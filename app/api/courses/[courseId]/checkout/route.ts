import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { Purchase } from '@/models/Purchase';
import { StripeCustomer } from '@/models/StripeCustomer';
import { stripe } from '@/lib/stripe';
export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB(); // Ensure the database connection is established
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // Find the course if it's published
    const course = await Course.findOne({
      _id: new mongoose.Types.ObjectId(params.courseId),
      isPublished: true,
    });
    if (!course) {
      return new NextResponse('Not Found', { status: 404 });
    }
    // Check if the user has already purchased the course
    const purchase = await Purchase.findOne({
      userId: user.id,
      courseId: course._id,
    });
    if (purchase) {
      return new NextResponse('Already purchased', { status: 400 });
    }

    // Remove Purchase creation here - should only be created in webhook after successful payment
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(course.price! * 100),
          product_data: {
            name: course.title,
            description: course.description!,
          },
        },
      },
    ];
    // Find or create a Stripe customer for the user
    let stripeCustomer = await StripeCustomer.findOne({
      userId: user.id,
    }).select('stripeCustomerId');
    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses?.[0]?.emailAddress,
      });
      stripeCustomer = await StripeCustomer.create({
        userId: user.id,
        stripeCustomerId: customer.id,
      });
    }
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      payment_method_types: ['card'],
      customer: stripeCustomer.stripeCustomerId,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course._id}?canceled=1`,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course._id}?success=1`,
      metadata: {
        userId: user.id,
        courseId: course._id.toString(),
      },
    });

    console.log(`🛒 Checkout session created:`, {
      sessionId: session.id,
      userId: user.id,
      courseId: course._id.toString(),
      url: session.url
    });

    // For development: Create purchase record immediately (bypass webhook)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Creating immediate purchase record');
      
      try {
        const { Purchase } = await import('@/models/Purchase');
        const { default: User } = await import('@/models/User');
        
        // Check if purchase already exists
        const existingPurchase = await Purchase.findOne({
          userId: user.id,
          courseId: course._id.toString()
        });
        
        if (!existingPurchase) {
          await Purchase.create({
            userId: user.id,
            courseId: course._id.toString()
          });
          
          await User.findOneAndUpdate(
            { userId: user.id },
            { 
              $addToSet: { courses: course._id.toString() },
              $inc: { numberOfCourses: 1 }
            },
            { upsert: true }
          );
          
          console.log('✅ Development purchase created immediately');
        }
      } catch (error) {
        console.error('❌ Development purchase creation failed:', error);
      }
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error('[COURSE_ID_CHECKOUT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
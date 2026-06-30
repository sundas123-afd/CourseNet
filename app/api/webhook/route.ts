import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Purchase } from '@/models/Purchase';
import User from '@/models/User';
import { stripe } from '@/lib/stripe';
export async function POST(req: Request) {
  await connectDB(); // Ensure the database connection is established
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error('❌ Webhook signature verification failed:', error.message);
    return new NextResponse('Webhook Error:' + error.message, { status: 400 });
  }
  
  console.log(`🔔 Webhook received: ${event.type}`);
  
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;
  
  console.log(`📝 Webhook metadata: userId=${userId}, courseId=${courseId}`);
  
  if (event.type === 'checkout.session.completed') {
    if (!userId || !courseId) {
      console.error('❌ Missing metadata in webhook');
      return new NextResponse('Webhook Error: Missing metadata', {
        status: 400,
      });
    }
    
    try {
      // Check if purchase already exists to avoid duplicates
      const existingPurchase = await Purchase.findOne({
        userId,
        courseId
      });
      
      if (!existingPurchase) {
        // Create a new purchase record in MongoDB
        await Purchase.create({
          userId,
          courseId
        });
        
        // Also update the user's courses array
        await User.findOneAndUpdate(
          { userId },
          { 
            $addToSet: { courses: courseId },
            $inc: { numberOfCourses: 1 }
          },
          { upsert: true }
        );
        
        console.log(`✅ Purchase created: userId=${userId}, courseId=${courseId}`);
      } else {
        console.log(`⚠️ Purchase already exists: userId=${userId}, courseId=${courseId}`);
      }
    } catch (error) {
      console.error('❌ Error creating purchase:', error);
      return new NextResponse('Database Error', { status: 500 });
    }
  } else {
    console.log(`ℹ️ Unhandled webhook event: ${event.type}`);
    return new NextResponse(
      `Webhook Error: Unhandled event type ${event.type}`,
      {
        status: 200,
      }
    );
  }
  return new NextResponse(null, { status: 200 });
}
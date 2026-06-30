import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Purchase } from '@/models/Purchase';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, courseId } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'Missing userId or courseId' }, { status: 400 });
    }

    console.log(`🎯 Manual purchase: userId=${userId}, courseId=${courseId}`);

    // Check if purchase already exists
    const existingPurchase = await Purchase.findOne({
      userId,
      courseId
    });

    if (existingPurchase) {
      console.log('⚠️ Purchase already exists');
      return NextResponse.json({ message: 'Purchase already exists' });
    }

    // Create purchase record
    await Purchase.create({
      userId,
      courseId
    });

    // Update user's courses array
    await User.findOneAndUpdate(
      { userId },
      { 
        $addToSet: { courses: courseId },
        $inc: { numberOfCourses: 1 }
      },
      { upsert: true }
    );

    console.log('✅ Manual purchase created successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Purchase created successfully' 
    });

  } catch (error: any) {
    console.error('❌ Manual purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

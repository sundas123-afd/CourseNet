import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import { TeacherInfo } from '@/models/TeacherInfo';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = auth();
    const values = await req.json();

    

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update or create teacher information
    const teacherInfo = new TeacherInfo({
        ...values,
        userId: userId
    })
    
    await teacherInfo.save();
    // Update user model to set isTeacher to true
    await User.findOneAndUpdate(
      { userId }, // Find the user by userId
      { isTeacher: true }, // Increment numberOfCourses by 1
      { new: true } // Return the updated user document
    );
    

    return NextResponse.json(teacherInfo);
  } catch (error) {
    console.error('[TEACHER_INFO_PATCH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
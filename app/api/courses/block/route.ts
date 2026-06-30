import { NextResponse } from 'next/server';
import Course, { ICourse } from '@/models/Course';
import connectDB from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    await connectDB();

    // Update the course to set isBlock to true and isPublished to false
    const course = await Course.findByIdAndUpdate(
      courseId,
      { isBlock: true, isPublished: false },
      { new: true }
    );

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Course blocked successfully', course });
  } catch (error) {
    console.error('Error blocking course:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

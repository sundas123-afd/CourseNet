import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { Chapter } from '@/models/Chapter';
import  User  from '@/models/User';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    await connectDB(); // Ensure the database connection is established

    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find the course and its associated chapters and muxData
    const course = await Course.findOne({ _id: courseId, userId });

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Check if the course has any published chapters
    const chapters = await Chapter.find({ courseId, isPublished: true });

    if (
      !course.title ||
      !course.imageUrl ||
      !course.categoryId ||
      !course.description ||
      !chapters.length
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Update the course to be published
    course.isPublished = true;
    await course.save();

    // Increment the number of courses for the user
    await User.findOneAndUpdate(
      { userId }, // Find the user by userId
      { $inc: { numberOfCourses: 1 } }, // Increment numberOfCourses by 1
      { new: true } // Return the updated user document
    );

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSE_ID_PUBLISH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { Chapter } from '@/models/Chapter';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    await connectDB(); // Ensure the database connection is established

    const { userId } = auth();
    const { courseId, chapterId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find course and ensure the user is the owner and the chapter exists in this course
    const courseOwner = await Course.findOne({
      _id: courseId,
      userId: userId,
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Unpublish the chapter
    const unpublishedChapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { isPublished: false },
      { new: true }
    );

    if (!unpublishedChapter) {
      return new NextResponse('Chapter not found', { status: 404 });
    }

    // Check if there are any published chapters left in the course
    const publishedChaptersInCourse = await Chapter.find({
      courseId,
      isPublished: true,
    });

    // If no published chapters left, update the course to not be published
    if (publishedChaptersInCourse.length === 0) {
      await Course.updateOne(
        { _id: courseId },
        { isPublished: false }
      );
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.error('[CHAPTER_UNPUBLISH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

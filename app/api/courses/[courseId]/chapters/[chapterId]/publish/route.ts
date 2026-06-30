import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { Chapter } from '@/models/Chapter';
import { MuxData } from '@/models/MuxData';

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

    // Find course and ensure the user is the owner
    const courseOwner = await Course.findOne({
      _id: courseId,
      userId: userId,
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find the chapter
    const chapter = await Chapter.findOne({
      _id: chapterId,
      courseId: courseId,
    });

    // Check if the chapter and required fields exist (no MuxData requirement)
    if (
      !chapter ||
      !chapter.title ||
      !chapter.videoUrl ||
      !chapter.description
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Update the chapter to be published
    const publishedChapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { isPublished: true },
      { new: true }
    );

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.error('[CHAPTER_PUBLISH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

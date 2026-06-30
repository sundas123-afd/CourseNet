import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

// import { isTeacher } from '@/lib/teacher';
import Course, { ICourse } from '@/models/Course';
import { Chapter } from '@/models/Chapter';
import { MuxData } from '@/models/MuxData';



export async function DELETE(
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
      chapters: chapterId, // Ensure the chapter belongs to this course
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find the chapter
    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Handle video deletion (no Mux processing)
    if (chapter.videoUrl) {
      const existingMuxData = await MuxData.findOne({ chapterId });

      if (existingMuxData) {
        // Delete MuxData record only
        await MuxData.deleteOne({ _id: existingMuxData._id });
      }
    }

    // Delete the chapter
    await Chapter.deleteOne({ _id: chapterId });

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

    return NextResponse.json({ success: true, message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('[CHAPTER_ID_DELETE]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } },
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse('userID not found Unauthorized', { status: 401 });
    }

    const courseOwner = await Course.findOne({
      _id: courseId,
      userId: userId,
      chapters: chapterId, // Assuming chapters are referenced by their IDs
    });

    if (!courseOwner) {
      return new NextResponse('courseowner Unauthorized', { status: 401 });
    }

    const chapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { ...values },
      { new: true }
    );

    if (!chapter) {
      return new NextResponse('Not found', { status: 404 });
    }


    if (values.videoUrl) {
      const existingMuxData = await MuxData.findOne({ chapterId });

      if (existingMuxData) {
        // Delete existing MuxData record
        await MuxData.deleteOne({ _id: existingMuxData._id });
      }

      // Create new MuxData record with video URL (no Mux processing)
      await MuxData.create({
        chapterId,
        assetId: values.videoUrl,
        playbackId: values.videoUrl,
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[COURSE_CHAPTER_ID]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

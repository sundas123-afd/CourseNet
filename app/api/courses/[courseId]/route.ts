import Mux from '@mux/mux-node';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { Chapter, IChapter } from '@/models/Chapter';
import { MuxData } from '@/models/MuxData';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID as string,
  tokenSecret: process.env.MUX_TOKEN_SECRET as string,
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB();

    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch the course with chapters and muxData
    const course = await Course.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(courseId),
          userId: userId,
        },
      },
      {
        $lookup: {
          from: 'chapters',
          localField: '_id',
          foreignField: 'courseId',
          as: 'chapters',
        },
      },
      {
        $unwind: {
          path: '$chapters',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'muxdatas',
          localField: 'chapters._id',
          foreignField: 'chapterId',
          as: 'chapters.muxData',
        },
      },
      {
        $unwind: {
          path: '$chapters.muxData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          course: { $first: '$$ROOT' },
          chapters: { $push: '$chapters' },
        },
      },
    ]);

    if (!course.length) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Handle case where there are no chapters or attachments
    if (course[0].chapters.length > 0) {
      for (const chapter of course[0].chapters) {
        if (chapter.muxData?.assetId) {
          try {
            await mux.video.assets.delete(chapter.muxData.assetId);
          } catch (err) {
            console.warn(`Failed to delete Mux asset for chapter ${chapter._id}`);
          }
        }
      }
    }

    // Delete the course, chapters, and muxData
    await Course.deleteOne({ _id: courseId, userId });
    if (course[0].chapters.length > 0) {
      await Chapter.deleteMany({ courseId });
      await MuxData.deleteMany({ chapterId: { $in: course[0].chapters.map((c: IChapter) => c._id) } });
    }

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('[COURSE_ID_DELETE]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}



export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB();

    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update the course with the provided values
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, userId },
      { ...values },
      { new: true }
    );

    if (!updatedCourse) {
      return new NextResponse('Not found', { status: 404 });
    }

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('[COURSE_ID_PATCH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { Chapter } from '@/models/Chapter';
// import { isTeacher } from '@/lib/teacher';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const course = await Course.findOne({ _id: courseId, userId });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lastChapter = await Chapter.findOne({ courseId })
      .sort({ position: -1 });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = new Chapter({
      title,
      courseId,
      position: newPosition,
    });

    await chapter.save();

    await Course.findByIdAndUpdate(course._id, {
      $push: { chapters: chapter._id },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[CHAPTERS]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

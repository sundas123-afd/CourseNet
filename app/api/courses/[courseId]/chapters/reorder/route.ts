import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { Chapter } from '@/models/Chapter';
// import { isTeacher } from '@/lib/teacher';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { list } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const course = await Course.findOne({ _id: courseId, userId });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    for (const item of list) {
      await Chapter.updateOne(
        { _id: item.id, courseId },
        { $set: { position: item.position } }
      );
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error('[REORDER]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

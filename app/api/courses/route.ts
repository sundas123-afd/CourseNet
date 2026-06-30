import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
// import { isTeacher } from '@/lib/teacher';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title, categoryId } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    await connectDB();

    const course = new Course({
      title,
      userId,
      categoryId: categoryId || undefined,
    });

    await course.save();

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSES]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

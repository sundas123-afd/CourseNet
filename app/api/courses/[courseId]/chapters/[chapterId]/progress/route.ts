import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import connectDB from '@/lib/db';
import { UserProgress } from '@/models/UserProgress';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    await connectDB();

    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const chapterId = params.chapterId;
    const userIdObj = userId;

    const userProgress = await UserProgress.findOneAndUpdate(
      { userId: userIdObj, chapterId },
      { isCompleted },
      { new: true, upsert: true }
    );

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error('[CHAPTER_ID_PROGRESS]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

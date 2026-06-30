import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { TeacherInfo } from '@/models/TeacherInfo';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;

    if (!userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    const teacherInfo = await TeacherInfo.findOne({ userId });

    if (!teacherInfo) {
      return new NextResponse('Teacher info not found', { status: 404 });
    }

    return NextResponse.json(teacherInfo);
  } catch (error) {
    console.error('[TEACHER_INFO_GET]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { Attachment } from '@/models/Attachment';

export async function DELETE(req: Request, { params }: { params: { courseId: string; attachmentId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const course = await Course.findOne({ _id: params.courseId, userId });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await Attachment.findOneAndDelete({ _id: params.attachmentId, courseId: course._id });

    if (!attachment) {
      return new NextResponse('Attachment not found', { status: 404 });
    }

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[ATTACHMENT_DELETE]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
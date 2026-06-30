import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { Attachment } from '@/models/Attachment';

interface RequestBody {
  url: string;
}

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const course = await Course.findOne({ _id: params.courseId, userId });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const { url }: RequestBody = await req.json();

    if (!url || !url.trim()) {
      return new NextResponse('Invalid URL', { status: 400 });
    }

    const attachment = await Attachment.create({
      courseId: course._id,
      url,
      name: url.split('/').pop(),
    });

    // Add the new attachment ID to the course's attachments array
    await Course.findByIdAndUpdate(course._id, {
      $push: { attachments: attachment._id },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[ATTACHMENT_CREATE]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

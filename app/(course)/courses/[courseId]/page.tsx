import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import mongoose from 'mongoose';

export default async function CourseIdPage({ 
  params, 
  searchParams 
}: { 
  params: { courseId: string }; 
  searchParams: { success?: string; canceled?: string; adminMode?: string };
}) {
  await connectDB(); // Ensure the database connection is established

  // Handle payment success/cancel
  if (searchParams.success === '1') {
    console.log('✅ Payment successful, redirecting to first chapter');
    // Small delay to ensure webhook has processed
    await new Promise(resolve => setTimeout(resolve, 1000));
  } else if (searchParams.canceled === '1') {
    console.log('❌ Payment canceled');
  }

  const course = await Course.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(params.courseId) } },
    {
      $lookup: {
        from: 'chapters',
        let: { courseId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$$courseId', '$courseId'] }, isPublished: true } },
          { $sort: { position: 1 } },
          { $project: { _id: 1 } },
        ],
        as: 'chapters',
      },
    },
  ]);

  if (!course || course.length === 0 || course[0].chapters.length === 0) {
    return redirect('/');
  }

  const firstChapterId = course[0].chapters[0]._id;
  const adminModeParam = searchParams.adminMode === '1' ? '?adminMode=1' : '';

  return redirect(`/courses/${course[0]._id}/chapters/${firstChapterId}${adminModeParam}`);
}

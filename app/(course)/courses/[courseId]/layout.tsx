import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { getProgress } from '@/actions/get-progress';
import { CourseNavbar } from './_components/course-navbar';
import { CourseSidebar } from './_components/course-sidebar';
import mongoose from 'mongoose';
import { IAttachment } from '@/models/Attachment';
import { IChapter } from '@/models/Chapter';
import { isAdmin } from '@/lib/admin';

export default async function CourseLayout({
  params,
  searchParams,
  children,
}: {
  children: React.ReactNode;
  params: { courseId: string };
  searchParams: { adminMode?: string };
}) {
  const { userId } = auth();

  if (!userId) return redirect('/');

  await connectDB();

  const course = await Course.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(params.courseId) } },
    {
      $lookup: {
        from: 'chapters',
        let: { courseId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$$courseId', '$courseId'] }, isPublished: true } },
          { $sort: { position: 1 } },
          {
            $lookup: {
              from: 'userprogresses',
              let: { chapterId: '$_id' },
              pipeline: [
                { $match: { $expr: { $and: [{ $eq: ['$chapterId', '$$chapterId'] }, { $eq: ['$userId', userId] }] } } },
              ],
              as: 'userProgress',
            },
          },
        ],
        as: 'chapters',
      },
    },
  ]);

  if (!course || course.length === 0) return redirect('/');

  const plainCourse = {
    ...course[0],
    _id: course[0]._id.toString(),
    userId: course[0].userId.toString(),
    categoryId: course[0].categoryId?.toString(),
    createdAt: course[0].createdAt.toISOString(),
    updatedAt: course[0].updatedAt.toISOString(),
    attachments: course[0].attachments.map((attachment: IAttachment) => ({
      ...attachment,
      _id: attachment._id.toString(),
      courseId: attachment.courseId ? attachment.courseId.toString() : null,
    })),
    chapters: course[0].chapters.map((chapter: IChapter) => ({
      ...chapter,
      _id: chapter._id.toString(),
      courseId: chapter.courseId.toString(),
    })),
  };

  const progressCount = await getProgress(userId, course[0]._id);
  const adminMode = (await isAdmin(userId)) && searchParams?.adminMode === '1';

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={plainCourse} progressCount={progressCount} />
      </div>

      <div className="fixed inset-y-0 z-50 flex-col hidden h-full md:flex w-80">
        <CourseSidebar course={plainCourse} progressCount={progressCount} adminMode={adminMode} />
      </div>

      <main className="h-full md:pl-80 pt-[80px]">{children}</main>
    </div>
  );
}

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { File, ListChecks, LayoutDashboard, CircleDollarSign } from 'lucide-react';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { Category } from '@/models/Category';
import { Banner } from '@/components/banner';
import { Actions } from './_components/actions';
import { IconBadge } from '@/components/icon-badge';
import { TitleForm } from './_components/title-form';
import { ImageForm } from './_components/image-form';
import { PriceForm } from './_components/price-form';
import { CategoryForm } from './_components/category-form';
import { ChaptersForm } from './_components/chapters-form';
import { AttachmentForm } from './_components/attachment-form';
import { DescriptionForm } from './_components/description-form';
import { IChapter } from '@/models/Chapter';
import { IAttachment } from '@/models/Attachment';

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  await connectDB();

  const courseId = new mongoose.Types.ObjectId(params.courseId);

  const course = await Course.aggregate([
    {
      $match: {
        _id: courseId,
        userId,
      },
    },
    {
      $lookup: {
        from: 'attachments',
        localField: '_id',
        foreignField: 'courseId',
        as: 'attachments',
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
  ]).exec();

  if (!course || course.length === 0 || course[0].userId.toString() !== userId) {
    return redirect('/');
  }

  // Convert fields to plain objects
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
      courseId: attachment.courseId.toString(),
    })),
    chapters: course[0].chapters.map((chapter: IChapter) => ({
      ...chapter,
      _id: chapter._id.toString(),
      courseId: chapter.courseId.toString(),
    })),
  };

  const categories = await Category.find().sort({ name: 1 }).exec();

  const requiredFields = [
    plainCourse.title,
    plainCourse.price,
    plainCourse.imageUrl,
    plainCourse.categoryId,
    plainCourse.description,
    plainCourse.chapters.some((chapter: IChapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <>
      {plainCourse.isBlock && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md text-center max-w-md">
            <h2 className="text-xl font-bold text-red-600">This course is blocked!</h2>
            <p className="mt-4">
              This course has been blocked by the Admin. If you believe this is a mistake, please
              contact support at{' '}
              <a href="mailto:sundasreman67.89@gmail.com" className="text-blue-600 underline">
                sundasreman67.89@gmail.com
              </a>{' '}
              with your email and the course title.
            </p>
          </div>
        </div>
      )}

      {!plainCourse.isPublished && (
        <Banner
          variant="warning"
          label="This course is unpublished. It will not be visible to students."
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>

          <Actions
            courseId={plainCourse._id}
            disabled={!isCompleted}
            isPublished={plainCourse.isPublished}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>

            <TitleForm initialData={plainCourse} courseId={plainCourse._id} />
            <DescriptionForm initialData={plainCourse} courseId={plainCourse._id} />
            <ImageForm initialData={plainCourse} courseId={plainCourse._id} />
            <CategoryForm
              initialData={plainCourse}
              courseId={plainCourse._id}
              options={categories.map(category => ({
                label: category.name,
                value: category._id.toString(),
              }))}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>

              <ChaptersForm initialData={plainCourse} courseId={plainCourse._id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>

              <PriceForm courseId={plainCourse._id} initialData={plainCourse} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>

              <AttachmentForm initialData={plainCourse} courseId={plainCourse._id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;


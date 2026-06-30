import mongoose from 'mongoose';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import connectDB from '@/lib/db';
import { Chapter } from '@/models/Chapter';
import { MuxData } from '@/models/MuxData';
import { Banner } from '@/components/banner';
import { IconBadge } from '@/components/icon-badge';
import { ChapterActions } from './_components/chapter-actions';
import { ChapterTitleForm } from './_components/chapter-tittle-form';
import { ChapterVideoForm } from './_components/chapter-video-form';
import { ChapterAccessForm } from './_components/chapter-access-form';
import { ChapterDescriptionForm } from './_components/chapter-description-form';
import Link from 'next/link';

interface ChapterIdPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  if (!params.courseId || !params.chapterId) {
    return redirect('/');
  }

  await connectDB();

  const chapter = await Chapter.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(params.chapterId),
        courseId: new mongoose.Types.ObjectId(params.courseId),
      },
    },
    {
      $lookup: {
        from: 'muxdatas',
        localField: '_id',
        foreignField: 'chapterId',
        as: 'muxData',
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'courseId',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $project: {
        'course.userId': 1,
        title: 1,
        description: 1,
        videoUrl: 1,
        isPublished: 1,
        'muxData': { $arrayElemAt: ['$muxData', 0] },
      },
    },
  ]).exec();

  if (!chapter || chapter.length === 0 || chapter[0].course.userId !== userId) {
    return redirect('/');
  }

  const doc = chapter[0];

  // Manually convert MongoDB ObjectIDs to strings
  const chapterData = {
    ...doc,
    _id: doc._id.toString(),
    courseId: doc.course?._id?.toString() || '',
    course: {
      ...doc.course,
      _id: doc.course?._id?.toString() || '',
    },
    muxData: doc.muxData
      ? {
          ...doc.muxData,
          _id: doc.muxData._id?.toString() || '',
          chapterId: doc.muxData.chapterId?.toString() || '',
        }
      : null,
  };

  const requiredFields = [
    chapterData.title,
    chapterData.description,
    chapterData.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isCompleted = requiredFields.every(Boolean);

  return (
    <>
      {!chapterData.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course."
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center mb-6 text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to course setup
            </Link>

            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>

              <ChapterActions
                disabled={!isCompleted}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapterData.isPublished}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>

            <ChapterTitleForm
              initialData={chapterData}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />

            <ChapterDescriptionForm
              initialData={chapterData}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>

              <ChapterAccessForm
                initialData={chapterData}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>

            <ChapterVideoForm
              initialData={chapterData}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;

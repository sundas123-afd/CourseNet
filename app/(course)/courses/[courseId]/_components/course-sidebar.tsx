import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { Purchase } from '@/models/Purchase';
import { CourseSidebarItem } from './course-sidebar-item';
import { CourseProgress } from '@/components/course-progress';
import { isAdmin } from '@/lib/admin';

interface CourseSidebarProps {
  progressCount: number;
  course: any;
  adminMode?: boolean;
}

export const CourseSidebar = async ({ course, progressCount, adminMode = false }: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) return redirect('/');

  await connectDB();

  const purchase = await Purchase.findOne({
    userId,
    courseId: course._id,
  });

  const admin = await isAdmin(userId);
  const isCourseCreator = course.userId === userId;

  return (
    <div className="flex flex-col h-full overflow-y-auto border-r shadow-sm select-none">
      <div className="flex flex-col p-8 border-b">
        <h1 className="font-semibold">{course.title}</h1>

        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>

      <div className="flex flex-col w-full">
        {course.chapters.map((chapter: any) => (
          <CourseSidebarItem
            _id={chapter._id}
            key={chapter._id}
            courseId={course._id}
            label={chapter.title}
            isLocked={!chapter.isFree && !purchase && !admin && !isCourseCreator && !adminMode}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            adminMode={adminMode}
          />
        ))}
      </div>
    </div>
  );
};

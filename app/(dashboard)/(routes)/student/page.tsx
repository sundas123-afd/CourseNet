import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CheckCircle, Clock } from 'lucide-react'

import { InfoCard } from './_components/info-card'
import { CoursesList } from '@/components/courses-list'
import { getDashboardCourses } from '@/actions/get-dashboard-courses'
import { ICourse } from '@/models/Course'
import { ICategory } from '@/models/Category'

type CourseWithProgressWithCategory = ICourse & {
  progress: number | null;
  category: ICategory | null;
  chapters: { _id: string }[];
  teacherInfo?: {
    _id: string;
    userId: string;
    fullName: string;
    profileImage?: string;
  };
}

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId,
  )

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />

        <InfoCard
          label="Completed"
          variant="success"
          icon={CheckCircle}
          numberOfItems={completedCourses.length}
        />
      </div>

      <CoursesList items={[...completedCourses, ...coursesInProgress] as CourseWithProgressWithCategory[]} />
    </div>
  )
}
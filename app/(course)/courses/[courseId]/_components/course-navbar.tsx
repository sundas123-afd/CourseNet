import { IChapter } from '@/models/Chapter';
import { ICourse } from '@/models/Course';
import { IUserProgress } from '@/models/UserProgress';

import { NavbarRoutes } from '@/components/navbar-routes'
import { CourseMobileSidebar } from './course-mobile-sidebar'

interface CourseNavbarProps {
  progressCount: number
  course: ICourse & {
    chapters: (IChapter & {
      userProgress: IUserProgress[] | null
    })[]
  }
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="flex items-center h-full p-4 bg-white border-b shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  )
}
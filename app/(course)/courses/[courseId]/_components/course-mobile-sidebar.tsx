import { Menu } from 'lucide-react';
import { IChapter } from '@/models/Chapter';
import { ICourse } from '@/models/Course';
import { IUserProgress } from '@/models/UserProgress';

import { CourseSidebar } from './course-sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface CourseMobileSidebarProps {
  progressCount: number
  course: ICourse & {
    chapters: (IChapter & {
      userProgress: IUserProgress[] | null
    })[]
  }
}

export const CourseMobileSidebar = ({
  course,
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition md:hidden hover:opacity-75">
        <Menu className="w-6 h-6" />
      </SheetTrigger>

      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  )
}
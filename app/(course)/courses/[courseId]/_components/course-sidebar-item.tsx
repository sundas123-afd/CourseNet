'use client'

import { usePathname, useRouter } from 'next/navigation'
import { CheckCircle, Lock, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CourseSidebarItemProps {
  _id: string
  label: string
  courseId: string
  isLocked: boolean
  isCompleted: boolean
  adminMode?: boolean
}

export const CourseSidebarItem = ({
  _id,
  label,
  courseId,
  isLocked,
  isCompleted,
  adminMode = false,
}: CourseSidebarItemProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle
  const isActive = pathname?.includes(_id)

  const adminModeParam = adminMode ? '?adminMode=1' : ''
  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${_id}${adminModeParam}`)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
        isActive &&
          'bg-slate-300/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700',
        isCompleted && 'text-emerald-700 hover:bg-emerald-700',
        isCompleted && isActive && 'bg-emerald-200/20',
      )}
    >
      <div className="flex items-center py-4 gap-x-2">
        <Icon
          size={22}
          className={cn(
            'text-slate-500',
            isActive && 'text-slate-700',
            isCompleted && 'text-emerald-700',
          )}
        />
        {label}
      </div>

      <div
        className={cn(
          'ml-auto opacity-0 border-2 border-slate-700 h-full transition-all',
          isActive && 'opacity-100',
          isCompleted && 'border-emerald-700',
        )}
      />
    </button>
  )
}
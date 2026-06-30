'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, User } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { IconBadge } from '@/components/icon-badge'
import { CourseProgress } from '@/components/course-progress'
import { isAdmin } from '@/lib/admin'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

interface CourseCardProps {
  id: string
  title: string
  price: number
  imageUrl: string
  category: string
  chaptersLength: number
  progress: number | null
  isBlock: boolean
  showBlockOption?: boolean // New prop to control block option visibility
  teacherInfo?: {
    fullName: string
    profileImage?: string
    userId: string
  }
}

export const CourseCard = ({
  id,
  title,
  price,
  imageUrl,
  progress,
  isBlock,
  category,
  chaptersLength,
  showBlockOption = false, // Default to false
  teacherInfo,
}: CourseCardProps) => {
  const { userId } = useAuth()
  const pathname = usePathname();
  const isAdminUser = isAdmin(userId ?? null)
  const isAdminPage = pathname?.startsWith("/admin");
  const courseLink = isAdminUser && isAdminPage ? `/courses/${id}?adminMode=1` : `/courses/${id}`;

  const handleBlockCourse = async () => {
    try {
      await axios.patch(`/api/courses/block`, { courseId: id })
      alert('Course blocked successfully')
    } catch (error) {
      console.error('Failed to block course:', error)
    }
  }

  const handleUnblockCourse = async () => {
    try {
      await axios.patch(`/api/courses/unblock`, { courseId: id })
      alert('Course unblocked successfully')
    } catch (error) {
      console.error('Failed to unblock course:', error)
    }
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={courseLink}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            fill
            alt={title}
            src={imageUrl}
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <Badge className="mb-2" variant="secondary">{category}</Badge>
          <h3 className="text-lg font-semibold line-clamp-2 mb-2 transition-colors group-hover:text-primary">
            {title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <IconBadge size="sm" icon={BookOpen} />
            <span className="ml-2">
              {chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
            </span>
          </div>
          {teacherInfo && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-slate-50 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarImage src={teacherInfo.profileImage} alt={teacherInfo.fullName} />
                <AvatarFallback className="text-xs">
                  {teacherInfo.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/teacher/${teacherInfo.userId}`}
                  className="text-sm font-medium text-primary hover:underline truncate block"
                  onClick={(e) => e.stopPropagation()}
                >
                  {teacherInfo.fullName}
                </Link>
                <p className="text-xs text-muted-foreground">This course was uploaded by this teacher.</p>
              </div>
            </div>
          )}
          {progress !== null && progress !== undefined ? (
            <CourseProgress
              size="sm"
              value={progress}
              variant={progress === 100 ? 'success' : 'default'}
            />
          ) : (
            <p className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </p>
          )}
        </CardContent>
      </Link>
      {isAdminUser && isAdminPage && showBlockOption && (
        <CardFooter className="p-4 pt-0">
          {isBlock ? (
            <Button
              onClick={handleUnblockCourse}
              variant="outline"
              className="w-full"
            >
              Unblock Course
            </Button>
          ) : (
            <Button
              onClick={handleBlockCourse}
              variant="destructive"
              className="w-full"
            >
              Block Course
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
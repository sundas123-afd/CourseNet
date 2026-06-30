'use client'

import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function TeacherEntryPage() {
  const { userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      if (!userId) {
        router.push('/')
        return
      }

      try {
        const res = await axios.get(`/api/teacherInfo/${userId}`)
        if (res && res.data && res.data._id) {
          router.push('/teacher/courses')
        } else {
          router.push('/teacher-info')
        }
      } catch (err) {
        // If teacher info not found or error, go to creation page
        router.push('/teacher-info')
      }
    }

    check()
  }, [userId, router])

  return <div className="p-6">Redirecting...</div>
}

'use client'

import * as z from 'zod'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form'

interface TeacherInfoFormProps {
  initialData?: {
    userId?: string
    fullName?: string
    bio?: string
    experience?: number
    expertise?: string[]
    socialLinks?: string[]
    education?: string
    phone?: string
    email?: string
  }
}

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(1000, 'Bio must be less than 1000 characters'),
  education: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
})

const TeacherInfoForm = ({ initialData }: TeacherInfoFormProps) => {
  const router = useRouter()
  const { userId } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExistingTeacherInfo = async () => {
      if (!userId) return

      try {
        const response = await axios.get(`/api/teacherInfo/${userId}`)
        if (response.data) {
          // Teacher profile already exists, redirect to teacher courses
          router.push('/teacher/courses')
        }
      } catch (error) {
        // Teacher info doesn't exist yet, that's fine
        console.log('No existing teacher info found')
      } finally {
        setLoading(false)
      }
    }

    fetchExistingTeacherInfo()
  }, [userId, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      bio: initialData?.bio || '',
      education: initialData?.education || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/teacherInfo', values)
      toast.success('Teacher information updated')
      router.push('/teacher/courses')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        <span>Teacher Information</span>
      </div>

      <Form {...form}>
        <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Your full name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="bio"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isSubmitting}
                    placeholder="Tell us about yourself"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            name="education"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. BSc Computer Science"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone No</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. +1234567890"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. teacher@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting || !isValid} type="submit">
                Save
              </Button>
            </div>
        </form>
      </Form>
    </div>
  )
}

export default TeacherInfoForm

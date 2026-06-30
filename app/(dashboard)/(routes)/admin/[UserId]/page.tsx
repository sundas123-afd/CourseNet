import React from "react";
import Course, { ICourse } from "@/models/Course";
import { Category, ICategory } from "@/models/Category";
import { IChapter } from "@/models/Chapter";
import { IAttachment } from "@/models/Attachment";
import { CoursesList } from "@/components/courses-list";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/user-roles";
import User from "@/models/User";
import { Purchase } from "@/models/Purchase";

type CourseWithProgress = ICourse & {
  category: ICategory | null;
  chapters: { _id: string; title: string }[];
  attachments: IAttachment[];
  progress: number | null;
};

interface UserIdPageProps {
  params: {
    UserId: string;
  };
  searchParams: {
    view?: string;
  };
}

const UserCoursePage = async ({ params, searchParams }: UserIdPageProps) => {
  if (!isAdmin) {
    return redirect("/");
  }

  // Use userId as a string since it's stored as a string in the database
  const userId = params.UserId;
  const view = searchParams.view;
  
  // Get user role to determine what to show
  const userRole = await getUserRole(userId);
  const user = await User.findOne({ userId });

  // Enhanced sync user courses array with Purchase model for consistency
  if (userRole === 'student' && user) {
    try {
      const purchases = await Purchase.find({ userId });
      const purchasedCourseIds = purchases.map(p => p.courseId.toString());
      const userCourseIds = (user.courses || []).map((c: any) => c.toString());
      
      // Update user's courses array if there's a mismatch
      if (JSON.stringify(purchasedCourseIds.sort()) !== JSON.stringify(userCourseIds.sort())) {
        await User.findOneAndUpdate(
          { userId },
          { 
            courses: purchasedCourseIds,
            numberOfCourses: purchasedCourseIds.length
          }
        );
      }
    } catch (error) {
      console.error('❌ Error syncing user courses:', error);
    }
  }

  let courses = [];
  let pageTitle = "";
  let pageDescription = "";

  if (userRole === 'teacher') {
    // Show courses created by teacher
    courses = await Course.find({
      userId,
      $or: [{ isPublished: true }, { isBlock: true }],
    }).sort({ createdAt: -1 });
    pageTitle = `Courses Created by ${user?.username || 'User'}`;
    pageDescription = "All courses created and managed by this teacher";
  } else if (userRole === 'student') {
    // Show courses enrolled by student using Purchase model (most reliable source)
    const purchases = await Purchase.find({ userId });
    const enrolledCourseIds = purchases.map(purchase => purchase.courseId);
    
    courses = await Course.find({
      _id: { $in: enrolledCourseIds },
      isPublished: true,
    }).sort({ createdAt: -1 });
    
    pageTitle = `Courses Enrolled by ${user?.username || 'User'}`;
    pageDescription = "All courses this student is enrolled in";
  } else if (userRole === 'teacher-student') {
    // Handle teacher-student users based on view parameter
    if (view === 'enrolled') {
      // Show enrolled courses
      const purchases = await Purchase.find({ userId });
      const enrolledCourseIds = purchases.map(purchase => purchase.courseId);
      
      courses = await Course.find({
        _id: { $in: enrolledCourseIds },
        isPublished: true,
      }).sort({ createdAt: -1 });
      
      pageTitle = `Courses Enrolled by ${user?.username || 'User'}`;
      pageDescription = "All courses this teacher-student is enrolled in";
    } else {
      // Default to created courses
      courses = await Course.find({
        userId,
        $or: [{ isPublished: true }, { isBlock: true }],
      }).sort({ createdAt: -1 });
      pageTitle = `Courses Created by ${user?.username || 'User'}`;
      pageDescription = "All courses created and managed by this teacher-student";
    }
  } else {
    // For visitors or other roles
    pageTitle = `User Profile - ${user?.username || 'User'}`;
    pageDescription = "This user has no course activity";
  }

  // Map courses to plain objects with progress
  const plainCourses: CourseWithProgress[] = courses.map((course) => ({
    ...course.toObject(),
    _id: course._id.toString(),
    userId: course.userId,
    categoryId: course.categoryId?.toString(),
    category: course.category
      ? { ...course.category.toObject(), _id: course.category._id.toString() }
      : null,
    attachments:
      course.attachments?.map((attachment: IAttachment) => ({
        _id: attachment._id.toString(),
        name: attachment.name,
        url: attachment.url,
        courseId: attachment.courseId?.toString(),
      })) ?? [],
    chapters:
      course.chapters?.map((chapter: IChapter) => ({
        _id: chapter._id.toString(),
        title: chapter.title,
      })) ?? [],
    imageUrl: course.imageUrl,
  }));

  return (
    <div className="m-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <p className="text-muted-foreground">{pageDescription}</p>
      </div>
      <CoursesList 
        items={plainCourses} 
        showBlockOption={(userRole === 'teacher' || (userRole === 'teacher-student' && view !== 'enrolled'))}
      />
    </div>
  );
};

export default UserCoursePage;

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import Course, { ICourse } from '@/models/Course';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { IChapter } from '@/models/Chapter';
import { ICategory } from '@/models/Category';
import { IAttachment } from '@/models/Attachment';
import User from '@/models/User';
import { isAdmin } from '@/lib/admin';
import { TeacherInfo } from '@/models/TeacherInfo';

type CourseProps = ICourse & {
  category: ICategory | null;
  chapters: IChapter[] | null;
  attachments: IAttachment[] | null;
}

const CoursesPage = async () => {
  await connectDB();

  const { userId } = auth();

  const user = await User.findOne({userId});

  if(!isAdmin(userId)){
    if (!userId) return redirect('/');

    if (!user) return redirect('/'); // Redirect if user not found

    // Check if user is a teacher, if not redirect to teacher-info page
    if (!user.isTeacher) {
      return redirect('/teacher-info');
    }

    // Check if teacher has a profile, if not redirect to teacher-info page
    const teacherInfo = await TeacherInfo.findOne({ userId });
    if (!teacherInfo) {
      return redirect('/teacher-info');
    }
  }

  const courses = await Course.find({ userId }).sort({ createdAt: -1 });

  const plainCourses: CourseProps[] = courses.map((course) => {
    const plainCourse: CourseProps = {
      ...course.toObject(),
      _id: course._id.toString(),
      userId: course.userId.toString(),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      __v: course.__v,
      title: course.title,
      isPublished: course.isPublished,
      description: course.description,
      imageUrl: course.imageUrl ? course.imageUrl.toString('base64') : undefined,
      categoryId: course.categoryId ? course.categoryId.toString() : undefined,
      price: course.price,
      category: course.category
        ? { ...course.category.toObject(), _id: course.category._id.toString() }
        : null,
      attachments: course.attachments
        ? course.attachments.map((attachment: IAttachment) => ({
            _id: attachment._id.toString(),
            name: attachment.name || '',
            url: attachment.url || '',
            courseId: attachment.courseId ? attachment.courseId.toString() : '',
          }))
        : [],
      chapters: course.chapters
        ? course.chapters.map((chapter: IChapter) => ({
            _id: chapter._id.toString(),
            title: chapter.title || '',
          }))
        : [],
    };

    return plainCourse;
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={plainCourses} />
    </div>
  );
}

export default CoursesPage;

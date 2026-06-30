import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import connectDB from '@/lib/db';
import { Category } from '@/models/Category';
import { getCourses } from '@/actions/get-courses';
import { Categories } from './_components/categories';
import { SearchInput } from '@/components/search-input';
import { CoursesList } from '@/components/courses-list';
import { ICourse } from '@/models/Course';
import { ICategory } from '@/models/Category';
import { IPurchase } from '@/models/Purchase';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

type CourseWithProgressWithCategory = ICourse & {
  progress: number | null;
  category: ICategory | null;
  chapters: { _id: string }[];
  purchases: IPurchase[] | null; // Ensure purchases is an array if applicable
  teacherInfo?: {
    _id: string;
    userId: string;
    fullName: string;
    profileImage?: string;
  };
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  await connectDB();

  const { userId } = auth();

  if (!userId) return redirect('/');

  const categories = await Category.find({}).sort({ name: 1 });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  const plainCategories = categories.map(category => ({
    ...category.toObject(),
    _id: category._id.toString(),
  }));

  const plainCourses: CourseWithProgressWithCategory[] = courses.map(course => ({
    ...course,
    _id: course._id.toString(),
    attachments: course.attachments?.map(att => att.toString()) || [],
    chapters: course.chapters.map(chapter => ({
      ...chapter,
      _id: chapter._id.toString(),
    })),
    category: course.category
      ? {
          ...course.category,
          _id: course.category._id.toString(),
          name: course.category.name,
        }
      : null,
    purchases: course.purchases?.map((purchase: IPurchase) => ({
      ...purchase,
      _id: purchase._id.toString(),
    })) || null,
    progress: course.progress ?? null,
    teacherInfo: course.teacherInfo ? {
      _id: course.teacherInfo._id?.toString(),
      userId: course.teacherInfo.userId,
      fullName: course.teacherInfo.fullName,
      profileImage: course.teacherInfo.profileImage,
    } : undefined,
  } as unknown as CourseWithProgressWithCategory));

  return (
    <>
      <div className="block px-6 pt-6 md:hidden md:mb-0">
        <SearchInput />
      </div>

      <div className="p-6 space-y-4">
        <Categories items={plainCategories} />
        <CoursesList items={plainCourses} />
      </div>
    </>
  );
};

export default SearchPage;

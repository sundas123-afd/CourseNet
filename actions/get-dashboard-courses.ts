import { Purchase } from '@/models/Purchase';
import { getProgress } from './get-progress';
import { ICourse } from '@/models/Course';
import { IChapter } from '@/models/Chapter';
import { Category, ICategory } from '@/models/Category';
import connectDB from '@/lib/db';

type CourseWithProgressWithCategory = ICourse & {
  category: ICategory;
  chapters: IChapter[];
  progress: number | null;
  teacherInfo?: {
    _id: string;
    userId: string;
    fullName: string;
    profileImage?: string;
  };
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string,
): Promise<DashboardCourses> => {

  await connectDB();
  try {
    const purchasedCourses = await Purchase.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: '$course' },
      {
        $lookup: {
          from: 'teacherinfos',
          localField: 'course.userId',
          foreignField: 'userId',
          as: 'teacherInfo',
        },
      },
      { $unwind: { path: '$teacherInfo', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
    ]);

    
    const courses = purchasedCourses.map(purchase => {

        const course = purchase.course;

        return {
            ...course,
            progress: null,
            teacherInfo: purchase.teacherInfo ? {
              _id: purchase.teacherInfo._id?.toString(),
              userId: purchase.teacherInfo.userId,
              fullName: purchase.teacherInfo.fullName,
              profileImage: purchase.teacherInfo.profileImage,
            } : undefined,
        };
    });
    
    const categoryIds = courses.map(course => course.categoryId);
    const categories = await Category.find({ _id: { $in: categoryIds } });
    const categoryMap = categories.reduce((map, category) => {
      map[category._id] = category;
      return map;
    }, {});


    for (let course of courses) {

        const category = categoryMap[course.categoryId];

        course.category = category

    }

    for (let course of courses) {
      const progress = await getProgress(userId, course._id);
      course.progress = progress;
    }

    const completedCourses = courses.filter(course => course.progress === 100);
    const coursesInProgress = courses.filter(
      course => (course.progress ?? 0) < 100,
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.error('[GET_DASHBOARD_COURSES]', error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};

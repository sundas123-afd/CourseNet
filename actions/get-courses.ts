import { Category } from '@/models/Category';
import Course, { ICourse } from '@/models/Course';
import { getProgress } from '@/actions/get-progress';
import connectDB from '@/lib/db';
import { ICategory } from '@/models/Category';
import { IPurchase } from '@/models/Purchase';

export type CourseWithProgressWithCategory = ICourse & {
  progress: number | null;
  category: ICategory | null;
  chapters: { _id: string }[];
  purchases: IPurchase[] | null;
  teacherInfo?: {
    _id: string;
    userId: string;
    fullName: string;
    profileImage?: string;
  };
}

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  title,
  userId,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    await connectDB(); // Ensure the database connection is established

    // Build the query conditions
    const query: any = { isPublished: true, };
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (categoryId) {
      query.categoryId = { $regex: categoryId, $options: 'i' };
    }

    // Fetch courses along with their categories and published chapters
    const courses = await Course.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'teacherinfos',
          localField: 'userId',
          foreignField: 'userId',
          as: 'teacherInfo',
        },
      },
      { $unwind: { path: '$teacherInfo', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'chapters',
          let: { courseId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$courseId', '$courseId'] }, isPublished: true } },
            { $project: { _id: 1 } },
          ],
          as: 'chapters',
        },
      },
      {
        $lookup: {
          from: 'purchases',
          let: { courseId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$$courseId', '$courseId'] }, { $eq: ['$userId', userId] }] } } },
          ],
          as: 'purchases',
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const categoryIds = courses.map(course => course.categoryId);
    const categories = await Category.find({ _id: { $in: categoryIds } });
    const categoryMap = categories.reduce((map, category) => {
      map[category._id] = category;
      return map;
    }, {});

    // Calculate progress for each course
    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {

        const category = categoryMap[course.categoryId] || null;

        if (course.purchases.length === 0) {
          return { ...course, category, progress: null };
        }

        const progressPercentage = await getProgress(userId, course._id);
        return { ...course, progress: progressPercentage };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.error('[GET_COURSES]', error);
    return [];
  }
};

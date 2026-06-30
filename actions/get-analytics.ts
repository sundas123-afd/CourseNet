import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { Purchase, IPurchase } from '@/models/Purchase';
import { ICourse } from '@/models/Course';

type PurchaseWithCourse = IPurchase & {
  course: ICourse;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: {
    [courseTitle: string]: number;
  } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    await connectDB();

    const purchases = await Purchase.aggregate([
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
        $match: {
          'course.userId': userId,
        },
      },
    ]);

    const groupedEarnings = groupByCourse(purchases as PurchaseWithCourse[]);
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        total,
        name: courseTitle,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalSales,
      totalRevenue,
    };
  } catch (error) {
    console.error('[GET_ANALYTICS]', error);
    return {
      data: [],
      totalSales: 0,
      totalRevenue: 0,
    };
  }
};

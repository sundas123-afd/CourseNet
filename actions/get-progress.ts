import { Chapter } from '@/models/Chapter';
import { UserProgress } from '@/models/UserProgress';
import connectDB from '@/lib/db';

export const getProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    await connectDB(); // Ensure the database connection is established

    // Find all published chapters for the course
    const publishedChapters = await Chapter.find({
      courseId,
      isPublished: true,
    }).select('_id');

    const publishedChapterIds = publishedChapters.map(({ _id }) => _id);

    // Count valid completed chapters for the user
    const validCompletedChapters = await UserProgress.countDocuments({
      userId,
      isCompleted: true,
      chapterId: { $in: publishedChapterIds },
    });

    // Calculate progress percentage
    const progressPercentage =
      (validCompletedChapters / publishedChapters.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.error('[GET_PROGRESS]', error);
    return 0;
  }
};

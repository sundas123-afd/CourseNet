import User from "@/models/User";
import Course from "@/models/Course";
import connectDB from "@/lib/db";

export async function getUserRole(userId: string): Promise<'admin' | 'teacher' | 'student' | 'teacher-student' | 'visitor'> {
  try {
    // Check if user is admin
    const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
    if (userId === adminId) {
      return 'admin';
    }

    // Check if user has created courses
    const createdCourses = await Course.countDocuments({ userId });
    const hasCreatedCourses = createdCourses > 0;

    // Check if user is enrolled in courses
    const user = await User.findOne({ userId });
    const enrolledCourses = user?.courses?.length || 0;
    const hasEnrolledCourses = enrolledCourses > 0;

    // Determine role based on activity
    if (hasCreatedCourses && hasEnrolledCourses) {
      return 'teacher-student';
    } else if (hasCreatedCourses) {
      return 'teacher';
    } else if (hasEnrolledCourses) {
      return 'student';
    } else {
      return 'visitor'; // Users with no activity are visitors
    }
  } catch (error) {
    console.error('Error determining user role:', error);
    return 'visitor';
  }
}

export async function getUsersWithRoles() {
  try {
    // Ensure database connection
    await connectDB();
    
    const users = await User.find().sort({ createdAt: -1 }).lean();
    
    const usersWithRoles = await Promise.all(
      users.map(async (user: any) => {
        const role = await getUserRole(user.userId);
        
        // Get actual created courses count
        const createdCoursesCount = await Course.countDocuments({ userId: user.userId });
        
        return {
          _id: user._id?.toString() || '',
          userId: user.userId || '',
          name: user.username || "Unknown",
          email: user.email || '',
          numberOfCourses: createdCoursesCount, // Actual created courses count
          courses: (user.courses || []).map((c: any) => c.toString()), // Convert to plain strings
          isTeacher: user.isTeacher || false,
          role,
          createdAt: user.createdAt || new Date(),
          updatedAt: user.updatedAt || new Date(),
          __v: user.__v || 0,
        };
      })
    );

    return usersWithRoles;
  } catch (error) {
    console.error('Error fetching users with roles:', error);
    return [];
  }
}

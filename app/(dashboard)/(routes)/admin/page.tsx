import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { getUsersWithRoles } from "@/lib/user-roles";
import { isAdmin } from "@/lib/admin";
import connectDB from '@/lib/db';
import User from '@/models/User';

const AdminPage = async () => {
  const { userId } = auth();
  
  if (!isAdmin(userId)) {
    return redirect("/");
  }

  // Get users with automatically determined roles
  let plainUsers = await getUsersWithRoles();

  // If no users found (dev environment), create test users so Manage Users shows data
  if (plainUsers.length === 0 && process.env.NODE_ENV !== 'production') {
    try {
      await connectDB();
      const testUsers = [
        { userId: 'user_dev_admin', email: 'admin@example.com', username: 'Admin User', isTeacher: true },
        { userId: 'user_dev_teacher', email: 'teacher@example.com', username: 'Teacher User', isTeacher: true },
      ];

      for (const tu of testUsers) {
        const exists = await User.findOne({ userId: tu.userId });
        if (!exists) {
          const u = new User(tu);
          await u.save();
        }
      }

      // re-fetch users after creating test users
      plainUsers = await getUsersWithRoles();
    } catch (err) {
      console.error('Error creating dev test users:', err);
    }
  }

  // Exclude the admin account from Manage Users
  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
  if (adminId) {
    plainUsers = plainUsers.filter((user) => user.userId !== adminId);
  }

  return (
    <div className="p-6">
      <DataTable columns={columns} data={plainUsers} />
    </div>
  );
};

export default AdminPage;

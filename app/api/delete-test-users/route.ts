import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Delete test users
    const testUserIds = [
      'user_dev_admin',
      'user_dev_teacher',
      'user_37HjugLIXMpIbQQr8aOdnBQ7Qru',
      'user_test_123456789'
    ];

    const result = await User.deleteMany({ userId: { $in: testUserIds } });

    return NextResponse.json({
      message: `Deleted ${result.deletedCount} test users`,
      deletedCount: result.deletedCount
    }, { status: 200 });

  } catch (error: any) {
    console.error("Delete test users error:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

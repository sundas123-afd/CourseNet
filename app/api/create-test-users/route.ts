import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Create test users manually for testing
    const testUsers = [
      {
        userId: "user_37HjugLIXMpIbQQr8aOdnBQ7Qru", // Admin user
        email: "mianluqman09876@gmail.com",
        username: "Admin User",
        isTeacher: true,
      },
      {
        userId: "user_test_123456789", // Test user
        email: "mianluqman786.1000ma@gmail.com",
        username: "Teacher User",
        isTeacher: true,
      }
    ];

    let syncedCount = 0;

    for (const testUser of testUsers) {
      try {
        const existingUser = await User.findOne({ userId: testUser.userId });
        
        if (!existingUser) {
          const newUser = new User(testUser);
          await newUser.save();
          syncedCount++;
          console.log(`Created user: ${testUser.email}`);
        } else {
          console.log(`User already exists: ${testUser.email}`);
        }
      } catch (error) {
        console.error(`Error creating user ${testUser.email}:`, error);
      }
    }

    // Fetch all users to verify
    const allUsers = await User.find().sort({ createdAt: -1 });

    return NextResponse.json({ 
      message: `Created ${syncedCount} test users`,
      totalUsers: allUsers.length,
      users: allUsers.map(user => ({
        _id: user._id,
        userId: user.userId,
        email: user.email,
        username: user.username,
        isTeacher: user.isTeacher,
        numberOfCourses: user.numberOfCourses,
        createdAt: user.createdAt
      }))
    }, { status: 200 });

  } catch (error: any) {
    console.error("Test sync error:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

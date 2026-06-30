import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    
    const users = await User.find().sort({ createdAt: -1 });
    
    return NextResponse.json({
      count: users.length,
      users: users.map(user => ({
        _id: user._id,
        userId: user.userId,
        email: user.email,
        username: user.username,
        isTeacher: user.isTeacher,
        numberOfCourses: user.numberOfCourses,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const { userId, username, email, numberOfCourses, courses } =
      await request.json();
    console.log("Request body:", {
      userId,
      username,
      email,
      numberOfCourses,
      courses,
    });
    if (!userId || !email) {
      console.error("Missing required fields:", { userId, email });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return NextResponse.json(
        { message: "User already exists", user: existingUser },
        { status: 200 } // Return 200 instead of 400
      );
    }
    const newUser = new User({
      userId,
      username, // This can be undefined now
      email,
      numberOfCourses,
      courses,
      isTeacher: false, // Default teacher status
    });
    const savedUser = await newUser.save();
    console.log("User saved:", savedUser);
    return NextResponse.json(
      { message: "User saved successfully", user: savedUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

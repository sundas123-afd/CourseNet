import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return NextResponse.json({ message: "User already synced" }, { status: 200 });
    }

    // Get user data from Clerk
    const clerkResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!clerkResponse.ok) {
      return new NextResponse("Failed to fetch user from Clerk", { status: 400 });
    }

    const clerkUser = await clerkResponse.json();

    // Create user in database
    const newUser = new User({
      userId: clerkUser.id,
      email: clerkUser.email_addresses[0]?.email_address || "",
      username: clerkUser.username || clerkUser.first_name || "Unknown",
      isTeacher: false,
    });

    await newUser.save();

    return NextResponse.json({ 
      message: "User synced successfully", 
      user: newUser 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Sync user error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    // Get all users from Clerk
    const clerkResponse = await fetch("https://api.clerk.dev/v1/users?limit=100", {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!clerkResponse.ok) {
      return new NextResponse("Failed to fetch users from Clerk", { status: 400 });
    }

    const clerkUsers = await clerkResponse.json();
    let syncedCount = 0;

    // Sync all users
    for (const clerkUser of clerkUsers.data) {
      try {
        const existingUser = await User.findOne({ userId: clerkUser.id });
        
        if (!existingUser) {
          const newUser = new User({
            userId: clerkUser.id,
            email: clerkUser.email_addresses[0]?.email_address || "",
            username: clerkUser.username || clerkUser.first_name || "Unknown",
            isTeacher: false,
          });
          
          await newUser.save();
          syncedCount++;
        }
      } catch (error) {
        console.error(`Error syncing user ${clerkUser.id}:`, error);
      }
    }

    return NextResponse.json({ 
      message: `Synced ${syncedCount} new users`,
      totalUsers: clerkUsers.data.length,
      syncedCount 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Bulk sync error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

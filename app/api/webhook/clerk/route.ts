import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import connectDB from "@/lib/db";
import User from "@/models/User";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const headerPayload = headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse("Error occured -- no svix headers", {
        status: 400,
      });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret || "");
    let evt: any;

    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err: any) {
      console.error("Error verifying webhook:", err);
      return new NextResponse("Error occured", {
        status: 400,
      });
    }

    const { type } = evt;

    if (type === "user.created") {
      const { id, email_addresses, username } = evt.data;
      
      await connectDB();
      
      const newUser = new User({
        userId: id,
        email: email_addresses[0]?.email_address || "",
        username: username || "",
        isTeacher: false,
      });

      await newUser.save();
      console.log("User created and saved to database:", newUser);
    }

    if (type === "user.updated") {
      const { id, email_addresses, username } = evt.data;
      
      await connectDB();
      
      await User.findOneAndUpdate(
        { userId: id },
        {
          email: email_addresses[0]?.email_address,
          username: username,
        },
        { upsert: true, new: true }
      );
      
      console.log("User updated in database:", id);
    }

    if (type === "user.deleted") {
      const { id } = evt.data;
      
      await connectDB();
      
      await User.findOneAndDelete({ userId: id });
      
      console.log("User deleted from database:", id);
    }

    return new NextResponse("", { status: 200 });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

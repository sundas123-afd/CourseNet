import mongoose, { Types, Document } from "mongoose";
import { ICourse } from "./Course";

// Define the IUser interface
export interface IUser extends Document {
  _id: string;
  userId: string;
  username?: string;
  email: string;
  numberOfCourses?: number;
  courses: Types.ObjectId[] | ICourse[];
  isTeacher: boolean;
  // Computed role - not stored in database
  role?: 'admin' | 'teacher' | 'student' | 'teacher-student';
}

// Define the Mongoose schema
const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String },
    email: { type: String, required: true },
    numberOfCourses: { type: Number, default: 0 },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    isTeacher: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

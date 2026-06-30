import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  userId: string;
  isCompleted: boolean;
  chapterId: string;
}

const userProgressSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  },
  {
    timestamps: true,
  }
);

userProgressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

export const UserProgress = mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', userProgressSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  _id: string;
  userId: string;
  courseId: string;
}

const purchaseSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  {
    timestamps: true,
  }
);

purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Purchase = mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', purchaseSchema);
import mongoose, { Document, Schema, Types } from 'mongoose';
import { IAttachment } from './Attachment';
import { IChapter } from './Chapter';

export interface ICourse extends Document {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  isPublished: boolean;
  isBlock: boolean;
  categoryId?: string;
  attachments?: Types.ObjectId[] | IAttachment[]; // It can be an array of ObjectId or populated Attachment
  chapters?: Types.ObjectId[] | IChapter[];
}

const courseSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    price: { type: Number },
    isPublished: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
    categoryId: { type: String, ref: 'Category' },
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);

export { Course };
export default Course;

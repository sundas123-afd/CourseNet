import mongoose, { Document, Schema } from 'mongoose';

export interface IMuxData extends Document {
  _id: string;
  assetId: string;
  playbackId?: string;
  chapterId: string;
}

const muxDataSchema: Schema = new Schema(
  {
    assetId: { type: String, required: true },
    playbackId: { type: String },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const MuxData = mongoose.models.MuxData || mongoose.model<IMuxData>('MuxData', muxDataSchema);
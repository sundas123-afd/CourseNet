import mongoose, { Document, Schema } from 'mongoose';

interface IStripeCustomer extends Document {
  _id: string;
  userId: string;
  stripeCustomerId: string;
}

const stripeCustomerSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const StripeCustomer = mongoose.models.StripeCustomer || mongoose.model<IStripeCustomer>('StripeCustomer', stripeCustomerSchema);
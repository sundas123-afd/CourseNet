// lib/categoriesService.ts
import { Category } from "@/models/Category";
import connectDB from '@/lib/db';

export const getCategories = async () => {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).exec();
  return categories.map((category) => ({
    label: category.name,
    value: category._id.toString(),
  }));
};
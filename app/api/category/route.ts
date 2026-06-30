import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Category } from '@/models/Category';
// import { isTeacher } from '@/lib/teacher';

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ name: 1 });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('[Category GET]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return new NextResponse('name is required', { status: 400 });
    }

    await connectDB();

    const category = new Category({
      name
    });

    await category.save();

    return NextResponse.json(category);
  } catch (error) {
    console.error('[Category POST]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

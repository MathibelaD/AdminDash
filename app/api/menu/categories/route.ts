import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const category = await prisma.menuCategory.create({
      data: { name: body.name, description: body.description || null },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating menu category:', error);
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 });
  }
}

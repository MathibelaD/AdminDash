import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    if (category && category !== 'All') where.category = { name: category };
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const items = await prisma.menuItem.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    const serialized = items.map(item => ({
      ...item,
      price: item.price.toString(),
      costPerUnit: item.costPerUnit.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ error: 'Error fetching menu items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const item = await prisma.menuItem.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: body.price,
        categoryId: body.categoryId,
        image: body.image || null,
        isAvailable: body.isAvailable ?? true,
        costPerUnit: body.costPerUnit || 0,
      },
      include: { category: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Error creating menu item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price && { price: data.price }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        ...(data.costPerUnit && { costPerUnit: data.costPerUnit }),
      },
      include: { category: true },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Error updating menu item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Error deleting menu item' }, { status: 500 });
  }
}

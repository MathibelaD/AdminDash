import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        ingredients: {
          select: { id: true, name: true, costPerUnit: true, unit: true, category: { select: { name: true } } },
        },
      },
    });

    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      ...item,
      price: item.price.toString(),
      costPerUnit: item.costPerUnit.toString(),
      ingredients: item.ingredients.map(i => ({
        ...i,
        costPerUnit: i.costPerUnit.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json({ error: 'Error fetching menu item' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
        ...(body.costPerUnit !== undefined && { costPerUnit: body.costPerUnit }),
        ...(body.ingredients !== undefined && {
          ingredients: { set: body.ingredients.map((ingId: string) => ({ id: ingId })) },
        }),
      },
      include: {
        category: true,
        ingredients: {
          select: { id: true, name: true, costPerUnit: true, unit: true },
        },
      },
    });

    return NextResponse.json({
      ...item,
      price: item.price.toString(),
      costPerUnit: item.costPerUnit.toString(),
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Error updating menu item' }, { status: 500 });
  }
}

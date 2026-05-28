import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};
    if (reason && reason !== 'all') where.reason = reason.toUpperCase();
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const entries = await prisma.wasteEntry.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const serialized = entries.map(entry => ({
      ...entry,
      cost: entry.cost.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching waste entries:', error);
    return NextResponse.json({ error: 'Error fetching waste entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const entry = await prisma.wasteEntry.create({
      data: {
        itemName: body.itemName,
        category: body.category,
        quantity: body.quantity,
        unit: body.unit,
        reason: body.reason,
        cost: body.cost,
        notes: body.notes || null,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error creating waste entry:', error);
    return NextResponse.json({ error: 'Error creating waste entry' }, { status: 500 });
  }
}

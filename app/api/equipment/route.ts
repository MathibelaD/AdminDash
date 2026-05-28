import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') where.status = status.toUpperCase();

    const equipment = await prisma.equipment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json({ error: 'Error fetching equipment' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const equipment = await prisma.equipment.create({
      data: {
        name: body.name,
        type: body.type,
        purchaseDate: new Date(body.purchaseDate),
        lastMaintenance: body.lastMaintenance ? new Date(body.lastMaintenance) : null,
        nextMaintenance: body.nextMaintenance ? new Date(body.nextMaintenance) : null,
        status: body.status || 'OPERATIONAL',
        supplier: body.supplier || null,
        supplierContact: body.supplierContact || null,
        warranty: body.warranty ? new Date(body.warranty) : null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return NextResponse.json({ error: 'Error creating equipment' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.type) updateData.type = data.type;
    if (data.status) updateData.status = data.status;
    if (data.supplier) updateData.supplier = data.supplier;
    if (data.supplierContact) updateData.supplierContact = data.supplierContact;
    if (data.lastMaintenance) updateData.lastMaintenance = new Date(data.lastMaintenance);
    if (data.nextMaintenance) updateData.nextMaintenance = new Date(data.nextMaintenance);
    if (data.warranty) updateData.warranty = new Date(data.warranty);
    if (data.notes !== undefined) updateData.notes = data.notes;

    const equipment = await prisma.equipment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error updating equipment:', error);
    return NextResponse.json({ error: 'Error updating equipment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.equipment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return NextResponse.json({ error: 'Error deleting equipment' }, { status: 500 });
  }
}

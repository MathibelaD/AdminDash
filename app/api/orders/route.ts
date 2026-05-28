import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (status && status !== 'all') where.status = status.toUpperCase();
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer: { firstName: { contains: search, mode: 'insensitive' } } },
        { customer: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        items: { include: { menuItem: true } },
        processedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const serialized = orders.map(order => ({
      ...order,
      subtotal: order.subtotal.toString(),
      tax: order.tax.toString(),
      total: order.total.toString(),
      items: order.items.map(item => ({
        ...item,
        unitPrice: item.unitPrice.toString(),
        totalPrice: item.totalPrice.toString(),
      })),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(4, '0')}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        orderType: body.orderType,
        customerId: body.customerId,
        tableNumber: body.tableNumber || null,
        subtotal: body.subtotal,
        tax: body.tax || 15.0,
        total: body.total,
        paymentStatus: 'PENDING',
        paymentMethod: body.paymentMethod || null,
        notes: body.notes || null,
        items: {
          create: body.items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        customer: { select: { firstName: true, lastName: true } },
        items: { include: { menuItem: true } },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, paymentStatus, paymentMethod, processedById } = body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(paymentMethod && { paymentMethod }),
        ...(processedById && { processedById }),
      },
      include: {
        customer: { select: { firstName: true, lastName: true } },
        items: { include: { menuItem: true } },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, totalRevenue, recentOrders, allItems] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: today }, paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { firstName: true, lastName: true } },
          items: { include: { menuItem: { select: { name: true } } } },
        },
      }),
      prisma.inventoryItem.findMany({
        where: { isActive: true },
        select: { id: true, name: true, currentStock: true, minimumStock: true, costPerUnit: true, unit: true },
      }),
    ]);

    const lowStockItems = allItems.filter(item => item.currentStock <= item.minimumStock);
    const inventoryValue = allItems.reduce(
      (sum, item) => sum + item.currentStock * Number(item.costPerUnit), 0
    );

    return NextResponse.json({
      todayRevenue: totalRevenue._sum.total?.toString() || '0',
      todayOrders,
      inventoryValue: inventoryValue.toFixed(2),
      recentOrders: recentOrders.map(order => ({
        ...order,
        subtotal: order.subtotal.toString(),
        tax: order.tax.toString(),
        total: order.total.toString(),
        items: order.items.map(item => ({
          ...item,
          unitPrice: item.unitPrice.toString(),
          totalPrice: item.totalPrice.toString(),
        })),
      })),
      lowStockItems: lowStockItems.map(item => ({
        id: item.id,
        name: item.name,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        unit: item.unit,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
  }
}

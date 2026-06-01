import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get orders in period
    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate }, paymentStatus: 'PAID' },
      include: { items: { include: { menuItem: { select: { name: true } } } } },
      orderBy: { createdAt: 'asc' },
    });

    // Total revenue & orders
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily revenue
    const dailyMap: Record<string, { revenue: number; orders: number }> = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailyMap[date]) dailyMap[date] = { revenue: 0, orders: 0 };
      dailyMap[date].revenue += Number(order.total);
      dailyMap[date].orders += 1;
    });

    const dailyRevenue = Object.entries(dailyMap).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }),
      ...data,
    }));

    // Top selling items
    const itemCounts: Record<string, { quantity: number; revenue: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.menuItem?.name || 'Unknown';
        if (!itemCounts[name]) itemCounts[name] = { quantity: 0, revenue: 0 };
        itemCounts[name].quantity += item.quantity;
        itemCounts[name].revenue += Number(item.totalPrice);
      });
    });

    const topItems = Object.entries(itemCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);

    // Inventory value by category
    const inventory = await prisma.inventoryItem.findMany({
      where: { isActive: true },
      include: { category: { select: { name: true } } },
    });

    const inventoryValue = inventory.reduce((sum, item) => sum + item.currentStock * Number(item.costPerUnit), 0);

    const categoryMap: Record<string, number> = {};
    inventory.forEach(item => {
      const cat = item.category?.name || 'Other';
      if (!categoryMap[cat]) categoryMap[cat] = 0;
      categoryMap[cat] += item.currentStock * Number(item.costPerUnit);
    });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, value]) => ({ category, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      inventoryValue: Math.round(inventoryValue),
      dailyRevenue,
      topItems,
      categoryBreakdown,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Error fetching analytics' }, { status: 500 });
  }
}

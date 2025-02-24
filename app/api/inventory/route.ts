// app/api/inventory/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.categoryId || body.currentStock === undefined || body.costPerUnit === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the inventory item with proper type handling
    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        name: body.name,
        description: body.description || null,
        categoryId: body.categoryId,
        currentStock: Number(body.currentStock),
        costPerUnit: new Prisma.Decimal(body.costPerUnit.toString()), // Convert to Decimal properly
        unit: body.unit || 'pieces',
        minimumStock: Number(body.minimumStock) || 30,
        supplierId: body.supplierId || null,
        isActive: true
      },
      include: {
        category: true,
        supplier: true
      }
    });

    return NextResponse.json(inventoryItem, {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: 'Error creating inventory item' },
      { status: 500 }
    );
  }
}

// Get all inventory items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActiveParam = searchParams.get('isActive');
    
    // Only apply isActive filter if explicitly provided
    const whereClause = isActiveParam !== null ? {
      isActive: isActiveParam === 'true'
    } : {};

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: whereClause,
      include: {
        category: true,
        supplier: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Convert Decimal to string for JSON serialization
    const serializedItems = inventoryItems.map(item => ({
      ...item,
      costPerUnit: item.costPerUnit.toString()
    }));

    return NextResponse.json(serializedItems);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json(
      { error: 'Error fetching inventory items' },
      { status: 500 }
    );
  }
}
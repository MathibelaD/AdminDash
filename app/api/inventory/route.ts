// app/api/inventory/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.categoryId || !body.currentStock || !body.costPerUnit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the inventory item
    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        name: body.name,
        description: body.description || null,
        categoryId: body.categoryId,
        currentStock: Number(body.currentStock),
        costPerUnit: body.costPerUnit,
        unit: body.unit || 'pieces', // Default unit if not provided
        minimumStock: body.minimumStock || 30, // Using the default from schema
        supplierId: body.supplierId || null,
        isActive: true
      },
      include: {
        category: true,
        supplier: true
      }
    });

    return NextResponse.json(inventoryItem);
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
    const isActive = searchParams.get('isActive') === 'true';

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
        isActive: isActive || undefined
      },
      include: {
        category: true,
        supplier: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json(
      { error: 'Error fetching inventory items' },
      { status: 500 }
    );
  }
}
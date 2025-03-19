import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';  

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    // Ensure params are available and accessible
    if (!params || !params.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const id = params.id;
    try {
      // Parse the body data
      const body = await request.json();
  
      // Validate required fields
      if (!body.name || !body.categoryId || body.currentStock === undefined || body.costPerUnit === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      // Validate required fields
      if (!body.name || !body.categoryId || body.currentStock === undefined || body.costPerUnit === undefined) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
  
      // Check if the inventory item exists
      const existingItem = await prisma.inventoryItem.findUnique({
        where: { id: id }  // Ensure id is a string type
      });
  
      if (!existingItem) {
        return NextResponse.json(
          { error: 'Inventory item not found' },
          { status: 404 }
        );
      }
  
      // Update the inventory item
      const updatedItem = await prisma.inventoryItem.update({
        where: { id: id },
        data: {
          name: body.name,
          description: body.description || existingItem.description,
          categoryId: body.categoryId,
          currentStock: Number(body.currentStock),
          costPerUnit: body.costPerUnit.toString(),
          unit: body.unit || existingItem.unit,
          minimumStock: Number(body.minimumStock) || existingItem.minimumStock,
          supplierId: body.supplierId || existingItem.supplierId,
          isActive: body.isActive ?? existingItem.isActive
        },
        include: {
          category: true,
          supplier: true
        }
      });
  
      return NextResponse.json(updatedItem, {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      return NextResponse.json(
        { error: 'Error updating inventory item' },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    // No need to await params - they're already available
    const id = params.id;
    
    try {
      // Ensure that the id exists in the database before attempting to delete
      const existingItem = await prisma.inventoryItem.findUnique({
        where: { id },
      });
  
      if (!existingItem) {
        return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
      }
  
      // Delete the inventory item
      await prisma.inventoryItem.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: 'Inventory item deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      return NextResponse.json({ error: 'Error deleting inventory item' }, { status: 500 });
    }
  }
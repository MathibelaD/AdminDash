import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = supabase
      .from('menu_items')
      .select('*, category:menu_categories(*)')
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category.name', category);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ error: 'Error fetching menu items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name: body.name,
        description: body.description || null,
        price: body.price,
        category_id: body.categoryId,
        image: body.image || null,
        is_available: body.isAvailable ?? true,
        cost_per_unit: body.costPerUnit || 0,
      })
      .select('*, category:menu_categories(*)')
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Error creating menu item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const updateData: Record<string, any> = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price) updateData.price = updates.price;
    if (updates.categoryId) updateData.category_id = updates.categoryId;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.isAvailable !== undefined) updateData.is_available = updates.isAvailable;
    if (updates.costPerUnit) updateData.cost_per_unit = updates.costPerUnit;

    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select('*, category:menu_categories(*)')
      .single();

    if (error) throw error;
    return NextResponse.json(data);
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

    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Error deleting menu item' }, { status: 500 });
  }
}

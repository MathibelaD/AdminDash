import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  // TODO: Migrate from Prisma to Supabase
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'Not yet migrated' }, { status: 501 });
}

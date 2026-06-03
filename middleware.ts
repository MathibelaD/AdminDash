import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Auth protection is handled client-side by AuthProvider
  // This middleware can be extended later for server-side session checks
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

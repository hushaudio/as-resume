import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('admin-auth');

    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};

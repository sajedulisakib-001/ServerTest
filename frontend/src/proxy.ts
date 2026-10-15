import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block any admin routes from running on the public customer storefront
  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/moderator' ||
    pathname.startsWith('/moderator/')
  ) {
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || process.env.ADMIN_URL || 'http://localhost:4000';
    // If admin is on a separate port/domain, cleanly redirect or 404
    const url = request.nextUrl.clone();
    url.pathname = '/not-found';
    return NextResponse.rewrite(url, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

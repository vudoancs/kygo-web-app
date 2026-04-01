import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Ví dụ bảo vệ /admin.
 * Production: kiểm tra cookie httpOnly do NestJS set hoặc session edge-validated.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('kygo_admin')?.value;
    if (!adminSession) {
      const login = new URL('/login', request.url);
      login.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(login);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

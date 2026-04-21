import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CMS_CATEGORY_PATH_TO_CODE } from '@/config/cms-seo';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const seg = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const code = CMS_CATEGORY_PATH_TO_CODE[seg];
  if (code) {
    const url = request.nextUrl.clone();
    url.pathname = `/category/${code}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/bi-quyet-lam-dep', '/su-kien-hoa-khoi'],
};

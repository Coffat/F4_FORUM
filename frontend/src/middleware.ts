import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware - Route Guard
 * Bảo vệ các route cần xác thực và phân quyền theo role.
 * Chạy trước khi render trang, đảm bảo người dùng có quyền truy cập.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('auth_role')?.value;

  // ── Bảo vệ route /admin/* ────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // Chưa đăng nhập → về login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Đã đăng nhập nhưng không phải ADMIN → về trang chủ
    if (role !== 'ROLE_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // ── Bảo vệ route /staff/* ────────────────────────────────────────
  if (pathname.startsWith('/staff')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== 'ROLE_STAFF' && role !== 'ROLE_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // ── Bảo vệ route /student/* ──────────────────────────────────────
  if (pathname.startsWith('/student')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== 'ROLE_STUDENT') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // ── Bảo vệ route /teacher/* ──────────────────────────────────────
  if (pathname.startsWith('/teacher')) {
    // Chưa đăng nhập → về login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Đã đăng nhập nhưng không phải TEACHER hoặc ADMIN → unauthorized
    if (role !== 'ROLE_TEACHER' && role !== 'ROLE_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Chỉ định các route mà middleware sẽ chạy.
 * Không chạy trên static files, _next, favicon...
 */
export const config = {
  matcher: ['/admin/:path*', '/staff/:path*', '/student/:path*', '/teacher/:path*'],
};

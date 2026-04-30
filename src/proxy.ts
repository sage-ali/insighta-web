import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profiles", "/search", "/account"];

export function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;

  // Check for the access_token cookie
  const isAuthenticated = cookies.has("access_token");
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  const isPublicOnlyRoute = nextUrl.pathname === "/login";

  // Redirect to login if not authenticated and trying to access a protected route
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(
      new URL("/login?error=unauthorized", request.url),
    );
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (isPublicOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

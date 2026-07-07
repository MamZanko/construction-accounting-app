import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const SESSION_COOKIE = "auth_session"
const PUBLIC_PATHS = ["/login"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get(SESSION_COOKIE)?.value

  // Allow static assets and api routes through unconditionally
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname === "/robots.txt" ||
    pathname === "/site.webmanifest"
  ) {
    return NextResponse.next()
  }

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // Already logged in — bounce away from login page
  if (isPublic && session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Not logged in — redirect to login
  if (!isPublic && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|site.webmanifest).*)",
  ],
}

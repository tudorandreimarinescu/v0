import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/companies") ||
    request.nextUrl.pathname.startsWith("/documents") ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname.startsWith("/account") ||
    request.nextUrl.pathname.startsWith("/orders")

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // For now, allow access to all routes (mock authentication)
  console.log("[v0] Mock middleware - allowing access to protected route:", request.nextUrl.pathname)
  return NextResponse.next()
}

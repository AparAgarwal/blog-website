import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Protect all admin routes with NextAuth middleware
export default withAuth(
  function middleware(_req) {
    // Additional custom logic can go here if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // User must have a valid token to access protected routes
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Specify which routes to protect
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Allow only if user is authenticated
    },
    pages: {
      signIn: "/auth/signin", // ✅ valid page config
    },
  },
);

// Protect specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/2fa/:path*"],
};

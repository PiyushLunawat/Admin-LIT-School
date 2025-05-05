import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("adminAccessToken")?.value;
  const refreshToken = req.cookies.get("adminRefreshToken")?.value;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isLogin = req.nextUrl.pathname === "/login";

  // Prevent accessing the dashboard without authentication
  // if (isDashboard && !(accessToken || refreshToken)) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // Prevent accessing login if already authenticated
  if (isLogin && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
  exclude: ["/api/:path*"],
};

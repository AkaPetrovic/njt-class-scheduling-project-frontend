import { NextRequest, NextResponse } from "next/server";
import { extractUserRole, isAuthenticated } from "./app/utility/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const role = extractUserRole(token);

  // Pattern for dynamic routes with academic year and subject
  const restrictedRoutesPattern =
    /^\/class-coverage-plans\/\d{4}-\d{2}\/[\w%20]+\/(new|\d+)$/;

  if (isAuthenticated(token)) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    } else if (role === "USER" && restrictedRoutesPattern.test(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      return NextResponse.next();
    }
  } else {
    if (pathname === "/login") {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Exclude static files and assets and the /login route
  ],
};

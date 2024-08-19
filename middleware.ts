import { NextRequest, NextResponse } from "next/server";
import { extractUserRole, isAuthenticated } from "./app/utility/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const role = extractUserRole(token);
  const restrictedRoutesForUser = ["/class-coverage-plans/new"];

  if (isAuthenticated(token)) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    } else if (
      role === "USER" &&
      isRouteRestrictedForUser(request, restrictedRoutesForUser)
    ) {
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

function isRouteRestrictedForUser(
  request: NextRequest,
  restrictedRoutes: string[]
) {
  return (
    restrictedRoutes.includes(request.nextUrl.pathname) ||
    isDynamicClassCoveragePlanRoute(request)
  );
}

function isDynamicClassCoveragePlanRoute(request: NextRequest): boolean {
  const dynamicRoutePattern = /^\/class-coverage-plans\/\d+$/;
  return dynamicRoutePattern.test(request.nextUrl.pathname);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Exclude static files and assets and the /login route
  ],
};

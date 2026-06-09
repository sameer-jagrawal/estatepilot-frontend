
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/leads",
  "/properties",
  "/followups",
  "/site-visits",
  "/deals",
  "/whatsapp",
  "/notes",
  "/users",
  "/settings",
  "/profile",
  "/activity-logs",
];

const adminProtectedRoutes = [
  "/admin/dashboard",
  "/admin/tenants",
  "/admin/plans",
  "/admin/payments",
  "/admin/support",
  "/admin/analytics",
  "/admin/settings",
];

const authRoutes = [
  "/login",
  "/register-company",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

const adminAuthRoutes = [
  "/admin/login",
  "/admin/register",
];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value || null;
  const role = request.cookies.get("role")?.value || null;
  const adminToken = request.cookies.get("admin_token")?.value || null;
  const adminRole = request.cookies.get("admin_role")?.value || null;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAdminProtectedRoute = adminProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminAuthRoute = adminAuthRoutes.includes(pathname);

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAdminProtectedRoute && !adminToken) {
    const adminLoginUrl = new URL("/admin/login", request.url);
    adminLoginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(adminLoginUrl);
  }

  if (isAdminProtectedRoute && adminRole !== "super-admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdminAuthRoute && adminToken && adminRole === "super-admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/leads/:path*",
    "/properties/:path*",
    "/followups/:path*",
    "/site-visits/:path*",
    "/deals/:path*",
    "/whatsapp/:path*",
    "/notes/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/activity-logs/:path*",

    "/admin/dashboard/:path*",
    "/admin/tenants/:path*",
    "/admin/plans/:path*",
    "/admin/payments/:path*",
    "/admin/support/:path*",
    "/admin/analytics/:path*",
    "/admin/settings/:path*",

    "/login",
    "/register-company",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
    "/admin",
    "/admin/login",
    "/admin/register",
  ],
};

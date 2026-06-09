"use client";
import { usePathname } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

export default function SuperAdminRouteLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return children;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

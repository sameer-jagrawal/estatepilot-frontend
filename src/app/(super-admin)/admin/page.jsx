import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminEntryPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  const adminRole = cookieStore.get("admin_role")?.value;

  if (adminToken && adminRole === "super-admin") {
    redirect("/admin/dashboard");
  }

  redirect("/admin/login");
}

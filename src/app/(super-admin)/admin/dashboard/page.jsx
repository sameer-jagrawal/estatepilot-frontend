"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import AdminCharts from "@/components/admin/dashboard/AdminCharts";
import AdminDashboardOverview from "@/components/admin/dashboard/AdminDashboardOverview";
import AdminRecentTenants from "@/components/admin/dashboard/AdminRecentTenants";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      setLoading(true);
      try {
        const response = await api.get("admin/dashboard/stats", { withCredentials: true });
        if (active) setStats(response?.data?.data || {});
      } catch (error) {
        if (error?.response?.status === 401) {
          router.push("/admin/login");
          return;
        }
        toast.error(error?.response?.data?.message || "Unable to load dashboard stats");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStats();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="grid gap-5">
      <header className="border border-[#DDE5EF] bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#2E95F7]">Super Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#0B1220] sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-[#667085]">Monitor platform health, tenant growth, and CRM usage.</p>
      </header>

      <AdminDashboardOverview data={stats} />
      <AdminCharts stats={stats} />
      <AdminRecentTenants tenants={stats?.recentTenants || []} loading={loading} />
    </div>
  );
}

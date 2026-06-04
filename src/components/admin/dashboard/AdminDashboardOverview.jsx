"use client";

import {
  Banknote,
  Building2,
  CheckCircle2,
  DoorClosed,
  Home,
  Hourglass,
  IndianRupee,
  Layers3,
  Users,
  Workflow,
} from "lucide-react";
import AdminStatGrid from "../AdminStatGrid";

export default function AdminDashboardOverview({ data = {} }) {
  const stats = [
    { label: "Total Tenants", value: data?.totalTenants, icon: Building2 },
    { label: "Active Tenants", value: data?.activeTenants, icon: CheckCircle2, tone: "green" },
    { label: "Trial Tenants", value: data?.trialTenants, icon: Hourglass },
    { label: "Suspended Tenants", value: data?.suspendedTenants, icon: DoorClosed, tone: "red" },
    { label: "Total Users", value: data?.totalUsers, icon: Users, tone: "lavender" },
    { label: "Total Leads", value: data?.totalLeads, icon: Workflow },
    { label: "Total Properties", value: data?.totalProperties, icon: Home, tone: "amber" },
    { label: "Total Deals", value: data?.totalDeals, icon: Layers3, tone: "green" },
    { label: "Total Revenue", value: data?.totalRevenue, prefix: "₹", icon: IndianRupee, tone: "green" },
    { label: "Total Commission", value: data?.totalCommission, prefix: "₹", icon: Banknote, tone: "lavender" },
  ];

  return <AdminStatGrid stats={stats} />;
}

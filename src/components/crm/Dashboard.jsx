"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Plus,
  TrendingUp,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "@/lib/axios";
import { extractArray, formatLabel, formatTime, getModuleConfig } from "@/components/crm/activity/activityUtils";
import DashboardCard from "@/components/crm/DashboardCard";
import TodaysWork from "@/components/crm/dashboard/TodaysWork";

const chartColors = ["#4DA8FF", "#A78BFA", "#22C55E", "#F59E0B", "#F43F5E", "#06B6D4"];

const colorSets = {
  blue: "bg-[#EAF5FF] text-[#2E95F7]",
  lavender: "bg-[#F3F0FF] text-[#7C3AED]",
  green: "bg-[#ECFDF5] text-[#059669]",
  amber: "bg-[#FFFBEB] text-[#D97706]",
  rose: "bg-[#FFF1F2] text-[#E11D48]",
  cyan: "bg-[#ECFEFF] text-[#0891B2]",
};

const statsConfig = [
  { key: "totalLeads", title: "Total Leads", note: "All captured prospects", icon: Users, color: "blue" },
  { key: "totalUsers", title: "Total Users", note: "Active CRM seats", icon: UserPlus, color: "lavender" },
  { key: "totalProperties", title: "Properties", note: "Inventory across projects", icon: Building2, color: "green" },
  { key: "availableProperties", title: "Available Properties", note: "Ready for matching", icon: CheckCircle2, color: "cyan" },
  { key: "todayFollowUps", title: "Today Follow-ups", note: "Calls and reminders due", icon: CalendarCheck, color: "amber" },
  { key: "overdueFollowUps", title: "Overdue Follow-ups", note: "Needs immediate attention", icon: Clock3, color: "rose" },
  { key: "totalDeals", title: "Total Deals", note: "Open and closed deals", icon: BadgeDollarSign, color: "blue" },
  { key: "closedDeals", title: "Closed Deals", note: "Won opportunities", icon: TrendingUp, color: "green" },
  { key: "totalRevenue", title: "Revenue", note: "Total booked value", icon: WalletCards, color: "lavender", prefix: "Rs. " },
  { key: "totalCommission", title: "Commission", note: "Estimated earnings", icon: BadgeDollarSign, color: "cyan", prefix: "Rs. " },
];

const quickActions = [
  { label: "Add Lead", href: "/leads", icon: Users },
  { label: "Add Property", href: "/properties", icon: Building2 },
  { label: "Schedule Follow-up", href: "/followups", icon: CalendarCheck },
  { label: "Create User", href: "/users", icon: UserPlus },
];

function normalizeStats(statsData) {
  const stats = statsData && typeof statsData === "object" ? statsData : {};

  return {
    totalLeads: Number(stats?.totalLeads || 0),
    totalUsers: Number(stats?.totalUsers || 0),
    totalProperties: Number(stats?.totalProperties || 0),
    availableProperties: Number(stats?.availableProperties || 0),
    todayFollowUps: Number(stats?.todayFollowUps || 0),
    overdueFollowUps: Number(stats?.overdueFollowUps || 0),
    totalDeals: Number(stats?.totalDeals || 0),
    closedDeals: Number(stats?.closedDeals || 0),
    totalRevenue: Number(stats?.totalRevenue || 0),
    totalCommission: Number(stats?.totalCommission || 0),
    recentActivities: Array.isArray(stats?.recentActivities) ? stats.recentActivities : [],
  };
}

function normalizeAggregateData(data) {
  if (!Array.isArray(data)) return [];

  return data
    .map((item, index) => ({
      name: formatLabel(item?._id),
      value: Number(item?.count || 0),
      count: Number(item?.count || 0),
      amount: Number(item?.totalAmount || 0),
      color: chartColors[index % chartColors.length],
    }))
    .filter((item) => item.value > 0 || item.amount > 0);
}

function ChartCard({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
        <p className="mt-1 text-sm font-medium text-[#64748B]">{subtitle}</p>
      </div>
      <div className="h-72">{children}</div>
    </section>
  );
}

function EmptyChartState({ label }) {
  return (
    <div className="grid h-full place-items-center rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center">
      <div>
        <p className="font-semibold text-[#0F172A]">{label}</p>
        <p className="mt-1 text-sm font-medium text-[#64748B]">Data will appear after records are added.</p>
      </div>
    </div>
  );
}

export default function DashboardPage({
  statsData,
  leadsData,
  dealsData,
  todayFollowUps = [],
}) {
  const stats = useMemo(() => normalizeStats(statsData), [statsData]);
  const leadStatusData = useMemo(() => normalizeAggregateData(leadsData), [leadsData]);
  const dealStatusData = useMemo(() => normalizeAggregateData(dealsData), [dealsData]);
  const [activities, setActivities] = useState([]);
  const todayWorkItems = useMemo(() => (Array.isArray(todayFollowUps) ? todayFollowUps : []), [todayFollowUps]);

  useEffect(() => {
    let active = true;

    async function fetchRecentActivities() {
      try {
        const response = await api.get("activity-logs?limit=10");
        if (active) setActivities(extractArray(response));
      } catch {
        if (active) setActivities(stats.recentActivities || []);
      }
    }

    fetchRecentActivities();
    return () => {
      active = false;
    };
  }, [stats.recentActivities]);

  return (
    <div className="grid gap-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Welcome back</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">
              Here is what is happening in your real estate business today.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#EAF5FF] px-4 py-2 text-sm font-semibold text-[#2E95F7]">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            Live CRM Overview
          </span>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055 } } }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {statsConfig.map((card) => (
          <motion.div key={card.key} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
            <DashboardCard
              title={card.title}
              value={stats?.[card.key] ?? 0}
              note={card.note}
              icon={card.icon}
              iconClass={colorSets[card.color]}
              prefix={card.prefix}
            />
          </motion.div>
        ))}
      </motion.section>

      <TodaysWork todayFollowUps={todayWorkItems} />

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Leads by status" subtitle="Live lead counts grouped by status">
          {leadStatusData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadStatusData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
                <Line type="monotone" dataKey="value" name="Leads" stroke="#4DA8FF" strokeWidth={3} dot={{ r: 4, fill: "#4DA8FF" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState label="No lead stats yet" />
          )}
        </ChartCard>

        <ChartCard title="Deals by status" subtitle="Live deal count from your pipeline">
          {dealStatusData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dealStatusData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
                <Bar dataKey="count" name="Deals" radius={[10, 10, 0, 0]} fill="#A78BFA" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState label="No deal stats yet" />
          )}
        </ChartCard>

        <ChartCard title="Lead status" subtitle="Pipeline health distribution">
          {leadStatusData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
                <Pie data={leadStatusData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={4}>
                  {leadStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState label="No lead distribution yet" />
          )}
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">Recent Activity</h2>
              <p className="mt-1 text-sm font-medium text-[#64748B]">Latest important CRM actions</p>
            </div>
            <Link href="/activity-logs" className="rounded-2xl border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#2E95F7] transition hover:bg-[#EAF5FF]">
              View All
            </Link>
          </div>

          {activities.length ? (
            <div className="grid gap-3">
              {activities.map((activity, index) => (
                <div key={activity?._id || index} className="flex gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition hover:border-[#4DA8FF]/40 hover:bg-white">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${getModuleConfig(activity?.module).badge}`}>
                    {(() => {
                      const Icon = getModuleConfig(activity?.module).icon;
                      return <Icon size={18} />;
                    })()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <p className="font-semibold text-[#0F172A]">{formatLabel(activity?.action || activity?.title || "CRM activity")}</p>
                      <span className="text-xs font-medium text-[#94A3B8]">{formatTime(activity?.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium leading-6 text-[#64748B]">
                      {activity?.description || "A CRM record was updated."}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-[#64748B]">{getModuleConfig(activity?.module).label} - {activity?.userId?.name || "System"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center">
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
                  <MessageCircle size={20} />
                </div>
                <p className="mt-3 font-semibold text-[#0F172A]">No activity yet</p>
                <p className="mt-1 text-sm font-medium text-[#64748B]">New updates will appear here as your team works.</p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <h2 className="text-base font-semibold text-[#0F172A]">Quick actions</h2>
          <p className="mt-1 text-sm font-medium text-[#64748B]">Jump into common workflows</p>
          <div className="mt-5 grid gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 font-semibold text-[#0F172A] transition hover:-translate-y-0.5 hover:border-[#4DA8FF]/50 hover:bg-white hover:shadow-[0_14px_35px_rgba(77,168,255,0.12)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
                      <Icon size={18} />
                    </span>
                    {action.label}
                  </span>
                  <Plus size={18} className="text-[#A78BFA]" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

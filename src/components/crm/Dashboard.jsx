"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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

const DashboardCharts = dynamic(() => import("@/components/crm/DashboardCharts"), {
  ssr: false,
  loading: () => (
    <section className="grid gap-4 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-80 animate-pulse rounded-2xl border border-[#E2E8F0] bg-white" />
      ))}
    </section>
  ),
});

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

const priorityStatKeys = [
  "totalLeads",
  "totalDeals",
  "totalRevenue",
  "todayFollowUps",
  "overdueFollowUps",
  "availableProperties",
];

const compactStatKeys = ["totalUsers", "totalProperties", "closedDeals", "totalCommission"];

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

function formatCompactNumber(value, prefix = "") {
  const number = Number(value || 0);
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: Number.isInteger(number) ? 0 : 1,
    notation: Math.abs(number) >= 100000 ? "compact" : "standard",
  }).format(number);

  return `${prefix}${formatted}`;
}

function ImportantStatsGraph({ stats, leadStatusData, dealStatusData }) {
  const graphData = [
    { name: "Leads", value: stats.totalLeads, color: "#1867B7" },
    { name: "Deals", value: stats.totalDeals, color: "#7C3AED" },
    { name: "Closed", value: stats.closedDeals, color: "#16A34A" },
    { name: "Due", value: stats.todayFollowUps, color: "#F59E0B" },
    { name: "Overdue", value: stats.overdueFollowUps, color: "#E11D48" },
    { name: "Stock", value: stats.availableProperties, color: "#0891B2" },
  ];

  const distributionData = [
    { name: "Lead stages", value: leadStatusData.reduce((total, item) => total + Number(item.value || 0), 0), color: "#1867B7" },
    { name: "Deal stages", value: dealStatusData.reduce((total, item) => total + Number(item.count || 0), 0), color: "#7C3AED" },
    { name: "Follow-ups", value: stats.todayFollowUps + stats.overdueFollowUps, color: "#F59E0B" },
  ].filter((item) => item.value > 0);

  return (
    <section className="border border-[#E2E8F0] bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-medium text-[#0F172A]">Business overview</h2>
          <p className="text-xs font-medium text-[#64748B]">Priority numbers from leads, deals, revenue, and follow-ups</p>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-right text-xs text-[#64748B]">
          <span>Revenue</span>
          <span className="text-[#0F172A]">{formatCompactNumber(stats.totalRevenue, "Rs. ")}</span>
          <span>Commission</span>
          <span className="text-[#0F172A]">{formatCompactNumber(stats.totalCommission, "Rs. ")}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_210px]">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graphData} margin={{ top: 10, right: 6, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#F8FAFC" }} contentStyle={{ borderRadius: 0, borderColor: "#E2E8F0", fontSize: 12 }} />
              <Bar dataKey="value" name="Count" radius={0}>
                {graphData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid min-h-64 gap-3 border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          <div className="h-40">
            {distributionData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: 0, borderColor: "#E2E8F0", fontSize: 12 }} />
                  <Pie data={distributionData} dataKey="value" nameKey="name" innerRadius={38} outerRadius={62} paddingAngle={2}>
                    {distributionData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-xs text-[#64748B]">No graph data</div>
            )}
          </div>
          <div className="grid gap-2 text-xs">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-[#64748B]">
                  <span className="h-2.5 w-2.5" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="text-[#0F172A]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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
  const priorityStats = useMemo(() => statsConfig.filter((card) => priorityStatKeys.includes(card.key)), []);
  const compactStats = useMemo(() => statsConfig.filter((card) => compactStatKeys.includes(card.key)), []);
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
        className="p-0"
      >
        <div>
          <h1 className="text-xl font-medium tracking-tight text-[#0F172A] sm:text-2xl">Welcome back</h1>
          <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-[#64748B]">
            Here is what is happening in your real estate business today.
          </p>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.75fr)]">
        <ImportantStatsGraph stats={stats} leadStatusData={leadStatusData} dealStatusData={dealStatusData} />

        <section className="grid gap-3 sm:grid-cols-2">
          {priorityStats.map((card) => (
            <DashboardCard
              key={card.key}
              title={card.title}
              value={stats?.[card.key] ?? 0}
              note={card.note}
              icon={card.icon}
              iconClass={colorSets[card.color]}
              prefix={card.prefix}
            />
          ))}
        </section>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055 } } }}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {compactStats.map((card) => (
          <motion.div key={card.key} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
            <DashboardCard title={card.title} value={stats?.[card.key] ?? 0} note={card.note} icon={card.icon} iconClass={colorSets[card.color]} prefix={card.prefix} />
          </motion.div>
        ))}
      </motion.section>

      <TodaysWork todayFollowUps={todayWorkItems} />

      <DashboardCharts leadStatusData={leadStatusData} dealStatusData={dealStatusData} />

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

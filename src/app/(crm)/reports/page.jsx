"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/axios";
import AgentPerformance from "@/components/crm/reports/AgentPerformance";
import DealAnalytics from "@/components/crm/reports/DealAnalytics";
import FollowupAnalytics from "@/components/crm/reports/FollowupAnalytics";
import LeadAnalytics from "@/components/crm/reports/LeadAnalytics";
import PropertyAnalytics from "@/components/crm/reports/PropertyAnalytics";
import ReportFilters from "@/components/crm/reports/ReportFilters";
import ReportSummaryCards from "@/components/crm/reports/ReportSummaryCards";
import RevenueOverview from "@/components/crm/reports/RevenueOverview";

const initialFilters = {
  dateRange: "30d",
  agentId: "",
  source: "",
  propertyType: "",
  dealStatus: "",
  startDate: "",
  endDate: "",
};

function unwrapList(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function labelize(value) {
  return String(value || "Unknown")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function itemId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?._id || value?.id || "";
}

function numberValue(value) {
  return Number(value || 0);
}

function getDateWindow(filters) {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (filters?.dateRange === "custom") {
    const start = filters?.startDate ? new Date(filters.startDate) : null;
    const customEnd = filters?.endDate ? new Date(filters.endDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (customEnd) customEnd.setHours(23, 59, 59, 999);
    return { start, end: customEnd || end };
  }

  const daysMap = { today: 0, "7d": 6, "30d": 29, "90d": 89 };
  const days = daysMap[filters?.dateRange] ?? 29;
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function inDateWindow(value, window) {
  if (!window?.start && !window?.end) return true;
  if (!value) return true;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return true;
  if (window?.start && date < window.start) return false;
  if (window?.end && date > window.end) return false;
  return true;
}

function groupCount(items, keyGetter) {
  const map = new Map();
  items.forEach((item) => {
    const key = labelize(keyGetter(item));
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

function monthName(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-IN", { month: "short" }).format(date);
}

function monthlyTotals(items, dateGetter, amountGetter, commissionGetter) {
  const map = new Map();
  items.forEach((item) => {
    const name = monthName(dateGetter(item));
    const current = map.get(name) || { name, amount: 0, revenue: 0, commission: 0, deals: 0, value: 0 };
    const amount = numberValue(amountGetter(item));
    const commission = numberValue(commissionGetter?.(item));
    current.amount += amount;
    current.revenue += amount;
    current.commission += commission;
    current.deals += 1;
    current.value += 1;
    map.set(name, current);
  });
  return Array.from(map.values());
}

function priceRanges(properties) {
  const ranges = [
    { name: "< 25L", min: 0, max: 2500000 },
    { name: "25L-50L", min: 2500000, max: 5000000 },
    { name: "50L-1Cr", min: 5000000, max: 10000000 },
    { name: "1Cr+", min: 10000000, max: Infinity },
  ];

  return ranges.map((range) => ({
    name: range.name,
    value: properties.filter((property) => {
      const price = numberValue(property?.price);
      return price >= range.min && price < range.max;
    }).length,
  }));
}

function buildQuery(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  return searchParams.toString();
}

function apiPath(endpoint, params = {}) {
  const query = buildQuery(params);
  return query ? `${endpoint}?${query}` : endpoint;
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="h-32 animate-pulse rounded-2xl border border-[#E2E8F0] bg-white" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl border border-[#E2E8F0] bg-white" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-2xl border border-[#E2E8F0] bg-white" />
        ))}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState({
    leads: [],
    properties: [],
    followups: [],
    siteVisits: [],
    deals: [],
    users: [],
  });

  const fetchReports = useCallback(async () => {
    try {
      const [leadsRes, propertiesRes, followupsRes, siteVisitsRes, dealsRes, usersRes] = await Promise.all([
        api.get(apiPath("leads", { assignedTo: filters.agentId, source: filters.source })),
        api.get(apiPath("properties", { propertyType: filters.propertyType })),
        api.get(apiPath("followups", { assignedTo: filters.agentId })),
        api.get(apiPath("site-visits", { assignedTo: filters.agentId })),
        api.get(apiPath("deals", { agentId: filters.agentId, dealStatus: filters.dealStatus })),
        api.get("users"),
      ]);

      setDatasets({
        leads: unwrapList(leadsRes),
        properties: unwrapList(propertiesRes),
        followups: unwrapList(followupsRes),
        siteVisits: unwrapList(siteVisitsRes),
        deals: unwrapList(dealsRes),
        users: unwrapList(usersRes),
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load reports");
      setDatasets((current) => current);
    } finally {
      setLoading(false);
    }
  }, [filters.agentId, filters.source, filters.propertyType, filters.dealStatus]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReports();
  }, [fetchReports]);

  const handleFiltersChange = (nextFilters) => {
    const shouldRefetch =
      nextFilters.agentId !== filters.agentId ||
      nextFilters.source !== filters.source ||
      nextFilters.propertyType !== filters.propertyType ||
      nextFilters.dealStatus !== filters.dealStatus;
    setLoading(shouldRefetch);
    setFilters(nextFilters);
  };

  const handleResetFilters = () => {
    const shouldRefetch =
      filters.agentId ||
      filters.source ||
      filters.propertyType ||
      filters.dealStatus;
    setLoading(Boolean(shouldRefetch));
    setFilters(initialFilters);
  };

  const analytics = useMemo(() => {
    const dateWindow = getDateWindow(filters);
    const leads = datasets.leads.filter((lead) => inDateWindow(lead?.createdAt, dateWindow));
    const properties = datasets.properties.filter((property) => inDateWindow(property?.createdAt, dateWindow));
    const followups = datasets.followups.filter((followup) => inDateWindow(followup?.dueAt || followup?.createdAt, dateWindow));
    const siteVisits = datasets.siteVisits.filter((visit) => inDateWindow(visit?.scheduledAt || visit?.createdAt, dateWindow));
    const deals = datasets.deals.filter((deal) => inDateWindow(deal?.bookingDate || deal?.createdAt, dateWindow));
    const closedDeals = deals.filter((deal) => deal?.dealStatus === "closed");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const summary = {
      totalLeads: leads.length,
      convertedLeads: leads.filter((lead) => ["booked", "site_visit", "negotiation"].includes(lead?.status)).length,
      totalDeals: deals.length,
      revenue: closedDeals.reduce((sum, deal) => sum + numberValue(deal?.dealAmount), 0),
      commission: closedDeals.reduce((sum, deal) => sum + numberValue(deal?.commissionAmount), 0),
      siteVisits: siteVisits.length,
      pendingFollowups: followups.filter((followup) => followup?.status === "pending").length,
      activeAgents: datasets.users.filter((user) => user?.isActive !== false && user?.role === "agent").length,
    };

    const followupAnalytics = {
      today: followups.filter((followup) => inDateWindow(followup?.dueAt, { start: today, end: todayEnd })).length,
      overdue: followups.filter((followup) => followup?.status === "pending" && new Date(followup?.dueAt) < new Date()).length,
      completed: followups.filter((followup) => followup?.status === "completed").length,
      pending: followups.filter((followup) => followup?.status === "pending").length,
    };

    const agentRows = datasets.users
      .filter((user) => user?.role === "agent" || user?.role === "manager" || user?.role === "owner")
      .map((user) => {
        const id = itemId(user);
        const agentLeads = leads.filter((lead) => itemId(lead?.assignedTo) === id);
        const agentFollowups = followups.filter((followup) => itemId(followup?.assignedTo) === id);
        const agentVisits = siteVisits.filter((visit) => itemId(visit?.assignedTo) === id);
        const agentDeals = deals.filter((deal) => itemId(deal?.agentId) === id);
        const agentClosedDeals = agentDeals.filter((deal) => deal?.dealStatus === "closed");

        return {
          id,
          name: user?.name || "Team member",
          assignedLeads: agentLeads.length,
          completedFollowups: agentFollowups.filter((followup) => followup?.status === "completed").length,
          siteVisits: agentVisits.length,
          dealsClosed: agentClosedDeals.length,
          revenueGenerated: agentClosedDeals.reduce((sum, deal) => sum + numberValue(deal?.dealAmount), 0),
        };
      })
      .filter((row) => row.assignedLeads || row.completedFollowups || row.siteVisits || row.dealsClosed || row.revenueGenerated);

    const monthlyRevenue = monthlyTotals(closedDeals, (deal) => deal?.closingDate || deal?.bookingDate || deal?.createdAt, (deal) => deal?.dealAmount, (deal) => deal?.commissionAmount);

    return {
      summary,
      leads: {
        source: groupCount(leads, (lead) => lead?.source),
        status: groupCount(leads, (lead) => lead?.status),
        growth: monthlyTotals(leads, (lead) => lead?.createdAt, () => 1).map((item) => ({ name: item.name, value: item.value })),
      },
      deals: {
        status: groupCount(deals, (deal) => deal?.dealStatus),
        monthlyAmount: monthlyTotals(deals, (deal) => deal?.bookingDate || deal?.createdAt, (deal) => deal?.dealAmount),
        comparison: [
          { name: "Booked", value: deals.filter((deal) => deal?.dealStatus === "booked").length },
          { name: "Closed", value: closedDeals.length },
        ],
      },
      properties: {
        type: groupCount(properties, (property) => property?.propertyType),
        availability: groupCount(properties, (property) => property?.status),
        priceRange: priceRanges(properties),
      },
      agentRows,
      followups: followupAnalytics,
      revenue: {
        monthly: monthlyRevenue,
        cards: monthlyRevenue.slice(-4).map((item) => ({
          name: item.name,
          revenue: item.revenue,
          commission: item.commission,
          deals: item.deals,
        })),
      },
    };
  }, [datasets, filters]);

  return (
    <div className="grid gap-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Reports & Analytics</h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">
              Track business performance, lead conversion, agent activity, and revenue growth.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#EAF5FF] px-4 py-2 text-sm font-semibold text-[#2E95F7]">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            Live Analytics
          </span>
        </div>
      </motion.section>

      <ReportFilters filters={filters} onChange={handleFiltersChange} onReset={handleResetFilters} users={datasets.users} />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <ReportSummaryCards summary={analytics.summary} />
          <LeadAnalytics data={analytics.leads} />
          <DealAnalytics data={analytics.deals} />
          <PropertyAnalytics data={analytics.properties} />
          <AgentPerformance rows={analytics.agentRows} />
          <FollowupAnalytics data={analytics.followups} />
          <RevenueOverview data={analytics.revenue} />
        </>
      )}
    </div>
  );
}

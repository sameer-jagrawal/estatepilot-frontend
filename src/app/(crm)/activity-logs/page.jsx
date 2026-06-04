"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { History } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import ActivityFilters from "@/components/crm/activity/ActivityFilters";
import ActivitySkeleton from "@/components/crm/activity/ActivitySkeleton";
import ActivityTimeline from "@/components/crm/activity/ActivityTimeline";
import { extractArray, isSameOrAfterDate, isSameOrBeforeDate } from "@/components/crm/activity/activityUtils";

function buildActivityPath({ module, userId, search }) {
  const params = new URLSearchParams();
  if (module) params.append("module", module);
  if (userId) params.append("userId", userId);
  if (search) params.append("search", search);
  const query = params.toString();
  return query ? `activity-logs?${query}` : "activity-logs";
}

function getTodayCount(activities = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return activities.filter((activity) => {
    const date = new Date(activity?.createdAt);
    if (Number.isNaN(date.getTime())) return false;
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  }).length;
}

export default function ActivityLogsPage() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [module, setModule] = useState("");
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(buildActivityPath({ module, userId, search: debouncedSearch }));
      setActivities(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load activity logs");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, module, userId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchActivities();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchActivities]);

  useEffect(() => {
    async function loadUsers() {
      for (const path of ["users/tenant-users", "users"]) {
        try {
          const response = await api.get(path);
          setUsers(extractArray(response));
          return;
        } catch {
          setUsers([]);
        }
      }
    }

    loadUsers();
  }, []);

  const filteredActivities = useMemo(
    () => activities.filter((activity) => isSameOrAfterDate(activity?.createdAt, startDate) && isSameOrBeforeDate(activity?.createdAt, endDate)),
    [activities, endDate, startDate]
  );

  const stats = useMemo(() => ({
    total: filteredActivities.length,
    lead: filteredActivities.filter((activity) => activity?.module === "lead").length,
    deal: filteredActivities.filter((activity) => activity?.module === "deal").length,
    followup: filteredActivities.filter((activity) => activity?.module === "followup").length,
    user: filteredActivities.filter((activity) => activity?.module === "user").length,
    today: getTodayCount(filteredActivities),
  }), [filteredActivities]);

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setModule("");
    setUserId("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="grid min-w-0 gap-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]">
              <History size={15} />
              CRM audit trail
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Activity Logs</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">
              Track all important actions performed across the CRM.
            </p>
          </div>
        </div>
      </motion.section>

      <ActivityFilters
        search={search}
        module={module}
        userId={userId}
        startDate={startDate}
        endDate={endDate}
        users={users}
        onSearchChange={setSearch}
        onModuleChange={setModule}
        onUserChange={setUserId}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onReset={resetFilters}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          {loading ? (
            <ActivitySkeleton count={7} />
          ) : (
            <ActivityTimeline activities={filteredActivities} />
          )}
        </section>

        <aside className="hidden xl:block">
          <div className="sticky top-24 rounded-2xl border border-[#E2E8F0] bg-white p-4">
            <h2 className="text-base font-semibold text-[#0F172A]">Quick statistics</h2>
            <p className="mt-1 text-sm font-medium text-[#64748B]">Current filtered activity counts.</p>
            <div className="mt-5 grid gap-3">
              <Stat label="Total Activities" value={stats.total} />
              <Stat label="Lead Activities" value={stats.lead} />
              <Stat label="Deal Activities" value={stats.deal} />
              <Stat label="Follow-up Activities" value={stats.followup} />
              <Stat label="User Activities" value={stats.user} />
              <Stat label="Today's Activities" value={stats.today} accent />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = false }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-[#4DA8FF]/40 bg-[#EAF5FF]" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accent ? "text-[#2E95F7]" : "text-[#0F172A]"}`}>{value}</p>
    </div>
  );
}

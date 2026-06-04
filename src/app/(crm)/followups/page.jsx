"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, Clock3, Eye, Plus, TimerReset, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import FollowupCalendar from "@/components/crm/followups/FollowupCalendar";
import FollowupFilters from "@/components/crm/followups/FollowupFilters";
import FollowupFormModal from "@/components/crm/followups/FollowupFormModal";
import FollowupStatusBadge from "@/components/crm/followups/FollowupStatusBadge";
import FollowupTable, { FollowupTableSkeleton } from "@/components/crm/followups/FollowupTable";
import { assignedName, derivedStatus, followupNotes, followupPriority, followupType, formatDateTime, leadName, leadPhone } from "@/components/crm/followups/FollowupCard";

const tabs = ["Today", "Overdue", "Upcoming", "Completed", "All Follow-ups"];

function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function buildFollowupQuery({ search, status, assignedTo, leadId, priority, date }) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (assignedTo) params.append("assignedTo", assignedTo);
  if (leadId) params.append("leadId", leadId);
  if (priority) params.append("priority", priority);
  if (date) params.append("date", date);

  const query = params.toString();
  return query ? `followups?${query}` : "followups";
}

function isToday(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return date >= start && date <= end;
}

function isUpcoming(followup) {
  return followup?.status === "pending" && new Date(followup?.dueAt) > new Date() && !isToday(followup?.dueAt);
}

export default function FollowupsPage() {
  const [followups, setFollowups] = useState([]);
  const [todayFollowups, setTodayFollowups] = useState([]);
  const [overdueFollowups, setOverdueFollowups] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("Today");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [leadId, setLeadId] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editingFollowup, setEditingFollowup] = useState(null);
  const [viewingFollowup, setViewingFollowup] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchFollowups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(buildFollowupQuery({ search: debouncedSearch, status, assignedTo, leadId, priority, date }));
      setFollowups(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch follow-ups");
      setFollowups([]);
    } finally {
      setLoading(false);
    }
  }, [assignedTo, date, debouncedSearch, leadId, priority, status]);

  const fetchSummary = useCallback(async () => {
    try {
      const [todayRes, overdueRes] = await Promise.all([api.get("followups/today"), api.get("followups/overdue")]);
      setTodayFollowups(extractArray(todayRes));
      setOverdueFollowups(extractArray(overdueRes));
    } catch {
      setTodayFollowups([]);
      setOverdueFollowups([]);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchFollowups();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchFollowups]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchSummary();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchSummary]);

  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const leadsRes = await api.get("leads");
        setLeads(extractArray(leadsRes));
      } catch {
        setLeads([]);
      }

      for (const path of ["users/tenant-users", "users"]) {
        try {
          const usersRes = await api.get(path);
          setUsers(extractArray(usersRes));
          return;
        } catch {
          setUsers([]);
        }
      }
    }

    fetchDropdowns();
  }, []);

  const tabFollowups = useMemo(() => {
    if (activeTab === "Today") return todayFollowups;
    if (activeTab === "Overdue") return overdueFollowups;
    if (activeTab === "Upcoming") return followups.filter(isUpcoming);
    if (activeTab === "Completed") return followups.filter((item) => item?.status === "completed");
    return followups;
  }, [activeTab, followups, overdueFollowups, todayFollowups]);

  const completedToday = useMemo(() => followups.filter((item) => item?.status === "completed" && isToday(item?.completedAt || item?.updatedAt)).length, [followups]);

  const summaryCards = [
    { title: "Today's Follow-ups", value: todayFollowups.length, icon: CalendarCheck, className: "bg-[#EAF5FF] text-[#2E95F7]" },
    { title: "Overdue", value: overdueFollowups.length, icon: TimerReset, className: "bg-[#FCE7F3] text-[#DB2777]" },
    { title: "Upcoming", value: followups.filter(isUpcoming).length, icon: Clock3, className: "bg-[#F3EEFF] text-[#A78BFA]" },
    { title: "Completed Today", value: completedToday, icon: CheckCircle2, className: "bg-[#DCFCE7] text-[#16A34A]" },
  ];

  const openCreateModal = () => {
    setEditingFollowup(null);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const openEditModal = (followup) => {
    setEditingFollowup(followup);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingFollowup(null);
  };

  const refreshAll = async () => {
    await Promise.all([fetchFollowups(), fetchSummary()]);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      if (editingFollowup?._id) {
        await api.patch(`followups/${editingFollowup._id}`, payload);
        toast.success("Follow-up updated");
      } else {
        await api.post("followups/create", payload);
        toast.success("Follow-up created successfully");
      }

      closeModal();
      await refreshAll();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save follow-up");
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (followup) => {
    try {
      await api.patch(`followups/${followup?._id}/complete`);
      toast.success("Follow-up completed");
      await refreshAll();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to complete follow-up");
    }
  };

  const handleCancel = async (followup) => {
    try {
      await api.patch(`followups/${followup?._id}/cancel`);
      toast.success("Follow-up cancelled");
      await refreshAll();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to cancel follow-up");
    }
  };

  const handleDelete = async (followup) => {
    const confirmed = window.confirm(`Delete follow-up for ${leadName(followup)}?`);
    if (!confirmed || !followup?._id) return;

    try {
      await api.delete(`followups/${followup._id}`);
      toast.success("Follow-up deleted");
      await refreshAll();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete follow-up");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setAssignedTo("");
    setLeadId("");
    setPriority("");
    setDate("");
  };

  return (
    <div className="grid min-w-0 max-w-full gap-6 overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]">
            <CalendarCheck size={15} />
            Follow-up queue
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Follow-ups</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">
            Manage calls, reminders, site visits, and customer follow-ups efficiently.
          </p>
        </div>
        <button type="button" onClick={openCreateModal} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2E95F7] hover:shadow-[0_16px_35px_rgba(77,168,255,0.25)]">
          <Plus size={18} />
          Add Follow-up
        </button>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.article key={card.title} whileHover={{ y: -4 }} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#64748B]">{card.title}</p>
                  <p className="mt-3 text-3xl font-semibold text-[#0F172A]">{card.value}</p>
                </div>
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${card.className}`}>
                  <Icon size={21} />
                </span>
              </div>
            </motion.article>
          );
        })}
      </section>

      <FollowupFilters
        search={search}
        status={status}
        assignedTo={assignedTo}
        leadId={leadId}
        priority={priority}
        date={date}
        users={users}
        leads={leads}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onAssignedToChange={setAssignedTo}
        onLeadIdChange={setLeadId}
        onPriorityChange={setPriority}
        onDateChange={setDate}
        onReset={resetFilters}
      />

      <section className="flex flex-wrap gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
        {tabs.map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab ? "bg-[#EAF5FF] text-[#2E95F7]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"}`}>
            {tab}
          </button>
        ))}
      </section>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {loading && activeTab !== "Today" && activeTab !== "Overdue" ? (
            <FollowupTableSkeleton />
          ) : (
            <FollowupTable followups={tabFollowups} onView={setViewingFollowup} onEdit={openEditModal} onComplete={handleComplete} onCancel={handleCancel} onDelete={handleDelete} />
          )}
        </motion.div>
      </AnimatePresence>

      <FollowupCalendar followups={followups} />

      <FollowupFormModal key={modalKey} open={modalOpen} mode={editingFollowup ? "edit" : "create"} followup={editingFollowup} leads={leads} users={users} saving={saving} onClose={closeModal} onSubmit={handleSubmit} />
      <FollowupViewModal followup={viewingFollowup} onClose={() => setViewingFollowup(null)} />
    </div>
  );
}

function FollowupViewModal({ followup, onClose }) {
  return (
    <AnimatePresence>
      {followup ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} className="w-full max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <FollowupStatusBadge value={derivedStatus(followup)} />
                  <FollowupStatusBadge value={followupType(followup)} type="followupType" />
                  <FollowupStatusBadge value={followupPriority(followup)} type="priority" />
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-[#0F172A]">{leadName(followup)}</h2>
                <p className="mt-1 text-sm text-[#64748B]">{leadPhone(followup)} · {assignedName(followup)}</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close details">
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="Date & Time" value={formatDateTime(followup?.dueAt)} />
              <Info label="Status" value={derivedStatus(followup)} />
              <Info label="Priority" value={followupPriority(followup)} />
              <Info label="Assigned Agent" value={assignedName(followup)} />
            </div>
            <div className="mt-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Notes</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#0F172A]">{followupNotes(followup) || "No notes added"}</p>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p>
      <p className="mt-2 font-semibold capitalize text-[#0F172A]">{String(value || "-").replace(/_/g, " ")}</p>
    </div>
  );
}

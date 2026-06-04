"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, CheckCircle, Clock, Eye, MapPin, Plus, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import SiteVisitActionModal from "@/components/crm/site-visits/SiteVisitActionModal";
import SiteVisitFilters from "@/components/crm/site-visits/SiteVisitFilters";
import SiteVisitFormModal from "@/components/crm/site-visits/SiteVisitFormModal";
import SiteVisitStatusBadge from "@/components/crm/site-visits/SiteVisitStatusBadge";
import SiteVisitTable, { SiteVisitTableSkeleton } from "@/components/crm/site-visits/SiteVisitTable";
import { assignedName, formatVisitDate, formatVisitTime, leadName, leadPhone, propertyLocation, propertyTitle } from "@/components/crm/site-visits/SiteVisitCard";

const tabs = ["Upcoming", "Today", "Completed", "Cancelled", "All"];

function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function extractItem(response) {
  return response?.data?.data || null;
}

function buildQuery({ status, leadId, propertyId, assignedTo, date }) {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (leadId) params.append("leadId", leadId);
  if (propertyId) params.append("propertyId", propertyId);
  if (assignedTo) params.append("assignedTo", assignedTo);
  if (date) params.append("date", date);
  const query = params.toString();
  return query ? `site-visits?${query}` : "site-visits";
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

function matchesSearch(visit, search) {
  if (!search) return true;
  const text = [
    leadName(visit),
    leadPhone(visit),
    propertyTitle(visit),
    propertyLocation(visit),
    assignedName(visit),
    visit?.feedback,
  ].join(" ").toLowerCase();
  return text.includes(search.toLowerCase());
}

export default function SiteVisitsPage() {
  const [visits, setVisits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [leadId, setLeadId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editingVisit, setEditingVisit] = useState(null);
  const [actionVisit, setActionVisit] = useState(null);
  const [actionType, setActionType] = useState("complete");
  const [viewingVisit, setViewingVisit] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchVisits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(buildQuery({ status, leadId, propertyId, assignedTo, date }));
      setVisits(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch site visits");
      setVisits([]);
    } finally {
      setLoading(false);
    }
  }, [assignedTo, date, leadId, propertyId, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchVisits();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchVisits]);

  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [leadsRes, propertiesRes] = await Promise.all([api.get("leads"), api.get("properties")]);
        setLeads(extractArray(leadsRes));
        setProperties(extractArray(propertiesRes));
      } catch {
        setLeads([]);
        setProperties([]);
      }

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
    loadDropdowns();
  }, []);

  const filteredVisits = useMemo(() => visits.filter((visit) => matchesSearch(visit, debouncedSearch)), [debouncedSearch, visits]);
  const tabVisits = useMemo(() => {
    if (activeTab === "Today") return filteredVisits.filter((visit) => isToday(visit?.scheduledAt));
    if (activeTab === "Completed") return filteredVisits.filter((visit) => visit?.status === "completed");
    if (activeTab === "Cancelled") return filteredVisits.filter((visit) => visit?.status === "cancelled");
    if (activeTab === "Upcoming") return filteredVisits.filter((visit) => visit?.status === "scheduled" && new Date(visit?.scheduledAt) >= new Date() && !isToday(visit?.scheduledAt));
    return filteredVisits;
  }, [activeTab, filteredVisits]);

  const summary = useMemo(() => ({
    today: visits.filter((visit) => isToday(visit?.scheduledAt)).length,
    upcoming: visits.filter((visit) => visit?.status === "scheduled" && new Date(visit?.scheduledAt) >= new Date()).length,
    completed: visits.filter((visit) => visit?.status === "completed").length,
    cancelled: visits.filter((visit) => visit?.status === "cancelled").length,
  }), [visits]);

  const cards = [
    { title: "Today Visits", value: summary.today, icon: CalendarCheck, className: "bg-[#EAF5FF] text-[#2E95F7]" },
    { title: "Upcoming Visits", value: summary.upcoming, icon: Clock, className: "bg-[#F3EEFF] text-[#A78BFA]" },
    { title: "Completed Visits", value: summary.completed, icon: CheckCircle, className: "bg-[#DCFCE7] text-[#16A34A]" },
    { title: "Cancelled Visits", value: summary.cancelled, icon: XCircle, className: "bg-[#FEE2E2] text-[#DC2626]" },
  ];

  const openCreate = () => {
    setEditingVisit(null);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const openEdit = (visit) => {
    setEditingVisit(visit);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      if (editingVisit?._id) {
        await api.patch(`site-visits/${editingVisit._id}`, payload);
        toast.success("Site visit updated successfully");
      } else {
        await api.post("site-visits/create", payload);
        toast.success("Site visit created successfully");
      }
      setModalOpen(false);
      await fetchVisits();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save site visit");
    } finally {
      setSaving(false);
    }
  };

  const openAction = (visit, type) => {
    setActionVisit(visit);
    setActionType(type);
  };

  const handleAction = async (payload, reset) => {
    try {
      setSaving(true);
      await api.patch(`site-visits/${actionVisit?._id}/${actionType}`, payload);
      toast.success(actionType === "complete" ? "Site visit completed successfully" : "Site visit cancelled successfully");
      reset?.();
      setActionVisit(null);
      await fetchVisits();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update site visit");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (visit) => {
    const confirmed = window.confirm(`Delete site visit for ${leadName(visit)}?`);
    if (!confirmed || !visit?._id) return;
    try {
      await api.delete(`site-visits/${visit._id}`);
      toast.success("Site visit deleted successfully");
      await fetchVisits();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete site visit");
    }
  };

  const handleView = async (visit) => {
    try {
      const response = await api.get(`site-visits/${visit?._id}`);
      setViewingVisit(extractItem(response) || visit);
    } catch {
      setViewingVisit(visit);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setLeadId("");
    setPropertyId("");
    setAssignedTo("");
    setDate("");
  };

  return (
    <div className="grid min-w-0 max-w-full gap-6 overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]"><MapPin size={15} />Visit management</div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Site Visits</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">Schedule, track, and manage property visits with customers.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2E95F7]">
          <Plus size={18} />Add Site Visit
        </button>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.article key={card.title} whileHover={{ y: -4 }} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-medium text-[#64748B]">{card.title}</p><p className="mt-3 text-3xl font-semibold text-[#0F172A]">{card.value}</p></div>
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${card.className}`}><Icon size={21} /></span>
              </div>
            </motion.article>
          );
        })}
      </section>

      <SiteVisitFilters search={search} status={status} leadId={leadId} propertyId={propertyId} assignedTo={assignedTo} date={date} leads={leads} properties={properties} users={users} onSearchChange={setSearch} onStatusChange={setStatus} onLeadIdChange={setLeadId} onPropertyIdChange={setPropertyId} onAssignedToChange={setAssignedTo} onDateChange={setDate} onReset={resetFilters} />

      <section className="flex flex-wrap gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
        {tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab ? "bg-[#EAF5FF] text-[#2E95F7]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"}`}>{tab}</button>)}
      </section>

      {loading ? <SiteVisitTableSkeleton /> : <SiteVisitTable visits={tabVisits} onView={handleView} onEdit={openEdit} onComplete={(visit) => openAction(visit, "complete")} onCancel={(visit) => openAction(visit, "cancel")} onDelete={handleDelete} />}

      <SiteVisitFormModal key={modalKey} open={modalOpen} mode={editingVisit ? "edit" : "create"} visit={editingVisit} leads={leads} properties={properties} users={users} saving={saving} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      <SiteVisitActionModal open={Boolean(actionVisit)} type={actionType} saving={saving} onClose={() => setActionVisit(null)} onSubmit={handleAction} />
      <SiteVisitViewModal visit={viewingVisit} onClose={() => setViewingVisit(null)} />
    </div>
  );
}

function SiteVisitViewModal({ visit, onClose }) {
  return (
    <AnimatePresence>
      {visit ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} className="w-full max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <SiteVisitStatusBadge value={visit?.status} />
                <h2 className="mt-4 text-2xl font-semibold text-[#0F172A]">{leadName(visit)}</h2>
                <p className="mt-1 text-sm text-[#64748B]">{propertyTitle(visit)} · {propertyLocation(visit)}</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] place-items-center"><X size={18} /></button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="Phone" value={leadPhone(visit)} />
              <Info label="Assigned Agent" value={assignedName(visit)} />
              <Info label="Scheduled Date" value={formatVisitDate(visit?.scheduledAt)} />
              <Info label="Scheduled Time" value={formatVisitTime(visit?.scheduledAt)} />
            </div>
            <Info className="mt-3" label="Feedback" value={visit?.feedback || "No feedback added"} />
            <Info className="mt-3" label="Cancelled Reason" value={visit?.cancelledReason || "Not cancelled"} />
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Info({ label, value, className = "" }) {
  return <div className={`rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 ${className}`}><p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p><p className="mt-2 font-semibold text-[#0F172A]">{value}</p></div>;
}

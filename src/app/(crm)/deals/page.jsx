"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Handshake, Plus, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import DealActionModal from "@/components/crm/deals/DealActionModal";
import DealFilters from "@/components/crm/deals/DealFilters";
import DealFormModal from "@/components/crm/deals/DealFormModal";
import DealStatusBadge from "@/components/crm/deals/DealStatusBadge";
import PaymentStatusBadge from "@/components/crm/deals/PaymentStatusBadge";
import DealSummaryCards from "@/components/crm/deals/DealSummaryCards";
import DealTable, { DealTableSkeleton } from "@/components/crm/deals/DealTable";
import { DealTypeBadge, agentName, formatCurrency, formatDate, leadName, leadPhone, propertyCode, propertyLocation, propertyTitle } from "@/components/crm/deals/DealCard";
import DealActivityTimeline from "@/components/crm/activity/DealActivityTimeline";

const tabs = [
  { label: "All", filters: {} },
  { label: "Booked", filters: { dealStatus: "booked" } },
  { label: "Closed", filters: { dealStatus: "closed" } },
  { label: "Cancelled", filters: { dealStatus: "cancelled" } },
  { label: "Payment Pending", filters: { paymentStatus: "pending" } },
  { label: "Paid", filters: { paymentStatus: "paid" } },
];

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

function buildDealQuery({ search, dealStatus, paymentStatus, agentId, leadId, propertyId, dealType }) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (dealStatus) params.append("dealStatus", dealStatus);
  if (paymentStatus) params.append("paymentStatus", paymentStatus);
  if (agentId) params.append("agentId", agentId);
  if (leadId) params.append("leadId", leadId);
  if (propertyId) params.append("propertyId", propertyId);
  if (dealType) params.append("dealType", dealType);
  const query = params.toString();
  return query ? `deals?${query}` : "deals";
}

function calculateSummary(deals) {
  return deals.reduce((summary, deal) => {
    const dealAmount = Number(deal?.dealAmount || 0);
    const commissionAmount = Number(deal?.commissionAmount || 0);
    const pendingAmount = deal?.paymentStatus === "pending" ? dealAmount : deal?.paymentStatus === "partial" ? Math.max(dealAmount - Number(deal?.tokenAmount || 0), 0) : 0;
    return {
      totalDeals: summary.totalDeals + 1,
      bookedDeals: summary.bookedDeals + (deal?.dealStatus === "booked" ? 1 : 0),
      closedDeals: summary.closedDeals + (deal?.dealStatus === "closed" ? 1 : 0),
      totalRevenue: summary.totalRevenue + dealAmount,
      totalCommission: summary.totalCommission + commissionAmount,
      pendingPayments: summary.pendingPayments + pendingAmount,
    };
  }, { totalDeals: 0, bookedDeals: 0, closedDeals: 0, totalRevenue: 0, totalCommission: 0, pendingPayments: 0 });
}

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dealStatus, setDealStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [agentId, setAgentId] = useState("");
  const [leadId, setLeadId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [dealType, setDealType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editingDeal, setEditingDeal] = useState(null);
  const [actionDeal, setActionDeal] = useState(null);
  const [actionType, setActionType] = useState("close");
  const [viewingDeal, setViewingDeal] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const tabFilters = useMemo(() => tabs.find((tab) => tab.label === activeTab)?.filters || {}, [activeTab]);
  const effectiveDealStatus = tabFilters.dealStatus || dealStatus;
  const effectivePaymentStatus = tabFilters.paymentStatus || paymentStatus;

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(buildDealQuery({ search: debouncedSearch, dealStatus: effectiveDealStatus, paymentStatus: effectivePaymentStatus, agentId, leadId, propertyId, dealType }));
      setDeals(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch deals");
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, [agentId, dealType, debouncedSearch, effectiveDealStatus, effectivePaymentStatus, leadId, propertyId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchDeals();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchDeals]);

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

  const summary = useMemo(() => calculateSummary(deals), [deals]);

  const openCreate = () => {
    setEditingDeal(null);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const openEdit = (deal) => {
    setEditingDeal(deal);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      if (editingDeal?._id) {
        await api.patch(`deals/${editingDeal._id}`, payload);
        toast.success("Deal updated successfully");
      } else {
        await api.post("deals/create", payload);
        toast.success("Deal created successfully");
      }
      setModalOpen(false);
      await fetchDeals();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save deal");
    } finally {
      setSaving(false);
    }
  };

  const openAction = (deal, type) => {
    setActionDeal(deal);
    setActionType(type);
  };

  const handleAction = async (payload, reset) => {
    try {
      setSaving(true);
      await api.patch(actionType === "close" ? `deals/${actionDeal?._id}/close` : `deals/${actionDeal?._id}/cancel`, payload);
      toast.success(actionType === "close" ? "Deal closed successfully" : "Deal cancelled successfully");
      reset?.();
      setActionDeal(null);
      await fetchDeals();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update deal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (deal) => {
    const confirmed = window.confirm(`Delete deal for ${leadName(deal)}?`);
    if (!confirmed || !deal?._id) return;
    try {
      await api.delete(`deals/${deal._id}`);
      toast.success("Deal deleted successfully");
      await fetchDeals();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete deal");
    }
  };

  const handleView = async (deal) => {
    try {
      const response = await api.get(`deals/${deal?._id}`);
      setViewingDeal(extractItem(response) || deal);
    } catch {
      setViewingDeal(deal);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setDealStatus("");
    setPaymentStatus("");
    setAgentId("");
    setLeadId("");
    setPropertyId("");
    setDealType("");
    setActiveTab("All");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab.label);
    if (tab.filters.dealStatus) setDealStatus("");
    if (tab.filters.paymentStatus) setPaymentStatus("");
  };

  return (
    <div className="grid min-w-0 max-w-full gap-6 overflow-x-hidden">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]"><Handshake size={15} />Revenue pipeline</div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Deals</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">Track bookings, revenue, commissions, and closed property deals.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2E95F7]">
          <Plus size={18} />Add Deal
        </button>
      </motion.section>

      <DealSummaryCards summary={summary} />

      <DealFilters search={search} dealStatus={dealStatus} paymentStatus={paymentStatus} agentId={agentId} leadId={leadId} propertyId={propertyId} dealType={dealType} leads={leads} properties={properties} users={users} onSearchChange={setSearch} onDealStatusChange={setDealStatus} onPaymentStatusChange={setPaymentStatus} onAgentIdChange={setAgentId} onLeadIdChange={setLeadId} onPropertyIdChange={setPropertyId} onDealTypeChange={setDealType} onReset={resetFilters} />

      <section className="flex flex-wrap gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
        {tabs.map((tab) => <button key={tab.label} type="button" onClick={() => handleTabChange(tab)} className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab.label ? "bg-[#EAF5FF] text-[#2E95F7]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"}`}>{tab.label}</button>)}
      </section>

      {loading ? <DealTableSkeleton /> : <DealTable deals={deals} onView={handleView} onEdit={openEdit} onCloseDeal={(deal) => openAction(deal, "close")} onCancelDeal={(deal) => openAction(deal, "cancel")} onDelete={handleDelete} />}

      <DealFormModal key={modalKey} open={modalOpen} mode={editingDeal ? "edit" : "create"} deal={editingDeal} leads={leads} properties={properties} users={users} saving={saving} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      <DealActionModal open={Boolean(actionDeal)} type={actionType} saving={saving} onClose={() => setActionDeal(null)} onSubmit={handleAction} />
      <DealViewModal deal={viewingDeal} onClose={() => setViewingDeal(null)} />
    </div>
  );
}

function DealViewModal({ deal, onClose }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <AnimatePresence>
      {deal ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} className="w-full max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2"><DealStatusBadge value={deal?.dealStatus} /><PaymentStatusBadge value={deal?.paymentStatus} /><DealTypeBadge value={deal?.dealType} /></div>
                <h2 className="mt-4 truncate text-2xl font-semibold text-[#0F172A]">{leadName(deal)}</h2>
                <p className="mt-1 text-sm text-[#64748B]">{propertyTitle(deal)} {propertyCode(deal) ? `- ${propertyCode(deal)}` : ""}</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close modal"><X size={18} /></button>
            </div>
            <div className="mt-5 flex gap-2 border-b border-[#E2E8F0] pb-3">
              {["Overview", "Activity"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab ? "bg-[#EAF5FF] text-[#2E95F7]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Overview" ? (
              <>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Info label="Deal Amount" value={formatCurrency(deal?.dealAmount)} />
                  <Info label="Commission" value={formatCurrency(deal?.commissionAmount)} />
                  <Info label="Token Amount" value={formatCurrency(deal?.tokenAmount)} />
                  <Info label="Agent" value={agentName(deal)} />
                  <Info label="Lead Phone" value={leadPhone(deal)} />
                  <Info label="Property Location" value={propertyLocation(deal)} />
                  <Info label="Booking Date" value={formatDate(deal?.bookingDate || deal?.createdAt)} />
                  <Info label="Closing Date" value={formatDate(deal?.closingDate)} />
                  <Info label="Property Code" value={propertyCode(deal) || "-"} />
                </div>
                <Info className="mt-3" label="Notes" value={deal?.notes || "No notes added"} />
              </>
            ) : (
              <div className="mt-5 max-h-[58vh] overflow-y-auto pr-1">
                <DealActivityTimeline dealId={deal?._id} />
              </div>
            )}
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Info({ label, value, className = "" }) {
  return <div className={`rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 ${className}`}><p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p><p className="mt-2 font-semibold text-[#0F172A]">{value}</p></div>;
}

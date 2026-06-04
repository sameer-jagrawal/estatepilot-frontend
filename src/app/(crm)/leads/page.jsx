"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, UsersRound } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import LeadFilters from "@/components/crm/leads/LeadFilters";
import LeadFormModal from "@/components/crm/leads/LeadFormModal";
import LeadTable, { LeadTableSkeleton } from "@/components/crm/leads/LeadTable";

function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function buildLeadQuery({ search, status, source, assignedTo }) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (source) params.append("source", source);
  if (assignedTo) params.append("assignedTo", assignedTo);

  const query = params.toString();
  return query ? `leads?${query}` : "leads";
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const path = buildLeadQuery({ search: debouncedSearch, status, source, assignedTo });
      const response = await api.get(path);
      setLeads(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [assignedTo, debouncedSearch, source, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchLeads();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchLeads]);

  useEffect(() => {
    async function fetchUsers() {
      const paths = ["users/tenant-users", "users"];

      for (const path of paths) {
        try {
          const response = await api.get(path);
          setUsers(extractArray(response));
          return;
        } catch {
          setUsers([]);
        }
      }
    }

    fetchUsers();
  }, []);

  const totalActiveFilters = useMemo(
    () => [debouncedSearch, status, source, assignedTo].filter(Boolean).length,
    [assignedTo, debouncedSearch, source, status]
  );

  const openCreateModal = () => {
    setEditingLead(null);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingLead(null);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      if (editingLead?._id) {
        await api.patch(`leads/${editingLead._id}`, payload);
        toast.success("Lead updated successfully");
      } else {
        await api.post("leads/create", payload);
        toast.success("Lead created successfully");
      }

      closeModal();
      await fetchLeads();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save lead");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lead) => {
    const confirmed = window.confirm(`Delete ${lead?.name || "this lead"}?`);
    if (!confirmed || !lead?._id) return;

    try {
      await api.delete(`leads/${lead._id}`);
      toast.success("Lead deleted successfully");
      await fetchLeads();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete lead");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setSource("");
    setAssignedTo("");
  };

  return (
    <div className="grid gap-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6 lg:flex-row lg:items-end"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]">
            <UsersRound size={15} />
            {totalActiveFilters ? `${totalActiveFilters} active filters` : "Lead pipeline"}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Leads</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">
            Manage buyers, inquiries, follow-ups, and property interest.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2E95F7] hover:shadow-[0_16px_35px_rgba(77,168,255,0.25)]"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </motion.section>

      <LeadFilters
        search={search}
        status={status}
        source={source}
        assignedTo={assignedTo}
        users={users}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSourceChange={setSource}
        onAssignedToChange={setAssignedTo}
        onReset={resetFilters}
      />

      {loading ? <LeadTableSkeleton /> : <LeadTable leads={leads} onEdit={openEditModal} onDelete={handleDelete} />}

      <LeadFormModal
        key={modalKey}
        open={modalOpen}
        mode={editingLead ? "edit" : "create"}
        lead={editingLead}
        users={users}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

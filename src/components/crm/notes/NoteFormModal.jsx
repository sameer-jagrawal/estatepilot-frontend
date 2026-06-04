"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Loader2, NotebookPen, Search, Star, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getId, getLeadName } from "./NoteCard";

const PRIORITIES = ["low", "medium", "high"];

function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function buildLeadSearchQuery(search) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  const query = params.toString();
  return query ? `leads?${query}` : "leads";
}

function LeadSearchSelect({ value, initialLeads = [], onChange }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [leads, setLeads] = useState(initialLeads);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(buildLeadSearchQuery(debouncedSearch));
      setLeads(extractArray(response));
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(fetchLeads, 0);
    return () => window.clearTimeout(timer);
  }, [fetchLeads, open]);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead?._id === value) || initialLeads.find((lead) => lead?._id === value),
    [initialLeads, leads, value]
  );

  return (
    <div className="relative">
      <label className="grid gap-2 text-sm font-medium text-[#0F172A]">
        Lead
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-12 items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-left text-sm font-semibold text-[#0F172A] outline-none transition hover:bg-[#F8FAFC] focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#4DA8FF]/15"
        >
          <span className="truncate">{selectedLead?.name || "Select lead"}</span>
          <ChevronDown className="shrink-0 text-[#94A3B8]" size={17} />
        </button>
      </label>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute z-30 mt-2 w-full rounded-2xl border border-[#E2E8F0] bg-white p-3 shadow-[0_22px_55px_rgba(15,23,42,0.14)]"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={17} />
              <input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search leads..."
                className="h-11 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
              />
            </div>

            <div className="mt-3 max-h-56 overflow-y-auto pr-1">
              {loading ? (
                <div className="grid h-24 place-items-center text-sm font-medium text-[#64748B]">Searching leads...</div>
              ) : leads.length ? (
                leads.map((lead) => (
                  <button
                    key={lead?._id}
                    type="button"
                    onClick={() => {
                      onChange(lead?._id || "");
                      setOpen(false);
                      setSearch("");
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-[#F8FAFC]"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-[#0F172A]">{lead?.name || "Lead"}</span>
                      <span className="block text-xs text-[#64748B]">{lead?.phone || lead?.email || "No contact"}</span>
                    </span>
                    {lead?._id === value ? <Check className="text-[#2E95F7]" size={17} /> : null}
                  </button>
                ))
              ) : (
                <div className="grid h-24 place-items-center text-sm font-medium text-[#64748B]">No leads found</div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function NoteFormModal({ open, mode = "create", note, leads = [], saving, onClose, onSubmit }) {
  const [form, setForm] = useState(() => ({
    leadId: getId(note?.leadId) || "",
    note: note?.note || "",
    priority: note?.priority || "medium",
    isImportant: Boolean(note?.isImportant),
  }));

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.leadId) return toast.error("Lead is required");
    if (!form.note.trim()) return toast.error("Note is required");
    if (form.note.trim().length < 5) return toast.error("Note must be at least 5 characters");

    onSubmit({
      leadId: form.leadId,
      note: form.note.trim(),
      priority: form.priority,
      isImportant: form.isImportant,
    });
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
                  <NotebookPen size={21} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A]">{mode === "edit" ? "Edit Note" : "Add Note"}</h2>
                  <p className="mt-1 text-sm text-[#64748B]">{mode === "edit" ? getLeadName(note) : "Capture an important lead insight."}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC]"
                aria-label="Close note modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <LeadSearchSelect value={form.leadId} initialLeads={leads} onChange={(value) => updateField("leadId", value)} />

              <label className="grid gap-2 text-sm font-medium text-[#0F172A]">
                Note
                <textarea
                  value={form.note}
                  onChange={(event) => updateField("note", event.target.value)}
                  rows={6}
                  placeholder="Write note details..."
                  className="resize-none rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#4DA8FF]/15"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="grid gap-2 text-sm font-medium text-[#0F172A]">
                  Priority
                  <select
                    value={form.priority}
                    onChange={(event) => updateField("priority", event.target.value)}
                    className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#4DA8FF]/15"
                  >
                    {PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A]">
                  <input
                    type="checkbox"
                    checked={form.isImportant}
                    onChange={(event) => updateField("isImportant", event.target.checked)}
                    className="h-4 w-4 accent-[#A78BFA]"
                  />
                  <Star size={17} className="text-[#A78BFA]" />
                  Important
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="h-12 rounded-2xl border border-[#E2E8F0] px-5 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#4DA8FF] px-5 text-sm font-semibold text-white transition hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <NotebookPen size={16} />}
                {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Note"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

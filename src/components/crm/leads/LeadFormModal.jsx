"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Loader from "@/components/common/Loader";

export const STATUS_OPTIONS = ["new", "contacted", "follow_up", "site_visit", "negotiation", "booked", "lost"];
export const SOURCE_OPTIONS = ["facebook", "instagram", "99acres", "magicbricks", "housing", "website", "whatsapp", "call", "walkin", "referral", "other"];
export const INTERESTED_OPTIONS = ["flat", "villa", "plot", "commercial"];

const emptyLead = {
  name: "",
  phone: "",
  email: "",
  source: "other",
  status: "new",
  interestedIn: "flat",
  budgetMin: "",
  budgetMax: "",
  locationPreference: "",
  assignedTo: "",
  notes: "",
};

function getAssignedId(lead) {
  if (!lead?.assignedTo) return "";
  return typeof lead.assignedTo === "string" ? lead.assignedTo : lead.assignedTo?._id || "";
}

export function buildLeadPayload(form) {
  return {
    ...form,
    budgetMin: Number(form.budgetMin || 0),
    budgetMax: Number(form.budgetMax || 0),
    assignedTo: form.assignedTo || null,
  };
}

export default function LeadFormModal({ open, mode = "create", lead, users = [], saving = false, onClose, onSubmit }) {
  const initialForm = useMemo(
    () => ({
      name: lead?.name || emptyLead.name,
      phone: lead?.phone || emptyLead.phone,
      email: lead?.email || emptyLead.email,
      source: lead?.source || emptyLead.source,
      status: lead?.status || emptyLead.status,
      interestedIn: lead?.interestedIn || emptyLead.interestedIn,
      locationPreference: lead?.locationPreference || emptyLead.locationPreference,
      notes: lead?.notes || emptyLead.notes,
      assignedTo: getAssignedId(lead),
      budgetMin: lead?.budgetMin ?? "",
      budgetMax: lead?.budgetMax ?? "",
    }),
    [lead]
  );

  const [form, setForm] = useState(initialForm);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(buildLeadPayload(form));
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#0F172A]/35 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="my-6 w-full max-w-4xl rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">{mode === "edit" ? "Edit Lead" : "Add Lead"}</h2>
                <p className="mt-1 text-sm font-medium text-[#64748B]">Capture buyer intent, assignment, and notes.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name" value={form.name} onChange={(value) => updateField("name", value)} required />
                <Field label="Phone" value={form.phone} onChange={(value) => updateField("phone", value)} required />
                <Field label="Email" type="email" value={form.email || ""} onChange={(value) => updateField("email", value)} />
                <Select label="Source" value={form.source} options={SOURCE_OPTIONS} onChange={(value) => updateField("source", value)} />
                <Select label="Status" value={form.status} options={STATUS_OPTIONS} onChange={(value) => updateField("status", value)} />
                <Select label="Interested In" value={form.interestedIn} options={INTERESTED_OPTIONS} onChange={(value) => updateField("interestedIn", value)} />
                <Field label="Budget Min" type="number" value={form.budgetMin} onChange={(value) => updateField("budgetMin", value)} />
                <Field label="Budget Max" type="number" value={form.budgetMax} onChange={(value) => updateField("budgetMax", value)} />
                <Field label="Location Preference" value={form.locationPreference || ""} onChange={(value) => updateField("locationPreference", value)} />
                <Select
                  label="Assigned To"
                  value={form.assignedTo}
                  options={users.map((user) => ({ value: user?._id, label: user?.name || user?.email || "Agent" }))}
                  placeholder="Unassigned"
                  onChange={(value) => updateField("assignedTo", value)}
                />
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#0F172A]">Notes</span>
                <textarea
                  value={form.notes || ""}
                  onChange={(event) => updateField("notes", event.target.value)}
                  rows={4}
                  className="resize-none rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
                  placeholder="Add requirements, objections, property preferences..."
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <Loader label="Saving" className="text-white" spinnerClassName="border-white/40 border-t-white" /> : mode === "edit" ? "Save Changes" : "Create Lead"}
                </button>
              </div>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
      />
    </label>
  );
}

function Select({ label, value, options = [], placeholder, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => {
          const item = typeof option === "string" ? { value: option, label: option.replace(/_/g, " ") } : option;
          return (
            <option key={item.value || item.label} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

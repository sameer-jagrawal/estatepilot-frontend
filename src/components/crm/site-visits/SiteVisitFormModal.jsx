"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Loader from "@/components/common/Loader";
import { STATUS_OPTIONS } from "./SiteVisitStatusBadge";

function getId(value) {
  if (!value) return "";
  return typeof value === "string" ? value : value?._id || "";
}

function toDatetimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function buildSiteVisitPayload(form, mode) {
  const payload = {
    scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : "",
    assignedTo: form.assignedTo,
    status: form.status,
    feedback: form.feedback,
    cancelledReason: form.cancelledReason,
  };

  if (mode !== "edit") {
    payload.leadId = form.leadId;
    payload.propertyId = form.propertyId;
  }

  return payload;
}

export default function SiteVisitFormModal({ open, mode = "create", visit, leads = [], properties = [], users = [], saving = false, onClose, onSubmit }) {
  const initialForm = useMemo(
    () => ({
      leadId: getId(visit?.leadId),
      propertyId: getId(visit?.propertyId),
      assignedTo: getId(visit?.assignedTo),
      scheduledAt: toDatetimeLocal(visit?.scheduledAt),
      status: visit?.status || "scheduled",
      feedback: visit?.feedback || "",
      cancelledReason: visit?.cancelledReason || "",
    }),
    [visit]
  );

  const [form, setForm] = useState(initialForm);
  const isEdit = mode === "edit";

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(buildSiteVisitPayload(form, mode));
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                <h2 className="text-lg font-semibold text-[#0F172A]">{isEdit ? "Edit Site Visit" : "Add Site Visit"}</h2>
                <p className="mt-1 text-sm font-medium text-[#64748B]">Schedule and manage property visits with customers.</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <EntitySelect label="Lead" value={form.leadId} disabled={isEdit} required={!isEdit} items={leads} getLabel={(lead) => `${lead?.name || "Lead"} ${lead?.phone ? `- ${lead.phone}` : ""}`} onChange={(value) => updateField("leadId", value)} />
                <EntitySelect label="Property" value={form.propertyId} disabled={isEdit} required={!isEdit} items={properties} getLabel={(property) => `${property?.title || "Property"} ${property?.location ? `- ${property.location}` : ""} ${property?.propertyCode ? `(${property.propertyCode})` : ""}`} onChange={(value) => updateField("propertyId", value)} />
                <EntitySelect label="Assigned Agent" value={form.assignedTo} required items={users} getLabel={(user) => `${user?.name || user?.email || "User"} ${user?.role ? `- ${user.role}` : ""}`} onChange={(value) => updateField("assignedTo", value)} />
                <Field label="Scheduled Date & Time" type="datetime-local" required value={form.scheduledAt} onChange={(value) => updateField("scheduledAt", value)} />
                <Select label="Status" value={form.status} options={STATUS_OPTIONS} onChange={(value) => updateField("status", value)} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextArea label="Feedback" value={form.feedback} onChange={(value) => updateField("feedback", value)} />
                <TextArea label="Cancelled Reason" value={form.cancelledReason} onChange={(value) => updateField("cancelledReason", value)} />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={onClose} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC]">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white hover:bg-[#2E95F7] disabled:opacity-60">
                  {saving ? <Loader label="Saving" className="text-white" spinnerClassName="border-white/40 border-t-white" /> : isEdit ? "Save Changes" : "Create Site Visit"}
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
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15" />
    </label>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold capitalize text-[#0F172A] outline-none focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15">
        {options.map((option) => <option key={option} value={option}>{option.replace(/_/g, " ")}</option>)}
      </select>
    </label>
  );
}

function EntitySelect({ label, value, items, getLabel, onChange, required = false, disabled = false }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <select required={required} disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none disabled:opacity-60 focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15">
        <option value="">Select {label.toLowerCase()}</option>
        {items.map((item) => <option key={item?._id} value={item?._id}>{getLabel(item)}</option>)}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="resize-none rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15" />
    </label>
  );
}

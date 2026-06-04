"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Loader from "@/components/common/Loader";

export const FOLLOWUP_TYPE_OPTIONS = ["call", "whatsapp", "site_visit", "meeting", "property_sharing", "email", "negotiation", "payment_followup"];
export const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"];
export const STATUS_OPTIONS = ["pending", "completed", "cancelled", "overdue", "today"];
export const REMINDER_OPTIONS = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "3 hours", value: 180 },
  { label: "1 day", value: 1440 },
];

const emptyFollowup = {
  leadId: "",
  assignedTo: "",
  followupType: "call",
  dueAt: "",
  priority: "medium",
  notes: "",
  reminderBefore: 30,
};

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

export function buildFollowupPayload(form, selectedLead) {
  const type = form.followupType === "payment_followup" ? "payment" : form.followupType === "property_sharing" ? "other" : form.followupType;
  const title = `${form.followupType.replace(/_/g, " ")} with ${selectedLead?.name || "lead"}`;

  return {
    leadId: form.leadId,
    assignedTo: form.assignedTo,
    type,
    followupType: form.followupType,
    title,
    dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : "",
    priority: form.priority,
    note: form.notes,
    notes: form.notes,
    reminderBefore: Number(form.reminderBefore || 0),
  };
}

export default function FollowupFormModal({ open, mode = "create", followup, leads = [], users = [], saving = false, onClose, onSubmit }) {
  const initialForm = useMemo(
    () => ({
      leadId: getId(followup?.leadId) || emptyFollowup.leadId,
      assignedTo: getId(followup?.assignedTo) || emptyFollowup.assignedTo,
      followupType: followup?.followupType || followup?.type || emptyFollowup.followupType,
      dueAt: toDatetimeLocal(followup?.dueAt),
      priority: followup?.priority || emptyFollowup.priority,
      notes: followup?.notes || followup?.note || emptyFollowup.notes,
      reminderBefore: followup?.reminderBefore || emptyFollowup.reminderBefore,
    }),
    [followup]
  );

  const [form, setForm] = useState(initialForm);
  const selectedLead = leads.find((lead) => lead?._id === form.leadId);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(buildFollowupPayload(form, selectedLead));
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
                <h2 className="text-lg font-semibold text-[#0F172A]">{mode === "edit" ? "Edit Follow-up" : "Add Follow-up"}</h2>
                <p className="mt-1 text-sm font-medium text-[#64748B]">Schedule calls, visits, reminders, and customer touchpoints.</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <EntitySelect label="Lead" value={form.leadId} items={leads} onChange={(value) => updateField("leadId", value)} required />
                <EntitySelect label="Assigned To" value={form.assignedTo} items={users} onChange={(value) => updateField("assignedTo", value)} required />
                <Select label="Follow-up Type" value={form.followupType} options={FOLLOWUP_TYPE_OPTIONS} onChange={(value) => updateField("followupType", value)} required />
                <Field label="Date & Time" type="datetime-local" value={form.dueAt} onChange={(value) => updateField("dueAt", value)} required />
                <Select label="Priority" value={form.priority} options={PRIORITY_OPTIONS} onChange={(value) => updateField("priority", value)} />
                <Select
                  label="Reminder Before"
                  value={String(form.reminderBefore)}
                  options={REMINDER_OPTIONS.map((item) => ({ value: String(item.value), label: item.label }))}
                  onChange={(value) => updateField("reminderBefore", value)}
                />
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#0F172A]">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  rows={4}
                  className="resize-none rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
                  placeholder="Add conversation context, next action, or reminder details..."
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={onClose} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC]">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? <Loader label="Saving" className="text-white" spinnerClassName="border-white/40 border-t-white" /> : mode === "edit" ? "Save Changes" : "Create Follow-up"}
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
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15" />
    </label>
  );
}

function Select({ label, value, options, onChange, required = false }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold capitalize text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15">
        {options.map((option) => {
          const item = typeof option === "string" ? { value: option, label: option.replace(/_/g, " ") } : option;
          return <option key={item.value} value={item.value}>{item.label}</option>;
        })}
      </select>
    </label>
  );
}

function EntitySelect({ label, value, items, onChange, required = false }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15">
        <option value="">Select {label.toLowerCase()}</option>
        {items.map((item) => (
          <option key={item?._id} value={item?._id}>{item?.name || item?.email || item?.phone || "Option"}</option>
        ))}
      </select>
    </label>
  );
}

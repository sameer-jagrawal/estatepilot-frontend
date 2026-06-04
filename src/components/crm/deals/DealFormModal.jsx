"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Loader from "@/components/common/Loader";
import { DEAL_STATUS_OPTIONS } from "./DealStatusBadge";
import { PAYMENT_STATUS_OPTIONS } from "./PaymentStatusBadge";
import { DEAL_TYPE_OPTIONS } from "./DealFilters";
import { getId } from "./DealCard";

export function buildDealPayload(form) {
  return {
    leadId: form.leadId,
    propertyId: form.propertyId,
    agentId: form.agentId,
    dealType: form.dealType,
    dealAmount: Number(form.dealAmount || 0),
    commissionAmount: Number(form.commissionAmount || 0),
    tokenAmount: Number(form.tokenAmount || 0),
    paymentStatus: form.paymentStatus,
    dealStatus: form.dealStatus,
    notes: form.notes,
  };
}

export default function DealFormModal({ open, mode = "create", deal, leads = [], properties = [], users = [], saving = false, onClose, onSubmit }) {
  const initialForm = useMemo(
    () => ({
      leadId: getId(deal?.leadId),
      propertyId: getId(deal?.propertyId),
      agentId: getId(deal?.agentId),
      dealType: deal?.dealType || "sale",
      dealAmount: deal?.dealAmount ?? "",
      commissionAmount: deal?.commissionAmount ?? "",
      tokenAmount: deal?.tokenAmount ?? "",
      paymentStatus: deal?.paymentStatus || "pending",
      dealStatus: deal?.dealStatus || "booked",
      notes: deal?.notes || "",
    }),
    [deal]
  );

  const [form, setForm] = useState(initialForm);
  const isEdit = mode === "edit";
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(buildDealPayload(form));
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section role="dialog" aria-modal="true" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} transition={{ duration: 0.22 }} className="my-6 w-full max-w-5xl rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">{isEdit ? "Edit Deal" : "Add Deal"}</h2>
                <p className="mt-1 text-sm font-medium text-[#64748B]">Connect a lead, property, and agent to track booked revenue.</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <EntitySelect label="Lead" value={form.leadId} required items={leads} getLabel={(lead) => `${lead?.name || "Lead"} ${lead?.phone ? `- ${lead.phone}` : ""}`} onChange={(value) => updateField("leadId", value)} />
                <EntitySelect label="Property" value={form.propertyId} required items={properties} getLabel={(property) => `${property?.title || "Property"} ${property?.location ? `- ${property.location}` : ""} ${property?.propertyCode ? `(${property.propertyCode})` : ""}`} onChange={(value) => updateField("propertyId", value)} />
                <EntitySelect label="Agent" value={form.agentId} required items={users} getLabel={(user) => `${user?.name || user?.email || "User"} ${user?.role ? `- ${user.role}` : ""}`} onChange={(value) => updateField("agentId", value)} />
                <Select label="Deal Type" value={form.dealType} options={DEAL_TYPE_OPTIONS} onChange={(value) => updateField("dealType", value)} />
                <Field label="Deal Amount" type="number" min="0" required value={form.dealAmount} onChange={(value) => updateField("dealAmount", value)} />
                <Field label="Commission Amount" type="number" min="0" value={form.commissionAmount} onChange={(value) => updateField("commissionAmount", value)} />
                <Field label="Token Amount" type="number" min="0" value={form.tokenAmount} onChange={(value) => updateField("tokenAmount", value)} />
                <Select label="Payment Status" value={form.paymentStatus} options={PAYMENT_STATUS_OPTIONS} onChange={(value) => updateField("paymentStatus", value)} />
                <Select label="Deal Status" value={form.dealStatus} options={DEAL_STATUS_OPTIONS} onChange={(value) => updateField("dealStatus", value)} />
              </div>

              <TextArea label="Notes" value={form.notes} onChange={(value) => updateField("notes", value)} />

              <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={onClose} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC]">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white hover:bg-[#2E95F7] disabled:opacity-60">
                  {saving ? <Loader label="Saving" className="text-white" spinnerClassName="border-white/40 border-t-white" /> : isEdit ? "Save Changes" : "Create Deal"}
                </button>
              </div>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({ label, value, onChange, type = "text", required = false, min }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <input type={type} min={min} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15" />
    </label>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold capitalize text-[#0F172A] outline-none focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function EntitySelect({ label, value, items, getLabel, onChange, required = false }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15">
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

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EyeOff, X } from "lucide-react";

const emptyForm = {
  businessAccountId: "",
  phoneNumberId: "",
  displayPhoneNumber: "",
  accessToken: "",
  webhookVerifyToken: "",
  status: "connected",
};

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#0F172A]">
      {label}
      {children}
    </label>
  );
}

export default function WhatsAppConnectModal({ open, mode = "connect", account, saving, onClose, onSubmit }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    businessAccountId: mode === "update" ? account?.businessAccountId || "" : "",
    phoneNumberId: mode === "update" ? account?.phoneNumberId || "" : "",
    displayPhoneNumber: mode === "update" ? account?.displayPhoneNumber || "" : "",
    webhookVerifyToken: mode === "update" ? account?.webhookVerifyToken || "" : "",
    status: mode === "update" ? account?.status || "connected" : "connected",
  }));

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = { ...form };
    if (mode === "update" && !payload.accessToken) delete payload.accessToken;
    onSubmit(payload);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#0F172A]">{mode === "connect" ? "Connect WhatsApp" : "Update WhatsApp credentials"}</h2>
                <p className="mt-1 text-sm text-[#64748B]">Access token stays hidden and is not displayed after save.</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Business Account ID">
                <input required value={form.businessAccountId} onChange={(event) => updateField("businessAccountId", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
              </Field>
              <Field label="Phone Number ID">
                <input required value={form.phoneNumberId} onChange={(event) => updateField("phoneNumberId", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
              </Field>
              <Field label="Display Phone Number">
                <input required value={form.displayPhoneNumber} onChange={(event) => updateField("displayPhoneNumber", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(event) => updateField("status", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]">
                  <option value="connected">Connected</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="disconnected">Disconnected</option>
                </select>
              </Field>
              <Field label="Access Token">
                <div className="relative">
                  <input
                    required={mode === "connect"}
                    type="password"
                    value={form.accessToken}
                    onChange={(event) => updateField("accessToken", event.target.value)}
                    placeholder={mode === "update" ? "Leave blank to keep existing token" : ""}
                    className="h-12 w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 pr-11 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]"
                  />
                  <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={17} />
                </div>
              </Field>
              <Field label="Webhook Verify Token">
                <input required value={form.webhookVerifyToken} onChange={(event) => updateField("webhookVerifyToken", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
              </Field>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} disabled={saving} className="h-12 rounded-2xl border border-[#E2E8F0] px-5 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="h-12 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white transition hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving..." : mode === "connect" ? "Connect WhatsApp" : "Save credentials"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

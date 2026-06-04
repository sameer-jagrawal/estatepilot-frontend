"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EyeOff, MessageCircle, PlugZap, X } from "lucide-react";

const emptyForm = {
  businessAccountId: "",
  phoneNumberId: "",
  displayPhoneNumber: "",
  accessToken: "",
  webhookVerifyToken: "",
  status: "connected",
};

function isConnected(account) {
  return Boolean(account?.businessAccountId || account?.phoneNumberId || account?.displayPhoneNumber);
}

function Field({ label, children }) {
  return <label className="grid gap-2 text-sm font-medium text-[#0F172A]">{label}{children}</label>;
}

function CredentialsModal({ open, mode, account, saving, onClose, onSubmit }) {
  const [form, setForm] = useState(() => ({
      ...emptyForm,
      businessAccountId: mode === "update" ? account?.businessAccountId || "" : "",
      phoneNumberId: mode === "update" ? account?.phoneNumberId || "" : "",
      displayPhoneNumber: mode === "update" ? account?.displayPhoneNumber || "" : "",
      webhookVerifyToken: mode === "update" ? account?.webhookVerifyToken || "" : "",
      status: mode === "update" ? account?.status || "connected" : "connected",
    }));

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form };
    if (mode === "update" && !payload.accessToken) delete payload.accessToken;
    const saved = await onSubmit(payload, mode);
    if (saved) onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.form onSubmit={submit} initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-[#0F172A]">{mode === "connect" ? "Connect WhatsApp" : "Update Credentials"}</h3>
                <p className="mt-1 text-sm text-[#64748B]">Access token is saved as a password field and never shown after save.</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close modal"><X size={18} /></button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Business Account ID"><input required value={form.businessAccountId} onChange={(event) => update("businessAccountId", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] px-4 text-sm font-semibold outline-none focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" /></Field>
              <Field label="Phone Number ID"><input required value={form.phoneNumberId} onChange={(event) => update("phoneNumberId", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] px-4 text-sm font-semibold outline-none focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" /></Field>
              <Field label="Display Phone Number"><input required value={form.displayPhoneNumber} onChange={(event) => update("displayPhoneNumber", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] px-4 text-sm font-semibold outline-none focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" /></Field>
              <Field label="Status">
                <select value={form.status} onChange={(event) => update("status", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]">
                  <option value="connected">Connected</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="disconnected">Disconnected</option>
                </select>
              </Field>
              <Field label="Access Token">
                <div className="relative">
                  <input required={mode === "connect"} type="password" value={form.accessToken} onChange={(event) => update("accessToken", event.target.value)} placeholder={mode === "update" ? "Leave blank to keep existing token" : ""} className="h-12 w-full rounded-2xl border border-[#E2E8F0] px-4 pr-11 text-sm font-semibold outline-none focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
                  <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={17} />
                </div>
              </Field>
              <Field label="Webhook Verify Token"><input required value={form.webhookVerifyToken} onChange={(event) => update("webhookVerifyToken", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] px-4 text-sm font-semibold outline-none focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" /></Field>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} disabled={saving} className="h-12 rounded-2xl border border-[#E2E8F0] px-5 text-sm text-[#64748B] hover:bg-[#F8FAFC]">Cancel</button>
              <button type="submit" disabled={saving} className="h-12 rounded-2xl bg-[#4DA8FF] px-5 text-sm font-semibold text-white hover:bg-[#2E95F7] disabled:opacity-60">{saving ? "Saving..." : mode === "connect" ? "Connect WhatsApp" : "Save credentials"}</button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function WhatsAppSettings({ account, loading, saving, onSave, onDisconnect }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("connect");
  const connected = isConnected(account) && account?.status !== "disconnected";

  const openModal = (nextMode) => {
    setMode(nextMode);
    setModalOpen(true);
  };

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="flex gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]"><MessageCircle size={22} /></div>
        <div>
          <h2 className="text-xl font-semibold text-[#0F172A]">WhatsApp</h2>
          <p className="mt-1 text-sm text-[#64748B]">Connect your WhatsApp Business account for CRM messaging.</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 h-52 animate-pulse rounded-2xl bg-[#F1F5F9]" />
      ) : connected ? (
        <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#15803D]">{account?.status || "connected"}</span>
              <p className="mt-3 text-2xl font-semibold text-[#0F172A]">{account?.displayPhoneNumber || "Phone number unavailable"}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => openModal("update")} className="h-11 rounded-2xl bg-[#4DA8FF] px-4 text-sm font-semibold text-white hover:bg-[#2E95F7]">Update Credentials</button>
              <button type="button" onClick={onDisconnect} disabled={saving} className="h-11 rounded-2xl border border-[#E2E8F0] px-4 text-sm text-[#64748B] hover:bg-white disabled:opacity-60">Disconnect</button>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4"><p className="text-xs text-[#64748B]">Business Account ID</p><p className="mt-1 break-all text-sm font-semibold text-[#0F172A]">{account?.businessAccountId || "Not set"}</p></div>
            <div className="rounded-2xl bg-white p-4"><p className="text-xs text-[#64748B]">Phone Number ID</p><p className="mt-1 break-all text-sm font-semibold text-[#0F172A]">{account?.phoneNumberId || "Not set"}</p></div>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid min-h-72 place-items-center rounded-2xl border border-dashed border-[#A78BFA] bg-[#F8FAFC] p-6 text-center">
          <div>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#A78BFA]"><PlugZap size={25} /></div>
            <h3 className="mt-4 text-xl font-semibold text-[#0F172A]">WhatsApp Business is not connected</h3>
            <button type="button" onClick={() => openModal("connect")} className="mt-5 h-11 rounded-2xl bg-[#4DA8FF] px-5 text-sm font-semibold text-white hover:bg-[#2E95F7]">Connect WhatsApp</button>
          </div>
        </div>
      )}

      {modalOpen ? (
        <CredentialsModal
          key={`${mode}-${account?._id || account?.businessAccountId || "new"}`}
          open={modalOpen}
          mode={mode}
          account={account}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSubmit={onSave}
        />
      ) : null}
    </section>
  );
}

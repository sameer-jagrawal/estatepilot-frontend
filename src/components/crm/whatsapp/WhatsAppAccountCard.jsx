"use client";

import { motion } from "framer-motion";
import { KeyRound, Link2, Phone, Power, RefreshCw, ShieldCheck } from "lucide-react";

const accountStatusTheme = {
  connected: "bg-[#DCFCE7] text-[#16A34A]",
  disconnected: "bg-[#FEE2E2] text-[#DC2626]",
  expired: "bg-[#FEF3C7] text-[#D97706]",
  pending: "bg-[#EAF5FF] text-[#2E95F7]",
};

function formatLabel(value) {
  if (!value) return "Unknown";
  return String(value).replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function AccountSkeleton() {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="animate-pulse">
        <div className="h-5 w-44 rounded-full bg-[#E2E8F0]" />
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-20 rounded-2xl bg-[#F8FAFC]" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
        <Icon size={14} />
        {label}
      </div>
      <p className="mt-2 truncate text-sm font-semibold text-[#0F172A]">{value || "-"}</p>
    </div>
  );
}

export default function WhatsAppAccountCard({ account, loading, saving, onConnect, onUpdate, onDisconnect }) {
  if (loading) return <AccountSkeleton />;

  const connected = account?.status === "connected" && account?.isActive !== false;
  const statusClass = accountStatusTheme[account?.status] || accountStatusTheme.pending;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6"
    >
      {connected ? (
        <div className="grid gap-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F3EEFF] px-3 py-1.5 text-xs font-semibold text-[#A78BFA]">
                <ShieldCheck size={15} />
                WhatsApp Business connected
              </div>
              <h2 className="mt-3 text-xl font-semibold text-[#0F172A]">{account?.displayPhoneNumber || "Connected account"}</h2>
              <p className="mt-1 text-sm text-[#64748B]">Credentials are stored securely. Access token is never shown after save.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onUpdate}
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] transition hover:-translate-y-0.5 hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={17} />
                Update credentials
              </button>
              <button
                type="button"
                onClick={onDisconnect}
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#FEE2E2] bg-[#FEF2F2] px-4 text-sm font-semibold text-[#DC2626] transition hover:-translate-y-0.5 hover:bg-[#FEE2E2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Power size={17} />
                Disconnect
              </button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <Detail icon={Phone} label="Display phone" value={account?.displayPhoneNumber} />
            <Detail icon={Link2} label="Business account ID" value={account?.businessAccountId} />
            <Detail icon={KeyRound} label="Phone number ID" value={account?.phoneNumberId} />
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Status</p>
              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{formatLabel(account?.status)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
              <Phone size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#0F172A]">Connect your WhatsApp Business Account</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#64748B]">
                Add your Business Account ID, phone number ID, and webhook credentials to start saving CRM conversations.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onConnect}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2E95F7] hover:shadow-[0_16px_35px_rgba(77,168,255,0.25)]"
          >
            <Link2 size={18} />
            Connect WhatsApp
          </button>
        </div>
      )}
    </motion.section>
  );
}

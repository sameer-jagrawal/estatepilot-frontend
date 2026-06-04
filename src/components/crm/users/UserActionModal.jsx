"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

const examples = ["Performance issue", "Temporary leave", "Policy violation"];

export default function UserActionModal({ open, user, saving, onClose, onConfirm }) {
  const [suspensionReason, setSuspensionReason] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm({ suspensionReason: suspensionReason.trim() });
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} className="w-full max-w-xl rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FEE2E2] text-[#DC2626]">
                  <AlertTriangle size={21} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A]">Suspend {user?.name || "user"}?</h2>
                  <p className="mt-1 text-sm text-[#64748B]">Suspended users cannot log in.</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <label className="mt-5 grid gap-2 text-sm font-medium text-[#0F172A]">
              Suspension reason
              <textarea value={suspensionReason} onChange={(event) => setSuspensionReason(event.target.value)} rows={4} placeholder="Add a reason" className="resize-none rounded-2xl border border-[#E2E8F0] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {examples.map((reason) => (
                <button key={reason} type="button" onClick={() => setSuspensionReason(reason)} className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs text-[#64748B] transition hover:bg-[#EAF5FF] hover:text-[#2E95F7]">
                  {reason}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} disabled={saving} className="h-12 rounded-2xl border border-[#E2E8F0] px-5 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="h-12 rounded-2xl border border-[#FEE2E2] bg-[#FEE2E2] px-5 text-sm font-semibold text-[#DC2626] transition hover:bg-[#FECACA] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Suspending..." : "Suspend User"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

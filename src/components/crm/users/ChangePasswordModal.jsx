"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, X } from "lucide-react";
import { toast } from "sonner";

export default function ChangePasswordModal({ open, user, saving, onClose, onSubmit }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    onSubmit({ newPassword });
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} className="w-full max-w-xl rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
                  <KeyRound size={21} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A]">Change password</h2>
                  <p className="mt-1 text-sm text-[#64748B]">{user?.name || "Selected user"}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-[#0F172A]">
                New password
                <input type="password" minLength={6} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-[#0F172A]">
                Confirm password
                <input type="password" minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} disabled={saving} className="h-12 rounded-2xl border border-[#E2E8F0] px-5 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="h-12 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white transition hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Changing..." : "Change Password"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

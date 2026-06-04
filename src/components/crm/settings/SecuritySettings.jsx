"use client";

import { useState } from "react";
import { KeyRound, Laptop, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import ChangePasswordModal from "@/components/crm/users/ChangePasswordModal";

export default function SecuritySettings() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const changePassword = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordOpen(false);
      toast.success("Password change flow is ready for profile API integration");
    }, 450);
  };

  return (
    <section className="grid gap-5">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]"><Lock size={22} /></div>
            <div>
              <h2 className="text-xl font-semibold text-[#0F172A]">Security</h2>
              <p className="mt-1 text-sm text-[#64748B]">Review password, sessions, and login protection.</p>
            </div>
          </div>
          <button type="button" onClick={() => setPasswordOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#4DA8FF] px-4 text-sm font-semibold text-white hover:bg-[#2E95F7]"><KeyRound size={16} /> Change Password</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <Laptop className="text-[#2E95F7]" size={22} />
          <h3 className="mt-4 text-base font-semibold text-[#0F172A]">Active sessions</h3>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">Session management placeholder for current and recent devices.</p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <ShieldCheck className="text-[#A78BFA]" size={22} />
          <h3 className="mt-4 text-base font-semibold text-[#0F172A]">Two-factor authentication</h3>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">2FA setup placeholder for stronger owner and manager login security.</p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
          <Lock className="text-[#2E95F7]" size={22} />
          <h3 className="mt-4 text-base font-semibold text-[#0F172A]">Login activity</h3>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">Login history placeholder for IP, device, and timestamp visibility.</p>
        </div>
      </div>

      <ChangePasswordModal open={passwordOpen} user={{ name: "Workspace owner" }} saving={saving} onClose={() => setPasswordOpen(false)} onSubmit={changePassword} />
    </section>
  );
}

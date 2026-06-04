"use client";

import { useState } from "react";
import { Bell, GitBranch, ShieldCheck, UserRoundCheck } from "lucide-react";
import { toast } from "sonner";

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-[#4DA8FF]" : "bg-[#CBD5E1]"}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

export default function LeadSettings() {
  const [settings, setSettings] = useState({
    defaultSource: "website",
    autoAssign: true,
    defaultStatus: "new",
    followupReminder: "24 hours",
    duplicateDetection: true,
  });

  const update = (field, value) => setSettings((current) => ({ ...current, [field]: value }));

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-xl font-semibold text-[#0F172A]">Lead Settings</h2>
          <p className="mt-1 text-sm text-[#64748B]">Tune how new enquiries enter your pipeline.</p>
        </div>
        <button type="button" onClick={() => toast.success("Lead preferences saved locally")} className="h-11 rounded-2xl bg-[#4DA8FF] px-4 text-sm font-semibold text-white hover:bg-[#2E95F7]">Save preferences</button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <GitBranch className="text-[#2E95F7]" size={21} />
          <label className="mt-4 grid gap-2 text-sm font-medium text-[#0F172A]">
            Default lead source
            <select value={settings.defaultSource} onChange={(event) => update("defaultSource", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]">
              <option value="website">Website</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="walk-in">Walk-in</option>
              <option value="referral">Referral</option>
            </select>
          </label>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <UserRoundCheck className="text-[#A78BFA]" size={21} />
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">Auto assign leads</p>
              <p className="mt-1 text-xs text-[#64748B]">Route new leads to available team members.</p>
            </div>
            <Toggle checked={settings.autoAssign} onChange={(value) => update("autoAssign", value)} />
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <ShieldCheck className="text-[#2E95F7]" size={21} />
          <label className="mt-4 grid gap-2 text-sm font-medium text-[#0F172A]">
            Default lead status
            <select value={settings.defaultStatus} onChange={(event) => update("defaultStatus", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
            </select>
          </label>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <Bell className="text-[#A78BFA]" size={21} />
          <label className="mt-4 grid gap-2 text-sm font-medium text-[#0F172A]">
            Follow-up reminder default
            <select value={settings.followupReminder} onChange={(event) => update("followupReminder", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]">
              <option value="same day">Same day</option>
              <option value="24 hours">24 hours</option>
              <option value="48 hours">48 hours</option>
              <option value="1 week">1 week</option>
            </select>
          </label>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">Duplicate lead detection</p>
              <p className="mt-1 text-xs text-[#64748B]">Flag matching phone numbers and email addresses before duplicates enter the CRM.</p>
            </div>
            <Toggle checked={settings.duplicateDetection} onChange={(value) => update("duplicateDetection", value)} />
          </div>
        </div>
      </div>
    </section>
  );
}

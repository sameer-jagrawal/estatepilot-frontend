"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";
import { toast } from "sonner";

const options = [
  ["email", "Email notifications", "Receive CRM alerts in your inbox."],
  ["whatsapp", "WhatsApp notifications", "Send important updates through WhatsApp."],
  ["followups", "Follow-up reminders", "Never miss a scheduled lead follow-up."],
  ["siteVisits", "Site visit reminders", "Remind agents before property visits."],
  ["deals", "Deal updates", "Notify owners and managers when deal stages change."],
  ["dailySummary", "Daily summary", "Start the day with a pipeline digest."],
];

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-[#4DA8FF]" : "bg-[#CBD5E1]"}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    whatsapp: true,
    followups: true,
    siteVisits: true,
    deals: true,
    dailySummary: false,
  });

  const update = (field, value) => setSettings((current) => ({ ...current, [field]: value }));

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]"><BellRing size={22} /></div>
          <div>
            <h2 className="text-xl font-semibold text-[#0F172A]">Notifications</h2>
            <p className="mt-1 text-sm text-[#64748B]">Choose which operational signals your team receives.</p>
          </div>
        </div>
        <button type="button" onClick={() => toast.success("Notification preferences saved locally")} className="h-11 rounded-2xl bg-[#4DA8FF] px-4 text-sm font-semibold text-white hover:bg-[#2E95F7]">Save preferences</button>
      </div>
      <div className="mt-6 grid gap-3">
        {options.map(([key, label, description]) => (
          <div key={key} className="flex items-center justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{label}</p>
              <p className="mt-1 text-xs text-[#64748B]">{description}</p>
            </div>
            <Toggle checked={settings[key]} onChange={(value) => update(key, value)} />
          </div>
        ))}
      </div>
    </section>
  );
}

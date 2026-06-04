"use client";

import { Crown, Rocket } from "lucide-react";
import { toast } from "sonner";

function percent(used = 0, max = 1) {
  if (!max) return 0;
  return Math.min(100, Math.round((Number(used || 0) / Number(max || 1)) * 100));
}

function UsageCard({ label, used, max }) {
  const value = percent(used, max);

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#0F172A]">{label}</p>
        <p className="text-xs text-[#64748B]">{used || 0} / {max || "Unlimited"}</p>
      </div>
      <div className="mt-4 h-2.5 rounded-full bg-white">
        <div className="h-2.5 rounded-full bg-[#4DA8FF]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function PlanSettings({ tenant, loading }) {
  return (
    <section className="grid gap-5">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F3EFFF] text-[#A78BFA]">
              <Crown size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#0F172A]">Plan & Limits</h2>
              <p className="mt-1 text-sm text-[#64748B]">Track subscription status and CRM capacity.</p>
            </div>
          </div>
          <button type="button" onClick={() => toast.info("Upgrade flow will be available soon")} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#4DA8FF] px-4 text-sm font-semibold text-white hover:bg-[#2E95F7]">
            <Rocket size={16} /> Upgrade Plan
          </button>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-[#F1F5F9]" />)}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Current plan", tenant?.plan || "free"],
              ["Status", tenant?.status || "trial"],
              ["Trial ends at", tenant?.trialEndsAt || "Not set"],
              ["Max Users", tenant?.maxUsers || 0],
              ["Max Leads", tenant?.maxLeads || 0],
              ["Max Properties", tenant?.maxProperties || 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{label}</p>
                <p className="mt-2 text-lg font-semibold capitalize text-[#0F172A]">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <UsageCard label="Users used" used={tenant?.usersUsed} max={tenant?.maxUsers} />
        <UsageCard label="Leads used" used={tenant?.leadsUsed} max={tenant?.maxLeads} />
        <UsageCard label="Properties used" used={tenant?.propertiesUsed} max={tenant?.maxProperties} />
      </div>
    </section>
  );
}

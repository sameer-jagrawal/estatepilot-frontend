"use client";

import { useState } from "react";
import { X } from "lucide-react";

const planOptions = ["free", "starter", "team", "business"];

export default function TenantPlanModal({ open, tenant, loading, onClose, onSubmit }) {
  const [form, setForm] = useState({
    plan: tenant?.plan || "free",
    maxUsers: tenant?.limits?.maxUsers || 5,
    maxLeads: tenant?.limits?.maxLeads || 1000,
    maxProperties: tenant?.limits?.maxProperties || 500,
  });

  if (!open) return null;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      plan: form.plan,
      limits: {
        maxUsers: Number(form.maxUsers) || 0,
        maxLeads: Number(form.maxLeads) || 0,
        maxProperties: Number(form.maxProperties) || 0,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0B1220]/35 p-4">
      <section className="w-full max-w-lg border border-[#DDE5EF] bg-white">
        <div className="flex items-center justify-between border-b border-[#DDE5EF] px-5 py-4">
          <h2 className="text-base font-semibold text-[#0B1220]">Change Plan</h2>
          <button type="button" onClick={onClose} className="text-[#667085]" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="grid gap-4 p-5">
          <label className="grid gap-1 text-sm font-medium text-[#0B1220]">
            Plan
            <select value={form.plan} onChange={(event) => update("plan", event.target.value)} className="h-10 rounded-md border border-[#DDE5EF] px-3 font-normal capitalize outline-none">
              {planOptions.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["maxUsers", "Max Users"],
              ["maxLeads", "Max Leads"],
              ["maxProperties", "Max Properties"],
            ].map(([key, label]) => (
              <label key={key} className="grid gap-1 text-sm font-medium text-[#0B1220]">
                {label}
                <input type="number" min="0" value={form[key]} onChange={(event) => update(key, event.target.value)} className="h-10 rounded-md border border-[#DDE5EF] px-3 font-normal outline-none" />
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-md border border-[#DDE5EF] px-4 py-2 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="rounded-md bg-[#2E95F7] px-4 py-2 text-sm font-medium text-white hover:bg-[#1C75C9] disabled:opacity-60">
              {loading ? "Saving..." : "Save Plan"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

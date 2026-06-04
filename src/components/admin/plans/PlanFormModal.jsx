"use client";

import { useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  name: "starter",
  displayName: "",
  price: 0,
  billingCycle: "monthly",
  maxUsers: 5,
  maxLeads: 1000,
  maxProperties: 500,
  features: "",
  isPopular: false,
  isActive: true,
  description: "",
};

export default function PlanFormModal({ open, plan, loading, onClose, onSubmit }) {
  const [form, setForm] = useState(
    plan
      ? {
          name: plan?.name || "starter",
          displayName: plan?.displayName || "",
          price: plan?.price || 0,
          billingCycle: plan?.billingCycle || "monthly",
          maxUsers: plan?.limits?.maxUsers || 5,
          maxLeads: plan?.limits?.maxLeads || 1000,
          maxProperties: plan?.limits?.maxProperties || 500,
          features: (plan?.features || []).join(", "),
          isPopular: Boolean(plan?.isPopular),
          isActive: plan?.isActive !== false,
          description: plan?.description || "",
        }
      : initialForm
  );

  if (!open) return null;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      name: form.name,
      displayName: form.displayName,
      price: Number(form.price) || 0,
      billingCycle: form.billingCycle,
      limits: {
        maxUsers: Number(form.maxUsers) || 0,
        maxLeads: Number(form.maxLeads) || 0,
        maxProperties: Number(form.maxProperties) || 0,
      },
      features: form.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
      isPopular: Boolean(form.isPopular),
      isActive: Boolean(form.isActive),
      description: form.description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#0B1220]/35 p-4">
      <section className="my-6 w-full max-w-2xl border border-[#DDE5EF] bg-white">
        <div className="flex items-center justify-between border-b border-[#DDE5EF] px-5 py-4">
          <h2 className="text-base font-semibold text-[#0B1220]">{plan ? "Edit Plan" : "Create Plan"}</h2>
          <button type="button" onClick={onClose} className="text-[#667085]" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="grid gap-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-[#0B1220]">
              Name
              <select disabled={Boolean(plan)} value={form.name} onChange={(event) => update("name", event.target.value)} className="h-10 rounded-md border border-[#DDE5EF] px-3 font-normal capitalize outline-none disabled:bg-[#F6F8FB]">
                {["free", "starter", "team", "business"].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium text-[#0B1220]">
              Display Name
              <input required value={form.displayName} onChange={(event) => update("displayName", event.target.value)} className="h-10 rounded-md border border-[#DDE5EF] px-3 font-normal outline-none" />
            </label>
            <label className="grid gap-1 text-sm font-medium text-[#0B1220]">
              Price
              <input type="number" min="0" value={form.price} onChange={(event) => update("price", event.target.value)} className="h-10 rounded-md border border-[#DDE5EF] px-3 font-normal outline-none" />
            </label>
            <label className="grid gap-1 text-sm font-medium text-[#0B1220]">
              Billing Cycle
              <select value={form.billingCycle} onChange={(event) => update("billingCycle", event.target.value)} className="h-10 rounded-md border border-[#DDE5EF] px-3 font-normal capitalize outline-none">
                {["monthly", "yearly", "lifetime"].map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>
            </label>
          </div>
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
          <label className="grid gap-1 text-sm font-medium text-[#0B1220]">
            Features
            <input value={form.features} onChange={(event) => update("features", event.target.value)} className="h-10 rounded-md border border-[#DDE5EF] px-3 font-normal outline-none" placeholder="Lead pipeline, WhatsApp inbox, Reports" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-[#0B1220]">
            Description
            <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={3} className="rounded-md border border-[#DDE5EF] px-3 py-2 font-normal outline-none" />
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#334155]">
              <input type="checkbox" checked={form.isPopular} onChange={(event) => update("isPopular", event.target.checked)} />
              Popular
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#334155]">
              <input type="checkbox" checked={form.isActive} onChange={(event) => update("isActive", event.target.checked)} />
              Active
            </label>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#DDE5EF] pt-4">
            <button type="button" onClick={onClose} className="rounded-md border border-[#DDE5EF] px-4 py-2 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="rounded-md bg-[#2E95F7] px-4 py-2 text-sm font-medium text-white hover:bg-[#1C75C9] disabled:opacity-60">
              {loading ? "Saving..." : plan ? "Save Changes" : "Create Plan"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

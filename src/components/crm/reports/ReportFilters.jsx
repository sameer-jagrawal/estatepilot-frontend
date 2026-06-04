"use client";

import { Filter, RotateCcw } from "lucide-react";

export const DATE_RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "custom", label: "Custom" },
];

export const LEAD_SOURCE_OPTIONS = [
  "facebook",
  "instagram",
  "99acres",
  "magicbricks",
  "housing",
  "website",
  "whatsapp",
  "call",
  "walkin",
  "referral",
  "other",
];

export const PROPERTY_TYPE_OPTIONS = ["flat", "villa", "plot", "commercial", "office", "shop"];
export const DEAL_STATUS_OPTIONS = ["booked", "closed", "cancelled"];

function labelize(value) {
  return String(value || "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function SelectField({ label, value, onChange, options, placeholder = "All" }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{label}</span>
      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="responsive-control h-11 border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || labelize(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ReportFilters({ filters, onChange, onReset, users = [] }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });
  const agentOptions = users
    .filter((user) => user?.role === "agent" || user?.role === "manager" || user?.role === "owner")
    .map((user) => ({ value: user?._id, label: user?.name || "Team member" }));

  return (
    <section className="responsive-filter-panel">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
            <Filter size={18} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[#0F172A]">Report filters</h2>
            <p className="text-xs text-[#64748B]">Narrow analytics by team, source, property, and pipeline stage.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#64748B] transition hover:border-[#4DA8FF]/50 hover:bg-white hover:text-[#0F172A]"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="responsive-filter-grid md:grid-cols-2 xl:grid-cols-5">
        <SelectField label="Date range" value={filters?.dateRange} onChange={(value) => update("dateRange", value)} options={DATE_RANGE_OPTIONS} placeholder="Select range" />
        <SelectField label="Agent" value={filters?.agentId} onChange={(value) => update("agentId", value)} options={agentOptions} />
        <SelectField label="Lead source" value={filters?.source} onChange={(value) => update("source", value)} options={LEAD_SOURCE_OPTIONS} />
        <SelectField label="Property type" value={filters?.propertyType} onChange={(value) => update("propertyType", value)} options={PROPERTY_TYPE_OPTIONS} />
        <SelectField label="Deal status" value={filters?.dealStatus} onChange={(value) => update("dealStatus", value)} options={DEAL_STATUS_OPTIONS} />
      </div>

      {filters?.dateRange === "custom" ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:w-2/5">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">From</span>
            <input
              type="date"
              value={filters?.startDate || ""}
              onChange={(event) => update("startDate", event.target.value)}
              className="responsive-control h-11 border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">To</span>
            <input
              type="date"
              value={filters?.endDate || ""}
              onChange={(event) => update("endDate", event.target.value)}
              className="responsive-control h-11 border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]"
            />
          </label>
        </div>
      ) : null}
    </section>
  );
}

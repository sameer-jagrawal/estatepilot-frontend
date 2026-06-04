"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { FOLLOWUP_TYPE_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from "./FollowupFormModal";

export default function FollowupFilters({
  search,
  status,
  assignedTo,
  leadId,
  priority,
  date,
  users = [],
  leads = [],
  onSearchChange,
  onStatusChange,
  onAssignedToChange,
  onLeadIdChange,
  onPriorityChange,
  onDateChange,
  onReset,
}) {
  const hasFilters = search || status || assignedTo || leadId || priority || date;

  return (
    <section className="responsive-filter-panel">
      <div className="responsive-filter-row">
        <div className="relative min-w-0 flex-[1_1_280px] lg:flex-[2_1_340px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search lead, phone, notes..."
            className="responsive-control h-12 w-full border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
          />
        </div>

        <Select value={status} onChange={onStatusChange} placeholder="All statuses" options={STATUS_OPTIONS} />
        <Select value={priority} onChange={onPriorityChange} placeholder="Priority" options={PRIORITY_OPTIONS} />
        <EntitySelect value={assignedTo} onChange={onAssignedToChange} placeholder="Assigned user" items={users} />
        <EntitySelect value={leadId} onChange={onLeadIdChange} placeholder="Lead" items={leads} />
        <input
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          className="responsive-control h-12 min-w-0 flex-[1_1_160px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
        />

        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
          className="inline-flex h-12 min-w-0 flex-[1_1_130px] items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
        >
          {hasFilters ? <X size={17} /> : <SlidersHorizontal size={17} />}
          Reset
        </button>
      </div>
      <div className="sr-only">{FOLLOWUP_TYPE_OPTIONS.join(",")}</div>
    </section>
  );
}

function Select({ value, onChange, placeholder, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="responsive-control h-12 min-w-0 flex-[1_1_155px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm capitalize text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}

function EntitySelect({ value, onChange, placeholder, items }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="responsive-control h-12 min-w-0 flex-[1_1_180px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
    >
      <option value="">{placeholder}</option>
      {items.map((item) => (
        <option key={item?._id} value={item?._id}>
          {item?.name || item?.email || item?.phone || "Option"}
        </option>
      ))}
    </select>
  );
}

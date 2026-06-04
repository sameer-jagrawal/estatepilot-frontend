"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { SOURCE_OPTIONS, STATUS_OPTIONS } from "./LeadFormModal";

export default function LeadFilters({
  search,
  status,
  source,
  assignedTo,
  users = [],
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onAssignedToChange,
  onReset,
}) {
  const hasFilters = search || status || source || assignedTo;

  return (
    <section className="responsive-filter-panel">
      <div className="responsive-filter-grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, phone, location..."
            className="responsive-control h-12 w-full border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
          />
        </div>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="responsive-control h-12 border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <select
          value={source}
          onChange={(event) => onSourceChange(event.target.value)}
          className="responsive-control h-12 border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
        >
          <option value="">All sources</option>
          {SOURCE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={assignedTo}
          onChange={(event) => onAssignedToChange(event.target.value)}
          className="responsive-control h-12 border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
        >
          <option value="">All agents</option>
          {users.map((user) => (
            <option key={user?._id} value={user?._id}>
              {user?.name || user?.email || "Agent"}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {hasFilters ? <X size={17} /> : <SlidersHorizontal size={17} />}
          Reset
        </button>
      </div>
    </section>
  );
}

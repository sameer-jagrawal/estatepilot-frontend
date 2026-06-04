"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { STATUS_OPTIONS } from "./SiteVisitStatusBadge";

export default function SiteVisitFilters({
  search,
  status,
  leadId,
  propertyId,
  assignedTo,
  date,
  leads = [],
  properties = [],
  users = [],
  onSearchChange,
  onStatusChange,
  onLeadIdChange,
  onPropertyIdChange,
  onAssignedToChange,
  onDateChange,
  onReset,
}) {
  const hasFilters = search || status || leadId || propertyId || assignedTo || date;

  return (
    <section className="responsive-filter-panel">
      <div className="responsive-filter-row">
        <div className="relative min-w-0 flex-[1_1_280px] lg:flex-[2_1_340px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search lead, property, location..."
            className="responsive-control h-12 w-full border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
          />
        </div>

        <Select value={status} onChange={onStatusChange} placeholder="All statuses" options={STATUS_OPTIONS.map((value) => ({ value, label: value }))} />
        <Select value={leadId} onChange={onLeadIdChange} placeholder="Lead" options={leads.map((lead) => ({ value: lead?._id, label: `${lead?.name || "Lead"} ${lead?.phone ? `- ${lead.phone}` : ""}` }))} />
        <Select value={propertyId} onChange={onPropertyIdChange} placeholder="Property" options={properties.map((property) => ({ value: property?._id, label: `${property?.title || "Property"} ${property?.location ? `- ${property.location}` : ""}` }))} />
        <Select value={assignedTo} onChange={onAssignedToChange} placeholder="Agent" options={users.map((user) => ({ value: user?._id, label: `${user?.name || user?.email || "User"} ${user?.role ? `- ${user.role}` : ""}` }))} />
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
    </section>
  );
}

function Select({ value, onChange, placeholder, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="responsive-control h-12 min-w-0 flex-[1_1_180px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm capitalize text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value || option.label} value={option.value}>
          {option.label?.replace?.(/_/g, " ") || option.label}
        </option>
      ))}
    </select>
  );
}

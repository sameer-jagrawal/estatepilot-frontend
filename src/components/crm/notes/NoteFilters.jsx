"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

export default function NoteFilters({
  search,
  leadId,
  createdBy,
  date,
  sort,
  leads = [],
  users = [],
  onSearchChange,
  onLeadChange,
  onCreatedByChange,
  onDateChange,
  onSortChange,
  onReset,
}) {
  const hasFilters = search || leadId || createdBy || date || sort !== "recent";

  return (
    <section className="responsive-filter-panel">
      <div className="responsive-filter-grid sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search notes..."
            className="responsive-control h-12 w-full border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
          />
        </div>

        <select
          value={leadId}
          onChange={(event) => onLeadChange(event.target.value)}
          className="responsive-control h-12 border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
        >
          <option value="">All leads</option>
          {leads.map((lead) => (
            <option key={lead?._id} value={lead?._id}>
              {lead?.name || lead?.phone || "Lead"}
            </option>
          ))}
        </select>

        <select
          value={createdBy}
          onChange={(event) => onCreatedByChange(event.target.value)}
          className="responsive-control h-12 border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
        >
          <option value="">All creators</option>
          {users.map((user) => (
            <option key={user?._id} value={user?._id}>
              {user?.name || user?.email || "User"}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          className="responsive-control h-12 border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
        />

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="responsive-control h-12 border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
        >
          <option value="recent">Newest first</option>
          <option value="updated">Last updated</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">Priority</option>
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

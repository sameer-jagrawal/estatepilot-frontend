"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

export default function UserFilters({ search, role, isActive, onSearchChange, onRoleChange, onStatusChange, onReset }) {
  const hasFilters = Boolean(search || role || isActive);

  return (
    <section className="responsive-filter-panel">
      <div className="responsive-filter-grid sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_190px_210px_auto]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={17} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search users"
            className="responsive-control h-12 w-full border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#EAF5FF]"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={17} />
          <select value={role} onChange={(event) => onRoleChange(event.target.value)} className="responsive-control h-12 w-full appearance-none border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#EAF5FF]">
            <option value="">All roles</option>
            <option value="manager">Managers</option>
            <option value="agent">Agents</option>
          </select>
        </div>

        <select value={isActive} onChange={(event) => onStatusChange(event.target.value)} className="responsive-control h-12 w-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#EAF5FF]">
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Suspended</option>
        </select>

        <button type="button" onClick={onReset} disabled={!hasFilters} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] px-4 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-50">
          <X size={17} />
          Reset
        </button>
      </div>
    </section>
  );
}

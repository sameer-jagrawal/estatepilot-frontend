"use client";

import { RotateCcw, Search } from "lucide-react";
import { moduleOptions } from "./activityUtils";

export default function ActivityFilters({
  search,
  module,
  userId,
  startDate,
  endDate,
  users = [],
  onSearchChange,
  onModuleChange,
  onUserChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}) {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.2fr)_minmax(150px,0.8fr)_minmax(160px,0.8fr)_minmax(140px,0.7fr)_minmax(140px,0.7fr)_auto]">
        <label className="relative min-w-0">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={search}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="Search activities"
            className="h-11 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-3 text-sm font-medium text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white"
          />
        </label>

        <Select value={module} onChange={onModuleChange} options={moduleOptions} />

        <select
          value={userId}
          onChange={(event) => onUserChange?.(event.target.value)}
          className="h-11 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white"
        >
          <option value="">All users</option>
          {users.map((user) => (
            <option key={user?._id} value={user?._id}>
              {user?.name || user?.email || "User"}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange?.(event.target.value)}
          className="h-11 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white"
        />

        <input
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange?.(event.target.value)}
          className="h-11 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white"
        />

        <button
          type="button"
          onClick={onReset}
          title="Reset filters"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </section>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className="h-11 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white"
    >
      {options.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

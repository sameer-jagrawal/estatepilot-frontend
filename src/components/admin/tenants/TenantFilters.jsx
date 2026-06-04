"use client";

import { Search } from "lucide-react";

const statuses = ["all", "active", "trial", "suspended", "inactive"];
const plans = ["all", "free", "starter", "team", "business"];

export default function TenantFilters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <section className="responsive-filter-panel responsive-filter-grid md:grid-cols-[1fr_180px_180px]">
      <label className="relative">
        <span className="sr-only">Search tenants</span>
        <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
        <input
          value={filters.search}
          onChange={(event) => update("search", event.target.value)}
          className="responsive-control h-10 w-full border border-[#DDE5EF] bg-[#F6F8FB] pl-10 pr-3 text-sm outline-none focus:border-[#2E95F7] focus:bg-white focus:ring-4 focus:ring-[#2E95F7]/10"
          placeholder="Search company, slug, owner, email..."
        />
      </label>
      <select
        value={filters.status}
        onChange={(event) => update("status", event.target.value)}
        className="responsive-control h-10 border border-[#DDE5EF] bg-white px-3 text-sm capitalize outline-none focus:border-[#2E95F7]"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status === "all" ? "All statuses" : status}
          </option>
        ))}
      </select>
      <select
        value={filters.plan}
        onChange={(event) => update("plan", event.target.value)}
        className="responsive-control h-10 border border-[#DDE5EF] bg-white px-3 text-sm capitalize outline-none focus:border-[#2E95F7]"
      >
        {plans.map((plan) => (
          <option key={plan} value={plan}>
            {plan === "all" ? "All plans" : plan}
          </option>
        ))}
      </select>
    </section>
  );
}

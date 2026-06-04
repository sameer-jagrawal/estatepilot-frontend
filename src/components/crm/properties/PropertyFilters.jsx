"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { PROPERTY_TYPE_OPTIONS, PURPOSE_OPTIONS, STATUS_OPTIONS } from "./PropertyFormModal";

export default function PropertyFilters({
  search,
  propertyType,
  purpose,
  status,
  location,
  minPrice,
  maxPrice,
  onSearchChange,
  onPropertyTypeChange,
  onPurposeChange,
  onStatusChange,
  onLocationChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}) {
  const hasFilters = search || propertyType || purpose || status || location || minPrice || maxPrice;

  return (
    <section className="responsive-filter-panel">
      <div className="responsive-filter-row">
        <div className="relative min-w-0 flex-[1_1_280px] lg:flex-[2_1_340px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search title, code, location..."
            className="responsive-control h-12 w-full border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
          />
        </div>

        <Select value={propertyType} onChange={onPropertyTypeChange} placeholder="All types" options={PROPERTY_TYPE_OPTIONS} />
        <Select value={purpose} onChange={onPurposeChange} placeholder="Purpose" options={PURPOSE_OPTIONS} />
        <Select value={status} onChange={onStatusChange} placeholder="All statuses" options={STATUS_OPTIONS} />
        <Input value={location} onChange={onLocationChange} placeholder="Location" />
        <Input value={minPrice} onChange={onMinPriceChange} placeholder="Min price" type="number" />
        <Input value={maxPrice} onChange={onMaxPriceChange} placeholder="Max price" type="number" />

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
      className="responsive-control h-12 min-w-0 flex-[1_1_150px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm capitalize text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="responsive-control h-12 min-w-0 flex-[1_1_150px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
    />
  );
}

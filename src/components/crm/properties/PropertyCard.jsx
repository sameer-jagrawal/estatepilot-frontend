"use client";

import { Building2, Edit3, Eye, MapPin, Trash2 } from "lucide-react";
import PropertyStatusBadge, { formatPropertyLabel } from "./PropertyStatusBadge";

export function formatPrice(value) {
  const price = Number(value || 0);
  if (!price) return "Price not set";
  return `Rs. ${price.toLocaleString("en-IN")}`;
}

export function formatArea(property) {
  const area = Number(property?.area || 0);
  if (!area) return "Area not set";
  return `${area.toLocaleString("en-IN")} ${property?.areaUnit || "sqft"}`;
}

export function createdByName(property) {
  return property?.createdBy?.name || property?.createdBy?.email || "System";
}

export default function PropertyCard({ property, onView, onEdit, onDelete }) {
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{property?.propertyCode || "No code"}</p>
          <h2 className="mt-1 truncate text-base font-semibold text-[#0F172A]">{property?.title || "Untitled property"}</h2>
        </div>
        <PropertyStatusBadge value={property?.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <PropertyStatusBadge value={property?.propertyType} type="propertyType" />
        <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold capitalize text-[#64748B]">{property?.purpose || "sale"}</span>
        {property?.isFeatured ? <span className="rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-semibold text-[#A78BFA]">Featured</span> : null}
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[#64748B]">
        <p className="flex items-center gap-2">
          <MapPin size={15} />
          {property?.location || "No location"}
          {property?.city ? `, ${property.city}` : ""}
        </p>
        <p className="flex items-center gap-2">
          <Building2 size={15} />
          {formatPropertyLabel(property?.furnishing)} · {formatArea(property)}
        </p>
        <p className="text-lg font-semibold text-[#0F172A]">{formatPrice(property?.price)}</p>
        <p>{Number(property?.bedrooms || 0)} beds · {Number(property?.bathrooms || 0)} baths</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => onView(property)} className="flex-1 rounded-2xl bg-[#EAF5FF] px-4 py-2.5 text-sm font-semibold text-[#2E95F7]">
          <Eye className="mr-1 inline" size={16} />
          View
        </button>
        <button type="button" onClick={() => onEdit(property)} className="flex-1 rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-semibold text-[#0F172A]">
          <Edit3 className="mr-1 inline" size={16} />
          Edit
        </button>
        <button type="button" onClick={() => onDelete(property)} className="rounded-2xl border border-[#FEE2E2] px-4 py-2.5 text-sm font-semibold text-[#DC2626]">
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}

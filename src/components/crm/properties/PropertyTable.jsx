"use client";

import { motion } from "framer-motion";
import { Building2, Edit3, Eye, Trash2 } from "lucide-react";
import PropertyCard, { createdByName, formatArea, formatPrice } from "./PropertyCard";
import PropertyStatusBadge from "./PropertyStatusBadge";

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function PropertyTableSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-2xl bg-[#E2E8F0]/70" />
        ))}
      </div>
    </div>
  );
}

export default function PropertyTable({ properties = [], onView, onEdit, onDelete }) {
  if (!properties.length) {
    return (
      <section className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
            <Building2 size={24} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">No properties found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#64748B]">
            Add inventory or adjust filters to see matching properties.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hidden min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.04)] xl:block">
        <div className="grid min-w-0 grid-cols-[minmax(0,0.78fr)_minmax(0,1.12fr)_minmax(0,0.68fr)_minmax(0,0.58fr)_minmax(0,0.85fr)_minmax(0,0.78fr)_minmax(0,0.62fr)_minmax(0,0.52fr)_minmax(0,0.68fr)_minmax(0,0.72fr)_minmax(0,1.05fr)] gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#64748B] [&>*]:min-w-0">
          <span>Property Code</span>
          <span>Title</span>
          <span>Type</span>
          <span>Purpose</span>
          <span>Location</span>
          <span>Price</span>
          <span>Area</span>
          <span>Bedrooms</span>
          <span>Status</span>
          <span>Created By</span>
          <span className="text-right">Actions</span>
        </div>

        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}>
          {properties.map((property) => (
            <motion.div
              key={property?._id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="grid min-w-0 grid-cols-[minmax(0,0.78fr)_minmax(0,1.12fr)_minmax(0,0.68fr)_minmax(0,0.58fr)_minmax(0,0.85fr)_minmax(0,0.78fr)_minmax(0,0.62fr)_minmax(0,0.52fr)_minmax(0,0.68fr)_minmax(0,0.72fr)_minmax(0,1.05fr)] items-center gap-2 border-b border-[#E2E8F0] px-4 py-4 text-xs last:border-b-0 hover:bg-[#F8FAFC] [&>*]:min-w-0"
            >
              <span className="truncate font-semibold text-[#0F172A]">{property?.propertyCode || "-"}</span>
              <span className="truncate font-semibold text-[#0F172A]">{property?.title || "Untitled"}</span>
              <PropertyStatusBadge value={property?.propertyType} type="propertyType" />
              <span className="font-semibold capitalize text-[#64748B]">{property?.purpose || "sale"}</span>
              <span className="truncate text-[#64748B]">{property?.location || "-"}</span>
              <span className="truncate font-semibold text-[#0F172A]">{formatPrice(property?.price)}</span>
              <span className="truncate text-[#64748B]">{formatArea(property)}</span>
              <span className="text-[#64748B]">{Number(property?.bedrooms || 0)}</span>
              <PropertyStatusBadge value={property?.status} />
              <span className="truncate text-[#64748B]">{createdByName(property)}</span>
              <div className="flex justify-end gap-1">
                <ActionButton onClick={() => onView(property)} label="View" icon={Eye} />
                <ActionButton onClick={() => onEdit(property)} label="Edit" icon={Edit3} />
                <ActionButton onClick={() => onDelete(property)} label="Delete" icon={Trash2} danger />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="grid gap-3 xl:hidden"
      >
        {properties.map((property) => (
          <motion.div key={property?._id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <PropertyCard property={property} onView={onView} onEdit={onEdit} onDelete={onDelete} />
          </motion.div>
        ))}
      </motion.section>
    </>
  );
}

function ActionButton({ label, icon: Icon, danger = false, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-xl transition ${
        danger ? "text-[#DC2626] hover:bg-[#FEE2E2]" : "text-[#64748B] hover:bg-[#EAF5FF] hover:text-[#2E95F7]"
      }`}
    >
      <Icon size={17} />
    </button>
  );
}

export { formatDate };

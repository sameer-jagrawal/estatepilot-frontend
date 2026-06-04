"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Edit3, Eye, MapPin, Phone, Trash2, UserRound } from "lucide-react";
import LeadStatusBadge, { formatLeadLabel } from "./LeadStatusBadge";

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatBudget(lead) {
  const min = Number(lead?.budgetMin || 0);
  const max = Number(lead?.budgetMax || 0);
  if (!min && !max) return "Not set";
  if (min && max) return `Rs. ${min.toLocaleString("en-IN")} - ${max.toLocaleString("en-IN")}`;
  return `Rs. ${(min || max).toLocaleString("en-IN")}`;
}

function assignedName(lead) {
  return lead?.assignedTo?.name || lead?.assignedTo?.email || "Unassigned";
}

export function LeadTableSkeleton() {
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

export default function LeadTable({ leads = [], onEdit, onDelete }) {
  if (!leads.length) {
    return (
      <section className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
            <UserRound size={24} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">No leads found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#64748B]">
            New inquiries and filtered results will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.04)] lg:block">
        <div className="grid grid-cols-[1.25fr_1fr_1.2fr_1.1fr_0.8fr_0.9fr_1fr_0.9fr_0.9fr] gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
          <span>Name</span>
          <span>Phone</span>
          <span>Location Preference</span>
          <span>Budget</span>
          <span>Source</span>
          <span>Status</span>
          <span>Assigned To</span>
          <span>Created At</span>
          <span className="text-right">Actions</span>
        </div>

        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}>
          {leads.map((lead) => (
            <motion.div
              key={lead?._id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="grid grid-cols-[1.25fr_1fr_1.2fr_1.1fr_0.8fr_0.9fr_1fr_0.9fr_0.9fr] items-center gap-3 border-b border-[#E2E8F0] px-5 py-4 text-sm last:border-b-0 hover:bg-[#F8FAFC]"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#0F172A]">{lead?.name || "Unnamed lead"}</p>
                <p className="truncate text-xs text-[#64748B]">{lead?.email || "No email"}</p>
              </div>
              <span className="font-semibold text-[#0F172A]">{lead?.phone || "-"}</span>
              <span className="truncate text-[#64748B]">{lead?.locationPreference || "-"}</span>
              <span className="font-semibold text-[#0F172A]">{formatBudget(lead)}</span>
              <LeadStatusBadge value={lead?.source} type="source" />
              <LeadStatusBadge value={lead?.status} />
              <span className="truncate text-[#64748B]">{assignedName(lead)}</span>
              <span className="text-[#64748B]">{formatDate(lead?.createdAt)}</span>
              <div className="flex justify-end gap-1.5">
                <ActionButton href={`/leads/${lead?._id}`} label="View" icon={Eye} />
                <ActionButton onClick={() => onEdit(lead)} label="Edit" icon={Edit3} />
                <ActionButton onClick={() => onDelete(lead)} label="Delete" icon={Trash2} danger />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="grid gap-3 lg:hidden"
      >
        {leads.map((lead) => (
          <motion.article
            key={lead?._id}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-[#0F172A]">{lead?.name || "Unnamed lead"}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-[#64748B]">
                  <Phone size={15} />
                  {lead?.phone || "-"}
                </p>
              </div>
              <LeadStatusBadge value={lead?.status} />
            </div>
            <div className="mt-4 grid gap-2 text-sm text-[#64748B]">
              <p className="flex items-center gap-2">
                <MapPin size={15} />
                {lead?.locationPreference || "No location preference"}
              </p>
              <p>{formatLeadLabel(lead?.interestedIn)} interest</p>
              <p>{formatBudget(lead)}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <LeadStatusBadge value={lead?.source} type="source" />
                <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-xs text-[#64748B]">{assignedName(lead)}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={`/leads/${lead?._id}`} className="flex-1 rounded-2xl bg-[#EAF5FF] px-4 py-2.5 text-center text-sm font-semibold text-[#2E95F7]">
                View
              </Link>
              <button type="button" onClick={() => onEdit(lead)} className="flex-1 rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-semibold text-[#0F172A]">
                Edit
              </button>
              <button type="button" onClick={() => onDelete(lead)} className="rounded-2xl border border-[#FEE2E2] px-4 py-2.5 text-sm font-semibold text-[#DC2626]">
                <Trash2 size={17} />
              </button>
            </div>
          </motion.article>
        ))}
      </motion.section>
    </>
  );
}

function ActionButton({ href, label, icon: Icon, danger = false, onClick }) {
  const classes = `grid h-9 w-9 place-items-center rounded-xl transition ${
    danger ? "text-[#DC2626] hover:bg-[#FEE2E2]" : "text-[#64748B] hover:bg-[#EAF5FF] hover:text-[#2E95F7]"
  }`;

  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={classes}>
        <Icon size={17} />
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={classes}>
      <Icon size={17} />
    </button>
  );
}

export { assignedName, formatBudget, formatDate };

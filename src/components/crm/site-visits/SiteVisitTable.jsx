"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Edit3, Eye, MapPin, Trash2, XCircle } from "lucide-react";
import SiteVisitCard, { assignedName, formatVisitDate, formatVisitTime, leadName, leadPhone, propertyLocation, propertyTitle } from "./SiteVisitCard";
import SiteVisitStatusBadge from "./SiteVisitStatusBadge";

export function SiteVisitTableSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-16 animate-pulse rounded-2xl bg-[#E2E8F0]/70" />)}
      </div>
    </div>
  );
}

export default function SiteVisitTable({ visits = [], onView, onEdit, onComplete, onCancel, onDelete }) {
  if (!visits.length) {
    return (
      <section className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]"><MapPin size={24} /></div>
          <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">No site visits found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#64748B]">Schedule visits or adjust filters to see matching records.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hidden min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.04)] xl:block">
        <div className="grid min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,0.72fr)_minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,0.9fr)_minmax(0,0.72fr)_minmax(0,0.72fr)_minmax(0,0.72fr)_minmax(0,0.92fr)_minmax(0,1.18fr)] gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#64748B] [&>*]:min-w-0">
          <span>Lead</span><span>Phone</span><span>Property</span><span>Location</span><span>Assigned Agent</span><span>Scheduled Date</span><span>Scheduled Time</span><span>Status</span><span>Feedback</span><span className="text-right">Actions</span>
        </div>
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}>
          {visits.map((visit) => (
            <motion.div key={visit?._id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="grid min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,0.72fr)_minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,0.9fr)_minmax(0,0.72fr)_minmax(0,0.72fr)_minmax(0,0.72fr)_minmax(0,0.92fr)_minmax(0,1.18fr)] items-center gap-2 border-b border-[#E2E8F0] px-4 py-4 text-xs transition last:border-b-0 hover:bg-[#F8FAFC] hover:shadow-sm [&>*]:min-w-0">
              <span className="truncate font-semibold text-[#0F172A]">{leadName(visit)}</span>
              <span className="truncate text-[#64748B]">{leadPhone(visit)}</span>
              <span className="truncate font-semibold text-[#0F172A]">{propertyTitle(visit)}</span>
              <span className="truncate text-[#64748B]">{propertyLocation(visit)}</span>
              <span className="truncate text-[#64748B]">{assignedName(visit)}</span>
              <span className="font-semibold text-[#0F172A]">{formatVisitDate(visit?.scheduledAt)}</span>
              <span className="font-semibold text-[#0F172A]">{formatVisitTime(visit?.scheduledAt)}</span>
              <SiteVisitStatusBadge value={visit?.status} />
              <span className="truncate text-[#64748B]">{visit?.feedback || "-"}</span>
              <div className="flex justify-end gap-1">
                <ActionButton label="View" icon={Eye} onClick={() => onView(visit)} />
                <ActionButton label="Edit" icon={Edit3} onClick={() => onEdit(visit)} />
                <ActionButton label="Complete" icon={CheckCircle2} onClick={() => onComplete(visit)} />
                <ActionButton label="Cancel" icon={XCircle} onClick={() => onCancel(visit)} />
                <ActionButton label="Delete" icon={Trash2} onClick={() => onDelete(visit)} danger />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <motion.section initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="grid gap-3 xl:hidden">
        {visits.map((visit) => (
          <motion.div key={visit?._id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <SiteVisitCard visit={visit} onView={onView} onEdit={onEdit} onComplete={onComplete} onCancel={onCancel} onDelete={onDelete} />
          </motion.div>
        ))}
      </motion.section>
    </>
  );
}

function ActionButton({ label, icon: Icon, danger = false, onClick }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`grid h-8 w-8 place-items-center rounded-xl transition ${danger ? "text-[#DC2626] hover:bg-[#FEE2E2]" : "text-[#64748B] hover:bg-[#EAF5FF] hover:text-[#2E95F7]"}`}>
      <Icon size={15} />
    </button>
  );
}

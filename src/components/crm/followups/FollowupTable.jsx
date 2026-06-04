"use client";

import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, Edit3, Eye, Trash2, XCircle } from "lucide-react";
import FollowupCard, { assignedName, derivedStatus, followupNotes, followupPriority, followupType, formatDateTime, leadName, leadPhone } from "./FollowupCard";
import FollowupStatusBadge from "./FollowupStatusBadge";

export function FollowupTableSkeleton() {
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

export default function FollowupTable({ followups = [], onView, onEdit, onComplete, onCancel, onDelete }) {
  if (!followups.length) {
    return (
      <section className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
            <CalendarCheck size={24} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">No follow-ups found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#64748B]">
            Scheduled calls, reminders, and visits will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hidden min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.04)] xl:block">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.88fr)_minmax(0,0.92fr)_minmax(0,0.9fr)_minmax(0,0.65fr)_minmax(0,0.72fr)_minmax(0,1fr)_minmax(0,1.22fr)] gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#64748B] [&>*]:min-w-0">
          <span>Lead Name</span>
          <span>Phone</span>
          <span>Follow-up Type</span>
          <span>Date & Time</span>
          <span>Assigned Agent</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Notes</span>
          <span className="text-right">Actions</span>
        </div>

        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}>
          {followups.map((followup) => (
            <motion.div
              key={followup?._id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.88fr)_minmax(0,0.92fr)_minmax(0,0.9fr)_minmax(0,0.65fr)_minmax(0,0.72fr)_minmax(0,1fr)_minmax(0,1.22fr)] items-center gap-2 border-b border-[#E2E8F0] px-4 py-4 text-xs transition last:border-b-0 hover:bg-[#F8FAFC] hover:shadow-sm [&>*]:min-w-0"
            >
              <span className="truncate font-semibold text-[#0F172A]">{leadName(followup)}</span>
              <span className="truncate text-[#64748B]">{leadPhone(followup)}</span>
              <FollowupStatusBadge value={followupType(followup)} type="followupType" />
              <span className="truncate font-semibold text-[#0F172A]">{formatDateTime(followup?.dueAt)}</span>
              <span className="truncate text-[#64748B]">{assignedName(followup)}</span>
              <FollowupStatusBadge value={followupPriority(followup)} type="priority" />
              <FollowupStatusBadge value={derivedStatus(followup)} />
              <span className="truncate text-[#64748B]">{followupNotes(followup) || "-"}</span>
              <div className="flex justify-end gap-1">
                <ActionButton label="View" icon={Eye} onClick={() => onView(followup)} />
                <ActionButton label="Edit" icon={Edit3} onClick={() => onEdit(followup)} />
                <ActionButton label="Complete" icon={CheckCircle2} onClick={() => onComplete(followup)} />
                <ActionButton label="Cancel" icon={XCircle} onClick={() => onCancel(followup)} />
                <ActionButton label="Delete" icon={Trash2} onClick={() => onDelete(followup)} danger />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="grid gap-3 xl:hidden">
        {followups.map((followup) => (
          <motion.div key={followup?._id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <FollowupCard followup={followup} onView={onView} onEdit={onEdit} onComplete={onComplete} onCancel={onCancel} onDelete={onDelete} />
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

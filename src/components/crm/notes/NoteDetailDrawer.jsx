"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Mail, Phone, UserRound, X } from "lucide-react";
import { formatDate, getCreatorName, getLeadName, ImportantBadge, PriorityBadge } from "./NoteCard";

function DetailRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-[#0F172A]">{value || "Not available"}</p>
    </div>
  );
}

export default function NoteDetailDrawer({ open, note, onClose }) {
  const lead = note?.leadId || note?.lead || {};

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 bg-[#0F172A]/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="ml-auto flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]"
          >
            <div className="border-b border-[#E2E8F0] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-[#0F172A]">Note Details</h2>
                  <p className="mt-1 text-sm text-[#64748B]">{getLeadName(note)}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC]"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <PriorityBadge priority={note?.priority} />
                {note?.isImportant ? <ImportantBadge /> : null}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.04)]">
                <p className="whitespace-pre-wrap text-sm font-semibold leading-7 text-[#0F172A]">{note?.note || "No note content"}</p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <DetailRow label="Lead Name" value={lead?.name || getLeadName(note)} />
                <DetailRow label="Created By" value={getCreatorName(note)} />
                <DetailRow label="Created Date" value={formatDate(note?.createdAt, true)} />
                <DetailRow label="Updated Date" value={formatDate(note?.updatedAt, true)} />
              </div>

              <div className="mt-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Lead Details</p>
                <div className="mt-4 grid gap-3 text-sm text-[#64748B]">
                  <span className="inline-flex items-center gap-2 text-[#0F172A]">
                    <UserRound size={16} />
                    {lead?.name || "Unknown lead"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Phone size={16} />
                    {lead?.phone || "No phone"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Mail size={16} />
                    {lead?.email || "No email"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={16} />
                    {lead?.status ? lead.status.replace(/_/g, " ") : "No status"}
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

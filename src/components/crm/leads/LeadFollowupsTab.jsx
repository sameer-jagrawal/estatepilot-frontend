"use client";

import { CalendarPlus, CheckCircle2, Edit3, XCircle } from "lucide-react";
import FollowupStatusBadge from "@/components/crm/followups/FollowupStatusBadge";
import { assignedName, derivedStatus, followupNotes, followupPriority, followupType, formatDateTime } from "@/components/crm/followups/FollowupCard";

export default function LeadFollowupsTab({ followups = [], onAddFollowup, onEditFollowup, onCompleteFollowup, onCancelFollowup }) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[#0F172A]">Follow-ups</h3>
          <p className="mt-1 text-sm font-medium text-[#64748B]">Scheduled calls, visits, and reminders for this lead.</p>
        </div>
        <button type="button" onClick={onAddFollowup} className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#4DA8FF] px-4 text-sm font-semibold text-white hover:bg-[#2E95F7]">
          <CalendarPlus size={16} />
          Add Follow-up
        </button>
      </div>

      {followups.length ? (
        <div className="grid gap-3">
          {followups.map((followup) => (
            <article key={followup?._id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <FollowupStatusBadge value={derivedStatus(followup)} />
                    <FollowupStatusBadge value={followupType(followup)} type="followupType" />
                    <FollowupStatusBadge value={followupPriority(followup)} type="priority" />
                  </div>
                  <p className="mt-3 font-semibold text-[#0F172A]">{formatDateTime(followup?.dueAt)}</p>
                  <p className="mt-1 text-sm text-[#64748B]">{assignedName(followup)}</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">{followupNotes(followup) || "No notes added"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Action icon={CheckCircle2} label="Complete" onClick={() => onCompleteFollowup(followup)} />
                  <Action icon={Edit3} label="Edit" onClick={() => onEditFollowup(followup)} />
                  <Action icon={XCircle} label="Cancel" onClick={() => onCancelFollowup(followup)} danger />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
          <div>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]"><CalendarPlus size={22} /></div>
            <h3 className="mt-3 font-semibold text-[#0F172A]">No follow-ups yet</h3>
            <p className="mt-1 text-sm font-medium text-[#64748B]">Schedule the next touchpoint for this customer.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Action({ icon: Icon, label, danger = false, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex h-10 items-center gap-2 rounded-2xl border px-3 text-xs font-semibold ${danger ? "border-[#FEE2E2] text-[#DC2626] hover:bg-[#FEE2E2]" : "border-[#E2E8F0] text-[#0F172A] hover:bg-white"}`}>
      <Icon size={15} />
      {label}
    </button>
  );
}

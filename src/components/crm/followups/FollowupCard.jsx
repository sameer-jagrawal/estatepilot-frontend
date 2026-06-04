"use client";

import { CalendarClock, CheckCircle2, Edit3, Eye, Phone, Trash2, XCircle } from "lucide-react";
import FollowupStatusBadge, { formatFollowupLabel } from "./FollowupStatusBadge";

export function leadName(followup) {
  return followup?.leadId?.name || followup?.lead?.name || "Unknown lead";
}

export function leadPhone(followup) {
  return followup?.leadId?.phone || followup?.lead?.phone || "-";
}

export function assignedName(followup) {
  return followup?.assignedTo?.name || followup?.assignedTo?.email || "Unassigned";
}

export function followupType(followup) {
  return followup?.followupType || followup?.type || "call";
}

export function followupNotes(followup) {
  return followup?.notes || followup?.note || "";
}

export function followupPriority(followup) {
  return followup?.priority || "medium";
}

export function formatDateTime(value) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function derivedStatus(followup) {
  if (followup?.status !== "pending") return followup?.status || "pending";

  const due = new Date(followup?.dueAt);
  if (Number.isNaN(due.getTime())) return "pending";

  const now = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  if (due < now) return "overdue";
  if (due >= start && due <= end) return "today";
  return "pending";
}

export default function FollowupCard({ followup, onView, onEdit, onComplete, onCancel, onDelete }) {
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-[#0F172A]">{leadName(followup)}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-[#64748B]">
            <Phone size={15} />
            {leadPhone(followup)}
          </p>
        </div>
        <FollowupStatusBadge value={derivedStatus(followup)} />
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[#64748B]">
        <p className="flex items-center gap-2">
          <CalendarClock size={15} />
          {formatDateTime(followup?.dueAt)}
        </p>
        <div className="flex flex-wrap gap-2">
          <FollowupStatusBadge value={followupType(followup)} type="followupType" />
          <FollowupStatusBadge value={followupPriority(followup)} type="priority" />
          <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-xs text-[#64748B]">{assignedName(followup)}</span>
        </div>
        <p className="line-clamp-2">{followupNotes(followup) || "No notes added"}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Action label="View" icon={Eye} onClick={() => onView(followup)} />
        <Action label="Edit" icon={Edit3} onClick={() => onEdit(followup)} />
        <Action label="Complete" icon={CheckCircle2} onClick={() => onComplete(followup)} />
        <Action label="Cancel" icon={XCircle} onClick={() => onCancel(followup)} />
        <Action label="Delete" icon={Trash2} onClick={() => onDelete(followup)} danger />
      </div>
    </article>
  );
}

function Action({ label, icon: Icon, danger = false, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex flex-1 items-center justify-center gap-1 rounded-2xl border px-3 py-2 text-xs font-semibold ${danger ? "border-[#FEE2E2] text-[#DC2626]" : "border-[#E2E8F0] text-[#0F172A]"}`}>
      <Icon size={15} />
      {label}
    </button>
  );
}

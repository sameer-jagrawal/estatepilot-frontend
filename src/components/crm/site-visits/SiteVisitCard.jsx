"use client";

import { CheckCircle2, Edit3, Eye, MapPin, Phone, Trash2, XCircle } from "lucide-react";
import SiteVisitStatusBadge from "./SiteVisitStatusBadge";

export function leadName(visit) {
  return visit?.leadId?.name || "Unknown lead";
}

export function leadPhone(visit) {
  return visit?.leadId?.phone || "-";
}

export function propertyTitle(visit) {
  return visit?.propertyId?.title || "Unknown property";
}

export function propertyLocation(visit) {
  return visit?.propertyId?.location || "-";
}

export function assignedName(visit) {
  return visit?.assignedTo?.name || visit?.assignedTo?.email || "Unassigned";
}

export function formatVisitDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function formatVisitTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export default function SiteVisitCard({ visit, onView, onEdit, onComplete, onCancel, onDelete }) {
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-[#0F172A]">{leadName(visit)}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-[#64748B]"><Phone size={15} />{leadPhone(visit)}</p>
        </div>
        <SiteVisitStatusBadge value={visit?.status} />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-[#64748B]">
        <p className="font-semibold text-[#0F172A]">{propertyTitle(visit)}</p>
        <p className="flex items-center gap-2"><MapPin size={15} />{propertyLocation(visit)}</p>
        <p>{formatVisitDate(visit?.scheduledAt)} · {formatVisitTime(visit?.scheduledAt)}</p>
        <p>{assignedName(visit)}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Action label="View" icon={Eye} onClick={() => onView(visit)} />
        <Action label="Edit" icon={Edit3} onClick={() => onEdit(visit)} />
        <Action label="Complete" icon={CheckCircle2} onClick={() => onComplete(visit)} />
        <Action label="Cancel" icon={XCircle} onClick={() => onCancel(visit)} />
        <Action label="Delete" icon={Trash2} onClick={() => onDelete(visit)} danger />
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

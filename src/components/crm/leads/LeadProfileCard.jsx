"use client";

import { CalendarPlus, Mail, MapPin, MessageCircle, NotebookPen, Phone } from "lucide-react";
import LeadStatusBadge, { formatLeadLabel } from "./LeadStatusBadge";
import { formatBudget, formatDate } from "./LeadTable";

function initials(name) {
  return String(name || "Lead")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function LeadProfileCard({ lead, onAddFollowup, onAddNote }) {
  return (
    <aside className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] lg:sticky lg:top-24">
      <div className="flex items-start gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#EAF5FF] text-xl font-semibold text-[#2E95F7]">
          {initials(lead?.name)}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-[#0F172A]">{lead?.name || "Unnamed Lead"}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-[#64748B]">
            <Phone size={15} />
            {lead?.phone || "-"}
          </p>
          <p className="mt-1 flex items-center gap-2 truncate text-sm text-[#64748B]">
            <Mail size={15} />
            {lead?.email || "No email"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <LeadStatusBadge value={lead?.status} />
        <LeadStatusBadge value={lead?.source} type="source" />
      </div>

      <div className="mt-5 grid gap-3">
        <Info label="Interested In" value={formatLeadLabel(lead?.interestedIn)} />
        <Info label="Budget Range" value={formatBudget(lead)} />
        <Info label="Location Preference" value={lead?.locationPreference || "Not specified"} icon={MapPin} />
        <Info label="Assigned Agent" value={lead?.assignedTo?.name || lead?.assignedTo?.email || "Unassigned"} />
        <Info label="Created Date" value={formatDate(lead?.createdAt)} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <a href={`tel:${lead?.phone || ""}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7] transition hover:bg-[#DCEEFF]">
          <Phone size={16} />
          Call
        </a>
        <a href={`https://wa.me/${lead?.phone || ""}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#DCFCE7] text-sm font-semibold text-[#16A34A] transition hover:bg-[#CFF7DA]">
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <button type="button" onClick={onAddFollowup} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
          <CalendarPlus size={16} />
          Follow-up
        </button>
        <button type="button" onClick={onAddNote} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
          <NotebookPen size={16} />
          Note
        </button>
      </div>
    </aside>
  );
}

function Info({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p>
      <p className="mt-2 flex items-center gap-2 break-words text-sm font-semibold text-[#0F172A]">
        {Icon ? <Icon size={15} className="text-[#2E95F7]" /> : null}
        {value}
      </p>
    </div>
  );
}

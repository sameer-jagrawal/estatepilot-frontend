"use client";

import { CheckCircle2, Edit3, Eye, Handshake, Trash2, XCircle } from "lucide-react";
import DealStatusBadge from "./DealStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

export function getId(value) {
  if (!value) return "";
  return typeof value === "string" ? value : value?._id || "";
}

export function leadName(deal) {
  return deal?.leadId?.name || "Unknown lead";
}

export function leadPhone(deal) {
  return deal?.leadId?.phone || "-";
}

export function propertyTitle(deal) {
  return deal?.propertyId?.title || "Unknown property";
}

export function propertyLocation(deal) {
  return deal?.propertyId?.location || "-";
}

export function propertyCode(deal) {
  return deal?.propertyId?.propertyCode || "";
}

export function agentName(deal) {
  return deal?.agentId?.name || deal?.agentId?.email || "Unassigned";
}

export function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function DealTypeBadge({ value }) {
  const type = value || "sale";
  const className = type === "rent" ? "bg-[#F3EEFF] text-[#A78BFA]" : "bg-[#EAF5FF] text-[#2E95F7]";
  return <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${className}`}>{type}</span>;
}

export default function DealCard({ deal, onView, onEdit, onCloseDeal, onCancelDeal, onDelete }) {
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-[#0F172A]">{leadName(deal)}</h2>
          <p className="mt-1 truncate text-sm text-[#64748B]">{propertyTitle(deal)}</p>
        </div>
        <DealStatusBadge value={deal?.dealStatus} />
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl bg-[#F8FAFC] p-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-[#64748B]">Deal amount</span>
          <span className="font-semibold text-[#0F172A]">{formatCurrency(deal?.dealAmount)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-[#64748B]">Commission</span>
          <span className="font-semibold text-[#0F172A]">{formatCurrency(deal?.commissionAmount)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-[#64748B]">Agent</span>
          <span className="truncate font-semibold text-[#0F172A]">{agentName(deal)}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <PaymentStatusBadge value={deal?.paymentStatus} />
        <DealTypeBadge value={deal?.dealType} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Action label="View" icon={Eye} onClick={() => onView(deal)} />
        <Action label="Edit" icon={Edit3} onClick={() => onEdit(deal)} />
        <Action label="Close" icon={CheckCircle2} onClick={() => onCloseDeal(deal)} />
        <Action label="Cancel" icon={XCircle} onClick={() => onCancelDeal(deal)} />
        <Action label="Delete" icon={Trash2} onClick={() => onDelete(deal)} danger />
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

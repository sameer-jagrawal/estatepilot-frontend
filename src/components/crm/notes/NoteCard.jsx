"use client";

import { motion } from "framer-motion";
import { Edit3, Eye, Trash2, UserRound } from "lucide-react";

export const PRIORITY_STYLES = {
  low: "bg-[#EAF5FF] text-[#2E95F7]",
  medium: "bg-[#FEF3C7] text-[#D97706]",
  high: "bg-[#FEE2E2] text-[#DC2626]",
};

export const IMPORTANT_STYLE = "bg-[#F3EEFF] text-[#7C3AED]";

export function getId(value) {
  if (!value) return "";
  return typeof value === "object" ? value?._id || value?.id || "" : value;
}

export function getLeadName(note) {
  return note?.leadId?.name || note?.lead?.name || "Unknown lead";
}

export function getCreatorName(note) {
  return note?.userId?.name || note?.createdBy?.name || note?.user?.name || "Unknown user";
}

export function formatDate(value, includeTime = false) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export function notePreview(note, length = 120) {
  const text = note?.note || "";
  if (text.length <= length) return text || "No note content";
  return `${text.slice(0, length).trim()}...`;
}

export function PriorityBadge({ priority }) {
  const value = priority || "medium";
  return (
    <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${PRIORITY_STYLES[value] || PRIORITY_STYLES.medium}`}>
      {value}
    </span>
  );
}

export function ImportantBadge() {
  return <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${IMPORTANT_STYLE}`}>Important</span>;
}

function IconButton({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-10 w-10 place-items-center rounded-2xl border transition ${
        danger
          ? "border-[#FEE2E2] text-[#DC2626] hover:bg-[#FEF2F2]"
          : "border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8FF] hover:bg-[#EAF5FF] hover:text-[#2E95F7]"
      }`}
    >
      <Icon size={17} />
    </button>
  );
}

export default function NoteCard({ note, onView, onEdit, onDelete }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="line-clamp-3 text-sm font-medium leading-6 text-[#0F172A]">{notePreview(note, 150)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <PriorityBadge priority={note?.priority} />
            {note?.isImportant ? <ImportantBadge /> : null}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 rounded-2xl bg-[#F8FAFC] p-3 text-sm text-[#64748B]">
        <span>{getLeadName(note)}</span>
        <span className="inline-flex items-center gap-2">
          <UserRound size={15} />
          {getCreatorName(note)}
        </span>
        <span>{formatDate(note?.createdAt, true)}</span>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <IconButton label="View note" icon={Eye} onClick={() => onView(note)} />
        <IconButton label="Edit note" icon={Edit3} onClick={() => onEdit(note)} />
        <IconButton label="Delete note" icon={Trash2} onClick={() => onDelete(note)} danger />
      </div>
    </motion.article>
  );
}

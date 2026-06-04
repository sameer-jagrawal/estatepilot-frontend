"use client";

import { motion } from "framer-motion";

export const MESSAGE_STATUS_COLORS = {
  pending: "bg-[#FEF3C7] text-[#D97706]",
  sent: "bg-[#EAF5FF] text-[#2E95F7]",
  delivered: "bg-[#DCFCE7] text-[#16A34A]",
  read: "bg-[#F3EEFF] text-[#A78BFA]",
  failed: "bg-[#FEE2E2] text-[#DC2626]",
};

function formatLabel(value) {
  if (!value) return "Unknown";
  return String(value).replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function WhatsAppMessageBubble({ message, index = 0 }) {
  const outgoing = message?.direction === "outgoing";
  const status = message?.status || "pending";
  const statusClass = MESSAGE_STATUS_COLORS[status] || MESSAGE_STATUS_COLORS.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.015, 0.1) }}
      className={`flex ${outgoing ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[70%] ${outgoing ? "bg-[#EAF5FF] text-[#0F172A]" : "border border-[#E2E8F0] bg-white text-[#0F172A]"}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">{formatLabel(message?.type || "text")}</span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}>{formatLabel(status)}</span>
        </div>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-6">{message?.message || "No message content"}</p>
        <p className="mt-2 text-right text-[11px] font-medium text-[#64748B]">{formatDateTime(message?.createdAt)}</p>
      </div>
    </motion.div>
  );
}

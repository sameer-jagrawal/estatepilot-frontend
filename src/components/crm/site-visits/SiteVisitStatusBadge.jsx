"use client";

const statusTheme = {
  scheduled: "bg-[#EAF5FF] text-[#2E95F7]",
  completed: "bg-[#DCFCE7] text-[#16A34A]",
  cancelled: "bg-[#FEE2E2] text-[#DC2626]",
  rescheduled: "bg-[#FEF3C7] text-[#D97706]",
};

export const STATUS_OPTIONS = ["scheduled", "completed", "cancelled", "rescheduled"];

export function formatSiteVisitLabel(value) {
  if (!value) return "Unknown";
  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SiteVisitStatusBadge({ value, className = "" }) {
  const key = value || "scheduled";
  const classes = statusTheme[key] || "bg-[#F1F5F9] text-[#475569]";

  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${classes} ${className}`}>
      {formatSiteVisitLabel(key)}
    </span>
  );
}

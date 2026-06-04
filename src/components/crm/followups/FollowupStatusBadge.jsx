"use client";

const statusTheme = {
  pending: "bg-[#FEF3C7] text-[#D97706]",
  completed: "bg-[#DCFCE7] text-[#16A34A]",
  cancelled: "bg-[#FEE2E2] text-[#DC2626]",
  overdue: "bg-[#FCE7F3] text-[#DB2777]",
  today: "bg-[#EAF5FF] text-[#2E95F7]",
  missed: "bg-[#FCE7F3] text-[#DB2777]",
};

const priorityTheme = {
  low: "bg-[#F1F5F9] text-[#475569]",
  medium: "bg-[#EAF5FF] text-[#2E95F7]",
  high: "bg-[#FEF3C7] text-[#D97706]",
  urgent: "bg-[#FEE2E2] text-[#DC2626]",
};

const typeTheme = {
  call: "bg-[#EAF5FF] text-[#2E95F7]",
  whatsapp: "bg-[#DCFCE7] text-[#16A34A]",
  site_visit: "bg-[#ECFEFF] text-[#0891B2]",
  meeting: "bg-[#F3EEFF] text-[#A78BFA]",
  property_sharing: "bg-[#F5F3FF] text-[#7C3AED]",
  email: "bg-[#E0F2FE] text-[#0284C7]",
  negotiation: "bg-[#FEF3C7] text-[#D97706]",
  payment_followup: "bg-[#FFE4E6] text-[#E11D48]",
  payment: "bg-[#FFE4E6] text-[#E11D48]",
  other: "bg-[#F1F5F9] text-[#475569]",
};

export function formatFollowupLabel(value) {
  if (!value) return "Unknown";
  return String(value)
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function FollowupStatusBadge({ value, type = "status", className = "" }) {
  const key = value || (type === "priority" ? "medium" : "pending");
  const themes = type === "priority" ? priorityTheme : type === "followupType" ? typeTheme : statusTheme;
  const classes = themes[key] || "bg-[#F1F5F9] text-[#475569]";

  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${classes} ${className}`}>
      {formatFollowupLabel(key)}
    </span>
  );
}

export { priorityTheme, statusTheme, typeTheme };

"use client";

const statusTheme = {
  new: "bg-[#EAF5FF] text-[#2E95F7]",
  contacted: "bg-[#F3EEFF] text-[#A78BFA]",
  follow_up: "bg-[#FEF3C7] text-[#D97706]",
  site_visit: "bg-[#ECFEFF] text-[#0891B2]",
  negotiation: "bg-[#F5F3FF] text-[#7C3AED]",
  booked: "bg-[#DCFCE7] text-[#16A34A]",
  lost: "bg-[#FEE2E2] text-[#DC2626]",
};

const sourceTheme = {
  whatsapp: "bg-[#DCFCE7] text-[#16A34A]",
  facebook: "bg-[#EAF5FF] text-[#2563EB]",
  instagram: "bg-[#FAE8FF] text-[#C026D3]",
  website: "bg-[#E0F2FE] text-[#0284C7]",
  call: "bg-[#FEF3C7] text-[#D97706]",
  referral: "bg-[#F3EEFF] text-[#A78BFA]",
  other: "bg-[#F1F5F9] text-[#475569]",
};

export function formatLeadLabel(value) {
  if (!value) return "Unknown";
  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function LeadStatusBadge({ value, type = "status", className = "" }) {
  const key = value || "other";
  const themes = type === "source" ? sourceTheme : statusTheme;
  const classes = themes[key] || sourceTheme.other;

  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${classes} ${className}`}>
      {formatLeadLabel(key)}
    </span>
  );
}

export { sourceTheme, statusTheme };

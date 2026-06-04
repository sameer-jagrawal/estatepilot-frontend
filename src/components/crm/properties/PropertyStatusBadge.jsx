"use client";

const statusTheme = {
  available: "bg-[#DCFCE7] text-[#16A34A]",
  sold: "bg-[#FEE2E2] text-[#DC2626]",
  rented: "bg-[#F3EEFF] text-[#A78BFA]",
  blocked: "bg-[#FEF3C7] text-[#D97706]",
};

const typeTheme = {
  flat: "bg-[#EAF5FF] text-[#2E95F7]",
  villa: "bg-[#F3EEFF] text-[#A78BFA]",
  plot: "bg-[#DCFCE7] text-[#16A34A]",
  commercial: "bg-[#FEF3C7] text-[#D97706]",
  office: "bg-[#ECFEFF] text-[#0891B2]",
  shop: "bg-[#FFE4E6] text-[#E11D48]",
};

export function formatPropertyLabel(value) {
  if (!value) return "Unknown";
  return String(value)
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PropertyStatusBadge({ value, type = "status", className = "" }) {
  const key = value || "unknown";
  const themes = type === "propertyType" ? typeTheme : statusTheme;
  const classes = themes[key] || "bg-[#F1F5F9] text-[#475569]";

  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${classes} ${className}`}>
      {formatPropertyLabel(key)}
    </span>
  );
}

export { statusTheme, typeTheme };

"use client";

export const USER_ROLE_COLORS = {
  owner: "bg-[#F3EEFF] text-[#7C3AED]",
  manager: "bg-[#EAF5FF] text-[#2E95F7]",
  agent: "bg-[#DCFCE7] text-[#16A34A]",
};

export function formatUserLabel(value) {
  if (!value) return "Unknown";
  return String(value).replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function UserRoleBadge({ value, className = "" }) {
  const role = value || "agent";
  const classes = USER_ROLE_COLORS[role] || USER_ROLE_COLORS.agent;

  return <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${classes} ${className}`}>{formatUserLabel(role)}</span>;
}

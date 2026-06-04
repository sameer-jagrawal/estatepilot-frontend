"use client";

import { formatUserLabel } from "@/components/crm/users/UserRoleBadge";

export const USER_STATUS_COLORS = {
  active: "bg-[#DCFCE7] text-[#16A34A]",
  suspended: "bg-[#FEE2E2] text-[#DC2626]",
  inactive: "bg-[#FEF3C7] text-[#D97706]",
};

export function getUserStatus(user) {
  if (user?.isSuspended) return "suspended";
  if (user?.isActive === true) return "active";
  if (user?.isActive === false) return "suspended";
  return "inactive";
}

export default function UserStatusBadge({ user, status, className = "" }) {
  const value = status || getUserStatus(user);
  const classes = USER_STATUS_COLORS[value] || USER_STATUS_COLORS.inactive;

  return <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${classes} ${className}`}>{formatUserLabel(value)}</span>;
}

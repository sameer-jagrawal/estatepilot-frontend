"use client";

export const DEAL_STATUS_OPTIONS = ["booked", "closed", "cancelled"];

const styles = {
  booked: "bg-[#EAF5FF] text-[#2E95F7]",
  closed: "bg-[#DCFCE7] text-[#16A34A]",
  cancelled: "bg-[#FEE2E2] text-[#DC2626]",
};

export default function DealStatusBadge({ value }) {
  const status = value || "booked";

  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status] || styles.booked}`}>
      {status}
    </span>
  );
}

"use client";

export const PAYMENT_STATUS_OPTIONS = ["pending", "partial", "paid"];

const styles = {
  pending: "bg-[#FEF3C7] text-[#D97706]",
  partial: "bg-[#F3EEFF] text-[#A78BFA]",
  paid: "bg-[#DCFCE7] text-[#16A34A]",
};

export default function PaymentStatusBadge({ value }) {
  const status = value || "pending";

  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

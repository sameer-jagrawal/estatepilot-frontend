const statusStyles = {
  active: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
  trial: "border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]",
  suspended: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
  inactive: "border-[#FED7AA] bg-[#FFF7ED] text-[#B45309]",
};

const planStyles = {
  free: "border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]",
  starter: "border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]",
  team: "border-[#DDD6FE] bg-[#F5F3FF] text-[#7C3AED]",
  business: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
};

export default function AdminStatusBadge({ value = "inactive", type = "status" }) {
  const key = String(value || "inactive").toLowerCase();
  const styles = type === "plan" ? planStyles : statusStyles;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
        styles[key] || "border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]"
      }`}
    >
      {key}
    </span>
  );
}

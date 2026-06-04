"use client";

import CountUp from "react-countup";

export default function AdminStatGrid({ stats = [] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map(({ label, value = 0, prefix = "", suffix = "", icon: Icon, tone = "blue" }) => (
        <div key={label} className="border border-[#DDE5EF] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-[#667085]">{label}</p>
            {Icon ? (
              <span
                className={`grid h-9 w-9 place-items-center rounded-md border ${
                  tone === "lavender"
                    ? "border-[#DDD6FE] bg-[#F5F3FF] text-[#7C3AED]"
                    : tone === "green"
                      ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A]"
                      : tone === "amber"
                        ? "border-[#FED7AA] bg-[#FFF7ED] text-[#D97706]"
                        : tone === "red"
                          ? "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]"
                          : "border-[#BAE6FD] bg-[#F0F9FF] text-[#2E95F7]"
                }`}
              >
                <Icon size={17} />
              </span>
            ) : null}
          </div>
          <div className="mt-4 text-2xl font-semibold tabular-nums text-[#0B1220]">
            {prefix}
            <CountUp end={Number(value) || 0} duration={0.8} separator="," decimals={0} />
            {suffix}
          </div>
        </div>
      ))}
    </section>
  );
}

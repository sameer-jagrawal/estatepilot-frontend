"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";

export default function DashboardCard({
  title,
  value = 0,
  note,
  icon: Icon,
  iconClass = "bg-[#EAF5FF] text-[#2E95F7]",
  prefix = "",
  suffix = "",
}) {
  const number = Number(value || 0);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_22px_60px_rgba(15,23,42,0.09)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#64748B]">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A]">
            {prefix}
            <CountUp end={number} duration={1.25} separator="," decimals={Number.isInteger(number) ? 0 : 1} />
            {suffix}
          </p>
        </div>
        {Icon ? (
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconClass}`}>
            <Icon size={21} strokeWidth={2.3} />
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-sm font-medium leading-6 text-[#64748B]">{note}</p>
    </motion.article>
  );
}

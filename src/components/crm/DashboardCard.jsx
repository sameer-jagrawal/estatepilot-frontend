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
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="border border-[#E2E8F0] bg-white p-3 transition-colors hover:border-[#CBD5E1] sm:p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#64748B]">{title}</p>
          <p className="mt-2 text-2xl font-medium tracking-tight text-[#0F172A]">
            {prefix}
            <CountUp end={number} duration={1.25} separator="," decimals={Number.isInteger(number) ? 0 : 1} />
            {suffix}
          </p>
        </div>
        {Icon ? (
          <div className={`grid h-9 w-9 shrink-0 place-items-center ${iconClass}`}>
            <Icon size={17} strokeWidth={2} />
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-xs font-medium leading-5 text-[#64748B]">{note}</p>
    </motion.article>
  );
}

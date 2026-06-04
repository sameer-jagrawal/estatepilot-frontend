"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, Clock, TimerOff } from "lucide-react";

const cards = [
  { key: "today", label: "Today follow-ups", icon: CalendarCheck, tone: "bg-[#EAF5FF] text-[#2E95F7]" },
  { key: "overdue", label: "Overdue follow-ups", icon: TimerOff, tone: "bg-[#FEF2F2] text-[#EF4444]" },
  { key: "completed", label: "Completed follow-ups", icon: CheckCircle2, tone: "bg-[#ECFDF5] text-[#10B981]" },
  { key: "pending", label: "Pending follow-ups", icon: Clock, tone: "bg-[#FFFBEB] text-[#F59E0B]" },
];

export default function FollowupAnalytics({ data = {} }) {
  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A]">Follow-up Analytics</h2>
        <p className="mt-1 text-sm text-[#64748B]">Daily workload, overdue items, and completion health.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.article key={card.key} whileHover={{ y: -4 }} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#64748B]">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-[#0F172A]">
                    <CountUp end={Number(data?.[card.key] || 0)} duration={0.8} separator="," preserveValue />
                  </p>
                </div>
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${card.tone}`}>
                  <Icon size={21} />
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

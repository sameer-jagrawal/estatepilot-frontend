"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Briefcase, ShieldCheck, UserCheck, Users, UserX } from "lucide-react";

const cardMeta = [
  { key: "totalUsers", title: "Total Users", icon: Users, tone: "bg-[#EAF5FF] text-[#2E95F7]" },
  { key: "activeUsers", title: "Active Users", icon: UserCheck, tone: "bg-[#DCFCE7] text-[#16A34A]" },
  { key: "suspendedUsers", title: "Suspended Users", icon: UserX, tone: "bg-[#FEE2E2] text-[#DC2626]" },
  { key: "managers", title: "Managers", icon: ShieldCheck, tone: "bg-[#F3EEFF] text-[#A78BFA]" },
  { key: "agents", title: "Agents", icon: Briefcase, tone: "bg-[#FEF3C7] text-[#D97706]" },
];

export default function UserSummaryCards({ summary }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cardMeta.map((card) => {
        const Icon = card.icon;
        const value = Number(summary?.[card.key] || 0);

        return (
          <motion.article key={card.key} whileHover={{ y: -4 }} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#64748B]">{card.title}</p>
                <p className="mt-3 text-2xl font-semibold text-[#0F172A]">
                  <CountUp end={value} duration={0.9} separator="," />
                </p>
              </div>
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${card.tone}`}>
                <Icon size={21} />
              </span>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}

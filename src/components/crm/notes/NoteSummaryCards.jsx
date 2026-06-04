"use client";

import { motion } from "framer-motion";
import { Clock3, NotebookPen, Star, StickyNote } from "lucide-react";
import CountUp from "react-countup";

const cards = [
  { key: "total", label: "Total Notes", icon: NotebookPen, tone: "bg-[#EAF5FF] text-[#2E95F7]" },
  { key: "mine", label: "My Notes", icon: StickyNote, tone: "bg-[#F3EEFF] text-[#7C3AED]" },
  { key: "recent", label: "Recent Notes", icon: Clock3, tone: "bg-[#DCFCE7] text-[#16A34A]" },
  { key: "important", label: "Important Notes", icon: Star, tone: "bg-[#FEF3C7] text-[#D97706]" },
];

export default function NoteSummaryCards({ stats }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#64748B]">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A]">
                  <CountUp end={Number(stats?.[card.key] || 0)} duration={0.7} preserveValue />
                </p>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${card.tone}`}>
                <Icon size={22} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}

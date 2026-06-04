"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import { BadgeDollarSign, CheckCircle, Clock, Handshake, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency } from "./DealCard";

const cardMeta = [
  { key: "totalDeals", title: "Total Deals", icon: BadgeDollarSign, tone: "bg-[#EAF5FF] text-[#2E95F7]" },
  { key: "bookedDeals", title: "Booked Deals", icon: Handshake, tone: "bg-[#F3EEFF] text-[#A78BFA]" },
  { key: "closedDeals", title: "Closed Deals", icon: CheckCircle, tone: "bg-[#DCFCE7] text-[#16A34A]" },
  { key: "totalRevenue", title: "Total Revenue", icon: TrendingUp, tone: "bg-[#EAF5FF] text-[#2E95F7]", currency: true },
  { key: "totalCommission", title: "Total Commission", icon: Wallet, tone: "bg-[#F3EEFF] text-[#A78BFA]", currency: true },
  { key: "pendingPayments", title: "Pending Payments", icon: Clock, tone: "bg-[#FEF3C7] text-[#D97706]", currency: true },
];

export default function DealSummaryCards({ summary }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cardMeta.map((card) => {
        const Icon = card.icon;
        const value = Number(summary?.[card.key] || 0);

        return (
          <motion.article key={card.key} whileHover={{ y: -4 }} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#64748B]">{card.title}</p>
                <p className="mt-3 truncate text-2xl font-semibold text-[#0F172A]">
                  {card.currency ? (
                    <CountUp end={value} duration={0.9} formattingFn={formatCurrency} />
                  ) : (
                    <CountUp end={value} duration={0.9} separator="," />
                  )}
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

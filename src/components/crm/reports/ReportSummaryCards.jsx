"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Building2,
  CalendarCheck,
  Clock,
  Handshake,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

const cards = [
  { key: "totalLeads", label: "Total Leads", icon: Users, tone: "bg-[#EAF5FF] text-[#2E95F7]" },
  { key: "convertedLeads", label: "Converted Leads", icon: TrendingUp, tone: "bg-[#ECFDF5] text-[#10B981]" },
  { key: "totalDeals", label: "Total Deals", icon: Handshake, tone: "bg-[#F3F0FF] text-[#8B5CF6]" },
  { key: "revenue", label: "Revenue", icon: BadgeDollarSign, tone: "bg-[#FFFBEB] text-[#F59E0B]", currency: true },
  { key: "commission", label: "Commission", icon: Building2, tone: "bg-[#ECFEFF] text-[#06B6D4]", currency: true },
  { key: "siteVisits", label: "Site Visits", icon: CalendarCheck, tone: "bg-[#EAF5FF] text-[#2E95F7]" },
  { key: "pendingFollowups", label: "Pending Follow-ups", icon: Clock, tone: "bg-[#FEF2F2] text-[#EF4444]" },
  { key: "activeAgents", label: "Active Agents", icon: UserCheck, tone: "bg-[#F3F0FF] text-[#A78BFA]" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function ReportSummaryCards({ summary = {}, loading = false }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const value = Number(summary?.[card.key] || 0);

        return (
          <motion.article
            key={card.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035, duration: 0.25 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition"
          >
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 w-28 rounded-full bg-[#E2E8F0]" />
                <div className="mt-4 h-8 w-32 rounded-full bg-[#E2E8F0]" />
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#64748B]">{card.label}</p>
                  <p className="mt-3 truncate text-2xl font-semibold text-[#0F172A]">
                    {card.currency ? (
                      <CountUp end={value} duration={0.9} formattingFn={formatCurrency} preserveValue />
                    ) : (
                      <CountUp end={value} duration={0.9} separator="," preserveValue />
                    )}
                  </p>
                </div>
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${card.tone}`}>
                  <Icon size={21} />
                </span>
              </div>
            )}
          </motion.article>
        );
      })}
    </section>
  );
}

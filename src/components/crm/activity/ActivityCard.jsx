"use client";

import { motion } from "framer-motion";
import { Clock3, Tag, UserRound } from "lucide-react";
import { formatLabel, formatTime, getModuleConfig, getUserName, metadataPairs } from "./activityUtils";

export default function ActivityCard({ activity }) {
  const config = getModuleConfig(activity?.module);
  const Icon = config.icon;
  const metadata = metadataPairs(activity?.metadata);

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="min-w-0 rounded-2xl border border-[#E2E8F0] bg-white p-4 transition hover:border-[#4DA8FF]/50 hover:bg-[#FBFDFF]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-base font-semibold text-[#0F172A]">{formatLabel(activity?.action || "Activity")}</h3>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${config.badge}`}>
              <Icon size={13} />
              {config.label}
            </span>
          </div>
          <p className="mt-2 break-words text-sm font-medium leading-6 text-[#64748B]">
            {activity?.description || "No description available."}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#94A3B8]">
          <Clock3 size={14} />
          {formatTime(activity?.createdAt)}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-xs font-semibold text-[#64748B] sm:grid-cols-3">
        <span className="inline-flex min-w-0 items-center gap-2">
          <UserRound size={14} className="shrink-0 text-[#94A3B8]" />
          <span className="truncate">By: {getUserName(activity)}</span>
        </span>
        <span className="inline-flex min-w-0 items-center gap-2">
          <Tag size={14} className="shrink-0 text-[#94A3B8]" />
          <span className="truncate">Entity: {formatLabel(activity?.entityType || "record")}</span>
        </span>
        <span className="truncate">Module: {config.label}</span>
      </div>

      {metadata.length ? (
        <div className="mt-4 grid gap-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:grid-cols-2">
          {metadata.map((item) => (
            <div key={item.key} className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">{item.key}</p>
              <p className="mt-1 break-words text-sm font-semibold text-[#0F172A]">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </motion.article>
  );
}

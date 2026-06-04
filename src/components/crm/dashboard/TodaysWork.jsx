"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarCheck, CircleDollarSign, Clock3, MessageCircle, Phone, UsersRound, Video, MapPin } from "lucide-react";

const typeConfig = {
  call: { icon: Phone, className: "bg-[#EAF5FF] text-[#2E95F7]" },
  whatsapp: { icon: MessageCircle, className: "bg-[#DCFCE7] text-[#16A34A]" },
  meeting: { icon: Video, className: "bg-[#F3EEFF] text-[#A78BFA]" },
  site_visit: { icon: MapPin, className: "bg-[#FEF3C7] text-[#D97706]" },
  payment: { icon: CircleDollarSign, className: "bg-[#FFE4E6] text-[#E11D48]" },
  payment_followup: { icon: CircleDollarSign, className: "bg-[#FFE4E6] text-[#E11D48]" },
  other: { icon: CalendarCheck, className: "bg-[#F1F5F9] text-[#475569]" },
};

const statusConfig = {
  pending: "bg-[#FEF3C7] text-[#D97706]",
  completed: "bg-[#DCFCE7] text-[#16A34A]",
  missed: "bg-[#FEE2E2] text-[#DC2626]",
  cancelled: "bg-[#F1F5F9] text-[#475569]",
};

function label(value) {
  if (!value) return "Unknown";
  return String(value)
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDueTime(value) {
  if (!value) return "No time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No time";
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function getFollowupType(item) {
  return item?.type || item?.followupType || "other";
}

function getLeadId(item) {
  return item?.leadId?._id || item?.lead?._id || "";
}

export default function TodaysWork({ todayFollowUps = [] }) {
  const items = Array.isArray(todayFollowUps) ? todayFollowUps : [];

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold text-[#0F172A]">Today&apos;s Tasks</h2>
          <p className="mt-1 text-sm font-medium text-[#64748B]">Your scheduled follow-ups and priority work for today.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]">
          <Clock3 size={14} />
          {items.length} scheduled
        </span>
      </div>

      {items.length ? (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055 } } }}
          className="grid gap-3 lg:grid-cols-2"
        >
          {items.map((item, index) => (
            <motion.article
              key={item?._id || index}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition hover:bg-white hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
            >
              <TaskCard item={item} />
            </motion.article>
          ))}
        </motion.div>
      ) : (
        <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
          <div>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
              <UsersRound size={22} />
            </div>
            <h3 className="mt-3 font-semibold text-[#0F172A]">No follow-ups scheduled for today</h3>
            <p className="mt-1 text-sm font-medium text-[#64748B]">You&apos;re all caught up. Focus on new leads and opportunities.</p>
            <Link
              href="/leads"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-2xl bg-[#EAF5FF] px-4 text-sm font-semibold text-[#2E95F7] transition hover:bg-[#DCEEFF]"
            >
              View Leads
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function TaskCard({ item }) {
  const type = getFollowupType(item);
  const TypeIcon = typeConfig[type]?.icon || typeConfig.other.icon;
  const typeClass = typeConfig[type]?.className || typeConfig.other.className;
  const statusClass = statusConfig[item?.status] || statusConfig.pending;
  const leadHref = getLeadId(item) ? `/leads/${getLeadId(item)}` : "/leads";

  return (
    <div className="flex gap-3">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${typeClass}`}>
        <TypeIcon size={19} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-[#0F172A]">{item?.title || `${label(type)} follow-up`}</h3>
            <p className="mt-1 text-sm text-[#64748B]">
              {item?.leadId?.name || item?.lead?.name || "Unknown lead"}
              {item?.leadId?.phone || item?.lead?.phone ? ` - ${item?.leadId?.phone || item?.lead?.phone}` : ""}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs text-[#64748B] shadow-sm">
            {formatDueTime(item?.dueAt)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{label(item?.status || "pending")}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeClass}`}>{label(type)}</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs text-[#64748B] shadow-sm">
            {item?.assignedTo?.name || "Unassigned"}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-[#64748B]">{item?.note || "No notes added."}</p>

        <Link
          href={leadHref}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-2xl bg-[#EAF5FF] px-4 text-sm font-semibold text-[#2E95F7] transition hover:bg-[#DCEEFF]"
        >
          View Lead
        </Link>
      </div>
    </div>
  );
}

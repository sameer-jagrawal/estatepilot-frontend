"use client";

import { CalendarCheck, MessageCircle, NotebookPen, RefreshCw, Share2, Sparkles, UserPlus } from "lucide-react";

const typeConfig = {
  lead_created: { icon: UserPlus, className: "bg-[#EAF5FF] text-[#2E95F7]" },
  lead_updated: { icon: RefreshCw, className: "bg-[#FEF3C7] text-[#D97706]" },
  status_changed: { icon: RefreshCw, className: "bg-[#FEF3C7] text-[#D97706]" },
  followup_created: { icon: CalendarCheck, className: "bg-[#DCFCE7] text-[#16A34A]" },
  followup_completed: { icon: CalendarCheck, className: "bg-[#DCFCE7] text-[#16A34A]" },
  whatsapp_sent: { icon: MessageCircle, className: "bg-[#D1FAE5] text-[#059669]" },
  whatsapp_received: { icon: MessageCircle, className: "bg-[#D1FAE5] text-[#059669]" },
  note_added: { icon: NotebookPen, className: "bg-[#F3EEFF] text-[#A78BFA]" },
  property_shared: { icon: Share2, className: "bg-[#F5F3FF] text-[#7C3AED]" },
  other: { icon: Sparkles, className: "bg-[#F1F5F9] text-[#475569]" },
};

function formatTime(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

export default function LeadActivityCard({ activity }) {
  const config = typeConfig[activity?.type] || typeConfig.other;
  const Icon = config.icon;

  return (
    <div className="relative flex gap-4 pb-5 last:pb-0">
      <div className="absolute left-5 top-11 h-[calc(100%-44px)] w-px bg-[#E2E8F0]" />
      <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${config.className}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <p className="font-semibold text-[#0F172A]">{activity?.title || "Activity"}</p>
          <span className="text-xs font-medium text-[#94A3B8]">{formatTime(activity?.createdAt)}</span>
        </div>
        <p className="mt-1 text-sm font-medium leading-6 text-[#64748B]">{activity?.description || "No description available."}</p>
        <p className="mt-2 text-xs font-medium text-[#64748B]">{activity?.userId?.name || "Team member"}</p>
      </div>
    </div>
  );
}

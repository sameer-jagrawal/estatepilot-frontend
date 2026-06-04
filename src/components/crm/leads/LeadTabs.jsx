"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Route, WalletCards } from "lucide-react";
import LeadActivityTimeline from "@/components/crm/activity/LeadActivityTimeline";
import LeadFollowupsTab from "./LeadFollowupsTab";
import LeadNotesTab from "./LeadNotesTab";
import LeadStatusBadge, { formatLeadLabel } from "./LeadStatusBadge";
import { formatBudget } from "./LeadTable";

const tabs = ["Overview", "Notes", "Follow-ups", "Activity", "Site Visits", "Deals", "WhatsApp"];

export default function LeadTabs({
  lead,
  notes = [],
  activities = [],
  followups = [],
  onAddNote,
  onAddFollowup,
  onEditFollowup,
  onCompleteFollowup,
  onCancelFollowup,
}) {
  const [active, setActive] = useState("Overview");
  const lastFollowup = useMemo(() => followups?.[0], [followups]);

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
      <div className="flex gap-2 overflow-x-auto border-b border-[#E2E8F0] p-3">
        {tabs.map((tab) => (
          <button key={tab} type="button" onClick={() => setActive(tab)} className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${active === tab ? "bg-[#EAF5FF] text-[#2E95F7]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"}`}>
            {tab}
          </button>
        ))}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-5">
        {active === "Overview" ? (
          <Overview lead={lead} notes={notes} followups={followups} lastFollowup={lastFollowup} />
        ) : active === "Notes" ? (
          <LeadNotesTab notes={notes} onAddNote={onAddNote} />
        ) : active === "Follow-ups" ? (
          <LeadFollowupsTab followups={followups} onAddFollowup={onAddFollowup} onEditFollowup={onEditFollowup} onCompleteFollowup={onCompleteFollowup} onCancelFollowup={onCancelFollowup} />
        ) : active === "Activity" ? (
          <LeadActivityTimeline leadId={lead?._id} fallbackActivities={activities} />
        ) : (
          <Placeholder tab={active} />
        )}
      </motion.div>
    </section>
  );
}

function Overview({ lead, notes, followups, lastFollowup }) {
  const cards = [
    { label: "Lead Status", value: <LeadStatusBadge value={lead?.status} /> },
    { label: "Budget", value: formatBudget(lead) },
    { label: "Property Interest", value: formatLeadLabel(lead?.interestedIn) },
    { label: "Last Follow-up", value: lastFollowup?.dueAt ? new Date(lastFollowup.dueAt).toLocaleDateString("en-IN") : "Not scheduled" },
    { label: "Total Follow-ups", value: followups.length },
    { label: "Notes Count", value: notes.length },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <motion.div key={card.label} whileHover={{ y: -3 }} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{card.label}</p>
          <div className="mt-3 text-lg font-semibold text-[#0F172A]">{card.value}</div>
        </motion.div>
      ))}
    </div>
  );
}

function Placeholder({ tab }) {
  const Icon = tab === "Deals" ? WalletCards : tab === "WhatsApp" ? MessageCircle : Route;
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]"><Icon size={22} /></div>
        <h3 className="mt-3 font-semibold text-[#0F172A]">{tab}</h3>
        <p className="mt-1 text-sm font-medium text-[#64748B]">Coming soon</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, FileText, MessageCircle, NotebookPen, Route, WalletCards } from "lucide-react";

const tabs = [
  "Overview",
  "Activities",
  "Notes",
  "Follow-ups",
  "Site Visits",
  "Deals",
  "WhatsApp",
];

const tabIcons = {
  Activities: Route,
  Notes: NotebookPen,
  "Follow-ups": CalendarCheck,
  "Site Visits": Route,
  Deals: WalletCards,
  WhatsApp: MessageCircle,
};

export default function LeadDetailTabs({ lead }) {
  const [active, setActive] = useState("Overview");

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
      <div className="flex gap-2 overflow-x-auto border-b border-[#E2E8F0] p-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
              active === tab ? "bg-[#EAF5FF] text-[#2E95F7]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-5">
        {active === "Overview" ? <Overview lead={lead} /> : <Placeholder tab={active} />}
      </motion.div>
    </section>
  );
}

function Overview({ lead }) {
  const items = [
    ["Lead stage", lead?.status || "new"],
    ["Source", lead?.source || "other"],
    ["Property interest", lead?.interestedIn || "flat"],
    ["Location", lead?.locationPreference || "Not specified"],
    ["Assigned agent", lead?.assignedTo?.name || "Unassigned"],
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p>
          <p className="mt-2 font-semibold capitalize text-[#0F172A]">{String(value).replace(/_/g, " ")}</p>
        </div>
      ))}
    </div>
  );
}

function Placeholder({ tab }) {
  const Icon = tabIcons[tab] || FileText;

  return (
    <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
          <Icon size={21} />
        </div>
        <h3 className="mt-3 font-semibold text-[#0F172A]">{tab} ready</h3>
        <p className="mx-auto mt-1 max-w-md text-sm font-medium leading-6 text-[#64748B]">
          This tab is prepared for future API integration.
        </p>
      </div>
    </div>
  );
}

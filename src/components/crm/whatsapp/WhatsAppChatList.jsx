"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Search } from "lucide-react";
import LeadStatusBadge from "@/components/crm/leads/LeadStatusBadge";

function leadMatches(lead, query) {
  const text = `${lead?.name || ""} ${lead?.phone || ""} ${lead?.source || ""} ${lead?.status || ""}`.toLowerCase();
  return text.includes(query.toLowerCase());
}

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(value));
}

function ChatListSkeleton() {
  return (
    <div className="grid gap-3 p-4">
      {[0, 1, 2, 3, 4].map((item) => (
        <div key={item} className="flex animate-pulse gap-3 rounded-2xl border border-[#E2E8F0] p-4">
          <div className="h-11 w-11 rounded-2xl bg-[#E2E8F0]" />
          <div className="flex-1">
            <div className="h-4 w-2/3 rounded-full bg-[#E2E8F0]" />
            <div className="mt-3 h-3 w-4/5 rounded-full bg-[#F1F5F9]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WhatsAppChatList({ leads, loading, selectedLeadId, messagesByLead, onSelectLead }) {
  const [search, setSearch] = useState("");

  const filteredLeads = useMemo(() => {
    const query = search.trim();
    if (!query) return leads;
    return leads.filter((lead) => leadMatches(lead, query));
  }, [leads, search]);

  return (
    <div className="flex h-full min-h-[680px] flex-col bg-white">
      <div className="border-b border-[#E2E8F0] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">Lead inbox</h2>
            <p className="text-xs text-[#64748B]">{leads?.length || 0} leads available</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F3EEFF] text-[#A78BFA]">
            <MessageCircle size={19} />
          </span>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search lead"
            className="h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#EAF5FF]"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {loading ? <ChatListSkeleton /> : null}
        {!loading && filteredLeads?.length === 0 ? (
          <div className="grid h-full place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
                <Search size={21} />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#0F172A]">No leads found</p>
              <p className="mt-1 text-sm text-[#64748B]">Try a different name, phone, or source.</p>
            </div>
          </div>
        ) : null}
        {!loading && filteredLeads?.length > 0 ? (
          <div className="grid gap-2">
            {filteredLeads.map((lead, index) => {
              const latestMessage = messagesByLead?.get(lead?._id)?.[0];
              const active = selectedLeadId === lead?._id;
              return (
                <motion.button
                  type="button"
                  key={lead?._id || index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.12) }}
                  onClick={() => onSelectLead(lead)}
                  className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.06)] ${
                    active ? "border-[#4DA8FF] bg-[#EAF5FF]" : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-sm font-semibold text-[#2E95F7] shadow-sm">
                      {(lead?.name || "L").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-[#0F172A]">{lead?.name || "Unnamed lead"}</p>
                        <span className="shrink-0 text-[11px] font-medium text-[#64748B]">{formatTime(latestMessage?.createdAt)}</span>
                      </div>
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#64748B]">
                        <Phone size={13} />
                        {lead?.phone || "No phone"}
                      </p>
                      <p className="mt-2 line-clamp-1 text-sm text-[#64748B]">
                        {latestMessage?.message || "No WhatsApp messages yet"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <LeadStatusBadge value={lead?.status} />
                        <LeadStatusBadge value={lead?.source} type="source" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

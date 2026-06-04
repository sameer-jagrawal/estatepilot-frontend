"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import LeadStatusBadge from "@/components/crm/leads/LeadStatusBadge";
import SendMessageBox from "@/components/crm/whatsapp/SendMessageBox";
import WhatsAppMessageBubble from "@/components/crm/whatsapp/WhatsAppMessageBubble";

function MessagesSkeleton() {
  return (
    <div className="grid gap-4 p-5">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className={`flex animate-pulse ${item % 2 ? "justify-end" : "justify-start"}`}
        >
          <div className="h-20 w-2/3 max-w-[420px] rounded-2xl bg-[#F1F5F9]" />
        </div>
      ))}
    </div>
  );
}

export default function WhatsAppChatWindow({
  lead,
  messages,
  loading,
  saving,
  onBack,
  onSend,
}) {
  if (!lead) {
    return (
      <div className="grid h-full min-h-[680px] place-items-center bg-[#F8FAFC] p-6 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
            <MessageCircle size={25} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">
            Select a lead conversation
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">
            Open a lead from the inbox to view CRM WhatsApp message history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[680px] flex-col bg-[#F8FAFC]">
      <div className="border-b border-[#E2E8F0] bg-white p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] lg:hidden"
            aria-label="Back to chat list"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7]">
            {(lead?.name || "L").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-[#0F172A]">
              {lead?.name || "Unnamed lead"}
            </h2>
            <p className="mt-1 flex items-center gap-1 truncate text-sm text-[#64748B]">
              <Phone size={14} />
              {lead?.phone || "No phone"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <LeadStatusBadge value={lead?.status} />
              <LeadStatusBadge value={lead?.source} type="source" />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? <MessagesSkeleton /> : null}
        {!loading && (!messages || messages.length === 0) ? (
          <div className="grid h-full place-items-center p-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#A78BFA] shadow-sm">
                <MessageCircle size={24} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#0F172A]">
                No WhatsApp conversation yet
              </h3>
              <p className="mt-1 text-sm text-[#64748B]">
                Send your first message to this lead.
              </p>
            </motion.div>
          </div>
        ) : null}
        {!loading && messages?.length > 0 ? (
          <div className="grid gap-3 p-4 sm:p-5">
            {messages.map((message, index) => (
              <WhatsAppMessageBubble
                key={message?._id || index}
                message={message}
                index={index}
              />
            ))}
          </div>
        ) : null}
      </div>

      <SendMessageBox
        // selectedLead={selectedLead}
        // onMessageSent={fetchLeadMessages}
        saving={saving}
        onSend={onSend}
      />
    </div>
  );
}

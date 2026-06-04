"use client";

import { useState } from "react";
import { FileText, SendHorizonal } from "lucide-react";
import WhatsAppTemplateSelector from "@/components/crm/whatsapp/WhatsAppTemplateSelector";

export default function SendMessageBox({ saving, onSend }) {
  const [message, setMessage] = useState("");
  const [templateOpen, setTemplateOpen] = useState(false);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || saving) return;
    await onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[#E2E8F0] bg-white p-4">
      <p className="mb-3 rounded-2xl bg-[#F3EEFF] px-3 py-2 text-xs font-medium text-[#A78BFA]">Meta API sending will be connected in the next phase.</p>
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => setTemplateOpen(true)}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:-translate-y-0.5 hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          aria-label="Select template"
          title="Select template"
        >
          <FileText size={19} />
        </button>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a WhatsApp message"
          rows={2}
          className="max-h-40 min-h-12 flex-1 resize-none rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold leading-6 text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#EAF5FF]"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={saving || !message.trim()}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Send message"
          title="Send message"
        >
          <SendHorizonal size={19} />
        </button>
      </div>
      <WhatsAppTemplateSelector open={templateOpen} onClose={() => setTemplateOpen(false)} onSelectTemplate={(body) => setMessage(body || "")} />
    </div>
  );
}

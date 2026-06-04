"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import WhatsAppAccountCard from "@/components/crm/whatsapp/WhatsAppAccountCard";
import WhatsAppChatList from "@/components/crm/whatsapp/WhatsAppChatList";
import WhatsAppChatWindow from "@/components/crm/whatsapp/WhatsAppChatWindow";
import WhatsAppConnectModal from "@/components/crm/whatsapp/WhatsAppConnectModal";

function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function extractItem(response) {
  return response?.data?.data || response?.data || null;
}

function getLeadIdFromMessage(message) {
  return message?.leadId?._id || message?.leadId || "";
}

export default function WhatsappPage() {
  const [account, setAccount] = useState(null);
  const [leads, setLeads] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadMessages, setLeadMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [accountSaving, setAccountSaving] = useState(false);
  const [messageSaving, setMessageSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("connect");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const messagesByLead = useMemo(() => {
    const grouped = new Map();
    allMessages.forEach((message) => {
      const leadId = getLeadIdFromMessage(message);
      if (!leadId) return;
      const existing = grouped.get(leadId) || [];
      existing.push(message);
      grouped.set(leadId, existing);
    });

    grouped.forEach((messages, leadId) => {
      grouped.set(
        leadId,
        [...messages].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      );
    });

    return grouped;
  }, [allMessages]);

  const fetchAccount = useCallback(async () => {
    try {
      const response = await api.get("whatsapp-account");
      setAccount(extractItem(response));
    } catch (error) {
      if (error?.response?.status !== 404) {
        toast.error(error?.response?.data?.message || "Unable to fetch WhatsApp account");
      }
      setAccount(null);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      const response = await api.get("leads");
      setLeads(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch leads");
      setLeads([]);
    }
  }, []);

  const fetchAllMessages = useCallback(async () => {
    try {
      const response = await api.get("whatsapp-messages");
      setAllMessages(extractArray(response));
    } catch {
      setAllMessages([]);
    }
  }, []);

  const fetchLeadMessages = useCallback(async (leadId) => {
    if (!leadId) return;
    try {
      setMessagesLoading(true);
      const response = await api.get(`whatsapp-messages/lead/${leadId}`);
      setLeadMessages(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch conversation");
      setLeadMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        await Promise.all([fetchAccount(), fetchLeads(), fetchAllMessages()]);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [fetchAccount, fetchAllMessages, fetchLeads]);

  const openConnectModal = () => {
    setModalMode("connect");
    setModalOpen(true);
  };

  const openUpdateModal = () => {
    setModalMode("update");
    setModalOpen(true);
  };

  const handleAccountSubmit = async (payload) => {
    try {
      setAccountSaving(true);
      const response =
        modalMode === "connect"
          ? await api.post("whatsapp-account/connect", payload)
          : await api.patch("whatsapp-account", payload);

      setAccount(extractItem(response));
      setModalOpen(false);
      toast.success(modalMode === "connect" ? "WhatsApp account connected successfully" : "WhatsApp account updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save WhatsApp account");
    } finally {
      setAccountSaving(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmed = window.confirm("Disconnect this WhatsApp Business Account?");
    if (!confirmed) return;

    try {
      setAccountSaving(true);
      const response = await api.patch("whatsapp-account/disconnect");
      setAccount(extractItem(response));
      toast.success("WhatsApp account disconnected successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to disconnect WhatsApp account");
    } finally {
      setAccountSaving(false);
    }
  };

  const handleSelectLead = async (lead) => {
    setSelectedLead(lead);
    setMobileChatOpen(true);
    await fetchLeadMessages(lead?._id);
  };

  const refreshSelectedLeadMessages = async () => {
    if (!selectedLead?._id) return;
    await Promise.all([fetchLeadMessages(selectedLead._id), fetchAllMessages()]);
  };

  const handleSendMessage = async (message) => {
    if (!selectedLead?._id) {
      toast.error("Select a lead first");
      return;
    }
  
    if (!message?.trim()) {
      toast.error("Message is required");
      return;
    }
  
    try {
      setMessageSaving(true);
  
      const response = await api.post("whatsapp/send-message", {
        leadId: selectedLead._id,
        message: message.trim(),
      });
  
      toast.success(
        response?.data?.message ||
        "WhatsApp message sent successfully"
      );
  
      await refreshSelectedLeadMessages();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Unable to send WhatsApp message"
      );
    } finally {
      setMessageSaving(false);
    }
  };

  return (
    <div className="grid min-w-0 max-w-full gap-6 overflow-x-hidden">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6 lg:flex-row lg:items-end"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]">
            <MessageCircle size={15} />
            CRM message history
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">WhatsApp</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">
            Manage customer conversations, WhatsApp messages, and lead communication.
          </p>
        </div>
      </motion.section>

      <WhatsAppAccountCard
        account={account}
        loading={loading}
        saving={accountSaving}
        onConnect={openConnectModal}
        onUpdate={openUpdateModal}
        onDisconnect={handleDisconnect}
      />

      <section className="grid min-h-[680px] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)] lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className={`${mobileChatOpen ? "hidden lg:block" : "block"} min-w-0 border-[#E2E8F0] lg:border-r`}>
          <WhatsAppChatList
            leads={leads}
            loading={loading}
            selectedLeadId={selectedLead?._id}
            messagesByLead={messagesByLead}
            onSelectLead={handleSelectLead}
          />
        </div>
        <div className={`${mobileChatOpen ? "block" : "hidden lg:block"} min-w-0`}>
          <WhatsAppChatWindow
            lead={selectedLead}
            messages={leadMessages}
            loading={messagesLoading}
            saving={messageSaving}
            onBack={() => setMobileChatOpen(false)}
            onSend={handleSendMessage}
          />
        </div>
      </section>

      <WhatsAppConnectModal
        key={`${modalMode}-${account?._id || "new"}-${modalOpen ? "open" : "closed"}`}
        open={modalOpen}
        mode={modalMode}
        account={account}
        saving={accountSaving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAccountSubmit}
      />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, MessageCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import SettingsSidebar from "@/components/crm/settings/SettingsSidebar";
import CompanySettings from "@/components/crm/settings/CompanySettings";
import PlanSettings from "@/components/crm/settings/PlanSettings";
import LeadSettings from "@/components/crm/settings/LeadSettings";
import WhatsAppSettings from "@/components/crm/settings/WhatsAppSettings";
import NotificationSettings from "@/components/crm/settings/NotificationSettings";
import SecuritySettings from "@/components/crm/settings/SecuritySettings";

const emptyTenant = {
  companyName: "",
  slug: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  businessType: "broker",
  city: "",
  address: "",
  plan: "free",
  status: "trial",
  trialEndsAt: "",
  maxUsers: 0,
  maxLeads: 0,
  maxProperties: 0,
  usersUsed: 0,
  leadsUsed: 0,
  propertiesUsed: 0,
};

const tabs = [
  { id: "company", label: "Company Profile", icon: Building2 },
  { id: "plan", label: "Plan & Limits", icon: Settings },
  { id: "leads", label: "Lead Settings", icon: Settings },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "notifications", label: "Notifications", icon: Settings },
  { id: "security", label: "Security", icon: Settings },
];

function extractItem(response) {
  return response?.data?.data || response?.data || null;
}

function normalizeTenant(rawTenant = {}) {
  return {
    ...emptyTenant,
    ...rawTenant,
    companyName: rawTenant?.companyName || rawTenant?.name || "",
    maxUsers: rawTenant?.maxUsers ?? rawTenant?.limits?.maxUsers ?? 0,
    maxLeads: rawTenant?.maxLeads ?? rawTenant?.limits?.maxLeads ?? 0,
    maxProperties: rawTenant?.maxProperties ?? rawTenant?.limits?.maxProperties ?? 0,
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const [tenant, setTenant] = useState(emptyTenant);
  const [whatsAppAccount, setWhatsAppAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenantSaving, setTenantSaving] = useState(false);
  const [whatsAppSaving, setWhatsAppSaving] = useState(false);

  const fetchTenant = useCallback(async () => {
    try {
      const response = await api.get("tenant/me");
      setTenant(normalizeTenant(extractItem(response) || {}));
    } catch (error) {
      if (error?.response?.status && error.response.status !== 404) {
        toast.error(error?.response?.data?.message || "Unable to load company settings");
      }
      setTenant(emptyTenant);
    }
  }, []);

  const fetchWhatsAppAccount = useCallback(async () => {
    try {
      const response = await api.get("whatsapp-account");
      setWhatsAppAccount(extractItem(response));
    } catch (error) {
      if (error?.response?.status && error.response.status !== 404) {
        toast.error(error?.response?.data?.message || "Unable to load WhatsApp settings");
      }
      setWhatsAppAccount(null);
    }
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        await Promise.all([fetchTenant(), fetchWhatsAppAccount()]);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [fetchTenant, fetchWhatsAppAccount]);

  const saveTenant = async (payload) => {
    try {
      setTenantSaving(true);
      const response = await api.patch("tenant/me", payload);
      setTenant(normalizeTenant(extractItem(response) || payload));
      toast.success("Company profile updated");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save company settings");
      return false;
    } finally {
      setTenantSaving(false);
    }
  };

  const saveWhatsAppAccount = async (payload, mode) => {
    try {
      setWhatsAppSaving(true);
      const response =
        mode === "connect" ? await api.post("whatsapp-account/connect", payload) : await api.patch("whatsapp-account", payload);
      setWhatsAppAccount(extractItem(response) || { ...payload, accessToken: undefined });
      toast.success(mode === "connect" ? "WhatsApp connected" : "WhatsApp credentials updated");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save WhatsApp settings");
      return false;
    } finally {
      setWhatsAppSaving(false);
    }
  };

  const disconnectWhatsApp = async () => {
    try {
      setWhatsAppSaving(true);
      const response = await api.patch("whatsapp-account/disconnect");
      setWhatsAppAccount(extractItem(response) || null);
      toast.success("WhatsApp disconnected");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to disconnect WhatsApp");
    } finally {
      setWhatsAppSaving(false);
    }
  };

  const renderActivePanel = () => {
    if (activeTab === "company") return <CompanySettings tenant={tenant} loading={loading} saving={tenantSaving} onSave={saveTenant} />;
    if (activeTab === "plan") return <PlanSettings tenant={tenant} loading={loading} />;
    if (activeTab === "leads") return <LeadSettings />;
    if (activeTab === "whatsapp") {
      return (
        <WhatsAppSettings
          account={whatsAppAccount}
          loading={loading}
          saving={whatsAppSaving}
          onSave={saveWhatsAppAccount}
          onDisconnect={disconnectWhatsApp}
        />
      );
    }
    if (activeTab === "notifications") return <NotificationSettings />;
    return <SecuritySettings />;
  };

  return (
    <div className="grid min-w-0 gap-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]">
          <Settings size={15} />
          Workspace controls
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Settings</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">
          Manage your company profile, CRM preferences, WhatsApp setup, and security options.
        </p>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <SettingsSidebar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          className="min-w-0"
        >
          {renderActivePanel()}
        </motion.div>
      </div>
    </div>
  );
}

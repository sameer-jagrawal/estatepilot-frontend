"use client";

import {
  Building,
  Building2,
  CalendarClock,
  Handshake,
  History,
  MapPinned,
  MessageCircle,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

export const moduleOptions = [
  { label: "All", value: "" },
  { label: "Lead", value: "lead" },
  { label: "Property", value: "property" },
  { label: "Follow-up", value: "followup" },
  { label: "Site Visit", value: "site_visit" },
  { label: "Deal", value: "deal" },
  { label: "User", value: "user" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Tenant", value: "tenant" },
  { label: "Auth", value: "auth" },
  { label: "System", value: "system" },
];

export const moduleConfig = {
  lead: { label: "Lead", icon: UserRound, badge: "bg-[#EAF5FF] text-[#2E95F7]", dot: "bg-[#4DA8FF]" },
  property: { label: "Property", icon: Building2, badge: "bg-[#F3EEFF] text-[#7C3AED]", dot: "bg-[#A78BFA]" },
  followup: { label: "Follow-up", icon: CalendarClock, badge: "bg-[#FFFBEB] text-[#D97706]", dot: "bg-[#F59E0B]" },
  site_visit: { label: "Site Visit", icon: MapPinned, badge: "bg-[#ECFEFF] text-[#0891B2]", dot: "bg-[#06B6D4]" },
  deal: { label: "Deal", icon: Handshake, badge: "bg-[#ECFDF5] text-[#059669]", dot: "bg-[#22C55E]" },
  user: { label: "User", icon: Users, badge: "bg-[#EEF2FF] text-[#4F46E5]", dot: "bg-[#6366F1]" },
  whatsapp: { label: "WhatsApp", icon: MessageCircle, badge: "bg-[#D1FAE5] text-[#047857]", dot: "bg-[#10B981]" },
  tenant: { label: "Tenant", icon: Building, badge: "bg-[#E0F2FE] text-[#0284C7]", dot: "bg-[#38BDF8]" },
  auth: { label: "Auth", icon: ShieldCheck, badge: "bg-[#F1F5F9] text-[#475569]", dot: "bg-[#64748B]" },
  system: { label: "System", icon: Settings, badge: "bg-[#F3F4F6] text-[#4B5563]", dot: "bg-[#9CA3AF]" },
  default: { label: "Activity", icon: History, badge: "bg-[#F8FAFC] text-[#64748B]", dot: "bg-[#CBD5E1]" },
};

export function getModuleConfig(module) {
  return moduleConfig[module] || moduleConfig.default;
}

export function formatLabel(value) {
  if (!value) return "Not available";
  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatTime(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function formatDateGroup(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "Earlier";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  if (current.getTime() === today.getTime()) return "Today";
  if (current.getTime() === yesterday.getTime()) return "Yesterday";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.logs)) return data.logs;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export function getUserName(activity) {
  return activity?.userId?.name || activity?.user?.name || "System";
}

export function metadataPairs(metadata = {}) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return [];

  return Object.entries(metadata)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .slice(0, 5)
    .map(([key, value]) => ({
      key: formatLabel(key),
      value: typeof value === "object" ? value?.name || value?.title || value?._id || JSON.stringify(value) : String(value),
    }));
}

export function isSameOrAfterDate(value, dateValue) {
  if (!dateValue) return true;
  const date = value ? new Date(value) : null;
  const filterDate = new Date(dateValue);
  if (!date || Number.isNaN(date.getTime()) || Number.isNaN(filterDate.getTime())) return true;
  date.setHours(0, 0, 0, 0);
  filterDate.setHours(0, 0, 0, 0);
  return date >= filterDate;
}

export function isSameOrBeforeDate(value, dateValue) {
  if (!dateValue) return true;
  const date = value ? new Date(value) : null;
  const filterDate = new Date(dateValue);
  if (!date || Number.isNaN(date.getTime()) || Number.isNaN(filterDate.getTime())) return true;
  date.setHours(0, 0, 0, 0);
  filterDate.setHours(0, 0, 0, 0);
  return date <= filterDate;
}

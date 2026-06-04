"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Search, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function formatLabel(value) {
  if (!value) return "Unknown";
  return String(value).replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

const templateStatusTheme = {
  draft: "bg-[#F1F5F9] text-[#475569]",
  pending: "bg-[#FEF3C7] text-[#D97706]",
  approved: "bg-[#DCFCE7] text-[#16A34A]",
  rejected: "bg-[#FEE2E2] text-[#DC2626]",
};

export default function WhatsAppTemplateSelector({ open, onClose, onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function fetchTemplates() {
      try {
        setLoading(true);
        const response = await api.get("whatsapp-templates");
        setTemplates(extractArray(response));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Unable to fetch WhatsApp templates");
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, [open]);

  const filteredTemplates = templates.filter((template) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return `${template?.name || ""} ${template?.category || ""} ${template?.body || ""} ${template?.status || ""}`.toLowerCase().includes(query);
  });

  const handleSelect = (template) => {
    onSelectTemplate(template?.body || "");
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
          >
            <div className="border-b border-[#E2E8F0] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-[#0F172A]">WhatsApp templates</h2>
                  <p className="mt-1 text-sm text-[#64748B]">Choose a template to fill the message composer.</p>
                </div>
                <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close template selector">
                  <X size={18} />
                </button>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={17} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search templates" className="h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#EAF5FF]" />
              </div>
            </div>

            <div className="max-h-[58vh] overflow-y-auto p-4">
              {loading ? (
                <div className="grid gap-3">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="h-28 animate-pulse rounded-2xl bg-[#F8FAFC]" />
                  ))}
                </div>
              ) : null}
              {!loading && filteredTemplates.length === 0 ? (
                <div className="grid place-items-center p-10 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
                    <FileText size={23} />
                  </div>
                  <p className="mt-4 text-base font-semibold text-[#0F172A]">No templates found</p>
                </div>
              ) : null}
              {!loading && filteredTemplates.length > 0 ? (
                <div className="grid gap-3">
                  {filteredTemplates.map((template) => {
                    const statusClass = templateStatusTheme[template?.status] || templateStatusTheme.draft;
                    return (
                      <button
                        key={template?._id || template?.name}
                        type="button"
                        onClick={() => handleSelect(template)}
                        className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#4DA8FF] hover:bg-[#F8FAFC] hover:shadow-[0_16px_35px_rgba(15,23,42,0.06)]"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="mr-auto text-sm font-semibold text-[#0F172A]">{template?.name || "Untitled template"}</p>
                          <span className="rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-semibold text-[#A78BFA]">{formatLabel(template?.category)}</span>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{formatLabel(template?.status)}</span>
                        </div>
                        <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-[#64748B]">{template?.body || "No body preview available"}</p>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

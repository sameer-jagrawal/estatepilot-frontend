"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Loader from "@/components/common/Loader";

export default function SiteVisitActionModal({ open, type = "complete", saving = false, onClose, onSubmit }) {
  const [value, setValue] = useState("");
  const isComplete = type === "complete";

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(isComplete ? { feedback: value } : { cancelledReason: value }, () => setValue(""));
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} className="w-full max-w-xl rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] p-5">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">{isComplete ? "Complete Site Visit" : "Cancel Site Visit"}</h2>
                <p className="mt-1 text-sm font-medium text-[#64748B]">{isComplete ? "Add visit feedback before completing." : "Add cancellation reason for team context."}</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 p-5">
              <textarea value={value} onChange={(event) => setValue(event.target.value)} rows={5} placeholder={isComplete ? "Feedback..." : "Cancelled reason..."} className="resize-none rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="h-11 rounded-2xl border border-[#E2E8F0] px-5 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC]">Close</button>
                <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#4DA8FF] px-5 text-sm font-semibold text-white hover:bg-[#2E95F7] disabled:opacity-60">
                  {saving ? <Loader label="Saving" className="text-white" spinnerClassName="border-white/40 border-t-white" /> : isComplete ? "Complete" : "Cancel Visit"}
                </button>
              </div>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

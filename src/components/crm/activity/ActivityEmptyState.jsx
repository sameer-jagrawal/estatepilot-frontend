"use client";

import { History } from "lucide-react";

export default function ActivityEmptyState({
  title = "No activities yet",
  text = "Start using the CRM to generate activity history.",
}) {
  return (
    <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
          <History size={24} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#64748B]">{text}</p>
      </div>
    </div>
  );
}

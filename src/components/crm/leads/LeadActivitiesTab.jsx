"use client";

import { Activity } from "lucide-react";
import LeadActivityCard from "./LeadActivityCard";

export default function LeadActivitiesTab({ activities = [] }) {
  if (!activities.length) {
    return <Empty title="No activity available" text="Customer timeline events will appear here." icon={Activity} />;
  }

  return (
    <div className="grid gap-1">
      {activities.map((activity, index) => (
        <LeadActivityCard key={activity?._id || index} activity={activity} />
      ))}
    </div>
  );
}

function Empty({ title, text, icon: Icon }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]"><Icon size={22} /></div>
        <h3 className="mt-3 font-semibold text-[#0F172A]">{title}</h3>
        <p className="mt-1 text-sm font-medium text-[#64748B]">{text}</p>
      </div>
    </div>
  );
}

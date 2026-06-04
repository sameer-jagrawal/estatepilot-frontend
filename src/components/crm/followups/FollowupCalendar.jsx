"use client";

import { CalendarDays } from "lucide-react";
import { derivedStatus } from "./FollowupCard";

const dotColors = {
  pending: "bg-[#D97706]",
  completed: "bg-[#16A34A]",
  cancelled: "bg-[#DC2626]",
  overdue: "bg-[#DB2777]",
  today: "bg-[#2E95F7]",
  missed: "bg-[#DB2777]",
};

function dateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function buildDays() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let i = 0; i < startOffset; i += 1) days.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) days.push(new Date(year, month, day));
  return days;
}

export default function FollowupCalendar({ followups = [] }) {
  const days = buildDays();
  const grouped = followups.reduce((acc, followup) => {
    const key = dateKey(followup?.dueAt);
    if (!key) return acc;
    acc[key] = acc[key] || [];
    acc[key].push(followup);
    return acc;
  }, {});

  const monthLabel = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date());

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A]">Calendar</h2>
          <p className="mt-1 text-sm font-medium text-[#64748B]">{monthLabel}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
          <CalendarDays size={20} />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[#94A3B8]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const key = day ? dateKey(day) : `empty-${index}`;
          const items = day ? grouped[key] || [] : [];

          return (
            <div key={key} className={`min-h-16 rounded-2xl border p-2 ${day ? "border-[#E2E8F0] bg-[#F8FAFC]" : "border-transparent"}`}>
              {day ? (
                <>
                  <p className="text-xs font-semibold text-[#0F172A]">{day.getDate()}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {items.slice(0, 5).map((item) => (
                      <span key={item?._id} className={`h-2 w-2 rounded-full ${dotColors[derivedStatus(item)] || "bg-[#94A3B8]"}`} />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

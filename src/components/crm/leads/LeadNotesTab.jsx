"use client";

import { NotebookPen } from "lucide-react";

function formatTime(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

function initials(name) {
  return String(name || "U").slice(0, 1).toUpperCase();
}

export default function LeadNotesTab({ notes = [], onAddNote }) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[#0F172A]">Notes Timeline</h3>
          <p className="mt-1 text-sm font-medium text-[#64748B]">Important context and conversation history.</p>
        </div>
        <button type="button" onClick={onAddNote} className="h-10 rounded-2xl bg-[#4DA8FF] px-4 text-sm font-semibold text-white hover:bg-[#2E95F7]">Add Note</button>
      </div>

      {notes.length ? (
        <div className="grid gap-3">
          {notes.map((note) => (
            <article key={note?._id} className="flex gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7]">{initials(note?.userId?.name)}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-6 text-[#0F172A]">{note?.note || ""}</p>
                <p className="mt-2 text-xs font-medium text-[#64748B]">{note?.userId?.name || "Team member"} · {formatTime(note?.createdAt)}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
          <div>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]"><NotebookPen size={22} /></div>
            <h3 className="mt-3 font-semibold text-[#0F172A]">No notes yet</h3>
            <p className="mt-1 text-sm font-medium text-[#64748B]">Add the first note to keep customer context organized.</p>
          </div>
        </div>
      )}
    </div>
  );
}

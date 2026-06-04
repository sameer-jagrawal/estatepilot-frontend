"use client";

import { motion } from "framer-motion";
import { Edit3, Eye, Trash2 } from "lucide-react";
import NoteCard, { formatDate, getCreatorName, getLeadName, ImportantBadge, notePreview, PriorityBadge } from "./NoteCard";

function ActionButton({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-xl border transition ${
        danger
          ? "border-[#FEE2E2] text-[#DC2626] hover:bg-[#FEF2F2]"
          : "border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8FF] hover:bg-[#EAF5FF] hover:text-[#2E95F7]"
      }`}
    >
      <Icon size={16} />
    </button>
  );
}

export function NoteTableSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.04)] lg:block">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="mb-4 h-12 animate-pulse rounded-2xl bg-[#F1F5F9] last:mb-0" />
        ))}
      </div>
      <div className="grid gap-4 lg:hidden">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-44 animate-pulse rounded-2xl border border-[#E2E8F0] bg-white" />
        ))}
      </div>
    </div>
  );
}

export default function NoteTable({ notes = [], onView, onEdit, onDelete }) {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)] lg:block"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[#64748B]">
              <tr>
                {["Note Preview", "Lead", "Created By", "Created Date", "Last Updated", "Priority", "Actions"].map((column) => (
                  <th key={column} className="px-5 py-4 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note?._id} className="border-t border-[#E2E8F0] transition hover:bg-[#F8FAFC]">
                  <td className="max-w-sm px-5 py-4">
                    <p className="line-clamp-2 font-medium leading-6 text-[#0F172A]">{notePreview(note)}</p>
                    {note?.isImportant ? <div className="mt-2"><ImportantBadge /></div> : null}
                  </td>
                  <td className="px-5 py-4 font-medium text-[#0F172A]">{getLeadName(note)}</td>
                  <td className="px-5 py-4 text-[#64748B]">{getCreatorName(note)}</td>
                  <td className="px-5 py-4 text-[#64748B]">{formatDate(note?.createdAt, true)}</td>
                  <td className="px-5 py-4 text-[#64748B]">{formatDate(note?.updatedAt, true)}</td>
                  <td className="px-5 py-4"><PriorityBadge priority={note?.priority} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <ActionButton label="View note" icon={Eye} onClick={() => onView(note)} />
                      <ActionButton label="Edit note" icon={Edit3} onClick={() => onEdit(note)} />
                      <ActionButton label="Delete note" icon={Trash2} onClick={() => onDelete(note)} danger />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      <div className="grid gap-4 lg:hidden">
        {notes.map((note) => (
          <NoteCard key={note?._id} note={note} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </>
  );
}

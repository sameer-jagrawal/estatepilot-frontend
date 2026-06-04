"use client";

import { Edit3, Eye, KeyRound, Phone, Power, UserCheck } from "lucide-react";
import UserRoleBadge from "@/components/crm/users/UserRoleBadge";
import UserStatusBadge, { getUserStatus } from "@/components/crm/users/UserStatusBadge";
import { formatDateTime } from "@/components/crm/users/UserTable";

export default function UserCard({ user, onView, onEdit, onSuspend, onActivate, onChangePassword }) {
  const status = getUserStatus(user);
  const suspended = status === "suspended";

  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7]">
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-[#0F172A]">{user?.name || "Unnamed user"}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <UserRoleBadge value={user?.role} />
              <UserStatusBadge user={user} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[#64748B]">
        <p className="flex items-center gap-2">
          <Phone size={15} />
          {user?.phone || "-"}
        </p>
        <p className="truncate">{user?.email || "No email"}</p>
        <p>Last login: {formatDateTime(user?.lastLoginAt)}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <ActionButton label="View" icon={Eye} onClick={() => onView(user)} />
        <ActionButton label="Edit" icon={Edit3} onClick={() => onEdit(user)} />
        <ActionButton label="Password" icon={KeyRound} onClick={() => onChangePassword(user)} />
      </div>
      <button
        type="button"
        onClick={() => (suspended ? onActivate(user) : onSuspend(user))}
        className={`mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition ${suspended ? "bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0]" : "bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA]"}`}
      >
        {suspended ? <UserCheck size={17} /> : <Power size={17} />}
        {suspended ? "Activate" : "Suspend"}
      </button>
    </article>
  );
}

function ActionButton({ label, icon: Icon, onClick }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="inline-flex h-10 items-center justify-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#EAF5FF] hover:text-[#2E95F7]">
      <Icon size={17} />
    </button>
  );
}

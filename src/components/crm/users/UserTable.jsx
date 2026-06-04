"use client";

import { motion } from "framer-motion";
import { Edit3, Eye, KeyRound, Power, UserCheck, UserRound } from "lucide-react";
import UserCard from "@/components/crm/users/UserCard";
import UserRoleBadge from "@/components/crm/users/UserRoleBadge";
import UserStatusBadge, { getUserStatus } from "@/components/crm/users/UserStatusBadge";

export function formatDateTime(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function UserTableSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-2xl bg-[#E2E8F0]/70" />
        ))}
      </div>
    </div>
  );
}

export default function UserTable({ users = [], onAdd, onView, onEdit, onSuspend, onActivate, onChangePassword }) {
  if (!users.length) {
    return (
      <section className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
            <UserRound size={24} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">No users found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#64748B]">Create your first manager or agent.</p>
          <button type="button" onClick={onAdd} className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#4DA8FF] px-5 text-sm font-semibold text-white transition hover:bg-[#2E95F7]">
            Add User
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.04)] xl:block">
        <div className="grid grid-cols-[0.8fr_1fr_1fr_1.25fr_0.85fr_0.9fr_1fr_1fr_1.25fr] gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
          <span>Profile</span>
          <span>Name</span>
          <span>Phone</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last Login</span>
          <span>Created Date</span>
          <span className="text-right">Actions</span>
        </div>

        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}>
          {users.map((user) => {
            const suspended = getUserStatus(user) === "suspended";
            return (
              <motion.div key={user?._id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="grid grid-cols-[0.8fr_1fr_1fr_1.25fr_0.85fr_0.9fr_1fr_1fr_1.25fr] items-center gap-3 border-b border-[#E2E8F0] px-5 py-4 text-sm last:border-b-0 hover:bg-[#F8FAFC]">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7]">
                  {(user?.name || "U").slice(0, 1).toUpperCase()}
                </div>
                <span className="truncate font-semibold text-[#0F172A]">{user?.name || "Unnamed user"}</span>
                <span className="font-semibold text-[#0F172A]">{user?.phone || "-"}</span>
                <span className="truncate text-[#64748B]">{user?.email || "No email"}</span>
                <UserRoleBadge value={user?.role} />
                <UserStatusBadge user={user} />
                <span className="text-[#64748B]">{formatDateTime(user?.lastLoginAt)}</span>
                <span className="text-[#64748B]">{formatDateTime(user?.createdAt)}</span>
                <div className="flex justify-end gap-1.5">
                  <ActionButton label="View" icon={Eye} onClick={() => onView(user)} />
                  <ActionButton label="Edit" icon={Edit3} onClick={() => onEdit(user)} />
                  <ActionButton label="Change Password" icon={KeyRound} onClick={() => onChangePassword(user)} />
                  {suspended ? <ActionButton label="Activate" icon={UserCheck} onClick={() => onActivate(user)} success /> : <ActionButton label="Suspend" icon={Power} onClick={() => onSuspend(user)} danger />}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <motion.section initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="grid gap-3 xl:hidden">
        {users.map((user) => (
          <motion.div key={user?._id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <UserCard user={user} onView={onView} onEdit={onEdit} onSuspend={onSuspend} onActivate={onActivate} onChangePassword={onChangePassword} />
          </motion.div>
        ))}
      </motion.section>
    </>
  );
}

function ActionButton({ label, icon: Icon, danger = false, success = false, onClick }) {
  const classes = `grid h-9 w-9 place-items-center rounded-xl transition ${
    danger ? "text-[#DC2626] hover:bg-[#FEE2E2]" : success ? "text-[#16A34A] hover:bg-[#DCFCE7]" : "text-[#64748B] hover:bg-[#EAF5FF] hover:text-[#2E95F7]"
  }`;

  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={classes}>
      <Icon size={17} />
    </button>
  );
}

"use client";

import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import useAuth from "@/hooks/useAuth";

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="border border-[#DDE5EF] bg-[#F6F8FB] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#667085]">
        <Icon size={15} />
        {label}
      </div>
      <p className="mt-2 break-words text-sm font-semibold text-[#0B1220]">{value || "Not available"}</p>
    </div>
  );
}

export default function AdminProfilePage() {
  const { user, loading } = useAuth("admin");

  if (loading) {
    return (
      <div className="grid gap-5">
        <div className="h-40 animate-pulse border border-[#DDE5EF] bg-white" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-28 animate-pulse border border-[#DDE5EF] bg-white" />
          <div className="h-28 animate-pulse border border-[#DDE5EF] bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <section className="border border-[#DDE5EF] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg border border-[#BBDFFF] bg-[#EAF5FF] text-[#2E95F7]">
            <UserRound size={34} />
          </div>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#BBDFFF] bg-[#EAF5FF] px-3 py-1 text-xs font-semibold text-[#2E95F7]">
              <ShieldCheck size={14} />
              Super admin
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-[#0B1220]">{user?.name || "Admin"}</h1>
            <p className="mt-1 text-sm text-[#667085]">Platform operations account</p>
          </div>
        </div>
      </section>

      <section className="border border-[#DDE5EF] bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[#0B1220]">Profile Details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Info icon={Mail} label="Email" value={user?.email} />
          <Info icon={ShieldCheck} label="Role" value={user?.role || "super-admin"} />
          <Info icon={CalendarDays} label="Last login" value={formatDate(user?.lastLoginAt)} />
          <Info icon={CalendarDays} label="Created" value={formatDate(user?.createdAt)} />
        </div>
      </section>
    </div>
  );
}

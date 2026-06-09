"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, LogOut, Menu, Search, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import useAuth from "@/hooks/useAuth";

export default function AdminTopbar({ onMenu }) {
  const { user } = useAuth("admin");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("super-admin/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    } finally {
      window.location.assign("/admin/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 h-[68px] border-b border-[#DDE5EF] bg-white/95 backdrop-blur">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenu}
          className="grid h-10 w-10 place-items-center rounded-md border border-[#DDE5EF] text-[#334155] transition hover:bg-[#F6F8FB] lg:hidden"
          aria-label="Open admin menu"
        >
          <Menu size={20} />
        </button>

        <label className="relative min-w-0 flex-1 sm:max-w-xl">
          <span className="sr-only">Search admin</span>
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            className="h-10 w-full rounded-md border border-[#DDE5EF] bg-[#F6F8FB] pl-10 pr-3 text-sm text-[#0B1220] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2E95F7] focus:bg-white focus:ring-4 focus:ring-[#2E95F7]/10"
            placeholder="Search tenants, plans, tickets..."
          />
        </label>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md border border-[#DDE5EF] bg-white text-[#334155] transition hover:bg-[#F6F8FB]"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <Link href="/admin/profile" className="hidden items-center gap-3 border border-[#DDE5EF] bg-white px-3 py-2 transition hover:bg-[#F6F8FB] sm:flex">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7]">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </span>
          <span>
            <span className="block text-sm font-medium leading-4 text-[#0B1220]">{user?.name || "Admin"}</span>
            <span className="block text-xs text-[#667085]">Super admin</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-[#DDE5EF] bg-white px-3 text-sm font-semibold text-[#334155] transition hover:bg-[#F6F8FB] hover:text-[#0B1220]"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
      {confirmOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#0B1220]/35 p-4">
          <section className="w-full max-w-md border border-[#DDE5EF] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
            <div className="flex items-center justify-between border-b border-[#DDE5EF] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-[#EAF5FF] text-[#2E95F7]">
                  <UserRound size={18} />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#0B1220]">Logout admin?</h2>
                  <p className="text-sm text-[#667085]">Your admin session will be closed.</p>
                </div>
              </div>
              <button type="button" onClick={() => setConfirmOpen(false)} className="text-[#667085]" aria-label="Close logout confirmation">
                <X size={18} />
              </button>
            </div>
            <div className="flex justify-end gap-2 p-5">
              <button type="button" onClick={() => setConfirmOpen(false)} className="rounded-md border border-[#DDE5EF] px-4 py-2 text-sm font-medium text-[#334155]">
                Cancel
              </button>
              <button type="button" onClick={handleLogout} className="rounded-md bg-[#DC2626] px-4 py-2 text-sm font-medium text-white hover:bg-[#B91C1C]">
                Logout
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </header>
  );
}

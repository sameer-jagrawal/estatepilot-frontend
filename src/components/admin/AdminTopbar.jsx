"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function AdminTopbar({ onMenu }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("super-admin/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    } finally {
      router.push("/admin/login");
      router.refresh();
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

        <div className="hidden items-center gap-3 border border-[#DDE5EF] bg-white px-3 py-2 sm:flex">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7]">
            A
          </span>
          <span>
            <span className="block text-sm font-medium leading-4 text-[#0B1220]">Admin</span>
            <span className="block text-xs text-[#667085]">Super admin</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-[#DDE5EF] bg-white px-3 text-sm font-semibold text-[#334155] transition hover:bg-[#F6F8FB] hover:text-[#0B1220]"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

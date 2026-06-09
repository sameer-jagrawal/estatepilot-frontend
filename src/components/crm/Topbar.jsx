"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, Bell, ChevronDown, Loader2, LogOut, Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/axios";
import useAuth from "@/hooks/useAuth";

function getInitial(value) {
  return (value || "U").slice(0, 1).toUpperCase();
}

function formatRole(value) {
  if (!value) return "Role";
  return String(value).replace(/[-_]/g, " ");
}

function getProfileImage(user) {
  return user?.profileImage || user?.profilePhoto || user?.avatar || user?.photo || user?.image || "";
}

export default function Topbar({ onMenu }) {
  const { user: fallbackUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(fallbackUser);
  const [open, setOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const user = currentUser || fallbackUser;
  const profileImage = getProfileImage(user);

  const loadCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("auth/me");
      const nextUser = response?.data?.data || response?.data?.user || response?.data;

      if (nextUser?.name || nextUser?.role) {
        setCurrentUser(nextUser);
      }
    } catch {
      setCurrentUser(fallbackUser);
    }
  }, [fallbackUser]);

  useEffect(() => {
    Promise.resolve().then(loadCurrentUser);
  }, [loadCurrentUser]);

  const handleLogoutClick = () => {
    setOpen(false);
    setLogoutConfirmOpen(true);
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const response = await api.post("auth/logout");
      toast.success(response?.data?.message || "Logout successful");
      setLogoutConfirmOpen(false);
      window.location.assign("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 backdrop-blur lg:z-20">
        <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={onMenu}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-[#E2E8F0] text-[#0F172A] transition hover:bg-[#F8FAFC] lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

        <div className="relative hidden w-full max-w-xl sm:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <label htmlFor="crm-search" className="sr-only">
            Search CRM
          </label>
          <input
            id="crm-search"
            className="h-11 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
            placeholder="Search leads, properties, deals..."
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Search"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] sm:hidden"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <Bell size={18} />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#A78BFA] ring-2 ring-white" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="flex h-11 items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-2.5 transition hover:bg-[#F8FAFC] sm:px-3"
            >
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={user?.name ? `${user.name} profile` : "User profile"}
                  width={32}
                  height={32}
                  unoptimized={profileImage.startsWith("data:")}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7]">
                  {getInitial(user?.name)}
                </span>
              )}
              <span className="hidden text-left md:block">
                <span className="block text-sm font-semibold leading-4 text-[#0F172A]">{user?.name || "Logged-in User"}</span>
                <span className="block text-xs font-semibold capitalize text-[#64748B]">{formatRole(user?.role)}</span>
              </span>
              <ChevronDown className="hidden text-[#94A3B8] sm:block" size={16} />
            </button>

            <AnimatePresence>
              {open ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-[0_22px_55px_rgba(15,23,42,0.13)]"
                >
                  <Link className="block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-[#F8FAFC]" href="/profile">
                    Profile
                  </Link>
                  <Link className="block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-[#F8FAFC]" href="/settings">
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2]"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
      </header>

      <AnimatePresence>
        {logoutConfirmOpen ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FEF2F2] text-[#DC2626]">
                    <AlertTriangle size={21} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#0F172A]">Confirm Logout</h2>
                    <p className="mt-1 text-sm leading-6 text-[#64748B]">
                      Are you sure you want to logout from EstatePilot CRM?
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(false)}
                  disabled={loggingOut}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Close logout confirmation"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(false)}
                  disabled={loggingOut}
                  className="h-12 rounded-2xl border border-[#E2E8F0] px-5 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#DC2626] px-5 text-sm font-semibold text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
                  {loggingOut ? "Logging out..." : "Yes, Logout"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  BellDot,
  Building2,
  CreditCard,
  Gauge,
  LifeBuoy,
  Settings,
  Tags,
  UserRound,
  X,
} from "lucide-react";

export const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Gauge },
  { label: "Tenants", href: "/admin/tenants", icon: Building2 },
  { label: "Plans", href: "/admin/plans", icon: Tags },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Support", href: "/admin/support", icon: LifeBuoy },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Profile", href: "/admin/profile", icon: UserRound },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function SidebarContent({ onClose, showClose = false }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[280px] flex-col border-r border-[#DDE5EF] bg-white">
      <div className="flex h-[72px] items-center gap-3 border-b border-[#DDE5EF] px-5">
        <Link href="/admin/dashboard" onClick={onClose} className="flex min-w-0 flex-1 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#BBDFFF] bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7]">
            EP
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold text-[#0B1220]">EstatePilot</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#667085]">
              Admin Console
            </span>
          </span>
        </Link>
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md border border-[#DDE5EF] text-[#334155] transition hover:bg-[#F6F8FB]"
            aria-label="Close admin menu"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <nav className="grid gap-1 px-3 py-4">
        {adminNavItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`group flex items-center gap-3 border-l-2 px-3 py-3 text-sm font-semibold transition ${
                active
                  ? "border-[#2E95F7] bg-[#EAF5FF] text-[#2E95F7]"
                  : "border-transparent text-[#334155] hover:border-[#DDE5EF] hover:bg-[#F6F8FB] hover:text-[#0B1220]"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#DDE5EF] p-4">
        <div className="rounded-lg border border-[#DDE5EF] bg-[#F6F8FB] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[#0B1220]">
            <BellDot size={16} className="text-[#A78BFA]" />
            Platform ops
          </div>
          <p className="mt-2 text-xs leading-5 text-[#667085]">
            Tenant controls, plan limits, billing signals, and support triage in one console.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function AdminSidebar({ open = false, onClose }) {
  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <SidebarContent />
      </div>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              aria-label="Close admin menu"
              className="absolute inset-0 bg-[#0B1220]/35"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
            <motion.div
              className="relative h-full"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <SidebarContent onClose={onClose} showClose />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeDollarSign,
  BarChart3,
  Building2,
  CalendarCheck,
  History,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  NotebookPen,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["owner", "manager", "agent"] },
  { label: "Leads", href: "/leads", icon: Users, roles: ["owner", "manager", "agent"] },
  { label: "Properties", href: "/properties", icon: Building2, roles: ["owner", "manager"] },
  { label: "Follow-ups", href: "/followups", icon: CalendarCheck, roles: ["owner", "manager", "agent"] },
  { label: "Site Visits", href: "/site-visits", icon: MapPin, roles: ["owner", "manager", "agent"] },
  { label: "Deals", href: "/deals", icon: BadgeDollarSign, roles: ["owner", "manager"] },
  { label: "Reports", href: "/reports", icon: BarChart3, roles: ["owner", "manager"] },
  { label: "Activity Logs", href: "/activity-logs", icon: History, roles: ["owner", "manager"] },
  { label: "WhatsApp", href: "/whatsapp", icon: MessageCircle, roles: ["owner", "manager", "agent"] },
  { label: "Notes", href: "/notes", icon: NotebookPen, roles: ["owner", "agent"] },
  { label: "Users", href: "/users", icon: UserPlus, roles: ["owner"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["owner"] },
];

function SidebarContent({ role, company, onClose, showClose = false }) {
  const pathname = usePathname();
  const items = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="flex h-full w-[280px] max-w-[calc(100vw-24px)] flex-col border-r border-[#E2E8F0] bg-white">
      <div className="flex h-[72px] items-center justify-between px-5">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EAF5FF] text-sm font-semibold tracking-wide text-[#2E95F7]">
            EP
          </span>
          <span>
            <span className="block text-lg font-semibold text-[#0F172A]">EstatePilot</span>
            <span className="block text-xs text-[#64748B]">Real estate CRM</span>
          </span>
        </Link>

        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <nav className="grid gap-1.5 px-4 py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 ${
                active
                  ? "bg-[#EAF5FF] text-[#2E95F7] shadow-[0_10px_24px_rgba(77,168,255,0.12)]"
                  : "text-[#64748B] hover:translate-x-0.5 hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              }`}
            >
              {active ? <span className="absolute left-0 h-7 w-1 rounded-r-full bg-[#2E95F7]" /> : null}
              <Icon size={19} strokeWidth={2.2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-[0_16px_35px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-sm font-semibold text-[#A78BFA] shadow-sm">
              {role.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold capitalize text-[#0F172A]">{role} workspace</p>
              <p className="text-xs font-medium text-[#64748B]">{company || "Company workspace"}</p>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white">
            <div className="h-2 w-3/4 rounded-full bg-[#4DA8FF]" />
          </div>
          <p className="mt-3 text-xs text-[#64748B]">Role-ready navigation</p>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar({ role = "owner", company = "", open = false, onClose }) {
  return (
    <>
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <SidebarContent role={role} company={company} />
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-[#0F172A]/35"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative h-full"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <SidebarContent role={role} company={company} onClose={onClose} showClose />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

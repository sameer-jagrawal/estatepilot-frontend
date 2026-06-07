"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import api from "@/lib/axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function CRMLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await api.get("auth/me");
        const nextUser = response?.data?.data || response?.data?.user || response?.data;

        if (active && nextUser) {
          setUser({
            ...nextUser,
            role: nextUser?.role || "owner",
          });
        }
      } catch {
        if (active && typeof window !== "undefined") {
          const search = window.location.search || "";
          const nextPath = `${pathname || "/dashboard"}${search}`;
          window.location.assign(`/login?next=${encodeURIComponent(nextPath)}`);
        }
      } finally {
        if (active) setCheckingAuth(false);
      }
    }

    loadUser();
    return () => {
      active = false;
    };
  }, [pathname]);

  if (checkingAuth || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F8FAFC] p-4 text-sm font-semibold text-[#64748B]">
        Checking your session...
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC]">
      <Sidebar role={user?.role || "owner"} company={user?.company || user?.tenant?.name || ""} open={open} onClose={() => setOpen(false)} />
      <div className="min-w-0 max-w-full lg:pl-[280px]">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="crm-content min-w-0 max-w-full overflow-x-hidden p-4 sm:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}

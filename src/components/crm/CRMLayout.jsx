"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function CRMLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ role: "owner", company: "" });

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
        if (active) setUser({ role: "owner", company: "" });
      }
    }

    loadUser();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC]">
      <Sidebar role={user?.role || "owner"} company={user?.company || user?.tenant?.name || ""} open={open} onClose={() => setOpen(false)} />
      <div className="min-w-0 max-w-full lg:pl-[280px]">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="min-w-0 max-w-full overflow-x-hidden p-4 sm:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}

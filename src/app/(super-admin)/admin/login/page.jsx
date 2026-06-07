"use client";

import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("super-admin/login", form, { withCredentials: true });
      toast.success("Welcome to Admin Console");
      window.location.assign("/admin/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#F6F8FB] px-4 py-10 text-[#0B1220]">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md border border-[#DDE5EF] bg-white"
      >
        <div className="border-b border-[#DDE5EF] p-6">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#F5F3FF] px-3 py-1 text-xs font-medium text-[#7C3AED]">
            <ShieldCheck size={14} />
            Super Admin
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg border border-[#BBDFFF] bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7]">
              EP
            </span>
            <div>
              <p className="text-lg font-semibold">EstatePilot</p>
              <p className="text-sm text-[#667085]">Admin Console</p>
            </div>
          </div>
          <h1 className="mt-6 text-2xl font-semibold">Admin Console</h1>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Manage tenants, plans, revenue, and platform operations.
          </p>
        </div>

        <form onSubmit={submit} className="grid gap-4 p-6">
          <label className="grid gap-1 text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="h-11 rounded-md border border-[#DDE5EF] bg-[#F6F8FB] px-3 font-normal outline-none transition focus:border-[#2E95F7] focus:bg-white focus:ring-4 focus:ring-[#2E95F7]/10"
              placeholder="admin@estatepilot.app"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Password
            <span className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="h-11 w-full rounded-md border border-[#DDE5EF] bg-[#F6F8FB] px-3 pr-24 font-normal outline-none transition focus:border-[#2E95F7] focus:bg-white focus:ring-4 focus:ring-[#2E95F7]/10"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[#667085] transition hover:bg-white hover:text-[#0B1220]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-11 rounded-md bg-[#2E95F7] text-sm font-semibold text-white transition hover:bg-[#1C75C9] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </motion.section>
    </main>
  );
}

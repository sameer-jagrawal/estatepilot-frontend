"use client";

import { useState } from "react";
import { Eye, EyeOff, ShieldPlus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function AdminRegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", secretKey: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("super-admin/create", form, { withCredentials: true });
      toast.success("Super admin registered successfully");
      window.location.assign("/admin/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Admin registration failed");
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
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#BBDFFF] bg-[#EAF5FF] px-3 py-1 text-xs font-medium text-[#2E95F7]">
            <ShieldPlus size={14} />
            Super Admin Setup
          </div>
          <h1 className="text-2xl font-semibold">Register Admin</h1>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Create the platform admin account using the server setup secret.
          </p>
        </div>

        <form onSubmit={submit} className="grid gap-4 p-6">
          <Field label="Name">
            <input required value={form.name} onChange={(event) => update("name", event.target.value)} className="h-11 rounded-md border border-[#DDE5EF] bg-[#F6F8FB] px-3 font-normal outline-none transition focus:border-[#2E95F7] focus:bg-white focus:ring-4 focus:ring-[#2E95F7]/10" />
          </Field>
          <Field label="Email">
            <input type="email" required value={form.email} onChange={(event) => update("email", event.target.value)} className="h-11 rounded-md border border-[#DDE5EF] bg-[#F6F8FB] px-3 font-normal outline-none transition focus:border-[#2E95F7] focus:bg-white focus:ring-4 focus:ring-[#2E95F7]/10" />
          </Field>
          <Field label="Password">
            <span className="relative">
              <input type={showPassword ? "text" : "password"} required minLength={6} value={form.password} onChange={(event) => update("password", event.target.value)} className="h-11 w-full rounded-md border border-[#DDE5EF] bg-[#F6F8FB] px-3 pr-24 font-normal outline-none transition focus:border-[#2E95F7] focus:bg-white focus:ring-4 focus:ring-[#2E95F7]/10" />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[#667085] transition hover:bg-white hover:text-[#0B1220]" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </Field>
          <Field label="Setup Secret">
            <input required type="password" value={form.secretKey} onChange={(event) => update("secretKey", event.target.value)} className="h-11 rounded-md border border-[#DDE5EF] bg-[#F6F8FB] px-3 font-normal outline-none transition focus:border-[#2E95F7] focus:bg-white focus:ring-4 focus:ring-[#2E95F7]/10" />
          </Field>
          <button type="submit" disabled={loading} className="mt-2 h-11 rounded-md bg-[#2E95F7] text-sm font-semibold text-white transition hover:bg-[#1C75C9] disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </motion.section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

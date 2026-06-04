"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";

export const USER_PERMISSIONS = [
  "leads.create",
  "leads.edit",
  "leads.delete",
  "followups.manage",
  "properties.manage",
  "deals.manage",
  "whatsapp.send",
  "users.manage",
];

function initialForm(user, mode) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    role: mode === "edit" ? user?.role || "agent" : "agent",
    permissions: Array.isArray(user?.permissions) ? user.permissions : [],
  };
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#0F172A]">
      {label}
      {children}
    </label>
  );
}

export default function UserFormModal({ open, mode = "create", user, saving, onClose, onSubmit }) {
  const [form, setForm] = useState(() => initialForm(user, mode));

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const togglePermission = (permission) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.phone.trim()) return toast.error("Phone is required");
    if (!form.role) return toast.error("Role is required");
    if (mode === "create" && form.password.length < 6) return toast.error("Password must be at least 6 characters");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim(),
      role: form.role,
      permissions: form.permissions,
    };

    if (mode === "create") payload.password = form.password;
    onSubmit(payload);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#0F172A]">{mode === "create" ? "Add User" : "Edit User"}</h2>
                <p className="mt-1 text-sm text-[#64748B]">Create manager and agent access with scoped permissions.</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input required value={form.name} onChange={(event) => updateField("name", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
              </Field>
              <Field label="Phone">
                <input required value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
              </Field>
              {mode === "create" ? (
                <Field label="Password">
                  <input required type="password" minLength={6} value={form.password} onChange={(event) => updateField("password", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
                </Field>
              ) : null}
              <Field label="Role">
                <select value={form.role} onChange={(event) => updateField("role", event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]">
                  <option value="manager">Manager</option>
                  <option value="agent">Agent</option>
                </select>
              </Field>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-[#0F172A]">Permissions</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {USER_PERMISSIONS.map((permission) => (
                  <label key={permission} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm font-medium transition ${form.permissions.includes(permission) ? "border-[#4DA8FF] bg-[#EAF5FF] text-[#2E95F7]" : "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-white"}`}>
                    <input type="checkbox" checked={form.permissions.includes(permission)} onChange={() => togglePermission(permission)} className="h-4 w-4 accent-[#4DA8FF]" />
                    {permission}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} disabled={saving} className="h-12 rounded-2xl border border-[#E2E8F0] px-5 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="h-12 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white transition hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving..." : mode === "create" ? "Create User" : "Save Changes"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

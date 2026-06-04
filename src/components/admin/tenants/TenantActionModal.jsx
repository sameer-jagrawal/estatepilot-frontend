"use client";

import { AlertTriangle, X } from "lucide-react";

export default function TenantActionModal({ open, tenant, action, loading, onClose, onConfirm }) {
  if (!open) return null;

  const isSuspend = action === "suspend";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0B1220]/35 p-4">
      <section className="w-full max-w-md border border-[#DDE5EF] bg-white">
        <div className="flex items-center justify-between border-b border-[#DDE5EF] px-5 py-4">
          <h2 className="text-base font-semibold text-[#0B1220]">{isSuspend ? "Suspend Tenant" : "Activate Tenant"}</h2>
          <button type="button" onClick={onClose} className="text-[#667085]" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <div className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#FFF7ED] text-[#D97706]">
              <AlertTriangle size={18} />
            </span>
            <div>
              <p className="font-medium text-[#0B1220]">{tenant?.name || "Selected tenant"}</p>
              <p className="mt-1 text-sm leading-6 text-[#667085]">
                {isSuspend
                  ? "This will suspend CRM access for tenant users until the account is activated again."
                  : "This will reactivate CRM access for the tenant and its users."}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-md border border-[#DDE5EF] px-4 py-2 text-sm font-medium">
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                isSuspend ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "bg-[#16A34A] hover:bg-[#15803D]"
              }`}
            >
              {loading ? "Working..." : isSuspend ? "Suspend" : "Activate"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Button from "./Button";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/30 p-4">
      <section
        aria-modal="true"
        role="dialog"
        className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-[#0F172A]">{title}</h2>
          <Button type="button" variant="ghost" onClick={onClose} className="px-3">
            Close
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}

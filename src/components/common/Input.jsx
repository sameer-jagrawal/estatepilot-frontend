"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({ label, id, className = "", showPasswordToggle = false, type = "text", ...props }) {
  const [visible, setVisible] = useState(false);
  const canTogglePassword = showPasswordToggle && type === "password";

  const input = (
    <div className={canTogglePassword ? "relative" : ""}>
      <input
        id={id}
        type={canTogglePassword && visible ? "text" : type}
        className={`input-field ${canTogglePassword ? "pr-24" : ""} ${className}`}
        {...props}
      />
      {canTogglePassword ? (
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          {visible ? "Hide" : "Show"}
        </button>
      ) : null}
    </div>
  );

  return (
    <label htmlFor={id} className="block">
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-[#0F172A]">
          {label}
        </span>
      ) : null}
      {input}
    </label>
  );
}

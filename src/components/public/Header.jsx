"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "@/components/common/Button";
import { brand, publicNav } from "@/lib/data";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 shadow-[0_10px_35px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      <nav className="app-container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3 font-medium">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#2E95F7] to-[#A78BFA] text-sm text-white shadow-[0_14px_30px_rgba(77,168,255,0.28)] transition group-hover:-rotate-3 group-hover:scale-105">
            EP
          </span>
          <span className="text-gradient-primary text-lg font-semibold tracking-tight">{brand.name}</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {publicNav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-medium transition after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#2E95F7] after:to-[#A78BFA] after:transition-all ${
                  active
                    ? "text-[#1867B7] after:w-full"
                    : "text-[#64748B] after:w-0 hover:text-[#0F172A] hover:after:w-full"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button href="/login" variant="secondary" className="py-2.5">
            Login
          </Button>
          <Button href="/register-company" className="py-2.5">
            Get Started
          </Button>
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#334155] shadow-sm md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-[#E2E8F0] bg-white shadow-xl md:hidden">
          <div className="app-container grid gap-2 py-4">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
                  pathname === item.href ? "bg-[#F3FAFF] text-[#2E95F7]" : "hover:bg-[#F3FAFF] hover:text-[#2E95F7]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button href="/login" variant="secondary">Login</Button>
              <Button href="/register-company">Get Started</Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

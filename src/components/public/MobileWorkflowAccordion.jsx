"use client";

import { useState } from "react";

export default function MobileWorkflowAccordion({ steps }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-6 grid gap-3 md:hidden">
      {steps.map((step, index) => {
        const open = openIndex === index;

        return (
          <article key={step} className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
              aria-expanded={open}
            >
              <span>
                <span className="block text-xs font-medium text-[#A78BFA]">0{index + 1}</span>
                <span className="mt-1 block text-base font-medium">{step}</span>
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#F3FAFF] text-[#2E95F7]">
                {open ? "-" : "+"}
              </span>
            </button>
            {open ? (
              <div className="px-4 pb-4 text-sm leading-6 text-[#64748B]">
                Move each lead forward with clear ownership, reminders, and sales context.
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

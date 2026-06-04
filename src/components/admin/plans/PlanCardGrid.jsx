"use client";

import { Check, Crown } from "lucide-react";

export default function PlanCardGrid({ plans = [] }) {
  if (!plans.length) {
    return (
      <section className="border border-[#DDE5EF] bg-white p-8 text-center">
        <p className="text-sm font-medium text-[#0B1220]">No plans configured</p>
        <p className="mt-1 text-sm text-[#667085]">Create the first billing plan to show plan cards here.</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => (
        <article key={plan?._id || plan?.name} className="border border-[#DDE5EF] bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold capitalize text-[#0B1220]">{plan?.displayName || plan?.name}</p>
              <p className="mt-1 text-xs capitalize text-[#667085]">{plan?.billingCycle || "monthly"}</p>
            </div>
            {plan?.isPopular ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#DDD6FE] bg-[#F5F3FF] px-2 py-1 text-xs font-medium text-[#7C3AED]">
                <Crown size={12} />
                Popular
              </span>
            ) : null}
          </div>
          <div className="mt-5 text-3xl font-semibold text-[#0B1220]">₹{Number(plan?.price || 0).toLocaleString("en-IN")}</div>
          <p className="mt-3 min-h-10 text-sm leading-5 text-[#667085]">{plan?.description || "Operational CRM plan for real estate teams."}</p>
          <div className="mt-4 grid gap-2 border-t border-[#DDE5EF] pt-4 text-sm text-[#334155]">
            <span>{plan?.limits?.maxUsers || 0} users</span>
            <span>{plan?.limits?.maxLeads || 0} leads</span>
            <span>{plan?.limits?.maxProperties || 0} properties</span>
          </div>
          <div className="mt-4 grid gap-2">
            {(plan?.features || []).slice(0, 4).map((feature) => (
              <span key={feature} className="inline-flex items-center gap-2 text-sm text-[#334155]">
                <Check size={14} className="text-[#16A34A]" />
                {feature}
              </span>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

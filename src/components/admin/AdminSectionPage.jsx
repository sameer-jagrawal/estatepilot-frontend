import { BarChart3, CreditCard, LifeBuoy, Settings } from "lucide-react";

const section = {
  payments: {
    title: "Payments",
    description: "Subscription invoices and platform transactions will appear here when billing APIs are connected.",
    icon: CreditCard,
    missingApi: "admin/payments",
  },
  support: {
    title: "Support",
    description: "Tenant support tickets will appear here when support APIs are connected.",
    icon: LifeBuoy,
    missingApi: "admin/support",
  },
  analytics: {
    title: "Analytics",
    description: "Growth, revenue, tenant activity, and usage trends will appear here when analytics APIs are connected.",
    icon: BarChart3,
    missingApi: "admin/analytics",
  },
  settings: {
    title: "Settings",
    description: "Platform-wide settings will appear here when settings APIs are connected.",
    icon: Settings,
    missingApi: "admin/settings",
  },
};

export default function AdminSectionPage({ type }) {
  const config = section[type] || section.analytics;
  const Icon = config.icon;

  return (
    <div className="grid gap-5">
      <header className="border border-[#DDE5EF] bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#2E95F7]">Super Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#0B1220] sm:text-3xl">{config.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#667085]">{config.description}</p>
      </header>

      <section className="grid min-h-[340px] place-items-center border border-dashed border-[#DDE5EF] bg-white p-8 text-center">
        <div>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-md border border-[#DDE5EF] bg-[#F6F8FB] text-[#334155]">
            <Icon size={22} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-[#0B1220]">No live data source connected</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
            Add the missing API route <span className="font-medium text-[#334155]">{config.missingApi}</span> to power this page with real platform data.
          </p>
        </div>
      </section>
    </div>
  );
}

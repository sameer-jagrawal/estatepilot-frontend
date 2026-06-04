"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useSyncExternalStore } from "react";

const statusColors = {
  active: "#16A34A",
  trial: "#2E95F7",
  suspended: "#DC2626",
  inactive: "#D97706",
};

function ChartPanel({ title, children }) {
  return (
    <section className="border border-[#DDE5EF] bg-white">
      <div className="border-b border-[#DDE5EF] px-4 py-3">
        <h2 className="text-sm font-semibold text-[#0B1220]">{title}</h2>
      </div>
      <div className="h-72 p-4">{children}</div>
    </section>
  );
}

function MissingChartData({ api }) {
  return (
    <div className="grid h-full place-items-center border border-dashed border-[#DDE5EF] bg-[#F6F8FB] p-5 text-center">
      <div>
        <p className="text-sm font-medium text-[#0B1220]">No live trend data</p>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Add <span className="font-medium text-[#334155]">{api}</span> to render this chart with real data.
        </p>
      </div>
    </div>
  );
}

export default function AdminCharts({ stats = {} }) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const statusData = [
    { name: "active", value: Number(stats?.activeTenants) || 0 },
    { name: "trial", value: Number(stats?.trialTenants) || 0 },
    { name: "suspended", value: Number(stats?.suspendedTenants) || 0 },
    {
      name: "inactive",
      value:
        (Number(stats?.totalTenants) || 0) -
        (Number(stats?.activeTenants) || 0) -
        (Number(stats?.trialTenants) || 0) -
        (Number(stats?.suspendedTenants) || 0),
    },
  ].map((item) => ({ ...item, value: Math.max(item.value, 0) }));

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <ChartPanel title="Tenant Growth">
        <MissingChartData api="admin/dashboard/tenant-growth" />
      </ChartPanel>

      <ChartPanel title="Revenue Overview">
        <MissingChartData api="admin/dashboard/revenue-trends" />
      </ChartPanel>

      <ChartPanel title="Tenant Status">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={2}>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={statusColors[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : null}
      </ChartPanel>
    </div>
  );
}

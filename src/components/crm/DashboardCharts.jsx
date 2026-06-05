"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ChartCard({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
        <p className="mt-1 text-sm font-medium text-[#64748B]">{subtitle}</p>
      </div>
      <div className="h-72">{children}</div>
    </section>
  );
}

function EmptyChartState({ label }) {
  return (
    <div className="grid h-full place-items-center rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center">
      <div>
        <p className="font-semibold text-[#0F172A]">{label}</p>
        <p className="mt-1 text-sm font-medium text-[#64748B]">Data will appear after records are added.</p>
      </div>
    </div>
  );
}

export default function DashboardCharts({ leadStatusData = [], dealStatusData = [] }) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <ChartCard title="Leads by status" subtitle="Live lead counts grouped by status">
        {leadStatusData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadStatusData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
              <Line type="monotone" dataKey="value" name="Leads" stroke="#1867B7" strokeWidth={3} dot={{ r: 4, fill: "#1867B7" }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState label="No lead stats yet" />
        )}
      </ChartCard>

      <ChartCard title="Deals by status" subtitle="Live deal count from your pipeline">
        {dealStatusData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dealStatusData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
              <Bar dataKey="count" name="Deals" radius={[10, 10, 0, 0]} fill="#6D28D9" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState label="No deal stats yet" />
        )}
      </ChartCard>

      <ChartCard title="Lead status" subtitle="Pipeline health distribution">
        {leadStatusData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
              <Pie data={leadStatusData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={4}>
                {leadStatusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState label="No lead distribution yet" />
        )}
      </ChartCard>
    </section>
  );
}

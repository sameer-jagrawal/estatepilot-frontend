"use client";

import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#4DA8FF", "#A78BFA", "#10B981", "#F59E0B", "#EF4444", "#06B6D4", "#8B5CF6"];

function EmptyState({ label }) {
  return (
    <div className="grid h-full place-items-center rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center">
      <div>
        <p className="font-semibold text-[#0F172A]">{label}</p>
        <p className="mt-1 text-sm text-[#64748B]">Data will appear after records are added.</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
      <h3 className="text-sm font-semibold text-[#0F172A]">{title}</h3>
      <div className="mt-4 h-72">{children}</div>
    </div>
  );
}

export default function LeadAnalytics({ data = {} }) {
  const source = data?.source || [];
  const status = data?.status || [];
  const growth = data?.growth || [];

  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A]">Lead Analytics</h2>
        <p className="mt-1 text-sm text-[#64748B]">Source mix, lead status, and acquisition growth.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Lead source">
          {source.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
                <Pie data={source} dataKey="value" nameKey="name" outerRadius={96} paddingAngle={4}>
                  {source.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState label="No lead sources yet" />}
        </ChartCard>

        <ChartCard title="Lead status">
          {status.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={status} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
                <Bar dataKey="value" name="Leads" radius={[10, 10, 0, 0]} fill="#4DA8FF" />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState label="No lead status data" />}
        </ChartCard>

        <ChartCard title="Lead growth">
          {growth.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
                <Line type="monotone" dataKey="value" name="Leads" stroke="#A78BFA" strokeWidth={3} dot={{ r: 4, fill: "#A78BFA" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <EmptyState label="No growth data yet" />}
        </ChartCard>
      </div>
    </motion.section>
  );
}

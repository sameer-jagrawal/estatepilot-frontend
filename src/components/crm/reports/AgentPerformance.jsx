"use client";

import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function AgentPerformance({ rows = [] }) {
  const chartRows = rows.map((row) => ({ name: row.name, revenue: row.revenueGenerated }));

  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A]">Agent Performance</h2>
        <p className="mt-1 text-sm text-[#64748B]">Assigned leads, follow-up completion, site visits, deals, and revenue.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#F8FAFC] text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                <tr>
                  <th className="px-5 py-4">Agent name</th>
                  <th className="px-5 py-4">Assigned leads</th>
                  <th className="px-5 py-4">Completed follow-ups</th>
                  <th className="px-5 py-4">Site visits</th>
                  <th className="px-5 py-4">Deals closed</th>
                  <th className="px-5 py-4">Revenue generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {rows.length ? rows.map((row) => (
                  <tr key={row.id} className="text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FAFC]">
                    <td className="px-5 py-4">{row.name}</td>
                    <td className="px-5 py-4">{row.assignedLeads}</td>
                    <td className="px-5 py-4">{row.completedFollowups}</td>
                    <td className="px-5 py-4">{row.siteVisits}</td>
                    <td className="px-5 py-4">{row.dealsClosed}</td>
                    <td className="px-5 py-4">{formatCurrency(row.revenueGenerated)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[#64748B]">No agent activity yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <h3 className="text-sm font-semibold text-[#0F172A]">Revenue by agent</h3>
          <div className="mt-4 h-80">
            {chartRows.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartRows} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
                  <Bar dataKey="revenue" name="Revenue" radius={[10, 10, 0, 0]} fill="#4DA8FF" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center font-semibold text-[#0F172A]">No revenue data</div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

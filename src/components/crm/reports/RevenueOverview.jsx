"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function EmptyState({ label }) {
  return <div className="grid h-full place-items-center rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center font-semibold text-[#0F172A]">{label}</div>;
}

export default function RevenueOverview({ data = {} }) {
  const monthly = data?.monthly || [];
  const cards = data?.cards || [];

  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A]">Revenue Overview</h2>
        <p className="mt-1 text-sm text-[#64748B]">Closed revenue, commission trend, and monthly performance.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <h3 className="text-sm font-semibold text-[#0F172A]">Revenue trend</h3>
          <div className="mt-4 h-72">
            {monthly.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4DA8FF" strokeWidth={3} dot={{ r: 4, fill: "#4DA8FF" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyState label="No revenue trend yet" />}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <h3 className="text-sm font-semibold text-[#0F172A]">Commission trend</h3>
          <div className="mt-4 h-72">
            {monthly.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#E2E8F0" }} />
                  <Bar dataKey="commission" name="Commission" radius={[10, 10, 0, 0]} fill="#A78BFA" />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState label="No commission data yet" />}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.name} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold text-[#0F172A]">{card.name}</p>
            <p className="mt-3 text-2xl font-semibold text-[#2E95F7]">
              <CountUp end={Number(card.revenue || 0)} duration={0.8} formattingFn={formatCurrency} preserveValue />
            </p>
            <p className="mt-2 text-sm font-medium text-[#64748B]">
              {card.deals} closed deals | {formatCurrency(card.commission)} commission
            </p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

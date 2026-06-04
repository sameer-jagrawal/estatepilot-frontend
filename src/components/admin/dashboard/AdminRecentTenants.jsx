"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import AdminDataTable from "../AdminDataTable";
import AdminStatusBadge from "../AdminStatusBadge";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}

export default function AdminRecentTenants({ tenants = [], loading = false }) {
  const columns = [
    { header: "Company", render: (row) => <span className="font-medium">{row?.name || "-"}</span> },
    { header: "Owner", render: (row) => row?.ownerName || "-" },
    { header: "Email", render: (row) => row?.ownerEmail || "-" },
    { header: "Plan", render: (row) => <AdminStatusBadge type="plan" value={row?.plan} /> },
    { header: "Status", render: (row) => <AdminStatusBadge value={row?.status} /> },
    { header: "Created", render: (row) => formatDate(row?.createdAt) },
    {
      header: "Action",
      render: () => (
        <Link
          href="/admin/tenants"
          className="inline-flex items-center gap-2 rounded-md border border-[#DDE5EF] px-3 py-2 text-xs font-medium text-[#2E95F7] transition hover:bg-[#EAF5FF]"
        >
          View Details
          <ExternalLink size={13} />
        </Link>
      ),
    },
  ];

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0B1220]">Recent Tenants</h2>
          <p className="text-sm text-[#667085]">Newest companies created across EstatePilot.</p>
        </div>
        <Link href="/admin/tenants" className="text-sm font-medium text-[#2E95F7] hover:text-[#1C75C9]">
          Go to tenants
        </Link>
      </div>
      <AdminDataTable
        columns={columns}
        data={tenants}
        loading={loading}
        emptyTitle="No tenants yet"
        emptyDescription="New tenant accounts will appear here after onboarding."
      />
    </section>
  );
}

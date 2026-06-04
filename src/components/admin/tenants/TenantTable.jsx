"use client";

import { Eye, PauseCircle, PlayCircle, SlidersHorizontal, Tags } from "lucide-react";
import AdminDataTable from "../AdminDataTable";
import AdminStatusBadge from "../AdminStatusBadge";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}

function ActionButton({ children, onClick, tone = "slate" }) {
  const tones = {
    slate: "text-[#334155] hover:bg-[#F6F8FB]",
    blue: "text-[#2E95F7] hover:bg-[#EAF5FF]",
    green: "text-[#16A34A] hover:bg-[#F0FDF4]",
    red: "text-[#DC2626] hover:bg-[#FEF2F2]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md border border-[#DDE5EF] px-2.5 py-1.5 text-xs font-medium transition ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export default function TenantTable({ tenants = [], loading, onView, onAction, onPlan, onLimits }) {
  const columns = [
    { header: "Company Name", render: (row) => <span className="font-medium">{row?.name || "-"}</span> },
    { header: "Slug", render: (row) => <span className="font-mono text-xs text-[#334155]">{row?.slug || "-"}</span> },
    { header: "Owner Name", render: (row) => row?.ownerName || "-" },
    { header: "Owner Email", render: (row) => row?.ownerEmail || "-" },
    { header: "Owner Phone", render: (row) => row?.ownerPhone || "-" },
    { header: "Plan", render: (row) => <AdminStatusBadge type="plan" value={row?.plan} /> },
    { header: "Status", render: (row) => <AdminStatusBadge value={row?.status} /> },
    { header: "Trial Ends", render: (row) => formatDate(row?.trialEndsAt) },
    { header: "Created Date", render: (row) => formatDate(row?.createdAt) },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex min-w-[360px] flex-wrap gap-2">
          <ActionButton onClick={() => onView(row)}>
            <Eye size={13} />
            View
          </ActionButton>
          <ActionButton onClick={() => onAction(row, "suspend")} tone="red">
            <PauseCircle size={13} />
            Suspend
          </ActionButton>
          <ActionButton onClick={() => onAction(row, "activate")} tone="green">
            <PlayCircle size={13} />
            Activate
          </ActionButton>
          <ActionButton onClick={() => onPlan(row)} tone="blue">
            <Tags size={13} />
            Change Plan
          </ActionButton>
          <ActionButton onClick={() => onLimits(row)} tone="slate">
            <SlidersHorizontal size={13} />
            Limits
          </ActionButton>
        </div>
      ),
    },
  ];

  return (
    <AdminDataTable
      columns={columns}
      data={tenants}
      loading={loading}
      emptyTitle="No tenants match this view"
      emptyDescription="Adjust search, status, or plan filters to widen the result set."
    />
  );
}

"use client";

import { Edit3, PowerOff } from "lucide-react";
import AdminDataTable from "../AdminDataTable";
import AdminStatusBadge from "../AdminStatusBadge";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}

export default function PlanTable({ plans = [], loading, onEdit, onDeactivate }) {
  const columns = [
    { header: "Plan", render: (row) => <AdminStatusBadge type="plan" value={row?.name} /> },
    { header: "Display Name", render: (row) => <span className="font-medium">{row?.displayName || "-"}</span> },
    { header: "Price", render: (row) => `₹${Number(row?.price || 0).toLocaleString("en-IN")}` },
    { header: "Billing", render: (row) => <span className="capitalize">{row?.billingCycle || "-"}</span> },
    { header: "Limits", render: (row) => `${row?.limits?.maxUsers || 0} users / ${row?.limits?.maxLeads || 0} leads / ${row?.limits?.maxProperties || 0} properties` },
    { header: "Popular", render: (row) => (row?.isPopular ? "Yes" : "No") },
    { header: "Active", render: (row) => (row?.isActive ? "Active" : "Inactive") },
    { header: "Updated", render: (row) => formatDate(row?.updatedAt) },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex min-w-[180px] flex-wrap gap-2">
          <button type="button" onClick={() => onEdit(row)} className="inline-flex items-center gap-1.5 rounded-md border border-[#DDE5EF] px-2.5 py-1.5 text-xs font-medium text-[#2E95F7] hover:bg-[#EAF5FF]">
            <Edit3 size={13} />
            Edit
          </button>
          <button type="button" onClick={() => onDeactivate(row)} className="inline-flex items-center gap-1.5 rounded-md border border-[#DDE5EF] px-2.5 py-1.5 text-xs font-medium text-[#DC2626] hover:bg-[#FEF2F2]">
            <PowerOff size={13} />
            Deactivate
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminDataTable
      columns={columns}
      data={plans}
      loading={loading}
      emptyTitle="No plans found"
      emptyDescription="Create or activate plans to manage tenant subscriptions."
    />
  );
}

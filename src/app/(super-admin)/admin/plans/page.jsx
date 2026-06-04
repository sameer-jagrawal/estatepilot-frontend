"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import PlanCardGrid from "@/components/admin/plans/PlanCardGrid";
import PlanFormModal from "@/components/admin/plans/PlanFormModal";
import PlanTable from "@/components/admin/plans/PlanTable";

export default function AdminPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleUnauthorized = useCallback(
    (error) => {
      if (error?.response?.status === 401) {
        router.push("/admin/login");
        return true;
      }
      return false;
    },
    [router]
  );

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("admin/plans", { withCredentials: true });
      setPlans(response?.data?.data || []);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        toast.error(error?.response?.data?.message || "Unable to load plans");
      }
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPlans();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadPlans]);

  const openCreate = () => {
    setEditingPlan(null);
    setModalOpen(true);
  };

  const submitPlan = async (payload) => {
    setSaving(true);
    try {
      if (editingPlan?._id) {
        await api.patch(`admin/plans/${editingPlan._id}`, payload, { withCredentials: true });
        toast.success("Plan updated");
      } else {
        await api.post("admin/plans/create", payload, { withCredentials: true });
        toast.success("Plan created");
      }
      setModalOpen(false);
      setEditingPlan(null);
      await loadPlans();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        toast.error(error?.response?.data?.message || "Plan save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const deactivatePlan = async (plan) => {
    if (!plan?._id) return;

    setSaving(true);
    try {
      await api.delete(`admin/plans/${plan._id}`, { withCredentials: true });
      toast.success("Plan deactivated");
      await loadPlans();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        toast.error(error?.response?.data?.message || "Plan deactivation failed");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-5">
      <header className="flex flex-col gap-4 border border-[#DDE5EF] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#2E95F7]">Subscription Controls</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#0B1220] sm:text-3xl">Plans</h1>
          <p className="mt-2 text-sm text-[#667085]">Create, update, deactivate, and inspect SaaS plan limits.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#2E95F7] px-4 text-sm font-semibold text-white transition hover:bg-[#1C75C9]"
        >
          <Plus size={17} />
          Create Plan
        </button>
      </header>

      <PlanCardGrid plans={plans} />

      <section className="grid gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0B1220]">Plans Table</h2>
          <p className="text-sm text-[#667085]">Detailed operational view of plan pricing, limits, and status.</p>
        </div>
        <PlanTable
          plans={plans}
          loading={loading || saving}
          onEdit={(plan) => {
            setEditingPlan(plan);
            setModalOpen(true);
          }}
          onDeactivate={deactivatePlan}
        />
      </section>

      <PlanFormModal key={editingPlan?._id || "create-plan"} open={modalOpen} plan={editingPlan} loading={saving} onClose={() => setModalOpen(false)} onSubmit={submitPlan} />
    </div>
  );
}

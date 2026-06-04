"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import TenantActionModal from "@/components/admin/tenants/TenantActionModal";
import TenantDetailDrawer from "@/components/admin/tenants/TenantDetailDrawer";
import TenantFilters from "@/components/admin/tenants/TenantFilters";
import TenantLimitsModal from "@/components/admin/tenants/TenantLimitsModal";
import TenantPlanModal from "@/components/admin/tenants/TenantPlanModal";
import TenantTable from "@/components/admin/tenants/TenantTable";

export default function AdminTenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "all", plan: "all" });
  const [actionState, setActionState] = useState({ open: false, tenant: null, action: "suspend" });
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tenantDetail, setTenantDetail] = useState(null);
  const [planTenant, setPlanTenant] = useState(null);
  const [limitsTenant, setLimitsTenant] = useState(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.search.trim()) params.set("search", filters.search.trim());
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.plan !== "all") params.set("plan", filters.plan);
    return params.toString();
  }, [filters]);

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

  const loadTenants = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`admin/tenants${queryString ? `?${queryString}` : ""}`, { withCredentials: true });
      setTenants(response?.data?.data || []);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        toast.error(error?.response?.data?.message || "Unable to load tenants");
      }
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, queryString]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadTenants();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadTenants]);

  const fetchTenantDetail = useCallback(
    async (tenantId) => {
      if (!tenantId) return null;

      setDetailLoading(true);
      try {
        const response = await api.get(`admin/tenants/${tenantId}`, { withCredentials: true });
        const detail = response?.data?.data || null;
        setTenantDetail(detail);
        return detail;
      } catch (error) {
        if (!handleUnauthorized(error)) {
          toast.error(error?.response?.data?.message || "Unable to load tenant details");
        }
        return null;
      } finally {
        setDetailLoading(false);
      }
    },
    [handleUnauthorized]
  );

  const refreshOpenTenantDetail = useCallback(async () => {
    const tenantId = tenantDetail?.tenant?._id;
    if (detailOpen && tenantId) {
      await fetchTenantDetail(tenantId);
    }
  }, [detailOpen, fetchTenantDetail, tenantDetail?.tenant?._id]);

  const viewTenant = async (tenant) => {
    setDetailOpen(true);
    setTenantDetail({ tenant, usersCount: tenant?.usersCount || 0, users: [] });
    await fetchTenantDetail(tenant?._id);
  };

  const openTenantAction = (tenant, action) => {
    if (!tenant?._id) return;
    setActionState({ open: true, tenant, action });
  };

  const openPlanModal = (tenant) => {
    if (!tenant?._id) return;
    setPlanTenant(tenant);
  };

  const openLimitsModal = (tenant) => {
    if (!tenant?._id) return;
    setLimitsTenant(tenant);
  };

  const closeDetailDrawer = () => {
    setDetailOpen(false);
    setTenantDetail(null);
  };

  const confirmAction = async () => {
    const tenantId = actionState?.tenant?._id;
    if (!tenantId) return;

    setSaving(true);
    try {
      await api.patch(`admin/tenants/${tenantId}/${actionState.action}`, {}, { withCredentials: true });
      toast.success(actionState.action === "suspend" ? "Tenant suspended" : "Tenant activated");
      setActionState({ open: false, tenant: null, action: "suspend" });
      await loadTenants();
      await refreshOpenTenantDetail();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        toast.error(error?.response?.data?.message || "Tenant update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const submitPlan = async (payload) => {
    if (!planTenant?._id) return;
    setSaving(true);
    try {
      await api.patch(`admin/tenants/${planTenant._id}/plan`, payload, { withCredentials: true });
      toast.success("Tenant plan updated");
      setPlanTenant(null);
      await loadTenants();
      await refreshOpenTenantDetail();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        toast.error(error?.response?.data?.message || "Plan update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const submitLimits = async (payload) => {
    if (!limitsTenant?._id) return;
    setSaving(true);
    try {
      await api.patch(`admin/tenants/${limitsTenant._id}/limits`, payload, { withCredentials: true });
      toast.success("Tenant limits updated");
      setLimitsTenant(null);
      await loadTenants();
      await refreshOpenTenantDetail();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        toast.error(error?.response?.data?.message || "Limits update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-5">
      <header className="border border-[#DDE5EF] bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#2E95F7]">Tenant Operations</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#0B1220] sm:text-3xl">Tenants</h1>
        <p className="mt-2 text-sm text-[#667085]">Search accounts, manage status, switch plans, and tune usage limits.</p>
      </header>

      <TenantFilters filters={filters} onChange={setFilters} />
      <TenantTable
        tenants={tenants}
        loading={loading}
        onView={viewTenant}
        onAction={openTenantAction}
        onPlan={openPlanModal}
        onLimits={openLimitsModal}
      />

      <TenantDetailDrawer
        open={detailOpen}
        loading={detailLoading}
        detail={tenantDetail}
        onClose={closeDetailDrawer}
        onSuspend={(tenant) => openTenantAction(tenant, "suspend")}
        onActivate={(tenant) => openTenantAction(tenant, "activate")}
        onChangePlan={openPlanModal}
        onUpdateLimits={openLimitsModal}
      />

      <TenantActionModal
        open={actionState.open}
        tenant={actionState.tenant}
        action={actionState.action}
        loading={saving}
        onClose={() => setActionState({ open: false, tenant: null, action: "suspend" })}
        onConfirm={confirmAction}
      />
      <TenantPlanModal key={planTenant?._id || "plan-modal"} open={Boolean(planTenant)} tenant={planTenant} loading={saving} onClose={() => setPlanTenant(null)} onSubmit={submitPlan} />
      <TenantLimitsModal key={limitsTenant?._id || "limits-modal"} open={Boolean(limitsTenant)} tenant={limitsTenant} loading={saving} onClose={() => setLimitsTenant(null)} onSubmit={submitLimits} />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Users, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import ChangePasswordModal from "@/components/crm/users/ChangePasswordModal";
import UserActionModal from "@/components/crm/users/UserActionModal";
import UserFilters from "@/components/crm/users/UserFilters";
import UserFormModal from "@/components/crm/users/UserFormModal";
import UserRoleBadge from "@/components/crm/users/UserRoleBadge";
import UserStatusBadge from "@/components/crm/users/UserStatusBadge";
import UserSummaryCards from "@/components/crm/users/UserSummaryCards";
import UserTable, { UserTableSkeleton, formatDateTime } from "@/components/crm/users/UserTable";

const tabs = [
  { label: "All Users", filters: {} },
  { label: "Active", filters: { isActive: "true" } },
  { label: "Suspended", filters: { isActive: "false" } },
  { label: "Managers", filters: { role: "manager" } },
  { label: "Agents", filters: { role: "agent" } },
];

function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function extractItem(response) {
  return response?.data?.data || response?.data || null;
}

function buildUserQuery({ search, role, isActive }) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (role) params.append("role", role);
  if (isActive) params.append("isActive", isActive);
  const query = params.toString();
  return query ? `users?${query}` : "users";
}

function calculateSummary(usersList) {
  return usersList.reduce(
    (summary, user) => ({
      totalUsers: summary.totalUsers + 1,
      activeUsers: summary.activeUsers + (user?.isActive ? 1 : 0),
      suspendedUsers: summary.suspendedUsers + (!user?.isActive || user?.isSuspended ? 1 : 0),
      managers: summary.managers + (user?.role === "manager" ? 1 : 0),
      agents: summary.agents + (user?.role === "agent" ? 1 : 0),
    }),
    { totalUsers: 0, activeUsers: 0, suspendedUsers: 0, managers: 0, agents: 0 }
  );
}

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth("tenant");
  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [activeTab, setActiveTab] = useState("All Users");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [actionUser, setActionUser] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const tabFilters = useMemo(() => tabs.find((tab) => tab.label === activeTab)?.filters || {}, [activeTab]);
  const effectiveRole = tabFilters.role || role;
  const effectiveIsActive = tabFilters.isActive || isActive;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(buildUserQuery({ search: debouncedSearch, role: effectiveRole, isActive: effectiveIsActive }));
      setUsersList(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch users");
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, effectiveIsActive, effectiveRole]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchUsers]);

  const summary = useMemo(() => calculateSummary(usersList), [usersList]);

  const openCreate = () => {
    setEditingUser(null);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      if (editingUser?._id) {
        await api.patch(`users/${editingUser._id}`, payload);
        toast.success("User updated successfully");
      } else {
        const response = await api.post("users/create", payload);
        const createdUser = extractItem(response);
        toast.success("User created successfully");
        if (createdUser?._id && createdUser?.email) {
          setModalOpen(false);
          router.push(`/users/verify?userId=${createdUser._id}&email=${encodeURIComponent(createdUser.email)}`);
          return;
        }
      }
      setModalOpen(false);
      await fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleView = async (user) => {
    if (!user?._id) return;
    try {
      const response = await api.get(`users/${user._id}`);
      setViewingUser(extractItem(response) || user);
    } catch {
      setViewingUser(user);
    }
  };

  const isCurrentUser = (user) => {
    if (!user) return false;
    return Boolean(
      (currentUser?._id && user?._id === currentUser._id) ||
        (currentUser?.email && user?.email === currentUser.email) ||
        (currentUser?.phone && user?.phone === currentUser.phone)
    );
  };

  const openSuspend = (user) => {
    if (isCurrentUser(user)) {
      toast.error("You cannot suspend your own account");
      return;
    }
    setActionUser(user);
  };

  const handleSuspend = async ({ suspensionReason }) => {
    if (!actionUser?._id) return;
    try {
      setSaving(true);
      await api.patch(`users/${actionUser._id}/suspend`, { suspensionReason });
      toast.success("User suspended successfully");
      setActionUser(null);
      await fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to suspend user");
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (user) => {
    if (!user?._id) return;
    try {
      setSaving(true);
      await api.patch(`users/${user._id}/activate`);
      toast.success("User activated successfully");
      await fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to activate user");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async ({ newPassword }) => {
    if (!passwordUser?._id) return;
    try {
      setSaving(true);
      await api.patch(`users/${passwordUser._id}/change-password`, { newPassword });
      toast.success("Password changed successfully");
      setPasswordUser(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to change password");
    } finally {
      setSaving(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setRole("");
    setIsActive("");
    setActiveTab("All Users");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab.label);
    if (tab.filters.role) setRole("");
    if (tab.filters.isActive) setIsActive("");
  };

  return (
    <div className="grid min-w-0 max-w-full gap-6 overflow-x-hidden">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6 lg:flex-row lg:items-end"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]">
            <Users size={15} />
            Team access control
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Users</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">
            Manage agents, managers, permissions, and account access.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2E95F7] hover:shadow-[0_16px_35px_rgba(77,168,255,0.25)]">
          <Plus size={18} />
          Add User
        </button>
      </motion.section>

      <UserSummaryCards summary={summary} />

      <UserFilters search={search} role={role} isActive={isActive} onSearchChange={setSearch} onRoleChange={setRole} onStatusChange={setIsActive} onReset={resetFilters} />

      <section className="flex flex-wrap gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
        {tabs.map((tab) => (
          <button key={tab.label} type="button" onClick={() => handleTabChange(tab)} className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab.label ? "bg-[#EAF5FF] text-[#2E95F7]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"}`}>
            {tab.label}
          </button>
        ))}
      </section>

      {loading ? (
        <UserTableSkeleton />
      ) : (
        <UserTable users={usersList} onAdd={openCreate} onView={handleView} onEdit={openEdit} onSuspend={openSuspend} onActivate={handleActivate} onChangePassword={setPasswordUser} />
      )}

      <UserFormModal key={modalKey} open={modalOpen} mode={editingUser ? "edit" : "create"} user={editingUser} saving={saving} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      <UserActionModal open={Boolean(actionUser)} user={actionUser} saving={saving} onClose={() => setActionUser(null)} onConfirm={handleSuspend} />
      <ChangePasswordModal open={Boolean(passwordUser)} user={passwordUser} saving={saving} onClose={() => setPasswordUser(null)} onSubmit={handleChangePassword} />
      <UserViewModal user={viewingUser} onClose={() => setViewingUser(null)} />
    </div>
  );
}

function UserViewModal({ user, onClose }) {
  return (
    <AnimatePresence>
      {user ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} className="w-full max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <UserRoleBadge value={user?.role} />
                  <UserStatusBadge user={user} />
                </div>
                <h2 className="mt-4 truncate text-2xl font-semibold text-[#0F172A]">{user?.name || "Unnamed user"}</h2>
                <p className="mt-1 text-sm text-[#64748B]">{user?.email || "No email"} · {user?.phone || "No phone"}</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="Last Login" value={formatDateTime(user?.lastLoginAt)} />
              <Info label="Created Date" value={formatDateTime(user?.createdAt)} />
              <Info label="Verified" value={user?.isVerified ? "Verified" : "Not verified"} />
              <Info label="Permissions" value={user?.permissions?.length ? user.permissions.join(", ") : "No custom permissions"} />
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-[#0F172A]">{value || "-"}</p>
    </div>
  );
}

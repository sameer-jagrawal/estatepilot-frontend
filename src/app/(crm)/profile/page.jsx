"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  ImagePlus,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import ImageCropInput from "@/components/common/ImageCropInput";

const fallbackProfile = {
  name: "User",
  email: "",
  phone: "",
  role: "owner",
  company: "",
  isActive: true,
  isSuspended: false,
  permissions: [],
  createdAt: "",
  updatedAt: "",
  lastLoginAt: "",
};

const roleStyles = {
  owner: "bg-[#F3EEFF] text-[#7C3AED] ring-[#A78BFA]/20",
  manager: "bg-[#EAF5FF] text-[#2E95F7] ring-[#4DA8FF]/20",
  agent: "bg-[#DCFCE7] text-[#16A34A] ring-[#22C55E]/20",
};

const statusStyles = {
  active: "bg-[#DCFCE7] text-[#16A34A] ring-[#22C55E]/20",
  suspended: "bg-[#FEE2E2] text-[#DC2626] ring-[#EF4444]/20",
  inactive: "bg-[#FEF3C7] text-[#D97706] ring-[#F59E0B]/20",
};

const cardMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28 },
};

function unwrapPayload(response) {
  return response?.data?.data || response?.data?.user || response?.data || null;
}

function getUserId(user) {
  return user?._id || user?.id || user?.userId || user?.data?._id || user?.data?.id || "";
}

function getTenantName(user) {
  return (
    user?.tenantId?.name ||
    user?.tenant?.name ||
    user?.companyName ||
    user?.company ||
    user?.tenantName ||
    "Not available"
  );
}

function getStatus(user) {
  if (user?.isSuspended) return "suspended";
  if (user?.isActive === false) return "inactive";
  if (user?.status) return String(user.status).toLowerCase();
  return "active";
}

function titleCase(value) {
  if (!value) return "Not available";
  return String(value).replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value, includeTime = false) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function normalizeUser(rawUser, authUser) {
  const source = rawUser || {};
  const merged = {
    ...fallbackProfile,
    ...authUser,
    ...source,
  };

  return {
    ...merged,
    email: merged?.email || "Not available",
    phone: merged?.phone || "Not available",
    role: merged?.role || "agent",
    permissions: Array.isArray(merged?.permissions) ? merged.permissions : fallbackProfile.permissions,
  };
}

function Badge({ value, styles }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${styles}`}>
      {titleCase(value)}
    </span>
  );
}

function SectionCard({ icon: Icon, title, subtitle, action, children, className = "" }) {
  return (
    <motion.section
      {...cardMotion}
      className={`rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6 ${className}`}
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
            <Icon size={21} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p> : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
        {Icon ? <Icon size={15} /> : null}
        {label}
      </div>
      <p className="mt-2 break-words text-sm font-semibold text-[#0F172A]">{value || "Not available"}</p>
    </div>
  );
}

function TextInput({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#0F172A]">
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#4DA8FF]/15"
      />
    </label>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="h-56 animate-pulse rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]" />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-72 animate-pulse rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onRetry }) {
  return (
    <motion.div {...cardMotion} className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
        <UserRound size={24} />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">Profile information is unavailable</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B]">
        EstatePilot could not load account details from the API. You can retry after the connection is available.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#4DA8FF] px-5 text-sm font-semibold text-white transition hover:bg-[#2E95F7]"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </motion.div>
  );
}

function ChangePasswordModal({ open, saving, onClose, onSubmit }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password must match");
      return;
    }

    onSubmit({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    });
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/35 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-xl rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
                  <KeyRound size={21} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A]">Change Password</h2>
                  <p className="mt-1 text-sm text-[#64748B]">Update your account security credentials.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <TextInput
                label="Current Password"
                type={showPasswords ? "text" : "password"}
                value={form.currentPassword}
                onChange={(value) => updateField("currentPassword", value)}
              />
              <TextInput
                label="New Password"
                type={showPasswords ? "text" : "password"}
                value={form.newPassword}
                onChange={(value) => updateField("newPassword", value)}
              />
              <TextInput
                label="Confirm Password"
                type={showPasswords ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(value) => updateField("confirmPassword", value)}
              />
              <label className="flex items-center gap-2 text-sm font-semibold text-[#64748B]">
                <input type="checkbox" checked={showPasswords} onChange={(event) => setShowPasswords(event.target.checked)} className="h-4 w-4 accent-[#4DA8FF]" />
                Show passwords
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="h-12 rounded-2xl border border-[#E2E8F0] px-5 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white transition hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <KeyRound size={16} />}
                {saving ? "Changing..." : "Change Password"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", profileImage: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const authUserId = getUserId(authUser);
  const stableAuthUser = useMemo(
    () => ({
      _id: authUserId,
      name: authUser?.name,
      email: authUser?.email,
      phone: authUser?.phone,
      role: authUser?.role,
      company: authUser?.company,
    }),
    [authUserId, authUser?.company, authUser?.email, authUser?.name, authUser?.phone, authUser?.role]
  );
  const normalizedProfile = useMemo(() => normalizeUser(profile, stableAuthUser), [profile, stableAuthUser]);
  const userId = getUserId(normalizedProfile);
  const status = getStatus(normalizedProfile);
  const tenantName = getTenantName(normalizedProfile);

  const syncForm = useCallback((user) => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      profileImage: user?.profileImage || "",
    });
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let loadedUser = null;

      try {
        const meResponse = await api.get("auth/me");
        loadedUser = unwrapPayload(meResponse);
      } catch {
        loadedUser = null;
      }

      const id = getUserId(loadedUser || stableAuthUser);

      if (id) {
        try {
          const userResponse = await api.get(`users/${id}`);
          loadedUser = unwrapPayload(userResponse) || loadedUser;
        } catch {
          loadedUser = loadedUser || null;
        }
      }

      if (!loadedUser) {
        try {
          const usersResponse = await api.get("users");
          const payload = unwrapPayload(usersResponse);
          const users = Array.isArray(payload) ? payload : payload?.users || [];
          loadedUser = users.find((item) => item?.email && item.email === stableAuthUser?.email) || users[0] || null;
        } catch {
          loadedUser = null;
        }
      }

      const nextProfile = normalizeUser(loadedUser, stableAuthUser);
      setProfile(nextProfile);
      syncForm(nextProfile);

      if (!loadedUser) {
        setError("Profile API data is not available yet.");
      }
    } catch (loadError) {
      const nextProfile = normalizeUser(null, stableAuthUser);
      setProfile(nextProfile);
      syncForm(nextProfile);
      setError(loadError?.response?.data?.message || "Unable to load profile details.");
    } finally {
      setLoading(false);
    }
  }, [stableAuthUser, syncForm]);

  useEffect(() => {
    Promise.resolve().then(loadProfile);
  }, [loadProfile]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCancelEdit = () => {
    syncForm(normalizedProfile);
    setIsEditing(false);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Phone is required");
      return;
    }

    setSaving(true);

    try {
      if (!userId) {
        throw new Error("User ID is not available for this profile");
      }

      const response = await api.patch(`users/${userId}`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        profileImage: form.profileImage,
      });
      const updatedProfile = normalizeUser(unwrapPayload(response), stableAuthUser);

      setProfile(updatedProfile);
      syncForm(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (saveError) {
      toast.error(saveError?.response?.data?.message || saveError?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (payload) => {
    setPasswordSaving(true);

    try {
      if (!userId) {
        throw new Error("User ID is not available for this profile");
      }

      await api.patch(`users/${userId}/change-password`, payload);
      toast.success("Password changed successfully");
      setPasswordModalOpen(false);
    } catch (passwordError) {
      toast.error(passwordError?.response?.data?.message || passwordError?.message || "Unable to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7">
            <div className="h-9 w-48 animate-pulse rounded-xl bg-[#E2E8F0]" />
            <div className="mt-3 h-5 w-full max-w-lg animate-pulse rounded-xl bg-[#E2E8F0]" />
          </div>
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  if (!normalizedProfile) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <EmptyState onRetry={loadProfile} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div {...cardMotion} className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">My Profile</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B] sm:text-base">
              Manage your personal information, account details, and security settings.
            </p>
          </div>
          {error ? (
            <button
              type="button"
              onClick={loadProfile}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#64748B] transition hover:border-[#4DA8FF] hover:text-[#2E95F7]"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          ) : null}
        </motion.div>

        {error ? (
          <motion.div
            {...cardMotion}
            className="mb-6 rounded-2xl border border-[#FEF3C7] bg-[#FFFBEB] p-4 text-sm font-semibold text-[#92400E]"
          >
            {error}
          </motion.div>
        ) : null}

        <motion.section
          {...cardMotion}
          className="mb-6 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)]"
        >
          <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full bg-[#EAF5FF] text-3xl font-semibold text-[#2E95F7] ring-8 ring-white">
                  {normalizedProfile?.profileImage ? (
                    <img
                      src={normalizedProfile.profileImage}
                      alt={normalizedProfile?.name || "Profile"}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserRound size={38} />
                  )}
                  <span className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-full bg-white text-[#A78BFA] shadow-[0_12px_30px_rgba(15,23,42,0.14)]">
                    <ImagePlus size={18} />
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold text-[#0F172A]">{normalizedProfile?.name || "EstatePilot User"}</h2>
                    <Badge value={normalizedProfile?.role} styles={roleStyles[normalizedProfile?.role] || roleStyles.agent} />
                    <Badge value={status} styles={statusStyles[status] || statusStyles.inactive} />
                  </div>
                  <div className="mt-3 flex flex-col gap-2 text-sm text-[#64748B] sm:flex-row sm:flex-wrap sm:items-center">
                    <span className="inline-flex items-center gap-2">
                      <Mail size={16} />
                      {normalizedProfile?.email || "Not available"}
                    </span>
                    <span className="hidden text-[#CBD5E1] sm:inline">|</span>
                    <span className="inline-flex items-center gap-2">
                      <Phone size={16} />
                      {normalizedProfile?.phone || "Not available"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[380px]">
                <InfoItem icon={Clock3} label="Last Login" value={formatDate(normalizedProfile?.lastLoginAt, true)} />
                <InfoItem icon={CalendarDays} label="Joined Date" value={formatDate(normalizedProfile?.createdAt)} />
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="grid gap-6">
            <SectionCard
              icon={UserRound}
              title="Personal Information"
              subtitle="Keep your public profile and contact details accurate."
              action={
                isEditing ? null : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] transition hover:border-[#4DA8FF] hover:bg-[#EAF5FF]"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                )
              }
            >
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="grid gap-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput label="Name" value={form.name} onChange={(value) => updateForm("name", value)} />
                    <TextInput label="Email" type="email" value={form.email} onChange={(value) => updateForm("email", value)} />
                    <TextInput label="Phone" value={form.phone} onChange={(value) => updateForm("phone", value)} />
                  </div>

                  <ImageCropInput
                    label="Profile image"
                    value={form.profileImage}
                    onChange={(value) => updateForm("profileImage", value)}
                    aspect={1}
                    outputWidth={512}
                    optionalText="Optional"
                    variant="circle"
                  />

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="h-12 rounded-2xl border border-[#E2E8F0] px-5 text-sm text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#4DA8FF] px-5 text-sm font-semibold text-white transition hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoItem icon={UserRound} label="Name" value={normalizedProfile?.name} />
                  <InfoItem icon={Mail} label="Email" value={normalizedProfile?.email} />
                  <InfoItem icon={Phone} label="Phone" value={normalizedProfile?.phone} />
                  <InfoItem icon={ImagePlus} label="Profile Image" value={normalizedProfile?.profileImage ? "Image connected" : "Placeholder"} />
                </div>
              )}
            </SectionCard>

            <SectionCard icon={Building2} title="Account Details" subtitle="Your organization identity and access profile.">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem icon={ShieldCheck} label="Role" value={titleCase(normalizedProfile?.role)} />
                <InfoItem icon={Building2} label="Company" value={tenantName} />
                <InfoItem icon={UserRound} label="User ID" value={userId || "Not available"} />
                <InfoItem icon={CalendarDays} label="Created Date" value={formatDate(normalizedProfile?.createdAt, true)} />
                <InfoItem icon={Clock3} label="Updated Date" value={formatDate(normalizedProfile?.updatedAt, true)} />
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 md:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    <CheckCircle2 size={15} />
                    Permissions
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {normalizedProfile?.permissions?.length ? (
                      normalizedProfile.permissions.map((permission) => (
                        <span key={permission} className="rounded-full bg-white px-3 py-1 text-xs text-[#64748B] ring-1 ring-[#E2E8F0]">
                          {titleCase(permission)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[#64748B]">No permissions assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-6 content-start">
            <SectionCard icon={LockKeyhole} title="Security" subtitle="Control access to your EstatePilot account.">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Password</p>
                    <p className="mt-1 font-semibold tracking-[0.3em] text-[#64748B]">••••••••••</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(true)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#4DA8FF] px-4 text-sm font-semibold text-white transition hover:bg-[#2E95F7]"
                  >
                    <KeyRound size={16} />
                    Change Password
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={Bell} title="Preferences" subtitle="Placeholder settings for upcoming account controls.">
              <div className="grid gap-3">
                {[
                  { icon: Bell, label: "Notification preferences", value: "Coming soon" },
                  { icon: Mail, label: "Email alerts", value: "Coming soon" },
                  { icon: MessageCircle, label: "WhatsApp alerts", value: "Coming soon" },
                  { icon: Clock3, label: "Timezone", value: "Asia/Calcutta" },
                ].map((preference) => (
                  <div
                    key={preference.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#2E95F7]">
                        <preference.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{preference.label}</p>
                        <p className="mt-1 text-xs text-[#64748B]">{preference.value}</p>
                      </div>
                    </div>
                    <span className="h-6 w-11 rounded-full bg-[#E2E8F0] p-1">
                      <span className="block h-4 w-4 rounded-full bg-white shadow-sm" />
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {passwordModalOpen ? (
        <ChangePasswordModal
          open={passwordModalOpen}
          saving={passwordSaving}
          onClose={() => setPasswordModalOpen(false)}
          onSubmit={handleChangePassword}
        />
      ) : null}
    </main>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  PauseCircle,
  Phone,
  PlayCircle,
  SlidersHorizontal,
  Tags,
  Users,
  X,
} from "lucide-react";
import AdminStatusBadge from "../AdminStatusBadge";

function formatDate(value, withTime = false) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: withTime ? "short" : undefined,
  }).format(new Date(value));
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "U") + (parts[1]?.[0] || "");
}

function Field({ label, value }) {
  return (
    <div className="border border-[#DDE5EF] bg-[#F6F8FB] p-3">
      <p className="text-xs font-medium uppercase tracking-[0.05em] text-[#667085]">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-[#0B1220]">{value || "-"}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="border border-[#DDE5EF] bg-white">
      <div className="border-b border-[#DDE5EF] px-4 py-3">
        <h3 className="text-sm font-semibold text-[#0B1220]">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function BoolBadge({ active, trueText, falseText, trueTone = "green", falseTone = "amber" }) {
  const tone = active ? trueTone : falseTone;
  const classes = {
    green: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
    amber: "border-[#FED7AA] bg-[#FFF7ED] text-[#B45309]",
    red: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${classes[tone]}`}>
      {active ? trueText : falseText}
    </span>
  );
}

function RoleBadge({ role }) {
  const styles = {
    owner: "border-[#DDD6FE] bg-[#F5F3FF] text-[#7C3AED]",
    manager: "border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]",
    agent: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${styles[role] || styles.agent}`}>
      {role || "agent"}
    </span>
  );
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
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#DDE5EF] bg-white px-3 text-xs font-medium transition ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function DrawerSkeleton() {
  return (
    <div className="grid gap-4 p-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="border border-[#DDE5EF] bg-white p-4">
          <div className="h-4 w-36 animate-pulse bg-[#E5EBF3]" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="h-16 animate-pulse bg-[#F1F5F9]" />
            <div className="h-16 animate-pulse bg-[#F1F5F9]" />
            <div className="h-16 animate-pulse bg-[#F1F5F9]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function UsageBar({ used = 0, max = 0 }) {
  const percent = max > 0 ? Math.min((used / max) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#667085]">
        <span>Users used</span>
        <span>
          {used} / {max || 0}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#E5EBF3]">
        <div className="h-full rounded-full bg-[#2E95F7]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function UsersTable({ users = [] }) {
  if (!users.length) {
    return (
      <div className="border border-dashed border-[#DDE5EF] bg-[#F6F8FB] p-8 text-center">
        <Users className="mx-auto text-[#667085]" size={24} />
        <p className="mt-3 text-sm font-medium text-[#0B1220]">No users found for this tenant.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-[#F6F8FB] text-xs uppercase tracking-[0.05em] text-[#667085]">
            <tr>
              {["Name", "Email", "Phone", "Role", "Active Status", "Suspended Status", "Verified Status", "Last Login", "Created Date"].map((column) => (
                <th key={column} className="border-b border-[#DDE5EF] px-3 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user?._id} className="border-b border-[#DDE5EF] last:border-b-0">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#EAF5FF] text-xs font-semibold text-[#2E95F7]">
                      {initials(user?.name)}
                    </span>
                    <span className="font-medium text-[#0B1220]">{user?.name || "-"}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-[#334155]">{user?.email || "-"}</td>
                <td className="px-3 py-3 text-[#334155]">{user?.phone || "-"}</td>
                <td className="px-3 py-3"><RoleBadge role={user?.role} /></td>
                <td className="px-3 py-3"><BoolBadge active={user?.isActive} trueText="active" falseText="inactive" /></td>
                <td className="px-3 py-3"><BoolBadge active={user?.isSuspended} trueText="suspended" falseText="not suspended" trueTone="red" falseTone="green" /></td>
                <td className="px-3 py-3"><BoolBadge active={user?.isVerified} trueText="verified" falseText="not verified" /></td>
                <td className="px-3 py-3 text-[#334155]">{formatDate(user?.lastLoginAt, true)}</td>
                <td className="px-3 py-3 text-[#334155]">{formatDate(user?.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {users.map((user) => (
          <article key={user?._id} className="border border-[#DDE5EF] bg-[#F6F8FB] p-3">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#EAF5FF] text-sm font-semibold text-[#2E95F7]">
                {initials(user?.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#0B1220]">{user?.name || "-"}</p>
                <p className="truncate text-sm text-[#667085]">{user?.email || "-"}</p>
                <p className="text-sm text-[#667085]">{user?.phone || "-"}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <RoleBadge role={user?.role} />
              <BoolBadge active={user?.isActive} trueText="active" falseText="inactive" />
              <BoolBadge active={user?.isSuspended} trueText="suspended" falseText="not suspended" trueTone="red" falseTone="green" />
              <BoolBadge active={user?.isVerified} trueText="verified" falseText="not verified" />
            </div>
            <div className="mt-3 grid gap-2 text-xs text-[#667085]">
              <span>Last login: {formatDate(user?.lastLoginAt, true)}</span>
              <span>Created: {formatDate(user?.createdAt)}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default function TenantDetailDrawer({
  open,
  loading,
  detail,
  onClose,
  onSuspend,
  onActivate,
  onChangePlan,
  onUpdateLimits,
}) {
  const tenant = detail?.tenant;
  const users = detail?.users || [];
  const maxUsers = tenant?.limits?.maxUsers || 0;

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close tenant details"
            className="absolute inset-0 bg-[#0B1220]/35"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-[#DDE5EF] bg-[#F6F8FB] md:max-w-4xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <header className="border-b border-[#DDE5EF] bg-white px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#2E95F7]">Tenant Detail</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-xl font-semibold text-[#0B1220]">{tenant?.name || "Tenant details"}</h2>
                    {tenant?.status ? <AdminStatusBadge value={tenant?.status} /> : null}
                    {tenant?.plan ? <AdminStatusBadge type="plan" value={tenant?.plan} /> : null}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[#DDE5EF] text-[#334155] transition hover:bg-[#F6F8FB]"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton onClick={() => onSuspend?.(tenant)} tone="red">
                  <PauseCircle size={14} />
                  Suspend Tenant
                </ActionButton>
                <ActionButton onClick={() => onActivate?.(tenant)} tone="green">
                  <PlayCircle size={14} />
                  Activate Tenant
                </ActionButton>
                <ActionButton onClick={() => onChangePlan?.(tenant)} tone="blue">
                  <Tags size={14} />
                  Change Plan
                </ActionButton>
                <ActionButton onClick={() => onUpdateLimits?.(tenant)}>
                  <SlidersHorizontal size={14} />
                  Update Limits
                </ActionButton>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading ? (
                <DrawerSkeleton />
              ) : (
                <div className="grid gap-4 p-4 sm:p-5">
                  <Section title="Company Overview">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <Field label="Company Name" value={tenant?.name} />
                      <Field label="Slug" value={tenant?.slug} />
                      <Field label="Business Type" value={tenant?.businessType} />
                      <Field label="City" value={tenant?.city} />
                      <Field label="Address" value={tenant?.address} />
                      <Field label="Created Date" value={formatDate(tenant?.createdAt)} />
                      <Field label="Updated Date" value={formatDate(tenant?.updatedAt)} />
                    </div>
                  </Section>

                  <Section title="Owner Information">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Owner Name" value={tenant?.ownerName} />
                      <Field label="Owner Email" value={tenant?.ownerEmail} />
                      <Field label="Owner Phone" value={tenant?.ownerPhone} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-[#667085]">
                      <span className="inline-flex items-center gap-2"><Mail size={14} /> {tenant?.ownerEmail || "-"}</span>
                      <span className="inline-flex items-center gap-2"><Phone size={14} /> {tenant?.ownerPhone || "-"}</span>
                      <span className="inline-flex items-center gap-2"><MapPin size={14} /> {tenant?.city || "-"}</span>
                    </div>
                  </Section>

                  <Section title="Plan & Limits">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <Field label="Current Plan" value={tenant?.plan} />
                      <Field label="Status" value={tenant?.status} />
                      <Field label="Trial Ends At" value={formatDate(tenant?.trialEndsAt)} />
                      <Field label="Max Users" value={tenant?.limits?.maxUsers} />
                      <Field label="Max Leads" value={tenant?.limits?.maxLeads} />
                      <Field label="Max Properties" value={tenant?.limits?.maxProperties} />
                    </div>
                    <div className="mt-4 grid gap-4 border-t border-[#DDE5EF] pt-4 md:grid-cols-3">
                      <UsageBar used={detail?.usersCount ?? users.length} max={maxUsers} />
                      <div className="rounded-md border border-[#DDE5EF] bg-[#F6F8FB] p-3 text-sm text-[#667085]">
                        Leads usage: not returned by API
                      </div>
                      <div className="rounded-md border border-[#DDE5EF] bg-[#F6F8FB] p-3 text-sm text-[#667085]">
                        Properties usage: not returned by API
                      </div>
                    </div>
                  </Section>

                  <Section title={`Tenant Users (${detail?.usersCount ?? users.length})`}>
                    <UsersTable users={users} />
                  </Section>
                </div>
              )}
            </div>

            <footer className="border-t border-[#DDE5EF] bg-white px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#667085]">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={15} />
                  Created {formatDate(tenant?.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#16A34A]" />
                  {detail?.usersCount ?? users.length} users loaded
                </span>
              </div>
            </footer>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { Building2, Edit3, Save, X } from "lucide-react";
import { generateSlug } from "@/lib/slug";
import ImageCropInput from "@/components/common/ImageCropInput";

const businessTypes = ["broker", "builder", "agency", "developer"];
const fields = [
  ["companyName", "Company Name"],
  ["ownerName", "Owner Name"],
  ["ownerEmail", "Owner Email"],
  ["ownerPhone", "Owner Phone"],
  ["businessType", "Business Type"],
  ["city", "City"],
  ["address", "Address"],
];

function Skeleton() {
  return <div className="h-12 animate-pulse rounded-2xl bg-[#F1F5F9]" />;
}

function Field({ field, label, value, editing, onChange }) {
  if (editing && field === "businessType") {
    return (
      <label className="grid gap-2 text-sm font-medium text-[#0F172A]">
        {label}
        <select value={value || ""} onChange={(event) => onChange(field, event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]">
          {businessTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="grid gap-2 text-sm font-medium text-[#0F172A]">
      {label}
      {editing ? (
        <input value={value || ""} onChange={(event) => onChange(field, event.target.value)} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]" />
      ) : (
        <div className="flex min-h-12 items-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A]">
          {value || "Not set"}
        </div>
      )}
    </label>
  );
}

export default function CompanySettings({ tenant, loading, saving, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(tenant || {});
  const visibleData = editing ? form : tenant || {};

  const updateField = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "companyName") {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };

  const handleSave = async () => {
    const saved = await onSave({
      ...form,
      slug: generateSlug(form.companyName || form.name || ""),
    });
    if (saved) setEditing(false);
  };

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
            <Building2 size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#0F172A]">Company Profile</h2>
            <p className="mt-1 text-sm text-[#64748B]">Keep your EstatePilot workspace identity accurate.</p>
          </div>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button type="button" onClick={() => { setForm(tenant || {}); setEditing(false); }} disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#E2E8F0] px-4 text-sm text-[#64748B] hover:bg-[#F8FAFC]">
              <X size={16} /> Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#4DA8FF] px-4 text-sm font-semibold text-white hover:bg-[#2E95F7] disabled:opacity-60">
              <Save size={16} /> {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => { setForm(tenant || {}); setEditing(true); }} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#4DA8FF] px-4 text-sm font-semibold text-white hover:bg-[#2E95F7]">
            <Edit3 size={16} /> Edit
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
        {editing ? (
          <ImageCropInput
            label="Company logo"
            value={form?.logo || ""}
            onChange={(value) => updateField("logo", value)}
            aspect={1}
            outputWidth={512}
            optionalText="Optional"
          />
        ) : (
          <div className="flex h-40 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#A78BFA] bg-[#F8FAFC] text-center">
            {visibleData?.logo ? (
              <span className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${visibleData.logo})` }} aria-label="Company logo" />
            ) : (
              <>
                <Building2 className="text-[#A78BFA]" size={28} />
                <p className="mt-2 text-sm font-semibold text-[#0F172A]">Company logo</p>
                <p className="text-xs text-[#64748B]">No logo uploaded</p>
              </>
            )}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([field, label]) =>
            loading ? <Skeleton key={field} /> : <Field key={field} field={field} label={label} value={visibleData?.[field]} editing={editing} onChange={updateField} />
          )}
        </div>
      </div>
    </section>
  );
}

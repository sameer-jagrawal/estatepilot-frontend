"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader from "@/components/common/Loader";

export default function AuthForm({
  title,
  subtitle,
  fields,
  buttonLabel,
  footerText,
  footerHref,
  footerLabel,
  onSubmit,
  size = "sm",
}) {
  const normalizedFields = fields.map((field) => ({
    ...field,
    name: field.name || field.id,
  }));

  const initialState = fields.reduce((acc, field) => {
    acc[field.name || field.id] = field.defaultValue || "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const widthClass = size === "md" ? "auth-card-md" : "auth-card-sm";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await onSubmit?.(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#F8FAFC] p-4">
      <section className={`auth-card ${widthClass} rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xl sm:p-8`}>
        <Link href="/" className="mb-8 inline-flex items-center gap-3 font-medium">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
            EP
          </span>
          EstatePilot
        </Link>

        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-3 text-[#64748B]">{subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          {normalizedFields.map((field) => (
            <Input
              key={field.id}
              {...field}
              value={formData[field.name]}
              onChange={handleChange}
            />
          ))}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? <Loader label="Please wait" className="text-white" spinnerClassName="border-white/40 border-t-white" /> : buttonLabel}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748B]">
          {footerText}{" "}
          <Link href={footerHref} className="font-semibold text-[#2E95F7]">
            {footerLabel}
          </Link>
        </p>
      </section>
    </main>
  );
}

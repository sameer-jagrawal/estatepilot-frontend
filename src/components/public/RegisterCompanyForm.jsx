"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader from "@/components/common/Loader";
import api from "@/lib/axios";
import { generateSlug } from "@/lib/slug";
import { useState } from "react";

const initialForm = {
  companyName: "",
  slug: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  password: "",
};

const fields = [
  { id: "companyName", name: "companyName", type: "text", placeholder: "Company Name" },
  { id: "ownerName", name: "ownerName", type: "text", placeholder: "Owner Name" },
  { id: "ownerEmail", name: "ownerEmail", type: "email", placeholder: "Owner Email" },
  { id: "ownerPhone", name: "ownerPhone", type: "text", placeholder: "Owner Phone" },
  { id: "password", name: "password", type: "password", placeholder: "Password" },
];

export default function RegisterCompanyForm({ compact = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => {
      const next = { ...current, [name]: value };
      if (name === "companyName") {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const payload = {
        ...formData,
        slug: generateSlug(formData.companyName),
      };
      const response = await api.post("tenant/register", payload);

      toast.success(response?.data?.message || "Company registered successfully");
      router.push(`/verify-otp?email=${payload.ownerEmail}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28, scale: 0.94, rotate: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`register-company-card w-full ${compact ? "max-w-[430px] p-4 sm:p-5" : "max-w-xl p-6 sm:p-8"}`}
    >
      <div className={compact ? "mb-5" : "mb-8"}>
        {!compact ? (
          <Link href="/" className="mb-8 inline-flex items-center gap-3 font-medium">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
              EP
            </span>
            EstatePilot
          </Link>
        ) : null}

        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2E95F7]">Start your workspace</p>
        <h2 className={`text-gradient-primary ${compact ? "mt-2 text-xl" : "mt-3 text-3xl"} font-semibold`}>
          Create Company Account
        </h2>
        <p className={`${compact ? "mt-2 text-sm leading-6" : "mt-3"} text-[#64748B]`}>
          Register your company and start managing leads, properties, and follow-ups.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`grid ${compact ? "gap-3" : "gap-4"}`}>
        {fields.map((field) => (
          <Input
            key={field.id}
            {...field}
            value={formData[field.name]}
            onChange={handleChange}
            className={compact ? "h-11 rounded-[1.35rem] text-sm" : ""}
          />
        ))}

        <Button type="submit" disabled={loading} className={`${compact ? "mt-1 rounded-[1.5rem] py-3" : "mt-2"} w-full`}>
          {loading ? <Loader label="Please wait" className="text-white" spinnerClassName="border-white/40 border-t-white" /> : "Register Company"}
        </Button>
      </form>

      <p className={`${compact ? "mt-4" : "mt-6"} text-center text-sm text-[#64748B]`}>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#2E95F7]">
          Login
        </Link>
      </p>
    </motion.section>
  );
}

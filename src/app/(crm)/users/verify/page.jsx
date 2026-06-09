"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Mail, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

function VerifyUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const formattedEmail = useMemo(() => decodeURIComponent(email), [email]);

  const handleOtpChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const verifyOtp = async (event) => {
    event.preventDefault();

    if (!userId) {
      toast.error("Verification link is missing the user id");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter the 6 digit OTP");
      return;
    }

    try {
      setVerifying(true);
      const response = await api.post(`users/${userId}/verify-otp`, { otp });
      toast.success(response?.data?.message || "User verified successfully");
      router.push("/users");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to verify OTP");
    } finally {
      setVerifying(false);
    }
  };

  const resendOtp = async () => {
    if (!userId) {
      toast.error("Verification link is missing the user id");
      return;
    }

    try {
      setResending(true);
      const response = await api.post(`users/${userId}/send-verification-otp`);
      toast.success(response?.data?.message || "OTP sent successfully");
      setOtp("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#BBDFFF] bg-[#EAF5FF] text-[#2E95F7]">
            <ShieldCheck size={22} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-[#0F172A] sm:text-3xl">Verify user email</h1>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Enter the 6 digit OTP sent to the created user&apos;s inbox before they sign in.
            </p>
          </div>
        </div>

        <div className="mt-6 flex min-w-0 items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <Mail className="shrink-0 text-[#2E95F7]" size={20} />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Created user email</p>
            <p className="mt-1 break-words text-sm font-semibold text-[#0F172A]">{formattedEmail || "Email not available"}</p>
          </div>
        </div>

        <form onSubmit={verifyOtp} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-[#0F172A]">
            OTP
            <input
              value={otp}
              onChange={handleOtpChange}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              className="h-14 rounded-2xl border border-[#E2E8F0] px-4 text-center text-2xl font-bold tracking-[0.45em] text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:ring-4 focus:ring-[#EAF5FF]"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={resendOtp} disabled={resending || verifying} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] px-5 text-sm font-semibold text-[#64748B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60">
              <RotateCcw size={17} />
              {resending ? "Sending..." : "Resend OTP"}
            </button>
            <button type="submit" disabled={verifying || otp.length !== 6} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white transition hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60">
              <CheckCircle2 size={18} />
              {verifying ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function VerifyCreatedUserPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-sm font-semibold text-[#64748B]">Loading verification...</div>}>
      <VerifyUserForm />
    </Suspense>
  );
}

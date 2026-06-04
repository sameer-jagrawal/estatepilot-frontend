"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AuthForm from "@/components/common/AuthForm";
import api from "@/lib/axios";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const fields = [
    {
      id: "otp",
      name: "otp",
      type: "text",
      placeholder: "Enter OTP",
    },
  ];

  const handleVerifyOtp = async (formData) => {
    try {
      const response = await api.post("tenant/verify-otp", {
        email,
        otp: formData.otp,
      });

      toast.success(response?.data?.message || "OTP verified successfully");

      router.push("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <AuthForm
      title="Verify OTP"
      subtitle={`OTP has been sent to ${email}`}
      fields={fields}
      buttonLabel="Verify OTP"
      footerText="Wrong email?"
      footerHref="/register-company"
      footerLabel="Register again"
      onSubmit={handleVerifyOtp}
    />
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <AuthForm
          title="Verify OTP"
          subtitle="Preparing your verification screen."
          fields={[{ id: "otp", name: "otp", type: "text", placeholder: "Enter OTP" }]}
          buttonLabel="Verify OTP"
          footerText="Wrong email?"
          footerHref="/register-company"
          footerLabel="Register again"
          onSubmit={async () => {}}
        />
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}

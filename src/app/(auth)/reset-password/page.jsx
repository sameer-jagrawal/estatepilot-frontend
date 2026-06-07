"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AuthForm from "@/components/common/AuthForm";
import api from "@/lib/axios";

const resetFields = [
  { id: "password", label: "New Password", type: "password", placeholder: "New password" },
  { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm password" },
];

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (formData) => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      toast.error("Reset link is invalid or incomplete");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("auth/reset-password", {
        ...formData,
        token,
        email,
      });

      toast.success(response?.data?.message || "Password reset successfully");
      router.push("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to reset password");
    }
  };

  return (
    <AuthForm
      title="Reset password"
      subtitle="Choose a new password for your workspace."
      buttonLabel="Reset Password"
      fields={resetFields}
      footerText="Back to"
      footerHref="/login"
      footerLabel="Login"
      onSubmit={handleSubmit}
    />
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthForm
          title="Reset password"
          subtitle="Choose a new password for your workspace."
          buttonLabel="Reset Password"
          fields={resetFields}
          footerText="Back to"
          footerHref="/login"
          footerLabel="Login"
          onSubmit={async () => {}}
        />
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

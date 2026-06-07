"use client";

import { toast } from "sonner";
import AuthForm from "@/components/common/AuthForm";
import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const handleSubmit = async (formData) => {
    try {
      const response = await api.post("auth/forgot-password", formData);
      toast.success(response?.data?.message || "Reset link sent");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to send reset link");
    }
  };

  return (
    <AuthForm
      title="Forgot password"
      subtitle="Request a secure reset link for your EstatePilot account."
      buttonLabel="Send Reset Link"
      fields={[{ id: "email", label: "Email", type: "email", placeholder: "you@company.com" }]}
      footerText="Remembered it?"
      footerHref="/login"
      footerLabel="Login"
      onSubmit={handleSubmit}
    />
  );
}

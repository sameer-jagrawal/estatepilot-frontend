"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AuthForm from "@/components/common/AuthForm";
import api from "@/lib/axios";

const fields = [
  { id: "email", name: "email", type: "email", placeholder: "Email" },
  { id: "password", name: "password", type: "password", placeholder: "Password" },
];

function LoginForm() {
  const searchParams = useSearchParams();

  const handleLogin = async (formData) => {
    try {
      const response = await api.post("auth/login", formData, {
        baseURL: "/api/",
      });

      toast.success(response?.data?.message || "Login successful");
      if (response?.data?.success) {
        const nextPath = searchParams.get("next") || "/dashboard";
        window.location.assign(nextPath.startsWith("/") ? nextPath : "/dashboard");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Login to your EstatePilot dashboard."
      fields={fields}
      buttonLabel="Login"
      footerText="Don't have an account?"
      footerHref="/register-company"
      footerLabel="Register company"
      onSubmit={handleLogin}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthForm
          title="Welcome back"
          subtitle="Login to your EstatePilot dashboard."
          fields={fields}
          buttonLabel="Login"
          footerText="Don't have an account?"
          footerHref="/register-company"
          footerLabel="Register company"
          onSubmit={async () => {}}
        />
      }
    >
      <LoginForm />
    </Suspense>
  );
}

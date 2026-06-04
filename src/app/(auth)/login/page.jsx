"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthForm from "@/components/common/AuthForm";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  const fields = [
    { id: "email", name: "email", type: "email", placeholder: "Email" },
    { id: "password", name: "password", type: "password", placeholder: "Password" },
  ];

  const handleLogin = async (formData) => {
    try {
      const response = await api.post("auth/login", formData);

      toast.success(response?.data?.message || "Login successful");
      console.log(response.data.success)
      if(response?.data.success){
        router.push("/dashboard");
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

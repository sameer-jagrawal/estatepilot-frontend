"use client";

import { getFallbackAdmin, getFallbackUser } from "@/lib/auth";

export default function useAuth(scope = "tenant") {
  const user = scope === "admin" ? getFallbackAdmin() : getFallbackUser();

  return {
    user,
    role: user.role,
    isAuthenticated: true,
  };
}

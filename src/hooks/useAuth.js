"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function useAuth(scope = "tenant") {
  const [state, setState] = useState({
    user: null,
    role: "",
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    const endpoint = scope === "admin" ? "super-admin/me" : "auth/me";

    async function loadUser() {
      try {
        const response = await api.get(endpoint);
        const user = response?.data?.data || response?.data?.user || response?.data || null;

        if (active) {
          setState({
            user,
            role: user?.role || "",
            isAuthenticated: Boolean(user),
            loading: false,
          });
        }
      } catch {
        if (active) {
          setState({
            user: null,
            role: "",
            isAuthenticated: false,
            loading: false,
          });
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [scope]);

  return state;
}

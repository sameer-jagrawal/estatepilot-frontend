import api from "@/lib/axios";
import { cookies } from "next/headers";

async function getDashboardStats() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [statsRes, leadsRes, dealsRes, todayFollowUpsRes] =
    await Promise.all([
      api.get("dashboard/stats", authHeader),
      api.get("dashboard/leads", authHeader),
      api.get("dashboard/deals", authHeader),
      api.get("followups/today", authHeader),
    ]);

  return {
    DashboardStats: statsRes.data,
    leadsStats: leadsRes.data,
    dealsStats: dealsRes.data,
    todayFollowUps: todayFollowUpsRes.data,
  };
}

export { getDashboardStats };

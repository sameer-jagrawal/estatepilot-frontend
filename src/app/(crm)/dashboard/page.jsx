import { getDashboardStats } from "@/api-call/apicall";
import DashboardPage from "@/components/crm/Dashboard";

export default async function Page() {
  const {
    DashboardStats,
    leadsStats,
    dealsStats,
    todayFollowUps,
  } = await getDashboardStats();

  return (
    <DashboardPage
      statsData={DashboardStats?.data}
      leadsData={leadsStats?.data}
      dealsData={dealsStats?.data}
      todayFollowUps={todayFollowUps?.data}
    />
  );
}

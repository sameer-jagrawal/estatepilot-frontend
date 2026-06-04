"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import ActivitySkeleton from "./ActivitySkeleton";
import ActivityTimeline from "./ActivityTimeline";
import { extractArray } from "./activityUtils";

export default function DealActivityTimeline({ dealId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(Boolean(dealId));

  const fetchActivities = useCallback(async () => {
    if (!dealId) return;
    try {
      setLoading(true);
      const response = await api.get(`activity-logs/entity/deal/${dealId}`);
      setActivities(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load deal activity");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchActivities();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchActivities]);

  if (loading) return <ActivitySkeleton count={4} />;

  return (
    <ActivityTimeline
      activities={activities}
      emptyTitle="No deal activity yet"
      emptyText="Deal creation, updates, closing, and cancellation events will appear here."
    />
  );
}

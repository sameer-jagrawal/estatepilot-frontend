"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import ActivitySkeleton from "./ActivitySkeleton";
import ActivityTimeline from "./ActivityTimeline";
import { extractArray } from "./activityUtils";

export default function LeadActivityTimeline({ leadId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(Boolean(leadId));

  const fetchActivities = useCallback(async () => {
    if (!leadId) return;
    try {
      setLoading(true);
      const response = await api.get(`activity-logs/entity/lead/${leadId}`);
      setActivities(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load lead activity");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchActivities();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchActivities]);

  if (loading) return <ActivitySkeleton />;

  return (
    <ActivityTimeline
      activities={activities}
      emptyTitle="No lead activity yet"
      emptyText="Lead updates, notes, follow-ups, and deals will appear here."
    />
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import ActivitySkeleton from "./ActivitySkeleton";
import ActivityTimeline from "./ActivityTimeline";
import { extractArray } from "./activityUtils";

export default function PropertyActivityTimeline({ propertyId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(Boolean(propertyId));

  const fetchActivities = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      const response = await api.get(`activity-logs/entity/property/${propertyId}`);
      setActivities(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load property activity");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

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
      emptyTitle="No property activity yet"
      emptyText="Property creation, updates, and status changes will appear here."
    />
  );
}

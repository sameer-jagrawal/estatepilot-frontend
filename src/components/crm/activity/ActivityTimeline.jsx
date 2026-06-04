"use client";

import { motion } from "framer-motion";
import ActivityCard from "./ActivityCard";
import ActivityEmptyState from "./ActivityEmptyState";
import { formatDateGroup, getModuleConfig } from "./activityUtils";

function groupActivities(activities = []) {
  return activities.reduce((groups, activity) => {
    const label = formatDateGroup(activity?.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(activity);
    return groups;
  }, {});
}

export default function ActivityTimeline({ activities = [], emptyTitle, emptyText, compact = false }) {
  if (!activities.length) {
    return <ActivityEmptyState title={emptyTitle} text={emptyText} />;
  }

  const groups = groupActivities(activities);

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }} className="grid gap-6">
      {Object.entries(groups).map(([group, items]) => (
        <section key={group} className="grid gap-3">
          {!compact ? <h2 className="text-sm font-semibold text-[#0F172A]">{group}</h2> : null}
          <div className="relative grid gap-4">
            <motion.span
              aria-hidden="true"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute left-[21px] top-2 h-[calc(100%-8px)] w-px origin-top bg-[#E2E8F0]"
            />
            {items.map((activity, index) => {
              const config = getModuleConfig(activity?.module);
              const Icon = config.icon;

              return (
                <motion.div
                  key={activity?._id || `${group}-${index}`}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  className="relative flex min-w-0 gap-4"
                >
                  <span className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${config.badge}`}>
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <ActivityCard activity={activity} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      ))}
    </motion.div>
  );
}

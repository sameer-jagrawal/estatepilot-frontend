"use client";

export default function ActivitySkeleton({ count = 5 }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
      <div className="grid gap-5">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex gap-4">
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-[#E2E8F0]" />
            <div className="min-w-0 flex-1 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="h-4 w-1/3 animate-pulse rounded-full bg-[#E2E8F0]" />
              <div className="mt-4 h-3 w-3/4 animate-pulse rounded-full bg-[#E2E8F0]" />
              <div className="mt-3 h-3 w-1/2 animate-pulse rounded-full bg-[#E2E8F0]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#E2E8F0]/70 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-11 w-11 rounded-2xl" />
      </div>
      <Skeleton className="mt-5 h-3 w-36" />
    </div>
  );
}

export default function Loader({ label = "Loading", className = "", spinnerClassName = "" }) {
  return (
    <div className={`inline-flex items-center gap-3 text-sm font-medium text-[#64748B] ${className}`}>
      <span className={`h-4 w-4 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#4DA8FF] ${spinnerClassName}`} />
      {label}
    </div>
  );
}

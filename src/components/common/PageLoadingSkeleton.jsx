export default function PageLoadingSkeleton({ variant = "crm" }) {
  const border = variant === "admin" ? "border-[#DDE5EF]" : "border-[#E2E8F0]";
  const surface = variant === "admin" ? "bg-[#F6F8FB]" : "bg-[#F8FAFC]";

  return (
    <div className="grid gap-5">
      <section className={`border ${border} bg-white p-5`}>
        <div className={`h-3 w-28 animate-pulse rounded ${surface}`} />
        <div className={`mt-4 h-8 w-56 animate-pulse rounded ${surface}`} />
        <div className={`mt-3 h-4 w-full max-w-xl animate-pulse rounded ${surface}`} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className={`border ${border} bg-white p-4`}>
            <div className={`h-3 w-24 animate-pulse rounded ${surface}`} />
            <div className={`mt-5 h-7 w-20 animate-pulse rounded ${surface}`} />
            <div className={`mt-4 h-3 w-32 animate-pulse rounded ${surface}`} />
          </div>
        ))}
      </section>

      <section className={`border ${border} bg-white p-4`}>
        <div className={`h-4 w-36 animate-pulse rounded ${surface}`} />
        <div className="mt-4 grid gap-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className={`h-12 animate-pulse rounded ${surface}`} />
          ))}
        </div>
      </section>
    </div>
  );
}

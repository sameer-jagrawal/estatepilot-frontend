import PageLoadingSkeleton from "@/components/common/PageLoadingSkeleton";

export default function Loading() {
  return (
    <div className="app-container py-8">
      <PageLoadingSkeleton variant="crm" />
    </div>
  );
}

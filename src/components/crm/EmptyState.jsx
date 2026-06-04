import Button from "@/components/common/Button";

export default function EmptyState({ title, description, action = "Create New" }) {
  return (
    <section className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">+</div>
        <h2 className="text-xl font-medium">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748B]">{description}</p>
        <Button type="button" className="mt-6">{action}</Button>
      </div>
    </section>
  );
}

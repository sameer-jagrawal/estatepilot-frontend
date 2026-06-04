const tones = {
  blue: "bg-[#F3FAFF] text-[#2E95F7]",
  lavender: "bg-[#F3EFFF] text-[#7C3AED]",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  gray: "bg-slate-100 text-[#64748B]",
};

export default function Badge({ children, tone = "blue" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

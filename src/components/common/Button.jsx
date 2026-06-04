import Link from "next/link";

const variants = {
  primary:
    "border border-transparent bg-gradient-to-r from-[#2E95F7] via-[#4DA8FF] to-[#A78BFA] text-white shadow-[0_14px_30px_rgba(77,168,255,0.22)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(124,58,237,0.22)]",
  secondary:
    "bg-white text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0]",
  ghost: "bg-transparent text-[#0F172A] hover:bg-[#EAF5FF] border border-transparent",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition focus-ring disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

import Link from "next/link";
import { brand } from "@/lib/data";

const columns = [
  ["Product", ["Features", "Pricing", "Dashboard"]],
  ["Company", ["About", "Contact", "Privacy Policy"]],
  ["Support", ["Help Center", "Documentation", "Email Support"]],
];

const hrefFor = (label) =>
  label === "Dashboard" ? "/dashboard" : `/${label.toLowerCase().replaceAll(" ", "-")}`;

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="app-container grid gap-10 py-12 md:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="mb-4 text-xl font-medium">{brand.name}</div>
          <p className="max-w-sm text-sm leading-6 text-[#64748B]">{brand.description}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map(([title, links]) => (
            <div key={title}>
              <h2 className="mb-3 text-sm font-medium">{title}</h2>
              <div className="grid gap-2">
                {links.map((label) => (
                  <Link key={label} href={hrefFor(label)} className="text-sm text-[#64748B] hover:text-[#0F172A]">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

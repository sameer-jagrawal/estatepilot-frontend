import { Toaster } from "sonner";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://estatepilot-frontend.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EstatePilot - WhatsApp-first Real Estate CRM",
    template: "%s | EstatePilot",
  },
  description:
    "EstatePilot helps real estate teams manage leads, follow-ups, properties, site visits, and deals from one clean dashboard.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "EstatePilot",
    title: "EstatePilot - WhatsApp-first Real Estate CRM",
    description:
      "Manage real estate leads, follow-ups, properties, site visits, deals, and WhatsApp conversations from one CRM.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EstatePilot - WhatsApp-first Real Estate CRM",
    description:
      "Manage real estate leads, follow-ups, properties, site visits, deals, and WhatsApp conversations from one CRM.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F8FAFC] text-[#0F172A]">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

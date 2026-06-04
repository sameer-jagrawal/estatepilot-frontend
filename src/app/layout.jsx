import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: "EstatePilot - WhatsApp-first Real Estate CRM",
  description:
    "EstatePilot helps real estate teams manage leads, follow-ups, properties, site visits, and deals from one clean dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[#F8FAFC] text-[#0F172A]">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://estatepilot-frontend.vercel.app";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/profile", "/settings"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

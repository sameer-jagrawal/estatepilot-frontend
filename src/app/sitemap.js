const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://estatepilot-frontend.vercel.app";

const publicRoutes = ["", "/features", "/pricing", "/about", "/contact", "/login", "/register-company"];

export default function sitemap() {
  const now = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route ? "monthly" : "weekly",
    priority: route ? 0.7 : 1,
  }));
}

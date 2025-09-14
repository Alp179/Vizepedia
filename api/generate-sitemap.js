import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export default async function handler(req, res) {
  const supabase = createClient(
    "https://ibygzkntdaljyduuhivj.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: posts, error } = await supabase
    .from("blogs")
    .select("slug, updated_at");

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: "Supabase error" });
  }

  const baseUrl = "https://www.vizepedia.com";

  // Static rotaları site haritasına ekliyoruz
  // NOT: Giriş, kayıt ve şifre sıfırlama sayfaları bilinçli olarak hariç tutuldu.
  // Bu sayfalar robots.txt’de Disallow ve her sayfada noindex meta etiketi var.
  const staticRoutes = [
    { path: "", priority: "1.0", changefreq: "weekly" },
    { path: "/mainpage", priority: "0.9", changefreq: "weekly" },
    { path: "/dashboard", priority: "0.8", changefreq: "daily" },
    { path: "/ready-documents", priority: "0.8", changefreq: "weekly" },
    { path: "/planned-documents", priority: "0.8", changefreq: "weekly" },
    { path: "/withus-documents", priority: "0.8", changefreq: "weekly" },
    { path: "/blog", priority: "0.8", changefreq: "daily" },
    { path: "/davetiye-olustur", priority: "0.7", changefreq: "monthly" },
    { path: "/site-haritasi", priority: "0.5", changefreq: "monthly" },
    // Kurumsal ve bilgilendirici sayfalar
    { path: "/hakkimizda", priority: "0.6", changefreq: "monthly" },
    { path: "/iletisim", priority: "0.7", changefreq: "monthly" },
    // Hukuki sayfalar
    { path: "/gizlilik-politikasi", priority: "0.4", changefreq: "quarterly" },
    {
      path: "/kisisel-verilerin-korunmasi",
      priority: "0.4",
      changefreq: "quarterly",
    },
    { path: "/kullanim-sartlari", priority: "0.4", changefreq: "quarterly" },
    { path: "/yasal-uyari", priority: "0.4", changefreq: "quarterly" },
    { path: "/cerez-politikasi", priority: "0.4", changefreq: "quarterly" },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Statik rotalar
  for (const route of staticRoutes) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}${route.path}</loc>\n`;
    sitemap += `    <lastmod>${dayjs().format("YYYY-MM-DD")}</lastmod>\n`;
    sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${route.priority}</priority>\n`;
    sitemap += `  </url>\n`;
  }

  // Blog yazıları
  for (const post of posts) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
    sitemap += `    <lastmod>${dayjs(post.updated_at).format(
      "YYYY-MM-DD"
    )}</lastmod>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += `  </url>\n`;
  }

  sitemap += `</urlset>\n`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.status(200).send(sitemap);
}

import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import dayjs from "dayjs";

// Supabase bağlantı bilgilerini gir
const supabase = createClient(
  'https://ibygzkntdaljyduuhivj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generateSitemap() {
  const { data: posts, error } = await supabase
    .from("blogs")
    .select("slug, updated_at");

  if (error) {
    console.error("Supabase Hatası:", error);
    return;
  }

  const baseUrl = "https://www.vizepedia.com";
  const staticRoutes = [
    "",
    "/blog",
    "/hakkimizda",
    "/cerez-politikasi",
    "/kisisel-verilerin-korunmasi",
    "/davetiye-olustur",
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Statik sayfalar
  for (const path of staticRoutes) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}${path}</loc>\n`;
    sitemap += `    <priority>0.6</priority>\n`;
    sitemap += `  </url>\n`;
  }

  // Blog postları
  for (const post of posts) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
    sitemap += `    <lastmod>${dayjs(post.updated_at).format(
      "YYYY-MM-DD"
    )}</lastmod>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += `  </url>\n`;
  }

  sitemap += `</urlset>`;

  fs.writeFileSync("./public/sitemap.xml", sitemap);
  console.log("✅ sitemap.xml başarıyla oluşturuldu.");
}

generateSitemap();

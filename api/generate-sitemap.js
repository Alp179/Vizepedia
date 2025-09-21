import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

// Helper function to convert document names to URL-friendly slugs
function toSlug(text) {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-ığüşöçİĞÜŞÖÇ]+/g, '') // Remove non-word chars except Turkish chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export default async function handler(req, res) {
  const supabase = createClient(
    "https://ibygzkntdaljyduuhivj.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Fetch blog posts
  const { data: posts, error: postsError } = await supabase
    .from("blogs")
    .select("slug, updated_at");

  if (postsError) {
    console.error("Supabase error fetching posts:", postsError);
    return res.status(500).json({ error: "Supabase error fetching posts" });
  }

  // NEW: Fetch all documents for sitemap
  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("docName, docStage, updated_at, created_at")
    .order("id", { ascending: true });

  if (documentsError) {
    console.error("Supabase error fetching documents:", documentsError);
    // Don't fail the entire sitemap, just continue without documents
  }

  const baseUrl = "https://www.vizepedia.com";

  // Static routes
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
    // Corporate and informational pages
    { path: "/hakkimizda", priority: "0.6", changefreq: "monthly" },
    { path: "/iletisim", priority: "0.7", changefreq: "monthly" },
    // Legal pages
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

  // Static routes
  for (const route of staticRoutes) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}${route.path}</loc>\n`;
    sitemap += `    <lastmod>${dayjs().format("YYYY-MM-DD")}</lastmod>\n`;
    sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${route.priority}</priority>\n`;
    sitemap += `  </url>\n`;
  }

  // Blog posts
  for (const post of posts || []) {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
    sitemap += `    <lastmod>${dayjs(post.updated_at).format("YYYY-MM-DD")}</lastmod>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += `  </url>\n`;
  }

  // NEW: Add document pages (public URLs only - without user IDs)
  if (documents && documents.length > 0) {
    console.log(`Adding ${documents.length} documents to sitemap`);
    
    for (const document of documents) {
      const slug = toSlug(document.docName);
      const lastmod = document.updated_at || document.created_at || new Date().toISOString();
      
      // Only add if we have a valid slug
      if (slug) {
        let basePath = '';
        let priority = '0.6';
        
        // Determine the base path based on document stage
        switch (document.docStage) {
          case 'hazir':
            basePath = '/ready-documents';
            priority = '0.7'; // Higher priority for ready documents
            break;
          case 'planla':
            basePath = '/planned-documents';
            priority = '0.6';
            break;
          case 'bizimle':
            basePath = '/withus-documents';
            priority = '0.6';
            break;
          default:
            // Skip documents without a valid stage
            continue;
        }
        
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}${basePath}/${slug}</loc>\n`;
        sitemap += `    <lastmod>${dayjs(lastmod).format("YYYY-MM-DD")}</lastmod>\n`;
        sitemap += `    <changefreq>monthly</changefreq>\n`;
        sitemap += `    <priority>${priority}</priority>\n`;
        sitemap += `  </url>\n`;
      }
    }
  }

  sitemap += `</urlset>\n`;

  // Set proper headers
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.status(200).send(sitemap);
}
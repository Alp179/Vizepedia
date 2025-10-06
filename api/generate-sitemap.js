import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

// Helper function to convert document names to URL-friendly slugs
function toSlug(s) {
  if (!s) return "";
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // aksan temizle
    .replace(/[^a-z0-9\s-]/g, "") // özel karakterleri at
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default async function handler(req, res) {
  try {
    console.log("🔍 Starting sitemap generation...");

    // Initialize Supabase client
    const supabase = createClient(
      "https://ibygzkntdaljyduuhivj.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Fetch blog posts with categories
    console.log("📝 Fetching blog posts...");
    const { data: posts, error: postsError } = await supabase
      .from("blogs")
      .select("slug, category, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (postsError) {
      console.error("❌ Error fetching posts:", postsError);
    }

    // Fetch documents
    console.log("📄 Fetching documents...");
    const { data: documents, error: documentsError } = await supabase
      .from("documents")
      .select("docName, docStage, created_at")
      .order("id", { ascending: true });

    if (documentsError) {
      console.error("❌ Error fetching documents:", documentsError);
    }

    // Use fallback data if queries fail
    const safePosts = posts || [];
    const safeDocuments = documents || [];

    console.log(`✅ Posts fetched: ${safePosts.length}`);
    console.log(`✅ Documents fetched: ${safeDocuments.length}`);

    // Extract unique categories from blog posts
    const categories = [...new Set(safePosts.filter(post => post.category).map(post => post.category))];
    console.log(`🏷️ Unique blog categories: ${categories.length}`, categories);

    const baseUrl = "https://www.vizepedia.com";
    const today = dayjs().format("YYYY-MM-DD");

    // Static routes
    const staticRoutes = [
      { path: "", priority: "1.0", changefreq: "weekly", lastmod: today },
      { path: "/dashboard", priority: "0.8", changefreq: "daily", lastmod: today },
      //{ path: "/ready-documents", priority: "0.8", changefreq: "weekly", lastmod: today },
      //{ path: "/planned-documents", priority: "0.8", changefreq: "weekly", lastmod: today },
      //{ path: "/withus-documents", priority: "0.8", changefreq: "weekly", lastmod: today },
      { path: "/blog", priority: "0.8", changefreq: "daily", lastmod: today },
      { path: "/davetiye-olustur", priority: "0.7", changefreq: "monthly", lastmod: today },
      { path: "/site-haritasi", priority: "0.5", changefreq: "monthly", lastmod: today },
      { path: "/hakkimizda", priority: "0.7", changefreq: "monthly", lastmod: today },
      { path: "/iletisim", priority: "0.7", changefreq: "monthly", lastmod: today },
      { path: "/gizlilik-politikasi", priority: "0.6", changefreq: "yearly", lastmod: today },
      { path: "/kisisel-verilerin-korunmasi", priority: "0.6", changefreq: "yearly", lastmod: today },
      { path: "/kullanim-sartlari", priority: "0.6", changefreq: "yearly", lastmod: today },
      { path: "/yasal-uyari", priority: "0.5", changefreq: "yearly", lastmod: today },
      { path: "/cerez-politikasi", priority: "0.5", changefreq: "yearly", lastmod: today },
    ];

    // Build sitemap XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    console.log("🔨 Adding static routes...");
    // Add static routes
    for (const route of staticRoutes) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${route.path}</loc>\n`;
      sitemap += `    <lastmod>${route.lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${route.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    }


    console.log("📝 Adding blog posts...");
    // Add blog posts
    if (safePosts && safePosts.length > 0) {
      for (const post of safePosts) {
        try {
          const postDate = post.updated_at
            ? dayjs(post.updated_at).format("YYYY-MM-DD")
            : today;

          sitemap += `  <url>\n`;
          sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
          sitemap += `    <lastmod>${postDate}</lastmod>\n`;
          sitemap += `    <changefreq>monthly</changefreq>\n`;
          sitemap += `    <priority>0.7</priority>\n`;
          sitemap += `  </url>\n`;
        } catch (err) {
          console.error(`Error adding blog post ${post.slug}:`, err);
        }
      }
    }

    console.log("📄 Adding document pages...");
    let addedDocumentCount = 0;
    
    if (safeDocuments && safeDocuments.length > 0) {
      for (const document of safeDocuments) {
        try {
          if (!document.docName || !document.docStage) {
            console.log(`Skipping document with missing data:`, document);
            continue;
          }

          const slug = toSlug(document.docName);
          if (!slug) {
            console.log(`Skipping document with empty slug: ${document.docName}`);
            continue;
          }

          const lastmod = document.created_at || today;
          let basePath = "";
          let priority = "0.6";

          // Determine the base path based on document stage
          switch (document.docStage) {
            case "hazir":
              basePath = "/ready-documents";
              priority = "0.7";
              break;
            case "planla":
              basePath = "/planned-documents";
              priority = "0.6";
              break;
            case "bizimle":
              basePath = "/withus-documents";
              priority = "0.6";
              break;
            default:
              console.log(`Unknown document stage: ${document.docStage}, skipping ${document.docName}`);
              continue;
          }

          const documentDate = dayjs(lastmod).format("YYYY-MM-DD");
          const documentUrl = `${baseUrl}${basePath}/${slug}`;

          sitemap += `  <url>\n`;
          sitemap += `    <loc>${documentUrl}</loc>\n`;
          sitemap += `    <lastmod>${documentDate}</lastmod>\n`;
          sitemap += `    <changefreq>monthly</changefreq>\n`;
          sitemap += `    <priority>${priority}</priority>\n`;
          sitemap += `  </url>\n`;
          
          addedDocumentCount++;

          if (addedDocumentCount <= 5) {
            console.log(`  ✅ Added: ${documentUrl}`);
          }
        } catch (err) {
          console.error(`Error processing document ${document.docName}:`, err);
        }
      }
    }

    sitemap += "</urlset>\n";

    console.log("✅ Sitemap generation complete!");
    console.log(`📊 Final counts: Static(${staticRoutes.length}) + Categories(${categories.length}) + Posts(${safePosts.length}) + Documents(${addedDocumentCount})`);

    // Set response headers
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.setHeader("X-Generated-At", new Date().toISOString());
    res.setHeader("X-Documents-Count", addedDocumentCount.toString());
    res.setHeader("X-Posts-Count", safePosts.length.toString());
    res.setHeader("X-Categories-Count", categories.length.toString());

    return res.status(200).send(sitemap);

  } catch (error) {
    console.error("❌ Sitemap generation error:", error);
    
    // Return minimal working sitemap
    const baseUrl = "https://www.vizepedia.com";
    const today = dayjs().format("YYYY-MM-DD");

    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/dashboard</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    res.setHeader("X-Cache", "ERROR-FALLBACK");
    return res.status(200).send(fallbackSitemap);
  }
}
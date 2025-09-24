import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

// In-memory cache for sitemap
let cachedSitemap = null;
let cacheTime = 0;
const CACHE_DURATION = 300000; // 5 minutes for debugging

// Helper function to convert document names to URL-friendly slugs
function toSlug(text) {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-ığüşöçİĞÜŞÖÇ]+/g, "") // Remove non-word chars except Turkish chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export default async function handler(req, res) {
  const now = Date.now();

  // TEMPORARILY DISABLE CACHE FOR DEBUGGING
  // if (cachedSitemap && now - cacheTime < CACHE_DURATION) {
  //   res.setHeader("Content-Type", "application/xml; charset=utf-8");
  //   res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  //   res.setHeader("X-Cache", "HIT");
  //   return res.status(200).send(cachedSitemap);
  // }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      "https://ibygzkntdaljyduuhivj.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log("🔍 Starting sitemap generation...");

    // Fetch blog posts with timeout and error handling - INCLUDE CATEGORY
    const postsPromise = Promise.race([
      supabase
        .from("blogs")
        .select("slug, category, updated_at") // ← ADD CATEGORY HERE
        .order("updated_at", { ascending: false })
        .limit(100), // Limit to 100 most recent posts

      // Timeout after 3 seconds
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Posts timeout")), 3000)
      ),
    ]);

    // Fetch documents with timeout and error handling
    const documentsPromise = Promise.race([
      supabase
        .from("documents")
        .select("docName, docStage, updated_at, created_at")
        .order("id", { ascending: true }),

      // Timeout after 3 seconds
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Documents timeout")), 3000)
      ),
    ]);

    // Fetch both in parallel
    const [postsResult, documentsResult] = await Promise.allSettled([
      postsPromise,
      documentsPromise,
    ]);

    // Handle posts result
    let posts = [];
    if (postsResult.status === "fulfilled" && !postsResult.value.error) {
      posts = postsResult.value.data || [];
      console.log("✅ Posts fetched:", posts.length);
      console.log("📝 First few posts:", posts.slice(0, 3).map(p => ({ slug: p.slug, category: p.category })));
    } else {
      console.error("❌ Error fetching posts:", postsResult.reason || postsResult.value?.error);
    }

    // Handle documents result
    let documents = [];
    if (
      documentsResult.status === "fulfilled" &&
      !documentsResult.value.error
    ) {
      documents = documentsResult.value.data || [];
      console.log("✅ Documents fetched:", documents.length);
      console.log("📄 First few documents:", documents.slice(0, 3).map(d => ({ 
        docName: d.docName, 
        docStage: d.docStage,
        slug: toSlug(d.docName)
      })));
    } else {
      console.error("❌ Error fetching documents:", documentsResult.reason || documentsResult.value?.error);
    }

    // Extract unique categories from blog posts
    const categories = [...new Set(posts.filter(post => post.category).map(post => post.category))];
    console.log("🏷️ Unique blog categories found:", categories.length, categories);

    const baseUrl = "https://www.vizepedia.com";
    const today = dayjs().format("YYYY-MM-DD");

    // Static routes
    const staticRoutes = [
      { path: "", priority: "1.0", changefreq: "weekly", lastmod: today },
      { path: "/mainpage", priority: "0.9", changefreq: "weekly", lastmod: today },
      { path: "/dashboard", priority: "0.8", changefreq: "daily", lastmod: today },
      { path: "/ready-documents", priority: "0.8", changefreq: "weekly", lastmod: today },
      { path: "/planned-documents", priority: "0.8", changefreq: "weekly", lastmod: today },
      { path: "/withus-documents", priority: "0.8", changefreq: "weekly", lastmod: today },
      { path: "/blog", priority: "0.8", changefreq: "daily", lastmod: today },
      { path: "/davetiye-olustur", priority: "0.7", changefreq: "monthly", lastmod: today },
      { path: "/site-haritasi", priority: "0.5", changefreq: "monthly", lastmod: today },
      { path: "/hakkimizda", priority: "0.7", changefreq: "monthly", lastmod: today },
      { path: "/iletisim", priority: "0.7", changefreq: "monthly", lastmod: today },
      { path: "/gizlilik-politikasi", priority: "0.6", changefreq: "quarterly", lastmod: today },
      { path: "/kisisel-verilerin-korunmasi", priority: "0.6", changefreq: "quarterly", lastmod: today },
      { path: "/kullanim-sartlari", priority: "0.6", changefreq: "quarterly", lastmod: today },
      { path: "/yasal-uyari", priority: "0.5", changefreq: "quarterly", lastmod: today },
      { path: "/cerez-politikasi", priority: "0.5", changefreq: "quarterly", lastmod: today },
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

    console.log("🏷️ Adding blog category pages...");
    // Add blog category pages
    if (categories && categories.length > 0) {
      for (const category of categories) {
        // Properly encode the category for URL
        const encodedCategory = encodeURIComponent(category);
        console.log(`  Adding category: ${category} → ${encodedCategory}`);
        
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/blog/kategori/${encodedCategory}</loc>\n`;
        sitemap += `    <lastmod>${today}</lastmod>\n`;
        sitemap += `    <changefreq>weekly</changefreq>\n`;
        sitemap += `    <priority>0.7</priority>\n`;
        sitemap += `  </url>\n`;
      }
    } else {
      console.log("⚠️ No blog categories found!");
    }

    console.log("📝 Adding blog posts...");
    // Add blog posts
    if (posts && posts.length > 0) {
      for (const post of posts) {
        const postDate = post.updated_at
          ? dayjs(post.updated_at).format("YYYY-MM-DD")
          : today;

        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
        sitemap += `    <lastmod>${postDate}</lastmod>\n`;
        sitemap += `    <changefreq>monthly</changefreq>\n`;
        sitemap += `    <priority>0.7</priority>\n`;
        sitemap += `  </url>\n`;
      }
    }

    console.log("📄 Adding document pages...");
    // Add document pages
    if (documents && documents.length > 0) {
      for (const document of documents) {
        const slug = toSlug(document.docName);
        const lastmod = document.updated_at || document.created_at || today;

        console.log(`  Processing document: ${document.docName} → slug: ${slug}, stage: ${document.docStage}`);

        // Only add if we have a valid slug
        if (slug) {
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
              console.log(`  ⚠️ Skipping document with unknown stage: ${document.docStage}`);
              continue;
          }

          const documentDate = dayjs(lastmod).format("YYYY-MM-DD");
          const documentUrl = `${baseUrl}${basePath}/${slug}`;
          console.log(`  ✅ Adding: ${documentUrl}`);

          sitemap += `  <url>\n`;
          sitemap += `    <loc>${documentUrl}</loc>\n`;
          sitemap += `    <lastmod>${documentDate}</lastmod>\n`;
          sitemap += `    <changefreq>monthly</changefreq>\n`;
          sitemap += `    <priority>${priority}</priority>\n`;
          sitemap += `  </url>\n`;
        } else {
          console.log(`  ⚠️ Skipping document with empty slug: ${document.docName}`);
        }
      }
    } else {
      console.log("⚠️ No documents found!");
    }

    sitemap += "</urlset>\n";

    console.log("✅ Sitemap generation complete!");
    console.log(`📊 Final counts: Static(${staticRoutes.length}) + Categories(${categories.length}) + Posts(${posts.length}) + Documents(${documents.length})`);

    // Cache the result
    cachedSitemap = sitemap;
    cacheTime = now;

    // Set response headers with debug info
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // NO CACHE FOR DEBUGGING
    res.setHeader("X-Cache", "DEBUG-MISS");
    res.setHeader("X-Generated-At", new Date().toISOString());
    res.setHeader("X-Documents-Count", documents.length.toString());
    res.setHeader("X-Posts-Count", posts.length.toString());
    res.setHeader("X-Categories-Count", categories.length.toString());

    res.status(200).send(sitemap);
  } catch (error) {
    console.error("❌ Sitemap generation error:", error);
    
    // Return a simple fallback
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.vizepedia.com/</loc>
    <lastmod>${dayjs().format("YYYY-MM-DD")}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Cache", "ERROR-FALLBACK");
    res.status(200).send(fallbackSitemap);
  }
}
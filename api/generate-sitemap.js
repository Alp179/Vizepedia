import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

// In-memory cache for sitemap
let cachedSitemap = null;
let cacheTime = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export default async function handler(req, res) {
  const now = Date.now();
  
  // Return cached version if still fresh
  if (cachedSitemap && (now - cacheTime) < CACHE_DURATION) {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.setHeader("X-Cache", "HIT");
    return res.status(200).send(cachedSitemap);
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      "https://ibygzkntdaljyduuhivj.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Fetch blog posts with timeout and error handling
    const { data: posts, error } = await Promise.race([
      supabase
        .from("blogs")
        .select("slug, updated_at")
        .eq('published', true) // Only fetch published posts if you have this field
        .order('updated_at', { ascending: false })
        .limit(100), // Limit to 100 most recent posts
      
      // Timeout after 3 seconds
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase timeout')), 3000)
      )
    ]);

    if (error) {
      console.error("Supabase error:", error);
      // Return cached version if available, even if expired
      if (cachedSitemap) {
        res.setHeader("Content-Type", "application/xml; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
        res.setHeader("X-Cache", "STALE");
        return res.status(200).send(cachedSitemap);
      }
      return res.status(500).json({ error: "Supabase error" });
    }

    const baseUrl = "https://www.vizepedia.com";
    const today = dayjs().format("YYYY-MM-DD");

    // Static routes - optimized for AdSense approval
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
      
      // Corporate pages - important for AdSense
      { path: "/hakkimizda", priority: "0.7", changefreq: "monthly", lastmod: today },
      { path: "/iletisim", priority: "0.7", changefreq: "monthly", lastmod: today },
      
      // Legal pages - required for AdSense
      { path: "/gizlilik-politikasi", priority: "0.6", changefreq: "quarterly", lastmod: today },
      { path: "/kisisel-verilerin-korunmasi", priority: "0.6", changefreq: "quarterly", lastmod: today },
      { path: "/kullanim-sartlari", priority: "0.6", changefreq: "quarterly", lastmod: today },
      { path: "/yasal-uyari", priority: "0.5", changefreq: "quarterly", lastmod: today },
      { path: "/cerez-politikasi", priority: "0.5", changefreq: "quarterly", lastmod: today },
    ];

    // Build sitemap XML - optimized for speed
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static routes
    for (const route of staticRoutes) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${route.path}</loc>\n`;
      sitemap += `    <lastmod>${route.lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${route.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    }

    // Add blog posts
    if (posts && posts.length > 0) {
      for (const post of posts) {
        const postDate = post.updated_at ? 
          dayjs(post.updated_at).format("YYYY-MM-DD") : 
          today;
        
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
        sitemap += `    <lastmod>${postDate}</lastmod>\n`;
        sitemap += `    <changefreq>monthly</changefreq>\n`;
        sitemap += `    <priority>0.7</priority>\n`;
        sitemap += `  </url>\n`;
      }
    }

    sitemap += '</urlset>\n';

    // Cache the result
    cachedSitemap = sitemap;
    cacheTime = now;

    // Set response headers
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.setHeader("X-Cache", "MISS");
    res.setHeader("X-Generated-At", new Date().toISOString());
    
    res.status(200).send(sitemap);

  } catch (error) {
    console.error("Sitemap generation error:", error);
    
    // Return cached version if available, even if expired
    if (cachedSitemap) {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
      res.setHeader("X-Cache", "ERROR-FALLBACK");
      return res.status(200).send(cachedSitemap);
    }
    
    // Return minimal sitemap if no cache available
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
  <url>
    <loc>${baseUrl}/hakkimizda</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/gizlilik-politikasi</loc>
    <lastmod>${today}</lastmod>
    <changefreq>quarterly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    res.setHeader("X-Cache", "FALLBACK");
    res.status(200).send(fallbackSitemap);
  }
}
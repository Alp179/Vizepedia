import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    "https://ibygzkntdaljyduuhivj.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Blog yazılarını çek - RSS için gerekli tüm alanlar
  const { data: posts, error } = await supabase
    .from("blogs")
    .select(
      "title, slug, section1_content, section2_content, section3_content, cover_image, created_at, updated_at, category, tags"
    )
    .order("created_at", { ascending: false })
    .limit(50); // Son 50 blog yazısı

  if (error) {
    console.error("Supabase RSS error:", error);
    return res.status(500).json({ error: "RSS feed oluşturulamadı" });
  }

  const baseUrl = "https://www.vizepedia.com";
  const currentDate = new Date().toUTCString();

  // RSS 2.0 formatında feed oluştur
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Vizepedia Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Vize başvuruları, seyahat rehberleri ve güncel bilgiler. Vize süreçleri hakkında kapsamlı blog yazıları.</description>
    <language>tr-TR</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/vite.svg</url>
      <title>Vizepedia</title>
      <link>${baseUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    <ttl>60</ttl>
`;

  // Her blog yazısı için RSS item oluştur
  for (const post of posts) {
    // İçerikten HTML etiketlerini temizle ve özet oluştur
    const allContent =
      [
        post.section1_content || "",
        post.section2_content || "",
        post.section3_content || "",
      ]
        .join(" ")
        .replace(/<[^>]*>/g, "") // HTML etiketlerini kaldır
        .replace(/\s+/g, " ") // Fazla boşlukları temizle
        .trim();

    // İlk 300 karakter özet olarak
    const description = allContent.substring(0, 300);
    const descriptionWithEllipsis =
      description + (allContent.length > 300 ? "..." : "");

    // Etiketleri virgülden ayır ve temizle
    const categories = post.tags
      ? post.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // CDATA ile HTML özel karakterlerini güvenli hale getir
    const escapeTitle = post.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    rss += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <dc:creator><![CDATA[Vizepedia Ekibi]]></dc:creator>
      <description><![CDATA[${descriptionWithEllipsis}]]></description>`;

    // Tam içeriği content:encoded ile ekle (RSS okuyucuları için)
    if (allContent) {
      rss += `
      <content:encoded><![CDATA[${allContent.substring(0, 1000)}...]]></content:encoded>`;
    }

    // Ana kategori ekle
    if (post.category) {
      rss += `
      <category><![CDATA[${post.category}]]></category>`;
    }

    // Etiketleri kategori olarak ekle
    categories.forEach((tag) => {
      rss += `
      <category><![CDATA[${tag}]]></category>`;
    });

    // Kapak görseli varsa media:content ile ekle (daha zengin görünüm)
    if (post.cover_image) {
      rss += `
      <enclosure url="${post.cover_image}" type="image/jpeg" />
      <media:content url="${post.cover_image}" medium="image" type="image/jpeg">
        <media:title><![CDATA[${post.title}]]></media:title>
      </media:content>`;
    }

    rss += `
    </item>`;
  }

  rss += `
  </channel>
</rss>`;

  // HTTP yanıt başlıklarını ayarla
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200"
  ); // 1 saat cache, 2 saat stale
  res.status(200).send(rss);
}
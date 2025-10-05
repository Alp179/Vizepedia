import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  keywords,
  image = "/logo.png",
  url,
  noindex = false,
  prevUrl,
  nextUrl,
  structuredData,
  breadcrumbs,
  faqData,
  articleData,
  organizationData,
  websiteData,
  locale = "tr",
  author = "Vizepedia Editör",
  publishedTime,
  modifiedTime,
  section,
  tags,
  wordCount,
  readingTime,
  estimatedReadingTime,
  articleBody,
  twitterCard = "summary_large_image",
  twitterSite = "@vizepedia",
  twitterCreator = "@vizepedia",
  openGraphType = "website",
  siteName = "Vizepedia",
  themeColor = "#004466",
  appleStatusBarStyle = "default",
  category,
}) {
  // ============================================
  // URL NORMALIZATION - SINGLE SOURCE OF TRUTH
  // ============================================
  const BASE_URL = "https://www.vizepedia.com";

  const normalizeUrl = (rawUrl) => {
    if (!rawUrl) {
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        return `${BASE_URL}${pathname}`;
      }
      return BASE_URL;
    }

    if (rawUrl.startsWith(BASE_URL)) {
      return rawUrl;
    }

    if (rawUrl.startsWith("https://vizepedia.com")) {
      return rawUrl.replace("https://vizepedia.com", BASE_URL);
    }

    if (rawUrl.startsWith("http://")) {
      return rawUrl
        .replace("http://", "https://")
        .replace("vizepedia.com", "www.vizepedia.com");
    }

    const cleanPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const canonicalUrl = normalizeUrl(url);

  // ============================================
  // IMAGE URL NORMALIZATION
  // ============================================
  const normalizeImageUrl = (rawImage) => {
    if (!rawImage) return `${BASE_URL}/logo.png`;
    if (rawImage.startsWith("http")) return rawImage;
    const cleanPath = rawImage.startsWith("/") ? rawImage : `/${rawImage}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const absoluteImageUrl = normalizeImageUrl(image);

  // ============================================
  // KEYWORDS NORMALIZATION
  // ============================================
  const keywordsString = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords ||
      "vize, vize başvurusu, vize rehberi, seyahat rehberi, belgeler, Vizepedia";

  // ============================================
  // ROBOTS META - ENHANCED
  // ============================================
  const robots = noindex
    ? "noindex,nofollow"
    : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  // ============================================
  // TIME FORMATTING
  // ============================================
  const formatPublishedTime = (time) => {
    if (!time) return null;
    const date = new Date(time);
    return date.toISOString();
  };

  const formatModifiedTime = (time) => {
    if (!time) return null;
    const date = new Date(time);
    return date.toISOString();
  };

  // ============================================
  // AUTO-GENERATE BREADCRUMBS FROM URL
  // ============================================
  const autoGenerateBreadcrumbs = () => {
    if (breadcrumbs) return breadcrumbs;

    const urlParts = canonicalUrl
      .replace(BASE_URL, "")
      .split("/")
      .filter(Boolean);

    const crumbs = [
      {
        name: "Ana Sayfa",
        url: BASE_URL,
      },
    ];

    let currentPath = BASE_URL;
    urlParts.forEach((part, index) => {
      currentPath += `/${part}`;
      const isLast = index === urlParts.length - 1;

      // Skip adding the last breadcrumb if it's too long (article slug)
      if (isLast && part.length > 50) return;

      let name = part;
      if (part === "blog") name = "Blog";
      else if (part === "seyahat") name = "Seyahat";
      else if (part === "vize") name = "Vize";
      else if (part === "gocmenlik") name = "Göçmenlik";
      else name = part.replace(/-/g, " ");

      crumbs.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        url: currentPath,
      });
    });

    return crumbs;
  };

  const finalBreadcrumbs = autoGenerateBreadcrumbs();

  // ============================================
  // AUTO-GENERATE READING TIME
  // ============================================
  const calculateReadingTime = () => {
    if (estimatedReadingTime) return estimatedReadingTime;
    if (readingTime) return readingTime;
    if (wordCount) {
      const minutes = Math.ceil(wordCount / 200);
      return `${minutes} dakika`;
    }
    return null;
  };

  const finalReadingTime = calculateReadingTime();

  return (
    <Helmet>
      {/* ============================================ */}
      {/* BASIC META TAGS */}
      {/* ============================================ */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <meta name="keywords" content={keywordsString} />
      <meta name="robots" content={robots} />
      <meta name="author" content={author} />
      <meta name="theme-color" content={themeColor} />
      <meta name="msapplication-TileColor" content={themeColor} />

      {/* ============================================ */}
      {/* LANGUAGE & REGION */}
      {/* ============================================ */}
      <html lang={locale} />
      <meta httpEquiv="content-language" content={locale} />
      <link rel="alternate" hrefLang="tr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* ============================================ */}
      {/* CANONICAL URL - UNIQUE FOR EVERY PAGE */}
      {/* ============================================ */}
      <link rel="canonical" href={canonicalUrl} />

      {/* ============================================ */}
      {/* PAGINATION */}
      {/* ============================================ */}
      {prevUrl && <link rel="prev" href={normalizeUrl(prevUrl)} />}
      {nextUrl && <link rel="next" href={normalizeUrl(nextUrl)} />}

      {/* ============================================ */}
      {/* FAVICON & APP ICONS */}
      {/* ============================================ */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/logo.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* ============================================ */}
      {/* OPEN GRAPH TAGS */}
      {/* ============================================ */}
      <meta property="og:type" content={openGraphType} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || "Vizepedia"} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="tr_TR" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />

      {/* ============================================ */}
      {/* ARTICLE-SPECIFIC OG TAGS */}
      {/* ============================================ */}
      {openGraphType === "article" && (
        <>
          {publishedTime && (
            <>
              <meta
                property="article:published_time"
                content={formatPublishedTime(publishedTime)}
              />
              <meta
                name="publish_date"
                content={formatPublishedTime(publishedTime)}
              />
            </>
          )}
          {modifiedTime && (
            <>
              <meta
                property="article:modified_time"
                content={formatModifiedTime(modifiedTime)}
              />
              <meta
                httpEquiv="last-modified"
                content={formatModifiedTime(modifiedTime)}
              />
              <meta
                name="last-modified"
                content={formatModifiedTime(modifiedTime)}
              />
              <meta name="revised" content={formatModifiedTime(modifiedTime)} />
            </>
          )}
          {author && <meta property="article:author" content={author} />}
          {(section || category) && (
            <meta property="article:section" content={section || category} />
          )}
          {tags &&
            Array.isArray(tags) &&
            tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
          <meta
            property="article:publisher"
            content="https://www.facebook.com/vizepedia"
          />
        </>
      )}

      {/* ============================================ */}
      {/* TWITTER CARD TAGS */}
      {/* ============================================ */}
      <meta name="twitter:card" content={twitterCard} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content={title || "Vizepedia"} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && (
        <meta name="twitter:creator" content={twitterCreator} />
      )}

      {/* Twitter Reading Labels (article only) */}
      {openGraphType === "article" && finalReadingTime && (
        <>
          <meta name="twitter:label1" content="Okuma süresi" />
          <meta name="twitter:data1" content={finalReadingTime} />
          {author && (
            <>
              <meta name="twitter:label2" content="Yazar" />
              <meta name="twitter:data2" content={author} />
            </>
          )}
        </>
      )}

      {/* ============================================ */}
      {/* ADDITIONAL SEO META TAGS */}
      {/* ============================================ */}
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content={appleStatusBarStyle}
      />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* News/Article specific tags */}
      {openGraphType === "article" && (
        <>
          <meta name="news_keywords" content={keywordsString} />
          <meta property="og:see_also" content={canonicalUrl} />
        </>
      )}

      {/* ============================================ */}
      {/* STRUCTURED DATA (JSON-LD) */}
      {/* ============================================ */}

      {/* BREADCRUMB SCHEMA - Always included */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: finalBreadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: normalizeUrl(item.url),
          })),
        })}
      </script>

      {/* ORGANIZATION SCHEMA - Always included */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: organizationData?.name || siteName,
          url: BASE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/logo.png`,
            width: 240,
            height: 240,
          },
          description:
            "Kapsamlı vize başvuru rehberi ve güncel seyahat bilgileri platformu",
          contactPoint: organizationData?.contactPoint || {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "iletisim@vizepedia.com",
            availableLanguage: ["Turkish"],
          },
          sameAs: organizationData?.sameAs || [
            "https://www.facebook.com/vizepedia",
            "https://www.instagram.com/vizepedia",
            "https://twitter.com/vizepedia",
          ],
        })}
      </script>

      {/* CUSTOM STRUCTURED DATA */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* FAQ SCHEMA */}
      {faqData && faqData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          })}
        </script>
      )}

      {/* ARTICLE/BLOG POSTING SCHEMA */}
      {(openGraphType === "article" || articleData) && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
            headline: articleData?.headline || title,
            description: articleData?.description || description,
            image: {
              "@type": "ImageObject",
              url: normalizeImageUrl(articleData?.image || image),
              width: 1200,
              height: 630,
            },
            datePublished: formatPublishedTime(
              articleData?.datePublished || publishedTime
            ),
            dateModified: formatModifiedTime(
              articleData?.dateModified || modifiedTime || publishedTime
            ),
            author: {
              "@type": "Person",
              name: articleData?.author || author,
              url: `${BASE_URL}/yazar/${(articleData?.author || author)
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")}`,
            },
            publisher: {
              "@type": "Organization",
              name: siteName,
              logo: {
                "@type": "ImageObject",
                url: `${BASE_URL}/logo.png`,
                width: 240,
                height: 240,
              },
            },
            articleSection: articleData?.section || section || category,
            keywords: articleData?.keywords || keywordsString,
            wordCount: articleData?.wordCount || wordCount,
            timeRequired:
              articleData?.timeRequired ||
              (finalReadingTime ? `PT${parseInt(finalReadingTime)}M` : "PT5M"),
            inLanguage: "tr-TR",
            isPartOf: {
              "@type": "Blog",
              "@id": `${BASE_URL}/blog`,
              name: "Vizepedia Blog",
            },
            ...(articleBody && { articleBody: articleBody }),
          })}
        </script>
      )}

      {/* WEBSITE SCHEMA */}
      {websiteData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: BASE_URL,
            description: websiteData.description || description,
            inLanguage: "tr-TR",
            publisher: {
              "@type": "Organization",
              name: siteName,
              logo: {
                "@type": "ImageObject",
                url: `${BASE_URL}/logo.png`,
              },
            },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${BASE_URL}/ara?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      )}
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  image: PropTypes.string,
  url: PropTypes.string,
  noindex: PropTypes.bool,
  prevUrl: PropTypes.string,
  nextUrl: PropTypes.string,
  structuredData: PropTypes.object,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  faqData: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ),
  articleData: PropTypes.object,
  organizationData: PropTypes.object,
  websiteData: PropTypes.object,
  locale: PropTypes.string,
  author: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  section: PropTypes.string,
  category: PropTypes.string,
  tags: PropTypes.array,
  wordCount: PropTypes.number,
  readingTime: PropTypes.string,
  estimatedReadingTime: PropTypes.string,
  articleBody: PropTypes.string,
  twitterCard: PropTypes.string,
  twitterSite: PropTypes.string,
  twitterCreator: PropTypes.string,
  openGraphType: PropTypes.string,
  siteName: PropTypes.string,
  themeColor: PropTypes.string,
  appleStatusBarStyle: PropTypes.string,
};

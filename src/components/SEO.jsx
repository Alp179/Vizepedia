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
  locale = "tr_TR",
  author = "Vizepedia",
  publishedTime,
  modifiedTime,
  section,
  tags,
  wordCount,
  readingTime,
  twitterCard = "summary_large_image",
  twitterSite = "@vizepedia",
  twitterCreator = "@vizepedia",
  openGraphType = "website",
  siteName = "Vizepedia",
  themeColor = "#004466",
  appleStatusBarStyle = "default",
}) {
  const robots = noindex ? "noindex,nofollow" : "index,follow";

  // Ensure image URL is absolute
  const absoluteImageUrl = image?.startsWith("http")
    ? image
    : `https://www.vizepedia.com${image}`;

  // Ensure canonical URL is absolute and uses HTTPS www version
  const canonicalUrl = url?.startsWith("http")
    ? url
    : `https://www.vizepedia.com${url || ""}`;

  // Generate keywords string
  const keywordsString = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords ||
      "vize, vize başvurusu, vize rehberi, seyahat rehberi, belgeler, Vizepedia";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <meta name="keywords" content={keywordsString} />
      <meta name="robots" content={robots} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content={themeColor} />
      <meta name="msapplication-TileColor" content={themeColor} />

      {/* Language and Region */}
      <html lang={locale} />
      <meta httpEquiv="content-language" content={locale} />
      <link rel="alternate" hrefLang={locale} href={canonicalUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Pagination */}
      {prevUrl && <link rel="prev" href={prevUrl} />}
      {nextUrl && <link rel="next" href={nextUrl} />}

      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Open Graph Tags */}
      <meta property="og:type" content={openGraphType} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || "Vizepedia"} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Additional Open Graph Tags for Different Content Types */}
      {openGraphType === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags &&
            Array.isArray(tags) &&
            tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={absoluteImageUrl} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && (
        <meta name="twitter:creator" content={twitterCreator} />
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content={appleStatusBarStyle}
      />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Breadcrumb Structured Data */}
      {breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: item.url,
            })),
          })}
        </script>
      )}

      {/* FAQ Structured Data */}
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

      {/* Article Structured Data */}
      {articleData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
            headline: articleData.headline || title,
            description: articleData.description || description,
            image: articleData.image || absoluteImageUrl,
            datePublished: articleData.datePublished || publishedTime,
            dateModified: articleData.dateModified || modifiedTime,
            author: {
              "@type": "Person",
              name: articleData.author || author,
            },
            publisher: {
              "@type": "Organization",
              name: articleData.publisher?.name || siteName,
              logo: {
                "@type": "ImageObject",
                url:
                  articleData.publisher?.logo ||
                  "https://www.vizepedia.com/logo.png",
              },
            },
            articleSection: articleData.section || section,
            keywords: articleData.keywords || keywordsString,
            wordCount: articleData.wordCount || wordCount,
            timeRequired: articleData.timeRequired || readingTime,
          })}
        </script>
      )}

      {/* Organization Structured Data */}
      {organizationData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: organizationData.name || siteName,
            url: organizationData.url || "https://www.vizepedia.com",
            logo: organizationData.logo || "https://www.vizepedia.com/logo.png",
            contactPoint: organizationData.contactPoint || {
              "@type": "ContactPoint",
              telephone: "+90-XXX-XXX-XXXX",
              contactType: "customer service",
            },
            sameAs: organizationData.sameAs || [
              "https://facebook.com/vizepedia",
              "https://instagram.com/vizepediacom",
              "https://youtube.com/vizepedia",
            ],
          })}
        </script>
      )}

      {/* Website Structured Data */}
      {websiteData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: websiteData.name || siteName,
            url: websiteData.url || "https://www.vizepedia.com",
            description: websiteData.description || description,
            publisher: {
              "@type": "Organization",
              name: websiteData.publisher?.name || siteName,
              logo: {
                "@type": "ImageObject",
                url:
                  websiteData.publisher?.logo ||
                  "https://www.vizepedia.com/logo.png",
              },
            },
            potentialAction: websiteData.potentialAction || {
              "@type": "SearchAction",
              target: "https://www.vizepedia.com/ara?q={search_term_string}",
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
  url: PropTypes.string.isRequired,
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
  tags: PropTypes.array,
  wordCount: PropTypes.number,
  readingTime: PropTypes.string,
  twitterCard: PropTypes.string,
  twitterSite: PropTypes.string,
  twitterCreator: PropTypes.string,
  openGraphType: PropTypes.string,
  siteName: PropTypes.string,
  themeColor: PropTypes.string,
  appleStatusBarStyle: PropTypes.string,
};

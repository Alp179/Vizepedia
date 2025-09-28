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
}) {
  const robots = noindex ? "noindex,nofollow" : "index,follow";
  
  // Ensure image URL is absolute
  const absoluteImageUrl = image?.startsWith('http') 
    ? image 
    : `https://www.vizepedia.com${image}`;

  // Ensure canonical URL is absolute and uses HTTPS www version
  const canonicalUrl = url?.startsWith('http') 
    ? url 
    : `https://www.vizepedia.com${url || ''}`;

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      
      {/* Always set canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {prevUrl && <link rel="prev" href={prevUrl} />}
      {nextUrl && <link rel="next" href={nextUrl} />}

      {/* Open Graph tags */}
      <meta property="og:type" content="website" />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteImageUrl} />
      
      {/* Additional Open Graph tags for better social sharing */}
      <meta property="og:site_name" content="Vizepedia" />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:site" content="@vizepedia" />
      
      {/* Additional meta tags for better SEO */}
      <meta name="author" content="Vizepedia" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Prevent duplicate content issues */}
      <meta httpEquiv="content-language" content="tr" />
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
};
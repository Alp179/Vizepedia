import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  keywords,
  image = "/vite.svg",
  url,
  noindex = false,
  prevUrl,
  nextUrl,
}) {
  const robots = noindex ? "noindex,nofollow" : "index,follow";
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />
      {prevUrl && <link rel="prev" href={prevUrl} />}
      {nextUrl && <link rel="next" href={nextUrl} />}

      <meta property="og:type" content="website" />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
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

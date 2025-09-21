import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

const normalizeCanonical = (u) => {
  if (!u) return "";
  try {
    const url = new URL(u);
    // slash politikanı seç: ben son slash'ı siliyorum (anasayfada hariç)
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }
    url.hash = ""; // #fragment istemeyiz
    return url.toString();
  } catch {
    return u; // geçersizse olduğu gibi bırak
  }
};

export default function SEO({
  title,
  description,
  keywords,
  image = "/vite.svg",
  url,
  noindex = false,
}) {
  const canonical = normalizeCanonical(url);
  const robots = noindex ? "noindex,nofollow" : "index,follow";
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && (
        <meta
          name="keywords"
          content={Array.isArray(keywords) ? keywords.join(", ") : keywords}
        />
      )}
      <meta name="robots" content={robots} />

      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content="website" />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
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
  url: PropTypes.string, // zorunlu yapmana gerek yok, koşullu render ediyoruz
  noindex: PropTypes.bool,
};

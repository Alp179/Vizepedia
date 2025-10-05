/* eslint-disable react/prop-types */
import { useMemo } from "react";
import Head from "next/head";

export default function JsonLd({ data, id = null }) {
  // Her zaman çalışacak useMemo hook
  const jsonLdString = useMemo(() => {
    // Validation
    if (!data || typeof data !== "object") {
      if (
        typeof window !== "undefined" &&
        window.location?.hostname === "localhost"
      ) {
        console.warn("JsonLd: Invalid data provided");
      }
      return null;
    }

    // Required fields check
    if (!data["@context"] || !data["@type"]) {
      if (
        typeof window !== "undefined" &&
        window.location?.hostname === "localhost"
      ) {
        console.warn("JsonLd: Missing required @context or @type");
      }
    }

    try {
      return JSON.stringify(data);
    } catch (error) {
      if (
        typeof window !== "undefined" &&
        window.location?.hostname === "localhost"
      ) {
        console.error("JsonLd: Error stringifying data:", error);
      }
      return null;
    }
  }, [data]);

  if (!jsonLdString) return null;

  return (
    <Head>
      <script
        type="application/ld+json"
        id={id}
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
        key={id || `json-ld-${jsonLdString.slice(0, 50)}`}
      />
    </Head>
  );
}

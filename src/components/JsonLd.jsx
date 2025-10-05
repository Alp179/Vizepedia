/* eslint-disable react/prop-types */
import { useMemo, useEffect } from "react";

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
        console.warn(
          "JsonLd: JSON-LD verisi eksik: @context veya @type bulunamadı"
        );
      }
    }

    try {
      return JSON.stringify(data);
    } catch (error) {
      if (
        typeof window !== "undefined" &&
        window.location?.hostname === "localhost"
      ) {
        console.error("JsonLd: JSON string oluşturma hatası:", error);
      }
      return null;
    }
  }, [data]);

  // Script'i DOM'e eklemek
  useEffect(() => {
    if (!jsonLdString) return;

    // Eğer zaten aynı ID'ye sahip bir script varsa, onu öncekini kaldır
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Yeni script oluştur ve ekle
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = jsonLdString;

    document.head.appendChild(script);

    // Cleanup function (isteğe bağlı)
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [jsonLdString, id]);

  if (!jsonLdString) return null;

  return null;
}

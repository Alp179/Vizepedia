// src/utils/seoHelpers.js
export function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function summarize(text, max = 160) {
  if (!text) return "";
  const t = stripHtml(text);
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

export function toSlug(s) {
  if (!s) return "";
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // aksan temizle
    .replace(/[^a-z0-9\s-]/g, "") // özel karakterleri at
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function keywordize(tags, fallback) {
  if (Array.isArray(tags)) return tags.join(", ");
  if (typeof tags === "string") return tags;
  return fallback;
}

export function buildCanonical(base, path) {
  // path zaten / ile başlıyorsa tekrar ekleme
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

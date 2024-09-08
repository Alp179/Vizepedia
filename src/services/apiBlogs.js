import supabase from "./supabase";

// Tüm blog yazılarını çek
export async function fetchAllBlogs() {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Belirli bir blog yazısını slug ile çek
export async function fetchBlogBySlug(slug) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Benzer etiketlere sahip blog yazılarını getir
// Benzer etiketlere sahip blog yazılarını getir
// Benzer etiketlere sahip blog yazılarını getir
export async function fetchRelatedBlogs(tags) {
  // tags'i virgülle ayrılmış string olarak kabul ediyoruz ve her bir etiketi ayrı ayrı aratıyoruz
  const searchTags = tags.split(",").map((tag) => tag.trim()); // Virgüllerden ayırıp her bir etiketi trimliyoruz

  // Tüm etiketleri ilike sorgusu ile aratıyoruz
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .or(searchTags.map((tag) => `tags.ilike.%${tag}%`).join(",")) // Her bir etiket için ilike sorgusu
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Bloglarda arama yapma fonksiyonu

// Bloglarda arama yapma fonksiyonu

// Bloglarda arama yapma fonksiyonu
export async function searchBlogs(searchTerm) {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .or(
      `title.ilike.%${lowerCaseSearchTerm}%,content.ilike.%${lowerCaseSearchTerm}%,tags.ilike.%${lowerCaseSearchTerm}%`
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

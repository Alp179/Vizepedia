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
    .select(
      `
      id,
      title,
      slug,
      content,
      category,
      tags,
      cover_image,
      created_at,
      updated_at,
      section1_title,
      section1_content,
      section1_image,
      section2_title,
      section2_content,
      section2_image,
      section3_title,
      section3_content,
      section3_image
    `
    )
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Benzer etiketlere sahip blog yazılarını getir
export async function fetchRelatedBlogs(tags, currentSlug = null) {
  if (!tags) return [];

  // tags'i virgülle ayrılmış string olarak kabul ediyoruz ve her bir etiketi ayrı ayrı aratıyoruz
  const searchTags = tags.split(",").map((tag) => tag.trim()); // Virgüllerden ayırıp her bir etiketi trimliyoruz

  // Tüm etiketleri ilike sorgusu ile aratıyoruz
  let query = supabase
    .from("blogs")
    .select(
      `
      id,
      title,
      slug,
      category,
      tags,
      cover_image,
      created_at
    `
    )
    .or(searchTags.map((tag) => `tags.ilike.%${tag}%`).join(",")) // Her bir etiket için ilike sorgusu
    .order("created_at", { ascending: false });

  // Eğer mevcut blog slugı varsa, o blogu sonuçlardan hariç tut
  if (currentSlug) {
    query = query.neq("slug", currentSlug);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

// Bloglarda arama yapma fonksiyonu
export async function searchBlogs(searchTerm) {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .or(
      `title.ilike.%${lowerCaseSearchTerm}%,
      content.ilike.%${lowerCaseSearchTerm}%,
      tags.ilike.%${lowerCaseSearchTerm}%,
      section1_title.ilike.%${lowerCaseSearchTerm}%,
      section1_content.ilike.%${lowerCaseSearchTerm}%,
      section2_title.ilike.%${lowerCaseSearchTerm}%,
      section2_content.ilike.%${lowerCaseSearchTerm}%,
      section3_title.ilike.%${lowerCaseSearchTerm}%,
      section3_content.ilike.%${lowerCaseSearchTerm}%`
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function fetchVisaBlogs() {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("category", "Vize") // Yalnızca "Vize" kategorisindeki blogları al
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Kategori bazında blog yazılarını getir
export async function fetchBlogsByCategory(category) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Yeni blog ekle
export async function createBlog(blogData) {
  const { data, error } = await supabase
    .from("blogs")
    .insert([blogData])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

// Blog güncelle
export async function updateBlog(id, blogData) {
  const { data, error } = await supabase
    .from("blogs")
    .update(blogData)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

// Blog sil
export async function deleteBlog(id) {
  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}

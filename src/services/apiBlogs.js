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
export async function fetchRelatedBlogs(tags) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .contains("tags", tags)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

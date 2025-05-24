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

// Belirli bir blog yazısını slug ile çek - sources kolonu eklendi
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
      section3_image,
      sources
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

// Bloglarda arama yapma fonksiyonu - Sözdizimi hatası düzeltildi
export async function searchBlogs(searchTerm) {
  // Arama terimi validasyonu
  if (!searchTerm || searchTerm.trim() === '') {
    console.log('Arama terimi boş');
    return [];
  }
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  console.log('Arama yapılıyor:', lowerCaseSearchTerm);

  try {
    // Supabase sorgusu - düzeltilmiş or sözdizimi
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, content, category, tags, cover_image, created_at")
      .or(`title.ilike.%${lowerCaseSearchTerm}%,content.ilike.%${lowerCaseSearchTerm}%,tags.ilike.%${lowerCaseSearchTerm}%,category.ilike.%${lowerCaseSearchTerm}%`)
      .order("created_at", { ascending: false });

    // Hata kontrolü
    if (error) {
      console.error('Supabase arama hatası:', error);
      throw new Error(`Arama hatası: ${error.message}`);
    }
    
    // Başarılı durum logları
    console.log('Supabase arama sonuçları:', data?.length || 0, 'sonuç bulundu');
    if (data?.length > 0) {
      console.log('İlk sonuç:', { 
        id: data[0].id, 
        title: data[0].title, 
        slug: data[0].slug 
      });
    }
    
    return data || [];
  } catch (err) {
    // Hata yakalama ve loglama
    console.error('Arama işlemi başarısız:', err);
    throw err;
  }
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

// Kategori bazında blog yazılarını getir (Genel kullanım için)
export async function fetchBlogsByCategory(category) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Sidebar için kategori bazında blog yazılarını getir (optimize edilmiş)
export async function fetchRelatedBlogsByCategory(category, currentSlug = null, limit = 10) {
  if (!category) {
    console.log('Kategori belirtilmedi, boş array döndürülüyor');
    return [];
  }

  console.log('Sidebar için kategori bazında blog arıyor:', {
    category,
    currentSlug,
    limit
  });

  try {
    let query = supabase
      .from("blogs")
      .select(`
        id,
        title,
        slug,
        category,
        tags,
        cover_image,
        created_at
      `)
      .eq("category", category) // Kategori bazında filtrele
      .order("created_at", { ascending: false });

    // ÖNEMLI: Mevcut blog slugı varsa, o blogu sonuçlardan hariç tut
    if (currentSlug) {
      console.log('Mevcut slug hariç tutuluyor:', currentSlug);
      query = query.neq("slug", currentSlug);
    }

    // Limit'i en sonda uygula
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Sidebar kategori bazında blog getirme hatası:', error);
      throw new Error(error.message);
    }

    console.log(`Sidebar: ${category} kategorisinde ${data?.length || 0} blog bulundu (${currentSlug} hariç)`);
    
    // Debug için sonuçları kontrol et
    if (data?.length > 0) {
      console.log('Getirilen blog slug\'ları:', data.map(blog => blog.slug));
      console.log('Mevcut slug:', currentSlug);
      
      // Eğer mevcut slug listede varsa, uyarı ver
      const currentInList = data.find(blog => blog.slug === currentSlug);
      if (currentInList) {
        console.warn('🚨 UYARI: Mevcut blog listede gözüküyor!', currentInList);
      }
    }
    
    return data || [];
    
  } catch (err) {
    console.error('Sidebar kategori bazında blog getirme işlemi başarısız:', err);
    throw err;
  }
}

// En yeni blog yazılarını getir
export async function fetchRecentBlogs(limit = 10, excludeSlug = null) {
  console.log('En yeni bloglar getiriliyor:', {
    limit,
    excludeSlug
  });

  try {
    let query = supabase
      .from("blogs")
      .select(`
        id,
        title,
        slug,
        category,
        tags,
        cover_image,
        created_at
      `)
      .order("created_at", { ascending: false });

    // Eğer hariç tutulacak slug varsa
    if (excludeSlug) {
      console.log('Hariç tutulan slug:', excludeSlug);
      query = query.neq("slug", excludeSlug);
    }

    // Limit'i en sonda uygula
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('En yeni blogları getirme hatası:', error);
      throw new Error(error.message);
    }

    console.log(`En yeni ${data?.length || 0} blog getirildi${excludeSlug ? ` (${excludeSlug} hariç)` : ''}`);
    
    // Debug için sonuçları kontrol et
    if (data?.length > 0) {
      console.log('En yeni bloglar:', data.map(blog => ({
        title: blog.title,
        category: blog.category,
        date: blog.created_at
      })));
    }
    
    return data || [];
    
  } catch (err) {
    console.error('En yeni blogları getirme işlemi başarısız:', err);
    throw err;
  }
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
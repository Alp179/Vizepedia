import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "../services/apiBlogs";
import styled from "styled-components";
import BlogSearchCards from "../ui/BlogSearchCards";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import Footer from "../ui/Footer";

const CategoryContainer = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 60px auto;
  padding: 120px 50px 30px;
  position: relative;

  @media (max-width: 1300px) {
    width: 95%;
    padding: 120px 30px 20px;
  }
  @media (max-width: 550px) {
    margin-top: 20px;
    padding: 100px 15px 20px;
  }
`;

const CategoryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const CategoryTitle = styled.h1`
  font-size: 72px;
  font-weight: 700;
  color: var(--color-grey-916);
  margin-bottom: 1rem;
  line-height: 1.1;
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5), 0px 0px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  display: inline-block;

  @media (max-width: 1300px) {
    font-size: 60px;
  }
  @media (max-width: 910px) {
    font-size: 52px;
  }
  @media (max-width: 810px) {
    font-size: 42px;
  }
  @media (max-width: 660px) {
    font-size: 36px;
  }
  @media (max-width: 550px) {
    font-size: 32px;
  }
  @media (max-width: 485px) {
    font-size: 28px;
  }
  @media (max-width: 435px) {
    font-size: 24px;
  }
  @media (max-width: 390px) {
    font-size: 22px;
  }
  @media (max-width: 365px) {
    font-size: 20px;
  }
  @media (max-width: 320px) {
    font-size: 18px;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, var(--color-brand-600), var(--color-brand-700));
    border-radius: 2px;
  }
`;

const CategoryDescription = styled.p`
  font-size: 1.2rem;
  color: var(--color-grey-600);
  max-width: 800px;
  margin: 2rem auto 0;
  line-height: 1.6;
`;

const PostCountInfo = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
`;

const PostCountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-grey-600);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &::before {
    content: "📄";
    margin-right: 0.5rem;
  }
`;

const CategoryNavigation = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 3rem 0 2rem;
`;

const CategoryTag = styled(Link)`
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: ${props => props.active ? 'var(--color-brand-600)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? 'white' : 'var(--color-grey-600)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--color-brand-700)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-3px);
  }
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SortSelect = styled.select`
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-grey-600);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin: 2rem auto;
  max-width: 600px;
  
  h3 {
    font-size: 1.5rem;
    color: var(--color-grey-916);
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--color-grey-600);
    margin-bottom: 1.5rem;
  }
`;

const BackToBlog = styled.div`
  text-align: center;
  margin-top: 2rem;
  
  a {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background: var(--color-brand-600);
    color: white;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.3s ease;
    
    &:hover {
      background: var(--color-brand-700);
    }
  }
`;

const RelatedCategories = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RelatedTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--color-grey-916);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const RelatedCategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 100%;
  }
`;

const RelatedCategoryCard = styled(Link)`
  display: block;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-5px);
  }
`;

const RelatedCategoryName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-grey-916);
  margin-bottom: 0.5rem;
`;

const RelatedCategoryCount = styled.div`
  font-size: 0.9rem;
  color: var(--color-grey-500);
`;

// Sayfalama bileşeni
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem 0;
  gap: 0.5rem;
`;

const PaginationButton = styled.button`
  padding: 0.6rem 1rem;
  background: ${props => props.active ? 'var(--color-brand-600)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: ${props => props.active ? 'white' : 'var(--color-grey-600)'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? 'var(--color-brand-700)' : 'rgba(255, 255, 255, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.span`
  margin: 0 1rem;
  color: var(--color-grey-500);
  font-size: 0.9rem;
`;

function BlogCategory() {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('date-newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allBlogs"],
    queryFn: fetchAllBlogs,
    staleTime: 60_000,
  });

  // Kategoriye göre filtrelenmiş bloglar
  const categoryBlogs = useMemo(() => {
    if (!blogs) return [];
    
    const decodedCategory = decodeURIComponent(category);
    return blogs.filter(blog => 
      blog.category && blog.category.toLowerCase() === decodedCategory.toLowerCase()
    );
  }, [blogs, category]);

  // Sıralanmış bloglar
  const sortedBlogs = useMemo(() => {
    let result = [...categoryBlogs];
    
    switch (sortBy) {
      case 'date-newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'date-oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'popularity':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'title-asc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-desc':
        result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      default:
        break;
    }
    
    return result;
  }, [categoryBlogs, sortBy]);

  // Sayfalama için hesaplamalar
  const totalPages = Math.ceil(sortedBlogs.length / itemsPerPage);
  const currentBlogs = sortedBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Tüm kategorileri çıkar
  const allCategories = useMemo(() => {
    if (!blogs) return [];
    
    const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
    return categories.sort();
  }, [blogs]);

  // Yazı adedi
  const postCount = categoryBlogs.length;

  // İlgili kategoriler (mevcut kategori hariç)
  const relatedCategories = useMemo(() => {
    const categoryCounts = {};
    
    blogs?.forEach(blog => {
      if (blog.category && blog.category.toLowerCase() !== category.toLowerCase()) {
        categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1;
      }
    });
    
    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([cat, count]) => ({ category: cat, count }));
  }, [blogs, category]);

  // Kategori açıklamaları
  const categoryDescriptions = {
    'vize': 'Vize başvurusu süreçleri, gereklilikler ve güncel vize haberleri hakkında detaylı bilgiler.',
    'seyahat': 'Seyahat ipuçları, rotalar ve gezilecek yerler hakkında yazılar.',
    'schengen': 'Schengen vizesi başvurusu ve Avrupa seyahatleri için rehberler.',
    'amerika': 'ABD vizesi başvuru süreci ve Amerika seyahat ipuçları.',
    'turist': 'Turist vizesi ve tatil planlama ile ilgili yazılar.',
    'iş': 'İş vizesi ve çalışma izinleri hakkında bilgiler.',
    'eğitim': 'Öğrenci vizesi ve eğitim fırsatları hakkında yazılar.',
    'sağlık': 'Sağlık sigortası ve seyahat sağlık konuları.'
  };

  const decodedCategory = decodeURIComponent(category);
  const description = categoryDescriptions[decodedCategory.toLowerCase()] || 
    `${decodedCategory} kategorisindeki tüm blog yazıları.`;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid var(--color-grey-905)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Bir hata oluştu</h3>
        <p>Bloglar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${decodedCategory} Kategorisi - Vizepedia Blog`}
        description={description}
        keywords={`blog, ${decodedCategory}, vize blog, seyahat ipuçları, Vizepedia`}
        url={`https://www.vizepedia.com/blog/kategori/${encodeURIComponent(category)}`}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${decodedCategory} Kategorisi`,
          description: description,
          url: `https://www.vizepedia.com/blog/kategori/${encodeURIComponent(category)}`,
        }}
      />

      <CategoryContainer>
        <CategoryHeader>
          <CategoryTitle>{decodedCategory}</CategoryTitle>
          <CategoryDescription>{description}</CategoryDescription>
          
          <PostCountInfo>
            <PostCountBadge>{postCount} yazı</PostCountBadge>
          </PostCountInfo>
        </CategoryHeader>

        <CategoryNavigation>
          {allCategories.map(cat => (
            <CategoryTag 
              key={cat} 
              to={`/blog/kategori/${encodeURIComponent(cat)}`}
              active={cat.toLowerCase() === decodedCategory.toLowerCase()}
            >
              {cat}
            </CategoryTag>
          ))}
        </CategoryNavigation>

        <SortContainer>
          <SortSelect 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-newest">En Yeni</option>
            <option value="date-oldest">En Eski</option>
            <option value="popularity">Popülerlik</option>
            <option value="title-asc">Başlık (A-Z)</option>
            <option value="title-desc">Başlık (Z-A)</option>
          </SortSelect>
        </SortContainer>

        {currentBlogs.length > 0 ? (
          <>
            <BlogSearchCards blogs={currentBlogs} query={''} />
            
            {/* Sayfalama */}
            {totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Önceki
                </PaginationButton>
                
                <PaginationInfo>
                  Sayfa {currentPage} / {totalPages}
                </PaginationInfo>
                
                <PaginationButton 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sonraki
                </PaginationButton>
              </PaginationContainer>
            )}
            
            <BackToBlog>
              <Link to="/blog">Tüm Blog Yazılarına Dön</Link>
            </BackToBlog>
          </>
        ) : (
          <NoResults>
            <h3>Bu kategoride henüz yazı bulunmuyor</h3>
            <p>
              &ldquo;<strong>{decodedCategory}</strong>&rdquo; kategorisinde henüz blog yazısı bulunmuyor. 
              Lütfen başka bir kategoriye göz atın veya ana sayfaya dönün.
            </p>
            <BackToBlog>
              <Link to="/blog">Tüm Blog Yazılarını Görüntüle</Link>
            </BackToBlog>
          </NoResults>
        )}
      </CategoryContainer>
      
      {/* İlgili Kategoriler Bölümü */}
      {relatedCategories.length > 0 && (
        <RelatedCategories>
          <RelatedTitle>Diğer Kategoriler</RelatedTitle>
          <RelatedCategoriesGrid>
            {relatedCategories.map(({ category: cat, count }) => (
              <RelatedCategoryCard 
                key={cat} 
                to={`/blog/kategori/${encodeURIComponent(cat)}`}
              >
                <RelatedCategoryName>{cat}</RelatedCategoryName>
                <RelatedCategoryCount>{count} yazı</RelatedCategoryCount>
              </RelatedCategoryCard>
            ))}
          </RelatedCategoriesGrid>
        </RelatedCategories>
      )}
      
      <Footer />
    </>
  );
}

export default BlogCategory;
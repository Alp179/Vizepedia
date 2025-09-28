/* eslint-disable react/prop-types */
import styled from "styled-components";
import BlogSearchCards from "../ui/BlogSearchCards";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import SearchBar from "../ui/SearchBar";
import Footer from "../ui/Footer";

const SearchResultsContainer = styled.div`
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

const SearchHeader = styled.h1`
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5), 0px 0px 10px rgba(0, 0, 0, 0.3);
  font-weight: 100;
  color: var(--color-grey-916);
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  margin-bottom: 20px;
  font-size: 72px;
  line-height: 1.1;
  letter-spacing: -0.5px;
  position: relative;
  -webkit-text-stroke: 0.2px rgba(0, 0, 0, 0.2);

  @media (max-width: 1300px) {
    font-size: 60px;
  }
  @media (max-width: 910px) {
    font-size: 52px;
  }
  @media (max-width: 810px) {
    font-size: 42px;
    margin-bottom: 10px;
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
    font-size: 28px;
  }
  @media (max-width: 390px) {
    font-size: 28px;
  }
  @media (max-width: 365px) {
    font-size: 24px;
  }
  @media (max-width: 320px) {
    font-size: 24px;
  }
`;

const SearchTerm = styled.span`
  font-weight: 700;
  color: var(--color-brand-600);
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
  
  .suggestions {
    margin-top: 1.5rem;
    
    h4 {
      font-size: 1.1rem;
      color: var(--color-grey-916);
      margin-bottom: 0.8rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        margin-bottom: 0.5rem;
        
        a {
          color: var(--color-brand-600);
          text-decoration: none;
          font-weight: 500;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
`;

const ResultCount = styled.p`
  text-align: center;
  font-size: 2rem;
  color: var(--color-grey-500);
  margin-bottom: 2rem;
  font-weight: 500;
  @media (max-width: 320px) {
  font-size: 16px;
  }
`;

const BackToBlog = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 16px;
  
  a {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background: #004466;
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

// Sıralama için bileşen
const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-grey-600);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

// En güncel bloglar bölümü için güncellenmiş stiller
const LatestBlogsSection = styled.div`
  margin-top: 100px;
  margin-bottom:100px;
  padding: 2.5rem;
  background: linear-gradient(135deg, rgba(0, 68, 102, 0.1), rgba(0, 51, 85, 0.05));
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const LatestBlogsTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-grey-600);
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, var(--color-brand-600), var(--color-brand-700));
    border-radius: 2px;
  }
`;

const LatestBlogsContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content:center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const LatestBlogCard = styled(Link)`
  display: block;
  padding: 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  height: 100%;
  min-width: 240px;
  max-width: 300px;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--color-brand-600), var(--color-brand-700));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    
    &::before {
      transform: scaleX(1);
    }
    
    .latest-blog-image {
      transform: scale(1.05);
    }
  }
`;

const LatestBlogImage = styled.div`
  position: relative;
  height: 180px;
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
`;

const LatestBlogContent = styled.div`
  padding: 1.5rem;
`;

const LatestBlogTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-grey-600);
  margin-bottom: 0.8rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const LatestBlogExcerpt = styled.p`
  font-size: 0.9rem;
  color: var(--color-grey-600);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const LatestBlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const LatestBlogDate = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--color-grey-500);
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    opacity: 0.7;
  }
`;

const LatestBlogCategory = styled.span`
  background: #004466;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 8px rgba(0, 68, 102, 0.3);
`;

const LatestBlogBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 2;
  backdrop-filter: blur(5px);
`;

// Sayfalama bileşeni
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
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

function BlogSearchResults({ blogs, query, latestBlogs }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Sıralanmış bloglar
  const sortedBlogs = useMemo(() => {
    let result = [...blogs];
    const queryLower = query.toLowerCase();
    
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
      case 'relevance':
      default:
        // Varsayılan olarak alaka düzeyine göre (arama terimiyle eşleşme)
        result.sort((a, b) => {
          const aTitle = a.title?.toLowerCase() || '';
          const bTitle = b.title?.toLowerCase() || '';
          const aExcerpt = a.excerpt || a.summary || '';
          const bExcerpt = b.excerpt || b.summary || '';
          
          // Başlıkta tam eşleşme varsa öncelikli
          if (aTitle.includes(queryLower) && !bTitle.includes(queryLower)) return -1;
          if (!aTitle.includes(queryLower) && bTitle.includes(queryLower)) return 1;
          
          // Özette tam eşleşme varsa öncelikli
          if (aExcerpt.includes(queryLower) && !bExcerpt.includes(queryLower)) return -1;
          if (!aExcerpt.includes(queryLower) && bExcerpt.includes(queryLower)) return 1;
          
          return 0;
        });
        break;
    }
    
    return result;
  }, [blogs, sortBy, query]);
  
  // Sayfalama için hesaplamalar
  const totalPages = Math.ceil(sortedBlogs.length / itemsPerPage);
  const currentBlogs = sortedBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Arama işlevi
  const handleSearch = (searchTerm) => {
    const params = new URLSearchParams(window.location.search);
    if (searchTerm) {
      params.set("q", searchTerm);
    } else {
      params.delete("q");
    }
    navigate(`/blog?${params.toString()}`);
  };

  return (
    <>
      <SEO
        title={`"${query}" Arama Sonuçları - Vizepedia Blog`}
        description={`"${query}" için arama sonuçları. Vize başvurusu süreçleri, seyahat ipuçları ve güncel vize haberleri.`}
        keywords={`blog, arama, ${query}, vize blog, seyahat ipuçları, vize haberleri, Vizepedia`}
        url={`https://www.vizepedia.com/blog?q=${encodeURIComponent(query)}`}
        noindex={true}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          name: `"${query}" Arama Sonuçları`,
          description: `"${query}" için Vizepedia blog arama sonuçları.`,
        }}
      />

      <SearchResultsContainer>
        <SearchHeader>
          Arama Sonuçları: <SearchTerm>&ldquo;{query}&rdquo;</SearchTerm>
        </SearchHeader>
        
        <ResultCount>
          {sortedBlogs.length} sonuç bulundu
        </ResultCount>

        {/* Sıralama Seçeneği */}
        <SortContainer>
          <SortSelect 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Alaka Düzeyi</option>
            <option value="date-newest">En Yeni</option>
            <option value="date-oldest">En Eski</option>
            <option value="popularity">Popülerlik</option>
          </SortSelect>
        </SortContainer>

        {currentBlogs.length > 0 ? (
          <>
            <BlogSearchCards blogs={currentBlogs} query={query} />
            
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
            <h3>Sonuç Bulunamadı</h3>
            <p>
              &ldquo;<strong>{query}</strong>&rdquo; için sonuç bulunamadı. Lütfen farklı
              bir anahtar kelime deneyin.
            </p>
            
            {/* Arama Çubuğu */}
            <div style={{ margin: '2rem 0' }}>
              <SearchBar
                initialValue={query}
                onSearch={handleSearch}
                ariaLabel="Bloglarda ara"
              />
            </div>
            
            <div className="suggestions">
              <h4>Önerilen Aramalar:</h4>
              <ul>
                <li><Link to="/blog?q=vize">vize</Link></li>
                <li><Link to="/blog?q=seyahat">seyahat</Link></li>
                <li><Link to="/blog?q=schengen">schengen</Link></li>
                <li><Link to="/blog?q=amerika">amerika</Link></li>
                <li><Link to="/blog?q=turist">turist</Link></li>
              </ul>
            </div>
            <BackToBlog>
              <Link to="/blog">Tüm Blog Yazılarını Görüntüle</Link>
            </BackToBlog>
          </NoResults>
        )}
      </SearchResultsContainer>
      
      {/* En Güncel Bloglar Bölümü */}
      {latestBlogs && latestBlogs.length > 0 && (
        <LatestBlogsSection>
          <LatestBlogsTitle>En Güncel Bloglarımız</LatestBlogsTitle>
          <LatestBlogsContainer>
            {latestBlogs.slice(0, 3).map(blog => (
              <LatestBlogCard key={blog.id} to={`/blog/${blog.slug}`}>
                <LatestBlogBadge>YENİ</LatestBlogBadge>
                <LatestBlogImage className="latest-blog-image">
                  <img 
                    src={blog.cover_image || '/placeholder-image.jpg'} 
                    alt={blog.title || 'Blog görseli'} 
                  />
                </LatestBlogImage>
                <LatestBlogContent>
                  <LatestBlogTitle>{blog.title}</LatestBlogTitle>
                  <LatestBlogExcerpt>{blog.excerpt || blog.summary || ''}</LatestBlogExcerpt>
                  <LatestBlogMeta>
                    <LatestBlogDate>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {new Date(blog.created_at).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </LatestBlogDate>
                    <LatestBlogCategory>{blog.category}</LatestBlogCategory>
                  </LatestBlogMeta>
                </LatestBlogContent>
              </LatestBlogCard>
            ))}
          </LatestBlogsContainer>
        </LatestBlogsSection>
      )}
      <Footer />
    </>
  );
}

export default BlogSearchResults;
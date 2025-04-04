/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useRef, useState, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Daha yumuşak ve profesyonel animasyonlar
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const CategoriesWrapper = styled.div`
  position: relative;
  margin-top: 40px;
  display: flex;
  overflow-x: hidden;
  padding: 20px 10px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.03);
  
  @media (max-width: 550px) {
    margin-top: 30px;
    padding: 15px 5px;
  }
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const CategoriesContainer = styled.div`
  display: flex;
  gap: 25px;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 10px 5px;
  width: 100%;
  
  @media (max-width: 910px) {
    gap: 15px;
  }
`;

// Kategori sütunlarına animasyon ekleyerek yüklenmesini sağlıyoruz
const CategoryColumn = styled.div`
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  animation: ${fadeInUp} 0.5s ease forwards;
  animation-delay: ${props => props.index * 0.1}s;
  opacity: 0;
  transition: all 0.5s ease;
  
  // Aktif, önceki ve sonraki kategori durumları
  &.category--current {
    opacity: 1;
    transform: scale(1);
    z-index: 3;
  }
  
  &.category--previous,
  &.category--next {
    opacity: 0.8;
    z-index: 2;
  }
  
  &.category--hidden {
    opacity: 0.5;
    z-index: 1;
  }
  
  @media (max-width: 910px) {
    flex: 0 0 270px;
    gap: 20px;
  }
  
  @media (max-width: 550px) {
    flex: 0 0 ${props => props.isMobile ? '100%' : '260px'};
    width: ${props => props.isMobile ? '100%' : '260px'};
    gap: 15px;
  }
`;

// Kart temel stillerini geliştiriyoruz
const BlogItem = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const LargeBlogItem = styled(BlogItem)`
  display: flex;
  flex-direction: column;
  height: 380px;
  
  @media (max-width: 550px) {
    height: 340px; /* Mobil görünümde yüksekliği azaltıyoruz */
  }
`;

const SmallBlogItem = styled(BlogItem)`
  height: 130px;
  display: flex;
  align-items: center;
  animation: ${fadeInUp} 0.5s ease both;
  animation-delay: ${props => (props.index + 1) * 0.1}s;
  
  @media (max-width: 550px) {
    height: 110px; /* Mobil görünümde küçük kartların yüksekliğini azaltıyoruz */
  }
`;

const CategoryLabel = styled.span`
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, var(--color-grey-911), var(--color-grey-908));
  color: var(--color-grey-600);
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  z-index: 2;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

// Görsel stillerini iyileştiriyoruz
const BlogImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.4));
  }
  
  ${BlogItem}:hover & {
    transform: scale(1.05);
  }
  
  @media (max-width: 550px) {
    height: 180px;
  }
`;

const SmallBlogImage = styled.div`
  width: 110px;
  height: 90px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  margin: 0 0 0 10px;
  border-radius: 12px;
  transition: transform 0.5s ease;
  
  ${SmallBlogItem}:hover & {
    transform: scale(1.05);
  }
  
  @media (max-width: 550px) {
    width: 90px;
    height: 70px;
  }
`;

// Yükleme durumu için iskelet ekranı
const SkeletonImage = styled.div`
  width: ${props => props.small ? '110px' : '100%'};
  height: ${props => props.small ? '90px' : '200px'};
  background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
  background-size: 800px 100px;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: ${props => props.small ? '12px' : '0'};
  margin: ${props => props.small ? '0 0 0 10px' : '0'};
  
  @media (max-width: 550px) {
    width: ${props => props.small ? '90px' : '100%'};
    height: ${props => props.small ? '70px' : '180px'};
  }
`;

// İçerik stillerini iyileştiriyoruz
const BlogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 15px;
  flex: 1;
`;

const SmallBlogContent = styled.div`
  gap: 8px;
  margin: 4px 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 5px;
`;

const BlogTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--color-grey-600);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;

  @media (max-width: 910px) {
    font-size: 15px;
  }
`;

const SmallBlogTitle = styled(BlogTitle)`
  font-size: 14px;
  margin-bottom: 5px;
  -webkit-line-clamp: 2;
  
  @media (max-width: 910px) {
    font-size: 13px;
  }
`;

const BlogExcerpt = styled.p`
  font-size: 14px;
  color: var(--color-grey-600);
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  
  @media (max-width: 910px) {
    font-size: 13px;
  }
`;

const BlogDate = styled.span`
  font-size: 12px;
  color: var(--color-grey-700);
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: var(--color-grey-905);
    border-radius: 50%;
    margin-right: 8px;
  }
`;

// "Devamını Gör" butonunu modernize ediyoruz
const ContinueReading = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: var(--color-grey-926);
  font-weight: bold;
  font-size: 13px;
  position: absolute;
  bottom: 15px;
  left: 15px;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  svg {
    margin-left: 5px;
    font-size: 16px;
    transition: margin-left 0.2s ease;
  }

  &:hover svg {
    margin-left: 10px;
  }
`;

// Ok butonlarını daha modern ve şık hale getiriyoruz
const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--color-grey-905);
  color: var(--color-grey-910);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);

  @media (max-width: 610px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  &:hover {
    background-color: #004466;
    color: #00ffa2;
    transform: translateY(-50%) scale(1.1);
  }

  &.left {
    left: -25px;
    
    @media (max-width: 768px) {
      left: -15px;
    }
  }

  &.right {
    right: -25px;
    
    @media (max-width: 768px) {
      right: -15px;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background-color: var(--color-grey-905);
      color: var(--color-grey-910);
      transform: translateY(-50%);
    }
  }
`;

// Daha modern "Daha Fazla Göster" butonu
const LoadMoreButton = styled.button`
  background: linear-gradient(135deg, #004466, #003355);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin: 50px auto;
  display: block;
  transition: all 0.3s ease;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #005577, #004466);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

// Sayfalama göstergesi
const PaginationIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
`;

const PaginationDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--color-grey-926)' : 'var(--color-grey-904)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

function BlogCardsMain({ blogs }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  // scrollPosition state'ini kaldırıyoruz çünkü artık kullanmıyoruz
  const [visibleCounts, setVisibleCounts] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  
  // Yeni state değişkeni: aktif kategori indeksi
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Cihazın mobil olup olmadığını kontrol et
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 550);
  
  // Sayfa yüklendiğinde ve pencere boyutu değiştiğinde mobil mi diye kontrol et
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 550);
    };
    
    window.addEventListener('resize', checkMobile);
    checkMobile(); // İlk yüklemede kontrol et
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Blog verileri geldiğinde visible counts başlat
  useEffect(() => {
    if (blogs && Object.keys(blogs).length > 0) {
      const groupedBlogsData = groupedBlogs();
      initializeVisibleCounts(Object.keys(groupedBlogsData));
      calculateTotalPages();
      
      // Pencere boyutu değiştiğinde yeniden hesapla
      const handleResize = () => {
        initializeVisibleCounts(Object.keys(groupedBlogsData));
        calculateTotalPages();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [blogs]); // calculateTotalPages ve groupedBlogs fonksiyonları komponent içinde tanımlandığı için bağımlılık olarak eklemeye gerek yok

  // Sayfalama sisteminde toplam sayfa sayısını hesapla
  const calculateTotalPages = () => {
    if (!containerRef.current) return;
    
    // Kategori sayısını kullan
    const categoryCount = Object.keys(groupedBlogs()).length;
    setTotalPages(categoryCount);
  };

  // Touch events for mobile scrolling - dokunmatik cihazlar için iyileştirilmiş sürükleme
  const handleTouchStart = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    // Dokunmatik başlangıcında animasyonu devre dışı bırak (daha pürüzsüz sürükleme için)
    containerRef.current.style.transition = 'none';
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const difference = startX - x;
    // Dokunmatik sürükleme duyarlılığını ayarlama
    const sensitivity = 1.2;
    setTranslateX(difference * sensitivity);
  };

  const handleTouchEnd = () => {
    if (!containerRef.current) return;
    
    // Animasyonu geri etkinleştir
    containerRef.current.style.transition = '';
    
    // Hareketin genişliğine ve hızına bağlı olarak kaydırma yönünü belirle
    // Daha küçük cihazlarda daha az hareket gerekli
    const threshold = window.innerWidth <= 550 ? 30 : 50;
    
    if (translateX > threshold) {
      handleNextClick();
    } else if (translateX < -threshold) {
      handlePreviousClick();
    } else {
      // Eşik değerinin altında bir hareket varsa, mevcut konuma geri dön
      // scrollPosition state'i yerine mevcut container scrollLeft değerini kullan
      if (containerRef.current.scrollLeft !== 0) {
        containerRef.current.scrollTo({ 
          left: containerRef.current.scrollLeft, 
          behavior: "smooth" 
        });
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };

  // Her kategori için küçük kartların sayısını başlat
  const initializeVisibleCounts = (categories) => {
    const initialCounts = {};
    categories.forEach((category) => {
      // Responsive tasarım için görüntü alanına göre sayı belirle
      if (window.innerWidth <= 550) {
        initialCounts[category] = 2;
      } else if (window.innerWidth <= 910) {
        initialCounts[category] = 3;
      } else {
        initialCounts[category] = 4;
      }
    });
    setVisibleCounts(initialCounts);
  };

  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    
    // Sadece birincil fare düğmesi (sol tıklama) için sürüklemeyi etkinleştir
    if (e.button !== 0) return;
    
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    
    // Fare sürüklemesi başladığında geçiş animasyonlarını devre dışı bırak
    containerRef.current.style.transition = 'none';
    
    // Varsayılan fare davranışlarını engelle
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const x = e.pageX - containerRef.current.offsetLeft;
    const difference = startX - x;
    
    // Fare hareketini daha duyarlı hale getir, ancak çok hızlı olmasını engelle
    const sensitivity = 1.0; // Normal hız için 1.0
    setTranslateX(difference * sensitivity);
    
    // Metin seçimini engelle
    e.preventDefault();
  };
  
  const handleMouseUpOrLeave = () => {
    if (!containerRef.current) return;
    
    // Animasyonu geri etkinleştir
    containerRef.current.style.transition = '';
    
    // Hareketin büyüklüğüne bağlı olarak kaydırma yönünü belirle
    // Masaüstü için daha büyük bir eşik değeri kullan
    const threshold = 50;
    
    if (translateX > threshold) {
      handleNextClick();
    } else if (translateX < -threshold) {
      handlePreviousClick();
    } else {
      // Eşik değerinin altında bir hareket varsa, mevcut konuma geri dön
      if (containerRef.current.scrollLeft !== 0) {
        containerRef.current.scrollTo({ 
          left: containerRef.current.scrollLeft, 
          behavior: "smooth" 
        });
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };

  // Blogları kategoriye göre grupla
  const groupedBlogs = () => {
    if (!blogs) return {};
    
    return blogs.reduce((acc, blog) => {
      (acc[blog.category] = acc[blog.category] || []).push(blog);
      return acc;
    }, {});
  };

  const handleNextClick = () => {
    const categoryCount = Object.keys(groupedBlogs()).length;
    const nextIndex = activeIndex + 1;
    
    // Döngüsel hareket - son kategoriden sonra ilk kategoriye geç
    setActiveIndex(nextIndex >= categoryCount ? 0 : nextIndex);
  };
  
  const handlePreviousClick = () => {
    const categoryCount = Object.keys(groupedBlogs()).length;
    const prevIndex = activeIndex - 1;
    
    // Döngüsel hareket - ilk kategoriden önce son kategoriye geç
    setActiveIndex(prevIndex < 0 ? categoryCount - 1 : prevIndex);
  };
  
  // Slider pagination dot'a tıklanınca
  const goToCategory = (categoryIndex) => {
    setActiveIndex(categoryIndex);
  };

  const handleLoadMore = () => {
    setVisibleCounts((prevCounts) => {
      const updatedCounts = {};
      Object.keys(prevCounts).forEach((category) => {
        updatedCounts[category] = prevCounts[category] + (window.innerWidth <= 550 ? 2 : 3);
      });
      return updatedCounts;
    });
  };

  // Daha fazla göster butonunu görüntüleme kontrolü
  const showLoadMoreButton = () => {
    const grouped = groupedBlogs();
    return Object.keys(grouped).some(
      (category) => grouped[category].length > (visibleCounts[category] || 0)
    );
  };

  const groupedBlogsData = groupedBlogs();

  return (
    <>
      <ArrowButton 
        className="left" 
        onClick={handlePreviousClick}
        aria-label="Önceki içerikler"
      >
        {"<"}
      </ArrowButton>
      
      <CategoriesWrapper
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Blog kategorileri"
      >
        <CategoriesContainer 
          style={{
            transform: isMobile ? 
              `translateX(-${activeIndex * 100}%)` : 
              `translateX(-${translateX}px)`
          }}
        >
          {Object.keys(groupedBlogsData).map((category, categoryIndex) => {
            // Kategoride blog yoksa bu kategoriyi gösterme
            if (!groupedBlogsData[category] || groupedBlogsData[category].length === 0) {
              return null;
            }
            
            const [latestBlog, ...otherBlogs] = groupedBlogsData[category];
            const visibleCount = visibleCounts[category] || (isMobile ? 2 : 4);
            
            // Kategori durumunu belirle
            let categoryClass = '';
            if (activeIndex === categoryIndex) categoryClass = 'category--current';
            else if (activeIndex - 1 === categoryIndex) categoryClass = 'category--previous';
            else if (activeIndex + 1 === categoryIndex) categoryClass = 'category--next';
            else categoryClass = 'category--hidden';

            return (
              <CategoryColumn 
                key={category} 
                index={categoryIndex}
                isMobile={isMobile}
                className={isMobile ? categoryClass : ''}
              >
                <LargeBlogItem>
                  <Link to={`/blog/${latestBlog.slug}`}>
                    <CategoryLabel>{category}</CategoryLabel>
                    {latestBlog.cover_image ? (
                      <BlogImage src={latestBlog.cover_image.trim()} />
                    ) : (
                      <SkeletonImage />
                    )}
                    <BlogContent>
                      <BlogDate>
                        {new Date(latestBlog.created_at).toLocaleDateString(
                          "tr-TR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </BlogDate>
                      <BlogTitle>{latestBlog.title}</BlogTitle>
                      <BlogExcerpt>
                        {latestBlog.content.substring(0, 90)}...
                      </BlogExcerpt>
                    </BlogContent>
                  </Link>
                  <ContinueReading to={`/blog/${latestBlog.slug}`}>
                    Devamını Gör
                    <ArrowForwardIcon />
                  </ContinueReading>
                </LargeBlogItem>
                
                {otherBlogs.slice(0, visibleCount).map((blog, blogIndex) => (
                  <SmallBlogItem key={blog.id} index={blogIndex}>
                    <Link
                      style={{ display: "flex", width: "100%", height: "100%", alignItems: "center" }}
                      to={`/blog/${blog.slug}`}
                    >
                      {blog.cover_image ? (
                        <SmallBlogImage src={blog.cover_image.trim()} />
                      ) : (
                        <SkeletonImage small />
                      )}
                      <SmallBlogContent>
                        <BlogDate>
                          {new Date(blog.created_at).toLocaleDateString(
                            "tr-TR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </BlogDate>
                        <SmallBlogTitle>{blog.title}</SmallBlogTitle>
                      </SmallBlogContent>
                    </Link>
                    <ContinueReading to={`/blog/${blog.slug}`}>
                      Devamını Gör
                      <ArrowForwardIcon />
                    </ContinueReading>
                  </SmallBlogItem>
                ))}
              </CategoryColumn>
            );
          })}
        </CategoriesContainer>
      </CategoriesWrapper>

      {/* Sayfalama göstergesi */}
      {totalPages > 1 && (
        <PaginationIndicator role="navigation" aria-label="Sayfa dolaşımı">
          {Array.from({length: totalPages}).map((_, index) => (
            <PaginationDot 
              key={index} 
              active={index === activeIndex}
              onClick={() => goToCategory(index)}
              role="button"
              tabIndex={0}
              aria-label={`Sayfa ${index + 1}`}
              aria-current={index === activeIndex ? "page" : undefined}
              onKeyDown={(e) => e.key === 'Enter' && goToCategory(index)}
            />
          ))}
        </PaginationIndicator>
      )}

      {showLoadMoreButton() && (
        <LoadMoreWrapper>
          <LoadMoreButton onClick={handleLoadMore}>
            Daha Fazla Göster
          </LoadMoreButton>
        </LoadMoreWrapper>
      )}

      <ArrowButton 
        className="right" 
        onClick={handleNextClick}
        aria-label="Sonraki içerikler"
      >
        {">"}
      </ArrowButton>
    </>
  );
}

export default BlogCardsMain;
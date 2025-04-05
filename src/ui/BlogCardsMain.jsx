/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { LargeCard, SmallCard, CategoryColumn } from "./CardComponent";

// Animasyonlar artık CardComponent'a taşındı

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
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 10px 5px;
  width: 100%;
  
  /* Desktop kategori genişliği sabit olmalı */
  & > div {
    flex: 0 0 320px;
    width: 320px;
    margin-right: 25px;
    
    @media (max-width: 910px) {
      flex: 0 0 300px;
      width: 300px;
      margin-right: 15px;
    }
    
    @media (max-width: 550px) {
      flex: 0 0 100%;
      width: 100%;
      margin-right: 10px;
    }
  }
  
  /* Son öğe için sağ margin'i kaldır */
  & > div:last-child {
    margin-right: 0;
  }
`;

// Ok butonları
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

// Daha fazla göster butonu
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
  const categoriesRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [visibleCounts, setVisibleCounts] = useState({});
  
  // Aktif kategori indeksi
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Cihazın mobil olup olmadığını kontrol et
  const [isMobile, setIsMobile] = useState(false);
  
  // Blogları kategoriye göre grupla
  const groupedBlogs = useCallback(() => {
    if (!blogs) return {};
    
    return blogs.reduce((acc, blog) => {
      (acc[blog.category] = acc[blog.category] || []).push(blog);
      return acc;
    }, {});
  }, [blogs]);
  
  // Kategorileri oluştur
  const categories = useMemo(() => {
    return Object.keys(groupedBlogs());
  }, [groupedBlogs]);
  
  // Kategori sayısı
  const categoryCount = categories.length;
  
  // Görünür kategori sayısı ve sayfa sayısı
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Sayfa yüklendiğinde ve pencere boyutu değiştiğinde boyutları güncelle
  useEffect(() => {
    const updateDimensions = () => {
      const isMobileView = window.innerWidth <= 550;
      setIsMobile(isMobileView);
      
      // Görünür kategori sayısını hesapla
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        
        // Ekran genişliğine göre kaç kategori görünebileceğini hesapla
        let categoriesPerView;
        
        if (isMobileView) {
          // Mobilde her zaman 1 kategori görünür
          categoriesPerView = 1;
        } else if (window.innerWidth <= 910) {
          // Tablet: 315px genişliğinde (300px + 15px margin)
          categoriesPerView = Math.floor(containerWidth / 315);
        } else {
          // Desktop: 345px genişliğinde (320px + 25px margin)
          categoriesPerView = Math.floor(containerWidth / 345);
        }
        
        // En az 1 kategori görünebilmeli
        categoriesPerView = Math.max(1, categoriesPerView);
        setVisibleCategoriesCount(categoriesPerView);
        
        // Toplam sayfa sayısını hesapla
        const pages = Math.ceil(categoryCount / categoriesPerView);
        setTotalPages(Math.max(1, pages));
      }
    };
    
    window.addEventListener('resize', updateDimensions);
    
    // İlk yüklemede ve kategori sayısı değişince boyutları güncelle
    const timer = setTimeout(updateDimensions, 100);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, [categoryCount]);
  
  // Blog verileri geldiğinde visible counts başlat
  useEffect(() => {
    if (blogs && blogs.length > 0) {
      initializeVisibleCounts(categories);
    }
  }, [blogs, categories]);

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
  
  // Touch events for mobile scrolling
  const handleTouchStart = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    containerRef.current.style.transition = 'none';
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const difference = startX - x;
    const sensitivity = 1.2;
    setTranslateX(difference * sensitivity);
  };

  const handleTouchEnd = () => {
    if (!containerRef.current) return;
    
    containerRef.current.style.transition = '';
    
    const threshold = window.innerWidth <= 550 ? 30 : 50;
    
    if (translateX > threshold) {
      handleNextClick();
    } else if (translateX < -threshold) {
      handlePreviousClick();
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };

  const handleMouseDown = (e) => {
    if (!containerRef.current || e.button !== 0) return;
    
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    containerRef.current.style.transition = 'none';
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const x = e.pageX - containerRef.current.offsetLeft;
    const difference = startX - x;
    const sensitivity = 1.0;
    setTranslateX(difference * sensitivity);
    e.preventDefault();
  };
  
  const handleMouseUpOrLeave = () => {
    if (!containerRef.current) return;
    
    containerRef.current.style.transition = '';
    
    const threshold = 50;
    
    if (translateX > threshold) {
      handleNextClick();
    } else if (translateX < -threshold) {
      handlePreviousClick();
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };

  // Sonraki kategoriye geçiş
  const handleNextClick = useCallback(() => {
    if (categoryCount === 0) return;
    
    setActiveIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      
      // Eğer sonraki kategori endeksi görüntülenebilecek maksimum kategori sayısından küçükse
      // o kategoriye git, değilse başa dön
      const maxVisibleIndex = categoryCount - (isMobile ? 1 : visibleCategoriesCount);
      return nextIndex <= maxVisibleIndex ? nextIndex : 0;
    });
  }, [categoryCount, visibleCategoriesCount, isMobile]);
  
  // Önceki kategoriye geçiş
  const handlePreviousClick = useCallback(() => {
    if (categoryCount === 0) return;
    
    setActiveIndex(prevIndex => {
      const nextIndex = prevIndex - 1;
      // Başa gelince maksimum görünür endekse git
      const maxVisibleIndex = categoryCount - (isMobile ? 1 : visibleCategoriesCount);
      return nextIndex >= 0 ? nextIndex : maxVisibleIndex;
    });
  }, [categoryCount, visibleCategoriesCount, isMobile]);
  
  // Belirli bir sayfaya geçiş
  const goToPage = useCallback((pageIndex) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      // Sayfa indeksinden kategori indeksine dönüştür
      // Her sayfada visibleCategoriesCount kadar kategori var 
      const categoryIndex = pageIndex * visibleCategoriesCount;
      
      // Kategori indeksi toplam kategori sayısından küçük olmalı
      if (categoryIndex < categoryCount) {
        setActiveIndex(categoryIndex);
      }
    }
  }, [totalPages, visibleCategoriesCount, categoryCount]);

  // Daha fazla göster butonuna tıklama
  const handleLoadMore = () => {
    setVisibleCounts(prevCounts => {
      const updatedCounts = {};
      Object.keys(prevCounts).forEach(category => {
        updatedCounts[category] = prevCounts[category] + (isMobile ? 2 : 3);
      });
      return updatedCounts;
    });
  };

  // Daha fazla göster butonunu görüntüleme kontrolü
  const showLoadMoreButton = useCallback(() => {
    const grouped = groupedBlogs();
    return Object.keys(grouped).some(
      category => grouped[category].length > (visibleCounts[category] || 0)
    );
  }, [groupedBlogs, visibleCounts]);
  
  // Klavye ok tuşları için event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousClick();
      } else if (e.key === 'ArrowRight') {
        handleNextClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePreviousClick, handleNextClick]);

  // Gruplandırılmış blog verileri
  const groupedBlogsData = groupedBlogs();
  
  // CSS transform değeri hesapla
  const calculateTransform = () => {
    if (isMobile) {
      // Mobilde: tam ekran genişliği (100%)
      return `translateX(-${activeIndex * 100}%)`;
    } else {
      // Desktop/tablet: Her kategori için kesin pozisyon
      if (categoriesRef.current && categoriesRef.current.children.length > 0) {
        const firstCategory = categoriesRef.current.children[0];
        const categoryFullWidth = firstCategory.offsetWidth + (window.innerWidth <= 910 ? 15 : 25); // Margin dahil
        
        return `translateX(-${activeIndex * categoryFullWidth}px)`;
      }
      
      // Fallback değeri (ilk çizimde veya kategoriler henüz DOM'a eklenmemişse)
      return `translateX(-${activeIndex * (window.innerWidth <= 910 ? 315 : 345)}px)`;
    }
  };

  return (
    <>
      <ArrowButton 
        className="left" 
        onClick={handlePreviousClick}
        aria-label="Önceki içerikler"
        disabled={categoryCount <= 1}
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
          ref={categoriesRef}
          style={{
            transform: calculateTransform()
          }}
        >
          {categories.map((category, categoryIndex) => {
            // Kategoride blog yoksa bu kategoriyi gösterme
            if (!groupedBlogsData[category] || groupedBlogsData[category].length === 0) {
              return null;
            }
            
            const [latestBlog, ...otherBlogs] = groupedBlogsData[category];
            const visibleCount = visibleCounts[category] || (isMobile ? 2 : 4);
            
            // Mobil görünümde kategori durumunu belirle
            let categoryClass = '';
            if (isMobile) {
              if (categoryIndex === activeIndex) categoryClass = 'category--current';
              else if (categoryIndex === activeIndex - 1) categoryClass = 'category--previous';
              else if (categoryIndex === activeIndex + 1) categoryClass = 'category--next';
              else categoryClass = 'category--hidden';
            }

            return (
              <CategoryColumn 
                key={category} 
                index={categoryIndex}
                isMobile={isMobile}
                className={categoryClass}
              >
                <LargeCard 
                  blog={latestBlog} 
                  category={category} 
                  isFirst={categoryIndex === 0} 
                />
                
                {otherBlogs.slice(0, visibleCount).map((blog, blogIndex) => (
                  <SmallCard key={blog.id} blog={blog} index={blogIndex} />
                ))}
              </CategoryColumn>
            );
          })}
        </CategoriesContainer>
      </CategoriesWrapper>

      {/* Sayfalama göstergesi - her sayfa için bir nokta */}
      {totalPages > 1 && (
        <PaginationIndicator role="navigation" aria-label="Sayfa dolaşımı">
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            // Aktif sayfayı hesapla
            const isActivePage = Math.floor(activeIndex / visibleCategoriesCount) === pageIndex;
            
            return (
              <PaginationDot 
                key={pageIndex} 
                active={isActivePage}
                onClick={() => goToPage(pageIndex)}
                role="button"
                tabIndex={0}
                aria-label={`Sayfa ${pageIndex + 1}`}
                aria-current={isActivePage ? "page" : undefined}
                onKeyDown={(e) => e.key === 'Enter' && goToPage(pageIndex)}
              />
            );
          })}
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
        disabled={categoryCount <= 1}
      >
        {">"}
      </ArrowButton>
    </>
  );
}

export default BlogCardsMain;
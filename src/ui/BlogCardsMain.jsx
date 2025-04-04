import { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';
import { LargeCard, SmallCard, CategoryColumn } from "./CardComponent";

// Animasyonlar artık CardComponent'a taşındı

const CategoriesWrapper = styled.div`
  position: relative;
  margin-top: 40px;
  display: flex;
  overflow-x: hidden;
  padding: 20px 10px;
  
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
  width: max-content;
  
  @media (max-width: 910px) {
    gap: 15px;
  }
`;

// Ok butonları
const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #1d1d1f;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);

  @media (max-width: 610px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.85);
    transform: translateY(-50%) scale(1.05);
  }

  &.left {
    left: -20px;
    
    @media (max-width: 768px) {
      left: -12px;
    }
  }

  &.right {
    right: -20px;
    
    @media (max-width: 768px) {
      right: -12px;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background-color: rgba(255, 255, 255, 0.7);
      transform: translateY(-50%);
    }
  }
`;

// Daha fazla göster butonu
const LoadMoreButton = styled.button`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #0066cc;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 12px 24px;
  border-radius: 22px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin: 40px auto;
  display: block;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  &:active {
    transform: scale(0.98);
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
  gap: 6px;
  margin-top: 16px;
`;

const PaginationDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#1d1d1f' : '#d2d2d7'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#1d1d1f' : '#a1a1a6'};
  }
`;

function BlogCardsMain({ blogs }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [visibleCounts, setVisibleCounts] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  
  // Aktif kategori indeksi
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Cihazın mobil olup olmadığını kontrol et
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 550);
  
  // Blogları kategoriye göre grupla
  const groupedBlogs = useCallback(() => {
    if (!blogs) return {};
    
    return blogs.reduce((acc, blog) => {
      (acc[blog.category] = acc[blog.category] || []).push(blog);
      return acc;
    }, {});
  }, [blogs]);

  // Sayfalama sisteminde toplam sayfa sayısını hesapla
  const calculateTotalPages = useCallback(() => {
    if (!containerRef.current) return;
    
    const categoryCount = Object.keys(groupedBlogs()).length;
    // Ekranda gösterilen kategori sayısını hesapla
    let visibleCategoryCount = 1; // Mobil için varsayılan
    
    if (window.innerWidth > 550) {
      // Desktop için viewport genişliğine bağlı olarak görünen kategori sayısını hesapla
      const containerWidth = containerRef.current.offsetWidth;
      const categoryWidth = 345; // Bir kategorinin ortalama genişliği (320px + 25px gap)
      visibleCategoryCount = Math.floor(containerWidth / categoryWidth);
    }
    
    // Toplam sayfa sayısı = Toplam kategori sayısı / Ekranda görünen kategori sayısı
    // Math.ceil ile yukarı yuvarlıyoruz, böylece tüm kategoriler görünebilir
    const pageCount = Math.ceil(categoryCount / visibleCategoryCount);
    
    setTotalPages(pageCount);
  }, [groupedBlogs]);
  
  // Sayfa yüklendiğinde ve pencere boyutu değiştiğinde mobil mi diye kontrol et
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 550);
      // Ekran boyutu değişince toplam sayfa sayısını yeniden hesapla
      calculateTotalPages();
    };
    
    window.addEventListener('resize', checkMobile);
    checkMobile(); // İlk yüklemede kontrol et
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [calculateTotalPages]);
  
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
  }, [blogs, calculateTotalPages, groupedBlogs]);

  // Touch events for mobile scrolling
  const handleTouchStart = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    // Dokunmatik başlangıcında animasyonu devre dışı bırak
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
    const threshold = window.innerWidth <= 550 ? 30 : 50;
    
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
    
    // Fare hareketini daha duyarlı hale getir
    const sensitivity = 1.0; 
    setTranslateX(difference * sensitivity);
    
    // Metin seçimini engelle
    e.preventDefault();
  };
  
  const handleMouseUpOrLeave = () => {
    if (!containerRef.current) return;
    
    // Animasyonu geri etkinleştir
    containerRef.current.style.transition = '';
    
    // Hareketin büyüklüğüne bağlı olarak kaydırma yönünü belirle
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

  const handleNextClick = useCallback(() => {
    const nextIndex = activeIndex + 1;
    
    // Toplam kategori sayısı sınırını aşmadan geçiş yap
    // Bu sayede fazla kaydırma olmaz
    const maxIndex = totalPages - 1;
    setActiveIndex(nextIndex > maxIndex ? 0 : nextIndex);
  }, [activeIndex, totalPages]);
  
  const handlePreviousClick = useCallback(() => {
    const prevIndex = activeIndex - 1;
    
    // Döngüsel hareket - ilk kategoriden önce son kategoriye geç
    setActiveIndex(prevIndex < 0 ? totalPages - 1 : prevIndex);
  }, [activeIndex, totalPages]);
  
  // Slider pagination dot'a tıklanınca
  const goToCategory = useCallback((categoryIndex) => {
    setActiveIndex(categoryIndex);
  }, []);

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
  const showLoadMoreButton = useCallback(() => {
    const grouped = groupedBlogs();
    return Object.keys(grouped).some(
      (category) => grouped[category].length > (visibleCounts[category] || 0)
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
              `translateX(-${activeIndex * 345}px)`
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

BlogCardsMain.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      cover_image: PropTypes.string,
      category: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired
    })
  ).isRequired
};
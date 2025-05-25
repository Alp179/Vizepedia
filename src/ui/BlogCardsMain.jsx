/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { LargeCard, SmallCard, CategoryColumn } from "./CardComponent";

const CategoriesWrapper = styled.div`
  position: relative;
  margin-top: 40px;
  display: flex;
  overflow-x: hidden;
  padding: 20px 10px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.03);
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
  
  @media (max-width: 550px) {
    margin-top: 30px;
    padding: 15px 5px;
  }
`;

const CategoriesContainer = styled.div`
  display: flex;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 10px 5px;
  width: 100%;
  
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
  
  & > div:last-child {
    margin-right: 0;
  }
`;

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
  const autoScrollRef = useRef(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [visibleCounts, setVisibleCounts] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Blogları kategoriye göre grupla
  const groupedBlogs = useMemo(() => {
    if (!blogs) return {};
    
    return blogs.reduce((acc, blog) => {
      (acc[blog.category] = acc[blog.category] || []).push(blog);
      return acc;
    }, {});
  }, [blogs]);
  
  // Kategori listesi
  const categories = useMemo(() => {
    return Object.keys(groupedBlogs);
  }, [groupedBlogs]);
  
  const categoryCount = categories.length;

  // Otomatik kaydırma fonksiyonu
  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    
    if (categoryCount > 1) {
      autoScrollRef.current = setInterval(() => {
        if (!isDragging) {
          setActiveIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            const maxVisibleIndex = categoryCount - (isMobile ? 1 : visibleCategoriesCount);
            return nextIndex <= maxVisibleIndex ? nextIndex : 0;
          });
        }
      }, 10000); // 10 saniye
    }
  }, [categoryCount, visibleCategoriesCount, isMobile, isDragging]);

  // Otomatik kaydırmayı durdur
  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  // Boyut hesaplama ve otomatik kaydırma başlatma
  useEffect(() => {
    const updateDimensions = () => {
      const isMobileView = window.innerWidth <= 550;
      setIsMobile(isMobileView);
      
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let categoriesPerView;
        
        if (isMobileView) {
          categoriesPerView = 1;
        } else if (window.innerWidth <= 910) {
          categoriesPerView = Math.floor(containerWidth / 315);
        } else {
          categoriesPerView = Math.floor(containerWidth / 345);
        }
        
        categoriesPerView = Math.max(1, categoriesPerView);
        setVisibleCategoriesCount(categoriesPerView);
        
        const pages = Math.ceil(categoryCount / categoriesPerView);
        setTotalPages(Math.max(1, pages));
      }
    };
    
    const handleResize = () => {
      updateDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(updateDimensions, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [categoryCount]);

  // Otomatik kaydırma yönetimi
  useEffect(() => {
    startAutoScroll();
    
    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll]);

  // Visible counts başlatma
  useEffect(() => {
    if (blogs?.length > 0) {
      const initialCounts = {};
      categories.forEach((category) => {
        if (window.innerWidth <= 550) {
          initialCounts[category] = 2;
        } else if (window.innerWidth <= 910) {
          initialCounts[category] = 3;
        } else {
          initialCounts[category] = 4;
        }
      });
      setVisibleCounts(initialCounts);
    }
  }, [blogs, categories]);

  // Mouse/Touch event handlers
  const handleInteractionStart = useCallback((clientX) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    stopAutoScroll();
    setStartX(clientX - containerRef.current.offsetLeft);
    containerRef.current.style.transition = 'none';
  }, [stopAutoScroll]);

  const handleInteractionMove = useCallback((clientX) => {
    if (!isDragging || !containerRef.current) return;
    
    const x = clientX - containerRef.current.offsetLeft;
    const difference = startX - x;
    const sensitivity = isMobile ? 1.2 : 1.0;
    setTranslateX(difference * sensitivity);
  }, [isDragging, startX, isMobile]);

  const handleInteractionEnd = useCallback(() => {
    if (!containerRef.current) return;
    
    containerRef.current.style.transition = '';
    
    const threshold = isMobile ? 30 : 50;
    
    if (translateX > threshold) {
      handleNextClick();
    } else if (translateX < -threshold) {
      handlePreviousClick();
    }
    
    setIsDragging(false);
    setTranslateX(0);
    
    // Otomatik kaydırmayı yeniden başlat
    setTimeout(startAutoScroll, 1000);
  }, [translateX, isMobile, startAutoScroll]);

  // Touch events
  const handleTouchStart = (e) => {
    handleInteractionStart(e.touches[0].pageX);
  };

  const handleTouchMove = useCallback((e) => {
    handleInteractionMove(e.touches[0].pageX);
  }, [handleInteractionMove]);

  // Mouse events
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    handleInteractionStart(e.pageX);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    handleInteractionMove(e.pageX);
    e.preventDefault();
  }, [handleInteractionMove]);

  // Navigation functions
  const handleNextClick = useCallback(() => {
    if (categoryCount === 0) return;
    
    stopAutoScroll();
    
    setActiveIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      const maxVisibleIndex = categoryCount - (isMobile ? 1 : visibleCategoriesCount);
      return nextIndex <= maxVisibleIndex ? nextIndex : 0;
    });
    
    setTimeout(startAutoScroll, 1000);
  }, [categoryCount, visibleCategoriesCount, isMobile, stopAutoScroll, startAutoScroll]);
  
  const handlePreviousClick = useCallback(() => {
    if (categoryCount === 0) return;
    
    stopAutoScroll();
    
    setActiveIndex(prevIndex => {
      const nextIndex = prevIndex - 1;
      const maxVisibleIndex = categoryCount - (isMobile ? 1 : visibleCategoriesCount);
      return nextIndex >= 0 ? nextIndex : maxVisibleIndex;
    });
    
    setTimeout(startAutoScroll, 1000);
  }, [categoryCount, visibleCategoriesCount, isMobile, stopAutoScroll, startAutoScroll]);
  
  const goToPage = useCallback((pageIndex) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      stopAutoScroll();
      
      const categoryIndex = pageIndex * visibleCategoriesCount;
      
      if (categoryIndex < categoryCount) {
        setActiveIndex(categoryIndex);
      }
      
      setTimeout(startAutoScroll, 1000);
    }
  }, [totalPages, visibleCategoriesCount, categoryCount, stopAutoScroll, startAutoScroll]);

  // Load more functionality
  const handleLoadMore = useCallback(() => {
    setVisibleCounts(prevCounts => {
      const updatedCounts = {};
      Object.keys(prevCounts).forEach(category => {
        updatedCounts[category] = prevCounts[category] + (isMobile ? 2 : 3);
      });
      return updatedCounts;
    });
  }, [isMobile]);

  const showLoadMoreButton = useMemo(() => {
    return Object.keys(groupedBlogs).some(
      category => groupedBlogs[category].length > (visibleCounts[category] || 0)
    );
  }, [groupedBlogs, visibleCounts]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousClick();
      } else if (e.key === 'ArrowRight') {
        handleNextClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePreviousClick, handleNextClick]);

  // Transform hesaplama
  const calculateTransform = () => {
    if (isMobile) {
      return `translateX(-${activeIndex * 100}%)`;
    } else {
      if (categoriesRef.current?.children.length > 0) {
        const firstCategory = categoriesRef.current.children[0];
        const categoryFullWidth = firstCategory.offsetWidth + (window.innerWidth <= 910 ? 15 : 25);
        return `translateX(-${activeIndex * categoryFullWidth}px)`;
      }
      return `translateX(-${activeIndex * (window.innerWidth <= 910 ? 315 : 345)}px)`;
    }
  };

  // Component unmount'ta timer'ı temizle
  useEffect(() => {
    return () => stopAutoScroll();
  }, [stopAutoScroll]);

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
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleInteractionEnd}
        role="region"
        aria-label="Blog kategorileri"
      >
        <CategoriesContainer 
          ref={categoriesRef}
          style={{ transform: calculateTransform() }}
        >
          {categories.map((category, categoryIndex) => {
            if (!groupedBlogs[category]?.length) return null;
            
            const [latestBlog, ...otherBlogs] = groupedBlogs[category];
            const visibleCount = visibleCounts[category] || (isMobile ? 2 : 4);
            
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

      {totalPages > 1 && (
        <PaginationIndicator role="navigation" aria-label="Sayfa dolaşımı">
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
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

      {showLoadMoreButton && (
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
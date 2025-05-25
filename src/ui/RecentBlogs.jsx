/* eslint-disable react/prop-types */
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import BlogCard, { BlogCardSkeleton } from "./BlogCard";

// Animasyonlar
const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Ana Container - Sabit genişlik
const RecentSection = styled.div`
  flex-shrink: 0; /* Konteynerin küçülmesini engelle */
  position: sticky;
  top: 2rem;
  height: fit-content;
  width: 300px; /* Sabit genişlik */
  min-width: 300px; /* Minimum genişlik garantisi */
  max-width: 300px; /* Maksimum genişlik sınırı */
  animation: ${slideUp} 1s ease-in-out;
  margin-left: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1.3rem;
  padding: 2.1rem 1.7rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 1400px) {
    width: 270px;
    min-width: 270px;
    max-width: 270px;
  }

  @media (max-width: 1200px) {
    width: 255px;
    min-width: 255px;
    max-width: 255px;
    padding: 1.7rem 1.3rem;
  }

  @media (max-width: 768px) {
    position: static;
    margin-left: 0;
    margin-top: 3rem;
    padding: 1.7rem 1.3rem;
    width: 100%;
    min-width: auto;
    max-width: none;
  }
`;

const RecentHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0; /* Header'ın küçülmesini engelle */
`;

const RecentTitle = styled.h3`
  font-size: 1.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-grey-600);
  letter-spacing: -0.01em;

  
`;

const RecentSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--color-grey-600);
  opacity: 0.7;
  margin: 0;
`;

// Liste konteyneri - Kartların boyutunu koruyarak uzayan
const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 100%; /* Container'ın tam genişliğini kullan */
  
  /* Scroll için maksimum yükseklik - daha fazla içerik için */
  max-height: 800px; /* Artırıldı */
  overflow-y: auto;
  padding-right: 0.5rem;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    max-height: 700px; /* Mobile'da da artırıldı */
    gap: 1.3rem;
    padding-right: 0;
  }
`;

// Card wrapper - Her kartın sabit boyutta kalmasını sağla
const CardWrapper = styled.div`
  width: 100%;
  flex-shrink: 0; /* Kartların küçülmesini engelle */
  min-height: fit-content;
`;

// Eğer içerik yoksa gösterilecek mesaj
const NoRecentContent = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--color-grey-600);
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.8;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.02);
  flex-shrink: 0;
`;

// Daha Fazla Göster Butonu
const LoadMoreButton = styled.button`
  width: 100%;
  padding: 0.65rem;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-grey-600);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0; /* Butonun küçülmesini engelle */

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

// Loading Component
const LoadingSkeletons = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CardWrapper key={index}>
          <BlogCardSkeleton />
        </CardWrapper>
      ))}
    </>
  );
};

function RecentBlogs({
  blogs,
  title = "En Yeni Yazılar",
  subtitle = "Blog'umuzdaki en güncel içerikler",
  initialCount = 5,
  isLoading = false,
  showCategory = true,
}) {
  const [displayCount, setDisplayCount] = useState(initialCount);

  const displayedBlogs = blogs?.slice(0, displayCount) || [];
  const hasMoreBlogs = blogs && displayCount < blogs.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

  return (
    <RecentSection>
      <RecentHeader>
        <RecentTitle>{title}</RecentTitle>
        {subtitle && <RecentSubtitle>{subtitle}</RecentSubtitle>}
      </RecentHeader>
      
      <RecentList>
        {isLoading ? (
          <LoadingSkeletons count={3} />
        ) : displayedBlogs && displayedBlogs.length > 0 ? (
          displayedBlogs.map((blog) => (
            <CardWrapper key={blog.id}>
              <BlogCard 
                blog={blog} 
                showCategory={showCategory} 
              />
            </CardWrapper>
          ))
        ) : (
          <NoRecentContent>
            Henüz yayınlanmış içerik bulunamadı.
          </NoRecentContent>
        )}

        {hasMoreBlogs && !isLoading && (
          <LoadMoreButton onClick={handleLoadMore}>
            Daha Fazla Göster
          </LoadMoreButton>
        )}
      </RecentList>
    </RecentSection>
  );
}

export default RecentBlogs;
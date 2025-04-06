/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

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

// Ana Container
const RelatedSection = styled.div`
  flex: 1;
  position: sticky;
  top: 2rem;
  height: fit-content;
  width: 350px; /* Sabit genişlik */
  animation: ${slideUp} 1s ease-in-out;
  margin-left: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 1400px) {
    width: 320px;
  }

  @media (max-width: 1200px) {
    width: 300px;
    padding: 2rem 1.5rem;
  }

  @media (max-width: 768px) {
    position: static;
    margin-left: 0;
    margin-top: 3rem;
    padding: 2rem 1.5rem;
    width: 100%;
  }
`;

const RelatedTitle = styled.h3`
  font-size: 2rem; /* 28px */
  font-weight: 600;
  margin-bottom: 1.75rem;
  color: var(--color-grey-600);
  letter-spacing: -0.01em;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem; /* 24px */
  }
`;

const RelatedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Kartlar arası mesafeyi arttırdım */
  max-height: 850px; /* Daha fazla içerik gösterme */
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 5px; /* Biraz daha kalın scrollbar */
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
    max-height: 700px;
    gap: 1.5rem; /* Mobilde daha fazla boşluk */
  }
`;

const RelatedCard = styled(Link)`
  display: flex;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: 150px; /* %50 büyütülmüş yükseklik */
  width: 100%; /* Tam genişlik */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 1200px) {
    height: 135px;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 320px; /* Büyütülmüş mobil kart yüksekliği */
    flex-direction: column; /* Mobilde dikey yerleşim */
  }
`;

const RelatedImage = styled.div`
  width: 150px; /* %50 büyütülmüş genişlik */
  flex-shrink: 0;
  height: 150px; /* Kart yüksekliğine eşit */
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;

  @media (max-width: 1200px) {
    width: 135px;
    height: 135px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 180px; /* Mobilde daha büyük görsel */
  }

  ${RelatedCard}:hover & {
    transform: scale(1.05);
  }
`;

const RelatedCardContent = styled.div`
  padding: 1rem 1.25rem; /* Büyütülmüş iç dolgu */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 150px); /* Görsel genişliğini çıkarıp genişliği ayarla */
  overflow: hidden; /* Taşan içeriği gizle */

  @media (max-width: 1200px) {
    padding: 0.75rem 1rem;
    width: calc(100% - 135px);
  }

  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem; /* Daha büyük dolgu */
    min-height: 140px;
    width: 100%; /* Mobilde tam genişlik */
  }
`;

const RelatedCardDate = styled.div`
  font-size: 1.1rem; /* 14px - %50 büyütülmüş */
  color: var(--color-grey-600);
  opacity: 0.8;
  margin-bottom: 0.5rem; /* Daha fazla boşluk */
  white-space: nowrap; /* Tarih tek satırda */

  @media (max-width: 768px) {
    font-size: 1rem; /* 16px - mobilde daha büyük */
    margin-bottom: 0.75rem;
  }
`;

const RelatedCardTitle = styled.h4`
  font-size: 1.425rem; /* 18px - %50 büyütülmüş */
  font-weight: 500;
  color: var(--color-grey-600);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0; /* Margin sıfırla */
  max-height: 2.8em; /* İki satır için max-height */
  transition: color 0.2s ease;
  text-overflow: ellipsis; /* Taşan metin yerine üç nokta */
  white-space: normal; /* Normal metin sarma */

  ${RelatedCard}:hover & {
    color: #fff;
  }

  @media (max-width: 1200px) {
    font-size: 1.85rem; /* 16px */
  }

  @media (max-width: 768px) {
    font-size: 1.85rem; /* 20px - mobilde daha büyük */
    line-height: 1.5;
    margin-top: 0.5rem;
    -webkit-line-clamp: 3; /* Mobilde 3 satır göster */
    max-height: none;
  }
`;

// Eğer ilgili içerik yoksa gösterilecek mesaj
const NoRelatedContent = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--color-grey-600);
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.8;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.02);
`;

// Daha Fazla Göster Butonu
const LoadMoreButton = styled.button`
  width: 100%;
  padding: 0.75rem; /* Daha kompakt button */
  margin-top: 1rem; /* Daha az üst boşluk */
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-grey-600);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  font-size: 1.8rem; /* Daha küçük font */
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

function SidebarBlogList({
  blogs,
  title = "İlgili İçerikler",
  initialCount = 5, // Başlangıçta daha fazla blog göster
}) {
  const [displayCount, setDisplayCount] = useState(initialCount);

  const displayedBlogs = blogs?.slice(0, displayCount) || [];
  const hasMoreBlogs = blogs && displayCount < blogs.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 5); // Daha fazla yükle
  };

  // Tarih formatlama fonksiyonu
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <RelatedSection>
      <RelatedTitle>{title}</RelatedTitle>
      <RelatedList>
        {displayedBlogs && displayedBlogs.length > 0 ? (
          displayedBlogs.map((blog) => (
            <RelatedCard to={`/blog/${blog.slug}`} key={blog.id}>
              <RelatedImage src={blog.cover_image} />
              <RelatedCardContent>
                <RelatedCardDate>{formatDate(blog.created_at)}</RelatedCardDate>
                <RelatedCardTitle>{blog.title}</RelatedCardTitle>
              </RelatedCardContent>
            </RelatedCard>
          ))
        ) : (
          <NoRelatedContent>
            Bu yazıyla ilgili içerik bulunamadı.
          </NoRelatedContent>
        )}

        {hasMoreBlogs && (
          <LoadMoreButton onClick={handleLoadMore}>
            Daha Fazla Göster
          </LoadMoreButton>
        )}
      </RelatedList>
    </RelatedSection>
  );
}

export default SidebarBlogList;

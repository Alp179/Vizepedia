/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Animasyonlar
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Kart temel stilleri
const BlogItem = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const LargeBlogItem = styled(BlogItem)`
  display: flex;
  flex-direction: column;
  height: ${props => props.isFirst ? '440px' : '420px'};
  position: relative;
  
  @media (max-width: 910px) {
    height: 400px;
  }
  
  @media (max-width: 550px) {
    height: 380px;
  }
`;

const SmallBlogItem = styled(BlogItem)`
  height: 140px;
  display: flex;
  align-items: center;
  animation: ${fadeInUp} 0.5s ease both;
  animation-delay: ${props => (props.index + 1) * 0.1}s;
  position: relative;
  
  @media (max-width: 550px) {
    height: 120px;
  }
`;

const CategoryLabel = styled.span`
  display: block;
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

// Görsel stilleri
const BlogImage = styled.div`
  width: 100%;
  height: ${props => props.isFirst ? '240px' : '220px'};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
  
  ${BlogItem}:hover & {
    transform: scale(1.02);
  }
  
  @media (max-width: 910px) {
    height: 200px;
  }
  
  @media (max-width: 550px) {
    height: 180px;
  }
`;

// SmallBlogImage ile ilgili stilleri güncelle
const SmallBlogImage = styled.div`
  width: 120px;
  height: 100px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  margin: 0 0 0 15px;
  border-radius: 12px;
  transition: transform 0.5s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  
  ${SmallBlogItem}:hover & {
    transform: scale(1.03);
  }
  
  @media (max-width: 550px) {
    width: 100px;
    height: 80px;
  }
`;

// Yükleme durumu için iskelet ekranı
const SkeletonImage = styled.div`
  width: ${props => props.small ? '120px' : '100%'};
  height: ${props => {
    if (props.small) return '100px';
    if (props.isFirst) return '240px';
    return '220px';
  }};
  background: rgba(245, 245, 247, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: ${props => props.small ? '12px' : '0'};
  margin: ${props => props.small ? '0 0 0 15px' : '0'};
  box-shadow: ${props => props.small ? '0 2px 10px rgba(0, 0, 0, 0.08)' : 'none'};
  
  @media (max-width: 910px) {
    height: ${props => props.small ? '90px' : '200px'};
    width: ${props => props.small ? '100px' : '100%'};
  }
  
  @media (max-width: 550px) {
    height: ${props => props.small ? '80px' : '180px'};
  }
`;

// İçerik stilleri
const BlogContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  flex: 1;
  position: relative;
`;

const SmallBlogContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15px;
  flex: 1;
  max-width: calc(100% - 150px);
`;

const BlogTitle = styled.h3`
  font-size: ${props => props.isFirst ? '24px' : '20px'};
  font-weight: 600;
  margin: 0 0 10px;
  color: rgba(0, 0, 0, 0.85);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;

  @media (max-width: 910px) {
    font-size: ${props => props.isFirst ? '22px' : '18px'};
  }
`;

const SmallBlogTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px;
  color: rgba(0, 0, 0, 0.85);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  
  @media (max-width: 910px) {
    font-size: 15px;
  }
`;

const BlogExcerpt = styled.p`
  font-size: 15px;
  color: rgba(0, 0, 0, 0.65);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  margin: 0 0 18px;
  
  @media (max-width: 910px) {
    font-size: 14px;
    -webkit-line-clamp: 3;
  }
`;

const BlogDate = styled.span`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: auto;
  display: block;
`;



// Tarih formatlama yardımcı fonksiyonu
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Büyük Kart Komponenti
export const LargeCard = ({ blog, category, isFirst = false }) => {
  return (
    <LargeBlogItem isFirst={isFirst}>
      <Link to={`/blog/${blog.slug}`}>
        {blog.cover_image ? (
          <BlogImage src={blog.cover_image.trim()} isFirst={isFirst} />
        ) : (
          <SkeletonImage isFirst={isFirst} />
        )}
        <BlogContent>
          <CategoryLabel>{category}</CategoryLabel>
          <BlogTitle isFirst={isFirst}>{blog.title}</BlogTitle>
          <BlogExcerpt>
            {blog.content
              .replace(/<[^>]*>/g, '')
              .substring(0, isFirst ? 150 : 120)}...
          </BlogExcerpt>
          <BlogDate>
            {formatDate(blog.created_at)}
          </BlogDate>
        </BlogContent>
      </Link>
    </LargeBlogItem>
  );
};

// Küçük Kart Komponenti
export const SmallCard = ({ blog, index }) => {
  return (
    <SmallBlogItem index={index}>
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
          <CategoryLabel>{blog.category}</CategoryLabel>
          <SmallBlogTitle>{blog.title}</SmallBlogTitle>
          <BlogDate>
            {formatDate(blog.created_at)}
          </BlogDate>
        </SmallBlogContent>
      </Link>
    </SmallBlogItem>
  );
};

// Kategori Kolonu Komponenti
export const CategoryColumn = styled.div`
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
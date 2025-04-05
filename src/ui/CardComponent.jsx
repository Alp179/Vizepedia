import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";

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
  backdrop-filter: blur(5px);
  box-shadow: 0px 4px 24px -1px rgba(0, 0, 0, 0.2);
  cursor: pointer;
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
  width: 100%;
  height: 420px;
  position: relative;

  @media (max-width: 910px) {
    height: 400px;
  }

  @media (max-width: 550px) {
    height: 380px;
  }
`;

const SmallBlogItem = styled(BlogItem)`
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  animation: ${fadeInUp} 0.5s ease both;
  animation-delay: ${(props) => (props.index + 1) * 0.1}s;
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
  height: 220px;
  background-image: url(${(props) => props.src});
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
  width: 140px;
  height: 110px;
  background-image: url(${(props) => props.src});
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
    width: 120px;
    height: 90px;
  }
`;

// Yükleme durumu için iskelet ekranı
const SkeletonImage = styled.div`
  width: ${(props) => (props.small ? "140px" : "100%")};
  height: ${(props) => (props.small ? "110px" : "220px")};
  background: rgba(245, 245, 247, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: ${(props) => (props.small ? "12px" : "0")};
  margin: ${(props) => (props.small ? "0 0 0 15px" : "0")};
  box-shadow: ${(props) =>
    props.small ? "0 2px 10px rgba(0, 0, 0, 0.08)" : "none"};

  @media (max-width: 910px) {
    height: ${(props) => (props.small ? "100px" : "200px")};
    width: ${(props) => (props.small ? "120px" : "100%")};
  }

  @media (max-width: 550px) {
    height: ${(props) => (props.small ? "90px" : "180px")};
  }
`;

// İçerik stilleri
const BlogContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 24px 40px; /* Alt kısmı tarih için daha fazla boşluk bırak */
  flex: 1;
  position: relative;
`;

const SmallBlogContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15px;
  flex: 1;
  max-width: calc(100% - 170px);
`;

const BlogTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px;
  color: rgba(0, 0, 0, 0.85);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;

  @media (max-width: 910px) {
    font-size: 18px;
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
  margin: 0;

  @media (max-width: 910px) {
    font-size: 14px;
    -webkit-line-clamp: 3;
  }
`;

const BlogDateLarge = styled.span`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 12px;
  left: 24px;
  width: calc(100% - 48px);
`;

const BlogDateSmall = styled.span`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 8px;
  @media (max-width: 290px) {
    font-size: 11px;
  }
`;

// Tarih formatlama yardımcı fonksiyonu
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Büyük Kart Komponenti
export const LargeCard = ({ blog, category }) => {
  return (
    <LargeBlogItem>
      <Link to={`/blog/${blog.slug}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {blog.cover_image ? (
          <BlogImage src={blog.cover_image.trim()} />
        ) : (
          <SkeletonImage />
        )}
        <BlogContent>
          <div>
            <CategoryLabel>{category}</CategoryLabel>
            <BlogTitle>{blog.title}</BlogTitle>
            <BlogExcerpt>
              {blog.content.replace(/<[^>]*>/g, "").substring(0, 120)}...
            </BlogExcerpt>
          </div>
          <BlogDateLarge>{formatDate(blog.created_at)}</BlogDateLarge>
        </BlogContent>
      </Link>
    </LargeBlogItem>
  );
};

LargeCard.propTypes = {
  blog: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    cover_image: PropTypes.string,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  category: PropTypes.string.isRequired,
};

// Küçük Kart Komponenti
export const SmallCard = ({ blog, index }) => {
  return (
    <SmallBlogItem index={index}>
      <Link
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
        }}
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
          <BlogDateSmall>{formatDate(blog.created_at)}</BlogDateSmall>
        </SmallBlogContent>
      </Link>
    </SmallBlogItem>
  );
};

SmallCard.propTypes = {
  blog: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    cover_image: PropTypes.string,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

// Kategori Kolonu Komponenti
export const CategoryColumn = styled.div`
  flex: 0 0 320px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  animation: ${fadeInUp} 0.5s ease forwards;
  animation-delay: ${(props) => props.index * 0.1}s;
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
    flex: 0 0 300px;
    width: 300px;
    gap: 20px;
  }

  @media (max-width: 550px) {
    flex: 0 0 100%;
    width: 100%;
    gap: 15px;
  }
`;

CategoryColumn.propTypes = {
  index: PropTypes.number,
  isMobile: PropTypes.bool,
  className: PropTypes.string,
};
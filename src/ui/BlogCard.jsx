/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Apple-quality animations
const shimmer = keyframes`
  0% {
    background-position: -300px 0;
  }
  100% {
    background-position: calc(300px + 100%) 0;
  }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 16px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

// Apple Card Container - Clean & Spacious
const CardContainer = styled(Link)`
  display: block;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px) saturate(150%);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.02),
    0 4px 12px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  width: 100%;
  min-width: 0; /* Flex shrinking için */
  flex-shrink: 0; /* Kartın küçülmesini engelle */
  position: relative;
  isolation: isolate;
  will-change: transform;
  animation: ${slideInUp} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* Subtle premium overlay */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.02) 0%,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 0.01) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1;
  }

  /* Apple-style hover elevation */
  &:hover {
    transform: translate3d(0, -8px, 0);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 12px 32px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.06);

    &::before {
      opacity: 1;
    }
  }

  /* Refined touch feedback */
  &:active {
    transform: translate3d(0, -4px, 0) scale(0.98);
    transition-duration: 0.1s;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition-duration: 0.2s;
  }
`;

// Hero image section with fixed height
const CardImageSection = styled.div`
  width: 100%;
  height: 100px; /* Sabit yükseklik */
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  flex-shrink: 0; /* Görsel kısmının küçülmesini engelle */

  @media (max-width: 768px) {
    height: 110px; /* Mobile'da biraz daha büyük */
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;

  /* Subtle image overlay */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.02) 70%,
      rgba(0, 0, 0, 0.06) 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  ${CardContainer}:hover & {
    transform: scale(1.03);
    
    &::after {
      opacity: 1;
    }
  }
`;

// Content section with fixed padding
const CardContent = styled.div`
  padding: 14px 18px 20px; /* Sabit padding */
  position: relative;
  z-index: 2;
  flex: 1; /* Esnek alan */
  min-height: 0; /* Flex shrinking için */

  @media (max-width: 768px) {
    padding: 16px 20px 22px;
  }
`;

// Meta row positioned at the top of image with separate backgrounds
const CardMeta = styled.div`
  position: absolute;
  top: 10px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 3;
  gap: 6px;
  
  @media (max-width: 768px) {
    top: 12px;
    left: 14px;
    right: 14px;
    gap: 8px;
  }
`;

// Date with its own glassmorphism background
const CardDate = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.01em;
  transition: all 0.3s ease;
  font-variant-numeric: tabular-nums;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  /* Independent glassmorphism background */
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px) saturate(180%);
  border-radius: 8px;
  padding: 4px 8px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  white-space: nowrap; /* Metinlerin kırılmasını engelle */

  ${CardContainer}:hover & {
    color: rgba(255, 255, 255, 1);
    background: rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translate3d(0, -1px, 0);
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 10px;
    border-radius: 10px;
  }
`;

// Category badge with enhanced glassmorphism and independent background
const CategoryBadge = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 9px;
  font-weight: 600;
  color: #ffffff;
  background: rgba(0, 122, 255, 0.25);
  padding: 4px 8px;
  border-radius: 8px;
  letter-spacing: 0.02em;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 0.5px solid rgba(0, 122, 255, 0.4);
  backdrop-filter: blur(12px) saturate(180%);
  flex-shrink: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  white-space: nowrap; /* Metinlerin kırılmasını engelle */

  ${CardContainer}:hover & {
    background: rgba(0, 122, 255, 0.4);
    border-color: rgba(0, 122, 255, 0.6);
    transform: translate3d(0, -1px, 0);
    box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 6px 10px;
    border-radius: 10px;
  }
`;

// Enhanced title with better spacing and line clamping
const CardTitle = styled.h3`
  font-size: 14px; /* Sidebar için daha küçük */
  font-weight: 600;
  color: var(--color-grey-600);
  line-height: 1.4;
  letter-spacing: -0.015em;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Maksimum 3 satır */
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word; /* Uzun kelimeleri böl */

  ${CardContainer}:hover & {
    color: var(--color-grey-600);
    transform: translate3d(0, -1px, 0);
  }

  @media (max-width: 768px) {
    font-size: 16px; /* Mobile'da biraz daha büyük */
    line-height: 1.35;
  }
`;

// Premium loading skeleton
const SkeletonCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px) saturate(150%);
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  flex-shrink: 0; /* Skeleton'ın da küçülmesini engelle */
  border: 0.5px solid rgba(255, 255, 255, 0.06);
  animation: ${slideInUp} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const SkeletonImageSection = styled.div`
  width: 100%;
  height: 100px; /* CardImageSection ile aynı yükseklik */
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  background-size: 300px 100%;
  animation: ${shimmer} 2.5s infinite ease-in-out;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 768px) {
    height: 110px; /* Mobile height */
  }
`;

const SkeletonContent = styled.div`
  padding: 14px 18px 20px; /* CardContent ile aynı padding */

  @media (max-width: 768px) {
    padding: 16px 20px 22px;
  }
`;

const SkeletonLine = styled.div`
  height: ${props => props.height || '8px'};
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  background-size: 300px 100%;
  animation: ${shimmer} 2.5s infinite ease-in-out;
  border-radius: 4px;
  margin-bottom: ${props => props.marginBottom || '8px'};
  width: ${props => props.width || '100%'};
`;

// Enhanced date formatting
const formatDate = (dateString) => {
  const now = new Date();
  const blogDate = new Date(dateString);
  const diffTime = Math.abs(now - blogDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Bugün";
  if (diffDays === 2) return "Dün";
  if (diffDays <= 7) return `${diffDays} gün önce`;
  if (diffDays <= 14) return `${Math.ceil(diffDays / 7)} hafta önce`;
  
  return blogDate.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: diffDays > 365 ? "numeric" : undefined,
  });
};

// Clean, readable BlogCard with separate meta elements at top
function BlogCard({ blog, showCategory = true }) {
  if (!blog) return null;

  return (
    <CardContainer to={`/blog/${blog.slug}`}>
      <CardImageSection>
        <CardImage src={blog.cover_image} />
        <CardMeta>
          <CardDate>{formatDate(blog.created_at)}</CardDate>
          {showCategory && (
            <CategoryBadge>{blog.category}</CategoryBadge>
          )}
        </CardMeta>
      </CardImageSection>
      <CardContent>
        <CardTitle>{blog.title}</CardTitle>
      </CardContent>
    </CardContainer>
  );
}

// Premium Loading Experience with separate meta skeletons at top
export const BlogCardSkeleton = () => {
  return (
    <SkeletonCard>
      <SkeletonImageSection>
        {/* Separate overlay meta skeletons at top */}
        <div style={{ 
          position: 'absolute',
          top: '10px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px'
        }}>
          {/* Date skeleton with independent background */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(12px)',
            borderRadius: '8px',
            padding: '4px 8px',
            border: '0.5px solid rgba(255, 255, 255, 0.15)'
          }}>
            <SkeletonLine height="6px" width="40px" marginBottom="0" />
          </div>
          
          {/* Category skeleton with independent background */}
          <div style={{
            background: 'rgba(0, 122, 255, 0.25)',
            backdropFilter: 'blur(12px)',
            borderRadius: '8px',
            padding: '4px 8px',
            border: '0.5px solid rgba(0, 122, 255, 0.4)'
          }}>
            <SkeletonLine height="6px" width="35px" marginBottom="0" />
          </div>
        </div>
      </SkeletonImageSection>
      <SkeletonContent>
        {/* Title skeleton */}
        <SkeletonLine height="8px" width="95%" marginBottom="6px" />
        <SkeletonLine height="8px" width="85%" marginBottom="6px" />
        <SkeletonLine height="8px" width="70%" marginBottom="0" />
      </SkeletonContent>
    </SkeletonCard>
  );
};

export default BlogCard;
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

// Hero image section with increased height
const CardImageSection = styled.div`
  width: 100%;
  height: 115px; /* Increased by 15% from 100px */
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));

  @media (max-width: 768px) {
    height: 138px; /* Increased by 15% from 120px */
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

// Content section with reduced top margin for title
const CardContent = styled.div`
  padding: 16px 26px 28px; /* Reduced top padding from 24px to 16px */
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 18px 28px 30px; /* Reduced from 26px to 18px */
  }
`;

// Meta row positioned at the top of image with separate backgrounds
const CardMeta = styled.div`
  position: absolute;
  top: 12px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 3;
  gap: 8px;
  
  @media (max-width: 768px) {
    top: 14px;
    left: 18px;
    right: 18px;
    gap: 10px;
  }
`;

// Date with its own glassmorphism background
const CardDate = styled.div`
  font-size: 11px;
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
  border-radius: 10px;
  padding: 6px 10px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);

  ${CardContainer}:hover & {
    color: rgba(255, 255, 255, 1);
    background: rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translate3d(0, -1px, 0);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 12px;
    border-radius: 12px;
  }
`;

// Category badge with enhanced glassmorphism and independent background
const CategoryBadge = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 600;
  color: #ffffff;
  background: rgba(0, 122, 255, 0.25);
  padding: 6px 10px;
  border-radius: 10px;
  letter-spacing: 0.02em;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 0.5px solid rgba(0, 122, 255, 0.4);
  backdrop-filter: blur(12px) saturate(180%);
  flex-shrink: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  ${CardContainer}:hover & {
    background: rgba(0, 122, 255, 0.4);
    border-color: rgba(0, 122, 255, 0.6);
    transform: translate3d(0, -1px, 0);
    box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 8px 12px;
    border-radius: 12px;
  }
`;

// Enhanced title with better spacing
const CardTitle = styled.h3`
  font-size: 18px; /* Slightly larger for better readability */
  font-weight: 600;
  color: var(--color-grey-600);
  line-height: 1.35; /* Improved line spacing */
  letter-spacing: -0.025em;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  
  /* NO line clamping - show full title with better spacing */

  ${CardContainer}:hover & {
    color: #ffffff;
    transform: translate3d(0, -1px, 0);
  }

  @media (max-width: 768px) {
    font-size: 20px; /* Larger on mobile for better touch experience */
    line-height: 1.4;
  }
`;

// Premium loading skeleton
const SkeletonCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px) saturate(150%);
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  border: 0.5px solid rgba(255, 255, 255, 0.06);
  animation: ${slideInUp} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const SkeletonImageSection = styled.div`
  width: 100%;
  height: 115px; /* Matching the increased image height */
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  background-size: 300px 100%;
  animation: ${shimmer} 2.5s infinite ease-in-out;
  position: relative;

  @media (max-width: 768px) {
    height: 138px; /* Matching mobile height */
  }
`;

const SkeletonContent = styled.div`
  padding: 16px 26px 28px; /* Matching the reduced content padding */

  @media (max-width: 768px) {
    padding: 18px 28px 30px;
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
  margin-bottom: ${props => props.marginBottom || '10px'};
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
          top: '12px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Date skeleton with independent background */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(12px)',
            borderRadius: '10px',
            padding: '6px 10px',
            border: '0.5px solid rgba(255, 255, 255, 0.15)'
          }}>
            <SkeletonLine height="6px" width="50px" marginBottom="0" />
          </div>
          
          {/* Category skeleton with independent background */}
          <div style={{
            background: 'rgba(0, 122, 255, 0.25)',
            backdropFilter: 'blur(12px)',
            borderRadius: '10px',
            padding: '6px 10px',
            border: '0.5px solid rgba(0, 122, 255, 0.4)'
          }}>
            <SkeletonLine height="6px" width="40px" marginBottom="0" />
          </div>
        </div>
      </SkeletonImageSection>
      <SkeletonContent>
        {/* Title skeleton */}
        <SkeletonLine height="10px" width="95%" marginBottom="8px" />
        <SkeletonLine height="10px" width="85%" marginBottom="8px" />
        <SkeletonLine height="10px" width="70%" marginBottom="0" />
      </SkeletonContent>
    </SkeletonCard>
  );
};

export default BlogCard;
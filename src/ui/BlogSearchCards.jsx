/* eslint-disable react/prop-types */
import styled from "styled-components";
import { Link } from "react-router-dom";
import { LargeCard } from "./CardComponent";

const SearchCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CardWrapper = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
`;

const HighlightedText = styled.mark`
  background-color: rgba(255, 235, 59, 0.3);
  padding: 0.2rem 0;
  border-radius: 2px;
`;

function BlogSearchCards({ blogs, query }) {
  // Highlight search term in text
  const highlightText = (text, query) => {
    // Metnin undefined veya null olup olmadığını kontrol et
    if (!text || !query) return text || '';
    
    // Metnin string olduğundan emin ol
    const textString = String(text);
    
    try {
      const regex = new RegExp(`(${query})`, 'gi');
      const parts = textString.split(regex);
      
      return parts.map((part, index) => 
        regex.test(part) ? (
          <HighlightedText key={index}>{part}</HighlightedText>
        ) : (
          part
        )
      );
    } catch (error) {
      console.error("Highlight text error:", error);
      return textString;
    }
  };

  // Blog verilerini vurgulama ile birleştir
  const enhancedBlogs = blogs.map(blog => ({
    ...blog,
    title: highlightText(blog.title || '', query),
    excerpt: highlightText(blog.excerpt || blog.summary || '', query)
  }));

  return (
    <SearchCardsContainer>
      {enhancedBlogs.map((blog, index) => (
        <CardWrapper key={blog.id} to={`/blog/${blog.slug}`}>
          <LargeCard 
            blog={blog} 
            category={blog.category} 
            isFirst={index === 0}
          />
        </CardWrapper>
      ))}
    </SearchCardsContainer>
  );
}

export default BlogSearchCards;
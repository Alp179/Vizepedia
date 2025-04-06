/* eslint-disable react/prop-types */
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

const MainContent = styled.div`
  flex: 2;
  animation: ${slideUp} 0.8s ease-in-out;
`;

const TableOfContentsContainer = styled.div`
  position: sticky;
  top: 2rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: ${(props) => (props.headings.length > 1 ? "block" : "none")};
`;

const TableOfContentsTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
  color: var(--color-grey-600);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TableOfContentsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TableOfContentsItem = styled.li`
  margin-bottom: 0.8rem;
  padding-left: ${(props) => props.level * 0.8}rem;

  a {
    color: var(--color-grey-600);
    text-decoration: none;
    display: block;
    padding: 0.5rem 0.8rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    opacity: 0.85;
    font-size: ${(props) => (props.level === 2 ? "1rem" : "0.95rem")};
    font-weight: ${(props) => (props.level === 2 ? "500" : "400")};

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      opacity: 1;
    }

    &.active {
      background: rgba(255, 255, 255, 0.1);
      border-left: 3px solid #0071e3;
      opacity: 1;
    }
  }
`;

// Bölüm stilleri
const SectionContainer = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 600;
  margin: 3rem 0 1.5rem;
  color: var(--color-grey-600);
  letter-spacing: -0.02em;
  scroll-margin-top: 2rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: -1rem;
    top: 0.3rem;
    width: 4px;
    height: 2.2rem;
    background: linear-gradient(to bottom, #0071e3, #00c6ff);
    border-radius: 4px;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;

    &::before {
      height: 1.75rem;
    }
  }
`;

const SectionContent = styled.div`
  margin-bottom: 2rem;
  font-size: 1.35rem;
  line-height: 1.8;
  color: var(--color-grey-600);

  p {
    margin-bottom: 1.8rem;
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 2.5rem 0 1.2rem;
    color: var(--color-grey-600);
    letter-spacing: -0.01em;
    scroll-margin-top: 2rem;
  }

  blockquote {
    border-left: 5px solid #0071e3;
    padding: 1.5rem 0 1.5rem 2rem;
    margin: 2.5rem 0;
    font-style: italic;
    font-size: 1.4rem;
    color: var(--color-grey-600);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0 0.8rem 0.8rem 0;
  }

  ul,
  ol {
    margin: 1.8rem 0 1.8rem 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.8rem;
    position: relative;
  }

  ul li::before {
    content: "";
    position: absolute;
    left: -1.2rem;
    top: 0.65rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #0071e3;
  }

  a {
    color: #0071e3;
    text-decoration: none;
    transition: all 0.2s ease;
    border-bottom: 1px solid transparent;
    font-weight: 500;

    &:hover {
      border-bottom: 1px solid #0071e3;
    }
  }

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
    font-family: "Fira Code", monospace;
    font-size: 0.9em;
  }

  pre {
    background: rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    border-radius: 0.8rem;
    overflow-x: auto;
    margin: 2rem 0;
    border: 1px solid rgba(255, 255, 255, 0.1);

    code {
      background: transparent;
      padding: 0;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    overflow: hidden;
    border-radius: 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  th,
  td {
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  th {
    background: rgba(255, 255, 255, 0.05);
    text-align: left;
  }

  tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.02);
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;

    h3 {
      font-size: 1.5rem;
    }

    blockquote {
      font-size: 1.2rem;
      padding: 1.2rem 0 1.2rem 1.5rem;
    }
  }
`;

const SectionImage = styled.div`
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
  border-radius: 1.2rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 100%;
    display: block;
    transition: transform 0.5s ease;
  }
`;

// Meta Bilgiler ve Paylaşım
const MetaSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4rem;
  padding-top: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2rem;
  font-size: 1rem;
  color: var(--color-grey-600);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ShareContainer = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const ShareButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-grey-600);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

function BlogContentSection({ blog, headings, activeHeading }) {
  // Başlığa kaydırma fonksiyonu
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  // Paylaşım fonksiyonları
  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        blog.title
      )}&url=${encodeURIComponent(window.location.href)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link kopyalandı!");
  };

  const tags = blog.tags ? blog.tags.split(",").map((tag) => tag.trim()) : [];

  return (
    <MainContent>
      {headings.length > 0 && (
        <TableOfContentsContainer headings={headings}>
          <TableOfContentsTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" y1="10" x2="7" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="21" y1="18" x2="7" y2="18"></line>
            </svg>
            İçindekiler
          </TableOfContentsTitle>
          <TableOfContentsList>
            {headings.map((heading) => (
              <TableOfContentsItem key={heading.id} level={heading.level}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(heading.id);
                  }}
                  className={activeHeading === heading.id ? "active" : ""}
                >
                  {heading.text}
                </a>
              </TableOfContentsItem>
            ))}
          </TableOfContentsList>
        </TableOfContentsContainer>
      )}

      {/* Bölüm 1 */}
      {blog.section1_title && (
        <SectionContainer id="section1">
          <SectionTitle>{blog.section1_title}</SectionTitle>
          <SectionContent
            dangerouslySetInnerHTML={{ __html: blog.section1_content }}
          />
          {blog.section1_image && (
            <SectionImage>
              <img src={blog.section1_image} alt={blog.section1_title} />
            </SectionImage>
          )}
        </SectionContainer>
      )}

      {/* Bölüm 2 */}
      {blog.section2_title && (
        <SectionContainer id="section2">
          <SectionTitle>{blog.section2_title}</SectionTitle>
          <SectionContent
            dangerouslySetInnerHTML={{ __html: blog.section2_content }}
          />
          {blog.section2_image && (
            <SectionImage>
              <img src={blog.section2_image} alt={blog.section2_title} />
            </SectionImage>
          )}
        </SectionContainer>
      )}

      {/* Bölüm 3 */}
      {blog.section3_title && (
        <SectionContainer id="section3">
          <SectionTitle>{blog.section3_title}</SectionTitle>
          <SectionContent
            dangerouslySetInnerHTML={{ __html: blog.section3_content }}
          />
          {blog.section3_image && (
            <SectionImage>
              <img src={blog.section3_image} alt={blog.section3_title} />
            </SectionImage>
          )}
        </SectionContainer>
      )}

      <MetaSection>
        <TagsContainer>
          {tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagsContainer>

        <ShareContainer>
          <ShareButton aria-label="Twitter'da paylaş" onClick={shareOnTwitter}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6-1 3.2-2.2 3.2-2.2a8.1 8.1 0 0 1-2.3.6A4 4 0 0 0 21 3a8 8 0 0 1-2.5 1A4 4 0 0 0 16 3c-2.2 0-4 1.8-4 4 0 .3 0 .6.1.9A11.3 11.3 0 0 1 3 4s-4 9 5 13a4.5 4.5 0 0 1-1 4 4 4 0 0 1-7-3.6c0-.1 0-.2 0-.3A8 8 0 0 0 7 19a4 4 0 0 1-1 2.3 4 4 0 0 1-1.8.7" />
            </svg>
          </ShareButton>
          <ShareButton
            aria-label="LinkedIn'de paylaş"
            onClick={shareOnLinkedIn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </ShareButton>
          <ShareButton aria-label="Linki kopyala" onClick={copyLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </ShareButton>
          <ShareButton
            aria-label="Facebook'ta paylaş"
            onClick={shareOnFacebook}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </ShareButton>
        </ShareContainer>
      </MetaSection>
    </MainContent>
  );
}

export default BlogContentSection;

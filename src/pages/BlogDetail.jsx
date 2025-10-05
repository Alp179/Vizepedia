import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchBlogBySlug,
  fetchRelatedBlogsByCategory,
  fetchRecentBlogs,
} from "../services/apiBlogs";
import Spinner from "../ui/Spinner";
import Footer from "../ui/Footer";
import styled, { keyframes } from "styled-components";
import SidebarBlogList from "../ui/SidebarBlogList";
import BlogContentSection from "../ui/BlogContentSection";
import BlogSources from "../ui/BlogSources";
import RecentBlogs from "../ui/RecentBlogs";
import SEO from "../components/SEO";

// Animasyonlar
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Ana Container
const PageContainer = styled.div`
  background: var(--color-grey-909);
  min-height: 100vh;
  position: relative;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  color: var(--color-grey-600);
  overflow-x: hidden;

  @media (min-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1200px) {
    font-size: 19px;
  }
`;

// Üst Bölüm
const HeroSection = styled.div`
  position: relative;
  height: 75vh;
  min-height: 550px;
  max-height: 750px;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-end;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70%;
    background: linear-gradient(to top, var(--color-grey-909), transparent);
    z-index: 1;
  }

  @media (max-width: 768px) {
    height: 65vh;
    min-height: 420px;
  }
`;

const HeroImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  filter: brightness(0.85);
  transition: transform 0.8s ease;
  transform: scale(1.03);
  animation: ${fadeIn} 1.2s ease-out;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.15);
  }
`;

const HeroContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
  position: relative;
  z-index: 2;
  padding-bottom: 4rem;
  animation: ${fadeIn} 1.2s ease-in-out;

  @media (max-width: 768px) {
    padding: 0 3rem;
    padding-bottom: 3rem;
  }

  @media (max-width: 480px) {
    padding: 0 2.5rem;
    padding-bottom: 2.5rem;
  }
`;

const Crumbs = styled.nav`
  position: relative;
  z-index: 2;
  margin-bottom: 1rem;
  color: #fff;
  opacity: 0.9;
  a {
    color: #fff;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  span.sep {
    margin: 0 0.5rem;
    opacity: 0.7;
  }
`;

const Category = styled.div`
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--color-grey-600);
  margin-bottom: 1.5rem;
  letter-spacing: 0.02em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
  }
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const PublishDate = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  font-weight: 500;
  letter-spacing: 0.02em;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ReadTime = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  font-weight: 500;
  letter-spacing: 0.02em;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 4.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.03em;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    font-size: 3.3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.7rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const ContentSection = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4.5rem 4rem;
  gap: 3rem;

  @media (max-width: 1400px) {
    max-width: 1200px;
    gap: 2.5rem;
  }

  @media (max-width: 1024px) {
    padding: 3.5rem 3.5rem;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 3rem 3rem;
    gap: 3.5rem;
  }

  @media (max-width: 480px) {
    padding: 2.5rem 2.5rem;
    gap: 3rem;
  }
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 4rem;
  min-width: 300px;

  @media (max-width: 1400px) {
    min-width: 270px;
  }

  @media (max-width: 1200px) {
    min-width: 255px;
  }

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`;

const MobileSourcesContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-top: 2rem;
    width: 100%;
  }
`;

const DesktopSourcesContainer = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ScrollToTop = styled.button`
  position: fixed;
  bottom: 3.5rem;
  right: 3.5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-grey-600);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) =>
    props.visible ? "translateY(0)" : "translateY(20px)"};
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: ${(props) =>
      props.visible ? "translateY(-8px)" : "translateY(20px)"};
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    bottom: 3rem;
    right: 3rem;
    width: 50px;
    height: 50px;
  }

  @media (max-width: 480px) {
    bottom: 2.5rem;
    right: 2.5rem;
    width: 46px;
    height: 46px;
  }
`;

const ReadingProgress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(to right, #0071e3, #00c6ff);
  z-index: 1000;
  width: ${(props) => props.progress}%;
  transition: width 0.2s ease;
`;

const TagsContainer = styled.div`
  margin-top: 2rem;
  strong {
    font-weight: 600;
    margin-right: 8px;
  }
`;

const CategoryLinkContainer = styled.div`
  margin-top: 2rem;
  a {
    display: inline-flex;
    align-items: center;
    color: var(--color-brand-600);
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover {
      color: var(--color-brand-700);
      text-decoration: underline;
    }
  }
`;

function BlogDetail() {
  const { slug } = useParams();
  const [scrollVisible, setScrollVisible] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");

  // Okuma süresi hesaplama fonksiyonu
  const calculateReadingTime = (blog) => {
    if (!blog) return 0;

    let combinedText = [
      blog.section1_content || "",
      blog.section2_content || "",
      blog.section3_content || "",
    ].join(" ");

    combinedText = combinedText.replace(/<[^>]*>/g, " ");
    const wordsPerMinute = 200;
    const numberOfWords = combinedText.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  };

  // Bölüm başlıklarını çıkarma
  const extractSectionHeadings = (blog) => {
    if (!blog) return [];

    const headings = [];

    if (blog.section1_title) {
      headings.push({
        id: `section1`,
        text: blog.section1_title,
        level: 2,
      });
    }

    if (blog.section2_title) {
      headings.push({
        id: `section2`,
        text: blog.section2_title,
        level: 2,
      });
    }

    if (blog.section3_title) {
      headings.push({
        id: `section3`,
        text: blog.section3_title,
        level: 2,
      });
    }

    return headings;
  };

  // Sayfa scroll olaylarını izleme
  useEffect(() => {
    const handleScroll = () => {
      setScrollVisible(window.scrollY > 400);

      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);

      if (headings.length > 0) {
        const headingElements = headings.map((heading) =>
          document.getElementById(heading.id)
        );

        let activeId = "";
        for (let i = headingElements.length - 1; i >= 0; i--) {
          const element = headingElements[i];
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 150) {
              activeId = headings[i].id;
              break;
            }
          }
        }

        if (activeId && activeId !== activeHeading) {
          setActiveHeading(activeId);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings, activeHeading]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => fetchBlogBySlug(slug),
  });

  // Blog içeriği yüklendiğinde başlıkları çıkar
  useEffect(() => {
    if (blog) {
      const extractedHeadings = extractSectionHeadings(blog);
      setHeadings(extractedHeadings);
    }
  }, [blog]);

  // Kategori bazında ilgili blogları getir
  const { data: relatedBlogs, isLoading: relatedLoading } = useQuery({
    queryKey: ["relatedBlogs", blog?.category, slug],
    queryFn: () => fetchRelatedBlogsByCategory(blog?.category, slug, 6),
    enabled: !!blog?.category,
  });

  // En yeni blogları getir (mevcut blog hariç)
  const { data: recentBlogs, isLoading: recentLoading } = useQuery({
    queryKey: ["recentBlogs", slug],
    queryFn: () => fetchRecentBlogs(6, slug),
  });

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "var(--color-grey-909)",
        }}
      >
        <Spinner />
      </div>
    );

  if (isError)
    return (
      <>
        <SEO
          title="İçerik Bulunamadı – Vizepedia"
          description="Aradığınız blog yazısı bulunamadı."
          keywords="hata, sayfa bulunamadı"
          url={`https://www.vizepedia.com/blog/${slug}`}
          noindex={true}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "var(--color-grey-909)",
            color: "var(--color-grey-600)",
            fontSize: "1.5rem",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          Blog içeriği yüklenirken bir hata oluştu. Lütfen daha sonra tekrar
          deneyin.
        </div>
      </>
    );

  const readingTime = calculateReadingTime(blog);

  // SEO için gerekli verileri hazırla
  const cleanText = (html = "") =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const bodyText = cleanText(
    `${blog.section1_content || ""} ${blog.section2_content || ""} ${
      blog.section3_content || ""
    }`
  );

  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  // Tags normalization
  const tags = Array.isArray(blog.tags)
    ? blog.tags
    : typeof blog.tags === "string"
    ? blog.tags.split(",").map((t) => t.trim())
    : [];

  // Meta description - 155 karakter optimize
  const metaDescription =
    blog.excerpt ||
    bodyText.slice(0, 155) + (bodyText.length > 155 ? "..." : "");

  // Breadcrumbs array
  const breadcrumbs = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Blog", url: "/blog" },
    {
      name: blog.category,
      url: `/blog/kategori/${encodeURIComponent(blog.category)}`,
    },
  ];

  return (
    <PageContainer>
      {blog && (
        <>
          <SEO
            title={`${blog.title} | Vizepedia Blog`}
            description={metaDescription}
            keywords={tags}
            image={blog.cover_image}
            url={`/blog/${slug}`}
            openGraphType="article"
            author={blog.author || "Vizepedia Editör"}
            publishedTime={blog.created_at}
            modifiedTime={blog.updated_at}
            category={blog.category}
            tags={tags}
            wordCount={wordCount}
            estimatedReadingTime={`${readingTime} dakika`}
            breadcrumbs={breadcrumbs}
            articleData={{
              headline: blog.title,
              description: metaDescription,
              image: blog.cover_image,
              datePublished: blog.created_at,
              dateModified: blog.updated_at || blog.created_at,
              author: blog.author || "Vizepedia Editör",
              section: blog.category,
              keywords: tags.join(", "),
              wordCount: wordCount,
              timeRequired: `PT${readingTime}M`,
            }}
          />
        </>
      )}

      <ReadingProgress progress={readingProgress} />

      <HeroSection>
        <HeroImage src={blog.cover_image} alt={blog.title} />
        <HeroContent>
          <Crumbs aria-label="breadcrumb">
            <Link to="/">Ana Sayfa</Link>
            <span className="sep">/</span>
            <Link to="/blog">Blog</Link>
            <span className="sep">/</span>
            <Link to={`/blog/kategori/${encodeURIComponent(blog.category)}`}>
              {blog.category}
            </Link>
            <span className="sep">/</span>
            <span aria-current="page">{blog.title}</span>
          </Crumbs>

          <Category>{blog.category}</Category>
          <Title>{blog.title}</Title>
          <BlogMeta>
            <PublishDate>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {new Date(blog.created_at).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </PublishDate>
            <ReadTime>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {readingTime} dakikalık okuma
            </ReadTime>
          </BlogMeta>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <div style={{ flex: 1 }}>
          <BlogContentSection
            blog={blog}
            headings={headings}
            activeHeading={activeHeading}
            setActiveHeading={setActiveHeading}
            hideTableOfContents={false}
          />

          {Array.isArray(tags) && tags.length > 0 && (
            <TagsContainer>
              <strong>Etiketler: </strong>
              {tags.map((t, i) => (
                <Link
                  key={i}
                  to={`/blog/etiket/${encodeURIComponent(t)}`}
                  style={{ marginRight: 8 }}
                >
                  #{t}
                </Link>
              ))}
            </TagsContainer>
          )}

          <CategoryLinkContainer>
            <Link
              to={`/blog/kategori/${encodeURIComponent(blog.category)}`}
              aria-label={`${blog.category} kategorisindeki yazılar`}
            >
              ← {blog.category} kategorisindeki tüm yazılar
            </Link>
          </CategoryLinkContainer>

          <MobileSourcesContainer>
            <BlogSources sourcesString={blog?.sources} />
          </MobileSourcesContainer>
        </div>

        <SidebarContainer>
          <SidebarBlogList
            blogs={relatedBlogs}
            title={`${blog.category} Kategorisi`}
            subtitle="Aynı kategorideki diğer yazılar"
            initialCount={3}
            isLoading={relatedLoading}
            showCategory={false}
          />

          <RecentBlogs
            blogs={recentBlogs}
            title="En Yeni Yazılar"
            subtitle="Son eklenen içerikler"
            initialCount={3}
            isLoading={recentLoading}
            showCategory={true}
          />
        </SidebarContainer>
      </ContentSection>

      <DesktopSourcesContainer>
        <BlogSources sourcesString={blog?.sources} />
      </DesktopSourcesContainer>

      <ScrollToTop
        visible={scrollVisible}
        onClick={scrollToTop}
        aria-label="Yukarı kaydır"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </ScrollToTop>

      <Footer />
    </PageContainer>
  );
}

export default BlogDetail;

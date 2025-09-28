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
import JsonLd from "../components/JsonLd";

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

// Hero görseli için eski çalışan koddaki gibi background-image kullanımı
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

// Breadcrumbs için stil
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

// İçerik Bölümü
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

// Sidebar Container - İki sidebar'ı yan yana yerleştirmek için
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

// Mobile Sources Container - Blog içeriğinden hemen sonra
const MobileSourcesContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-top: 2rem;
    width: 100%;
  }
`;

// Desktop Sources Container - Sadece desktop'ta görünür
const DesktopSourcesContainer = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Yukarı Kaydırma Butonu
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

// İlerleme Göstergesi
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

// İç linkler için stil
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

// Önceki/Sonraki yazı navigasyonu
const PrevNextNav = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  gap: 2rem;

  a {
    flex: 1;
    max-width: 48%;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.8rem;
    color: var(--color-grey-600);
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-3px);
    }

    &.prev {
      text-align: left;
    }

    &.next {
      text-align: right;
    }

    span {
      display: block;
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 0.5rem;
    }

    strong {
      display: block;
      font-size: 1.1rem;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;

    a {
      max-width: 100%;
    }
  }
`;

// FAQ Bölümü
const FaqSection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: var(--color-grey-600);
  }

  .faq-item {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }

    h3 {
      font-size: 1.2rem;
      margin-bottom: 0.8rem;
      color: var(--color-grey-600);
    }

    p {
      line-height: 1.6;
      color: var(--color-grey-500);
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

    combinedText = combinedText.replace(/<[^>]*>/g, "");

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
    onSuccess: (data) => {
      console.log("Blog verisi:", data);
      console.log("Cover image:", data?.cover_image);
    },
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
          title="İçerik bulunamadı – Vizepedia" 
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
  const plain = (html = "") =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const bodyText = plain(
    `${blog.section1_content || ""} ${blog.section2_content || ""} ${
      blog.section3_content || ""
    }`
  );
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  const timeRequired = `PT${Math.max(1, Math.ceil(wordCount / 200))}M`; // ISO8601 süre
  const published = new Date(blog.created_at).toISOString();
  const modified = new Date(blog.updated_at || blog.created_at).toISOString();
  const tags = Array.isArray(blog.tags)
    ? blog.tags
    : blog.tags?.split(",") || [];

  // Örnek FAQ verisi (gerçekte blog.faq olarak API'den gelmeli)
  const faqItems = blog.faq || [
    {
      q: "X vizesi kaç günde çıkar?",
      a: "Genelde 7–15 gün içinde sonuçlanır.",
    },
    {
      q: "Vize başvurusu için ne kadar önceden hazırlanmalıyım?",
      a: "En az 1 ay önceden başvurmanız önerilir.",
    },
    {
      q: "Vize reddedilirse ne yapmalıyım?",
      a: "Red nedenlerini analiz edip eksikleri tamamlayarak tekrar başvurabilirsiniz.",
    },
  ];

  return (
    <PageContainer>
      {blog && (
        <>
          {/* SIMPLIFIED SEO COMPONENT - This is the main change */}
          <SEO
            title={`${blog.title} – Vizepedia`}
            description={blog.excerpt ?? bodyText.slice(0, 150)}
            keywords={Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "vize rehberi, Vizepedia"}
            image={blog.cover_image || "/logo.png"}
            url={`https://www.vizepedia.com/blog/${slug}`}
            noindex={false}
          />

          {/* Hero image preload - kept for performance */}
          {blog.cover_image && (
            <link
              rel="preload"
              as="image"
              href={blog.cover_image}
              imageSrcSet={`
                ${blog.cover_image}?w=640 640w,
                ${blog.cover_image}?w=960 960w,
                ${blog.cover_image}?w=1280 1280w,
                ${blog.cover_image}?w=1600 1600w
              `}
              imageSizes="(max-width: 768px) 100vw, 100vw"
            />
          )}
        </>
      )}

      <ReadingProgress progress={readingProgress} />

      {/* All your existing JsonLd components remain unchanged - they're good */}
      {/* Breadcrumbs JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Ana Sayfa",
              item: "https://www.vizepedia.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: "https://www.vizepedia.com/blog",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: blog.category,
              item: `https://www.vizepedia.com/blog/kategori/${encodeURIComponent(
                blog.category
              )}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: blog.title,
              item: `https://www.vizepedia.com/blog/${slug}`,
            },
          ],
        }}
      />

      {/* Article/BlogPosting JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.vizepedia.com/blog/${slug}`,
          },
          headline: blog.title,
          description: blog.excerpt || bodyText.slice(0, 160),
          image: [blog.cover_image].filter(Boolean),
          datePublished: published,
          dateModified: modified,
          author: {
            "@type": "Person",
            name: blog.author || "Vizepedia Editör",
          },
          publisher: {
            "@type": "Organization",
            name: "Vizepedia",
            logo: {
              "@type": "ImageObject",
              url: "https://www.vizepedia.com/logo-512.png",
            },
          },
          articleSection: blog.category,
          keywords: tags,
          wordCount: wordCount,
          timeRequired: timeRequired,
        }}
      />

      {/* FAQ JSON-LD */}
      {faqItems.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }}
        />
      )}

      <HeroSection>
        {/* Hero görseli için eski çalışan koddaki gibi background-image kullanımı */}
        <HeroImage src={blog.cover_image} alt="hero-image" />
        <HeroContent>
          {/* Breadcrumbs */}
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
        {/* Ana İçerik Kolonu */}
        <div style={{ flex: 1 }}>
          <BlogContentSection
            blog={blog}
            headings={headings}
            activeHeading={activeHeading}
            setActiveHeading={setActiveHeading}
            hideTableOfContents={false}
            // Analytics event handlers
            onCopy={() => {
              // Kopyalama olayı analizi
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "copy_content", {
                  event_category: "engagement",
                  event_label: blog.title,
                });
              }
            }}
            onTocClick={(headingId) => {
              // TOC tıklama analizi
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "toc_click", {
                  event_category: "navigation",
                  event_label: headingId,
                });
              }
            }}
            onSourceClick={(sourceUrl) => {
              // Kaynak tıklama analizi
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "source_click", {
                  event_category: "outbound",
                  event_label: sourceUrl,
                });
              }
            }}
          />

          {/* Önceki/Sonraki yazı navigasyonu */}
          <PrevNextNav>
            {/* API'den önceki/sonraki yazıları alabilirsiniz */}
            {/* Şimdilik boş bırakıyorum */}
          </PrevNextNav>

          {/* Etiketler - İç linkleme */}
          {Array.isArray(tags) && tags.length > 0 && (
            <TagsContainer>
              <strong>Etiketler: </strong>
              {tags.map((t, i) => (
                <Link
                  key={i}
                  to={`/blog/etiket/${encodeURIComponent(t.trim())}`}
                  style={{ marginRight: 8 }}
                >
                  #{t.trim()}
                </Link>
              ))}
            </TagsContainer>
          )}

          {/* Kategoriye dönüş linki */}
          <CategoryLinkContainer>
            <Link
              to={`/blog/kategori/${encodeURIComponent(blog.category)}`}
              aria-label={`${blog.category} kategorisindeki yazılar`}
            >
              ← {blog.category} kategorisindeki tüm yazılar
            </Link>
          </CategoryLinkContainer>

          {/* FAQ Bölümü */}
          {faqItems.length > 0 && (
            <FaqSection>
              <h2>Sıkça Sorulan Sorular</h2>
              <div className="faq-items">
                {faqItems.map((item, index) => (
                  <div key={index} className="faq-item">
                    <h3>{item.q}</h3>
                    <p>{item.a}</p>
                  </div>
                ))}
              </div>
            </FaqSection>
          )}

          {/* Mobile'da Kaynaklar - Blog içeriğinden hemen sonra */}
          <MobileSourcesContainer>
            <BlogSources sourcesString={blog?.sources} />
          </MobileSourcesContainer>
        </div>

        {/* İki Sidebar Yan Yana */}
        <SidebarContainer>
          {/* İlgili Bloglar Sidebar'ı */}
          <SidebarBlogList
            blogs={relatedBlogs}
            title={`${blog.category} Kategorisi`}
            subtitle="Aynı kategorideki diğer yazılar"
            initialCount={3}
            isLoading={relatedLoading}
            showCategory={false}
          />

          {/* En Yeni Bloglar Sidebar'ı */}
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

      {/* Desktop'ta Kaynaklar - Orijinal konumda */}
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
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogBySlug, fetchRelatedBlogs } from "../services/apiBlogs";
import Spinner from "../ui/Spinner";
import Footer from "../ui/Footer";
import styled, { keyframes } from "styled-components";
import SidebarBlogList from "../ui/SidebarBlogList";
import BlogContentSection from "../ui/BlogContentSection";

// Animasyonlar
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

  @media (min-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1200px) {
    font-size: 19px; // Daha dengeli bir boyut
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
    height: 55vh;
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
  padding: 0 2.5rem;
  position: relative;
  z-index: 2;
  padding-bottom: 4rem;
  animation: ${fadeIn} 1.2s ease-in-out;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
    padding-bottom: 3rem;
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
  font-size: 1.15rem;
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
  font-size: 1.15rem;
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
    font-size: 2.5rem;
  }
`;

// İçerik Bölümü
const ContentSection = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4.5rem 3rem;
  gap: 5rem;

  @media (max-width: 1400px) {
    max-width: 1200px;
    gap: 4rem;
  }

  @media (max-width: 1024px) {
    padding: 3.5rem 2.5rem;
    gap: 3.5rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 2.5rem 1.5rem;
    gap: 3.5rem;
  }
`;

// Yukarı Kaydırma Butonu
const ScrollToTop = styled.button`
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
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
    bottom: 1.5rem;
    right: 1.5rem;
    width: 48px;
    height: 48px;
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

function BlogDetail() {
  const { slug } = useParams();
  const [scrollVisible, setScrollVisible] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");

  // Okuma süresi hesaplama fonksiyonu
  const calculateReadingTime = (blog) => {
    if (!blog) return 0;

    // Tüm bölümlerin içeriklerini birleştir
    let combinedText = [
      blog.section1_content || "",
      blog.section2_content || "",
      blog.section3_content || "",
    ].join(" ");

    // HTML etiketlerini temizle
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

  // Geliştirilmiş smooth scroll fonksiyonu
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Başlık alanı için boşluk bırakıyoruz
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Aktif başlığı güncelleme
      setActiveHeading(id);
      
      // Erişilebilirlik için başlığa odaklanma 
      setTimeout(() => {
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
      }, 500);
      
      // History API kullanarak URL'yi değiştirmeden geçmişi kaydet (opsiyonel)
      // const currentPath = window.location.pathname;
      // window.history.pushState({ headingId: id }, "", currentPath);
    }
  };

  // Sayfa scroll olaylarını izleme
  useEffect(() => {
    const handleScroll = () => {
      // Yukarı kaydırma butonu görünürlüğü
      setScrollVisible(window.scrollY > 400);
      
      // Okuma ilerleme çubuğu
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);

      // Aktif başlığı belirleme
      if (headings.length > 0) {
        const headingElements = headings.map((heading) =>
          document.getElementById(heading.id)
        );

        // En son görünür başlığı bul
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

        // Eğer aktif başlık değiştiyse state'i güncelle
        if (activeId && activeId !== activeHeading) {
          setActiveHeading(activeId);
          
          // URL'yi değiştirmeden durum güncellemesi (opsiyonel)
          // const currentPath = window.location.pathname;
          // window.history.replaceState({ headingId: activeId }, "", currentPath);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings, activeHeading]);

  // History API olayları için izleyici (opsiyonel)
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.headingId) {
        const id = event.state.headingId;
        scrollToHeading(id);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

  const relatedTags = blog?.tags || "";
  const { data: relatedBlogs } = useQuery({
    queryKey: ["relatedBlogs", relatedTags, slug],
    queryFn: () => fetchRelatedBlogs(relatedTags, slug),
    enabled: !!relatedTags.length,
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "var(--color-grey-909)",
          color: "var(--color-grey-600)",
          fontSize: "1.5rem",
          padding: "2rem",
        }}
      >
        Blog içeriği yüklenirken bir hata oluştu. Lütfen daha sonra tekrar
        deneyin.
      </div>
    );

  const readingTime = calculateReadingTime(blog);

  return (
    <PageContainer>
      <ReadingProgress progress={readingProgress} />

      <HeroSection>
        <HeroImage src={blog.cover_image} />
        <HeroContent>
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
        <BlogContentSection
          blog={blog}
          headings={headings}
          activeHeading={activeHeading}
          setActiveHeading={setActiveHeading}
        />

        <SidebarBlogList
          blogs={relatedBlogs}
          title="İlgili İçerikler"
          initialCount={3}
        />
      </ContentSection>

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
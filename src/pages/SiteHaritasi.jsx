import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";
import { toSlug } from "../utils/seoHelpers"; // Import the same function used by document pages
import MainPageHeader from "../ui/MainPageHeader";
import Footer from "../ui/Footer";
import {
  FullPage,
  ScrollIndicator,
  Main,
  Heading,
  LastUpdate,
  SubText,
  FadeInSection
} from "./Kvkk";
import styled from "styled-components";
import SEO from "../components/SEO";

// Function to fetch all documents and blog categories
const fetchSitemapData = async () => {
  // Fetch all documents
  const { data: documents, error: docsError } = await supabase
    .from("documents")
    .select("docName, docStage")
    .order("docName", { ascending: true });

  if (docsError) {
    console.error("Error fetching documents:", docsError);
    throw new Error(docsError.message);
  }

  // Fetch blog categories
  const { data: blogs, error: blogsError } = await supabase
    .from("blogs")
    .select("category")
    .not("category", "is", null);

  if (blogsError) {
    console.error("Error fetching blog categories:", blogsError);
    throw new Error(blogsError.message);
  }

  // Get unique categories
  const categories = [...new Set(blogs.map(blog => blog.category))];

  return {
    documents: documents || [],
    categories: categories || []
  };
};

// Styled components
const SitemapContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const SitemapSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #E5E7EB;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1F2937;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const LinkItem = styled.li`
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SitemapLink = styled.a`
  color: #3B82F6;
  text-decoration: none;
  font-size: 13px;
  display: block;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s;
  
  &:hover {
    background: #F3F4F6;
    color: #2563EB;
    transform: translateX(4px);
  }
`;

const PopularBadge = styled.span`
  background: #DBEAFE;
  color: #1E40AF;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: 6px;
  font-weight: 500;
`;

const NewBadge = styled.span`
  background: #DCFCE7;
  color: #166534;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: 6px;
  font-weight: 500;
`;

const CountBadge = styled.span`
  background: #F3F4F6;
  color: #6B7280;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
  font-weight: 500;
`;

const SitemapStats = styled.div`
  background: linear-gradient(135deg, #3B82F6, #10B981);
  border-radius: 12px;
  padding: 24px;
  color: white;
  text-align: center;
  margin-bottom: 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-top: 16px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #6B7280;
`;

export default function SiteHaritasi() {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef([]);
  const scrollIndicatorRef = useRef(null);

  // Fetch dynamic data
  const { data, isLoading, error } = useQuery({
    queryKey: ["sitemapData"],
    queryFn: fetchSitemapData,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Static sitemap data
  const staticSitemapData = [
    {
      title: "Ana Sayfalar",
      links: [
        { name: "Ana Sayfa", url: "/", popular: true },
        { name: "Vize Rehberi Başla", url: "/dashboard", popular: true },
        { name: "Site Haritası", url: "/site-haritasi" }
      ]
    },
    {
      title: "Belge Yönetimi",
      links: [
        { name: "Hazır Belgeler", url: "/ready-documents", popular: true },
        { name: "Planlanacak Belgeler", url: "/planned-documents" },
        { name: "Bizimle Belgeler", url: "/withus-documents" }
      ]
    },
    {
      title: "Araçlar",
      links: [
        { name: "Davetiye Oluştur", url: "/davetiye-olustur", popular: true }
      ]
    },
    {
      title: "Kullanıcı İşlemleri",
      links: [
        { name: "Giriş Yap", url: "/login" },
        { name: "Kayıt Ol", url: "/sign-up" },
        { name: "Şifre Sıfırla", url: "/reset-password" },
        { name: "Hesap Ayarları", url: "/account" }
      ]
    },
    {
      title: "Kurumsal ve Yasal",
      links: [
        { name: "Hakkımızda", url: "/hakkimizda", popular: true },
        { name: "İletişim", url: "/iletisim", popular: true },
        { name: "Gizlilik Politikası", url: "/gizlilik-politikasi" },
        { name: "KVKK Aydınlatma Metni", url: "/kisisel-verilerin-korunmasi" },
        { name: "Kullanım Şartları", url: "/kullanim-sartlari" },
        { name: "Yasal Uyarı", url: "/yasal-uyari" },
        { name: "Çerez Politikası", url: "/cerez-politikasi" }
      ]
    }
  ];

  // Generate dynamic sitemap data
  const generateDynamicSitemapData = () => {
    if (!data) return staticSitemapData;

    const { documents, categories } = data;

    // Group documents by stage
    const documentsByStage = {
      hazir: documents.filter(doc => doc.docStage === "hazir"),
      planla: documents.filter(doc => doc.docStage === "planla"),
      bizimle: documents.filter(doc => doc.docStage === "bizimle")
    };

    const dynamicSections = [
      // Blog categories
      {
        title: `Blog Kategorileri`,
        links: [
          { name: "Blog Ana Sayfa", url: "/blog", popular: true },
          ...categories.map(category => ({
            name: `${category} Kategorisi`,
            url: `/blog/kategori/${encodeURIComponent(category)}`,
            new: true
          }))
        ]
      },
      // Hazır belgeler
      {
        title: `Hazır Belge Sayfaları`,
        links: documentsByStage.hazir.map(doc => ({
          name: doc.docName,
          url: `/ready-documents/${toSlug(doc.docName)}`,
          popular: ["Biyometrik Fotoğraf", "Kimlik Fotokopisi", "Pasaport"].includes(doc.docName)
        }))
      },
      // Planlanacak belgeler
      {
        title: `Planlanacak Belge Sayfaları`,
        links: documentsByStage.planla.map(doc => ({
          name: doc.docName,
          url: `/planned-documents/${toSlug(doc.docName)}`
        }))
      },
      // Bizimle belgeler
      {
        title: `Bizimle Belge Sayfaları`,
        links: documentsByStage.bizimle.map(doc => ({
          name: doc.docName,
          url: `/withus-documents/${toSlug(doc.docName)}`
        }))
      }
    ];

    return [...staticSitemapData, ...dynamicSections];
  };

  const sitemapData = generateDynamicSitemapData();

  // Calculate stats
  const totalLinks = sitemapData.reduce((total, section) => total + section.links.length, 0);
  const popularCount = sitemapData.reduce((total, section) => 
    total + section.links.filter(link => link.popular).length, 0);

  // Set up scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Set up intersection observer for fade-in sections
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };
    
    const observers = [];
    
    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
            observer.unobserve(entry.target);
          }
        });
      }, options);
      
      observer.observe(ref);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [sitemapData.length]);
  
  // Set section refs
  const setSectionRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  if (error) {
    console.error("Sitemap data fetch error:", error);
  }

  return (
    <>
    <SEO
  title="Site Haritası – Vizepedia"
  description="Vizepedia site haritası. Tüm sayfalara hızlı erişim."
  keywords="site haritası, sitemap, sayfa listesi, site yapısı"
  url="/site-haritasi"
  noindex={false}
/>
    <FullPage>
      <ScrollIndicator ref={scrollIndicatorRef} />
      <MainPageHeader />
      <Main>
        <Heading>Vizepedia – Site Haritası</Heading>
        <LastUpdate>Son Güncelleme: 24 Eylül 2025</LastUpdate>
        <SubText>
          Vizepedia platformundaki tüm sayfalar ve bölümler. {data?.documents?.length || 48} belge sayfası, 
          blog kategorileri ve tüm özellikler dahil olmak üzere aradığınız içeriği kolayca bulabilirsiniz.
        </SubText>
        
        {/* Site Statistics */}
        <FadeInSection className="visible">
          <SitemapStats>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
              Platform İstatistikleri
            </h3>
            <StatsGrid>
              <StatItem>
                <StatNumber>{isLoading ? "..." : totalLinks}</StatNumber>
                <StatLabel>Toplam Sayfa</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{data?.documents?.length || 48}</StatNumber>
                <StatLabel>Belge Sayfası</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{data?.categories?.length || 4}</StatNumber>
                <StatLabel>Blog Kategorisi</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{popularCount}</StatNumber>
                <StatLabel>Popüler Sayfa</StatLabel>
              </StatItem>
            </StatsGrid>
          </SitemapStats>
        </FadeInSection>
        
        {isLoading && (
          <LoadingContainer>
            Sayfa içerikleri yükleniyor...
          </LoadingContainer>
        )}
        
        {/* Sitemap Sections */}
        <SitemapContainer>
          {sitemapData.map((section, sectionIndex) => (
            <FadeInSection
              key={section.title}
              ref={setSectionRef(sectionIndex)}
              className={visibleSections.includes(sectionIndex) ? 'visible' : ''}
            >
              <SitemapSection>
                <SectionTitle>
                  {section.title}
                  <CountBadge>{section.links.length}</CountBadge>
                </SectionTitle>
                <LinkList>
                  {section.links.map((link, linkIndex) => (
                    <LinkItem key={linkIndex}>
                      <SitemapLink href={link.url}>
                        {link.name}
                        {link.popular && <PopularBadge>Popüler</PopularBadge>}
                        {link.new && <NewBadge>Yeni</NewBadge>}
                      </SitemapLink>
                    </LinkItem>
                  ))}
                </LinkList>
              </SitemapSection>
            </FadeInSection>
          ))}
        </SitemapContainer>
        
        <FadeInSection
          ref={setSectionRef(sitemapData.length)}
          className={visibleSections.includes(sitemapData.length) ? 'visible' : ''}
        >
          <SitemapSection style={{ textAlign: 'center', background: '#F9FAFB' }}>
            <h3 style={{ marginBottom: '12px', color: '#1F2937' }}>
              Aradığınızı Bulamadınız mı?
            </h3>
            <p style={{ color: '#6B7280', marginBottom: '16px', fontSize: '14px' }}>
              Sorularınız için bizimle iletişime geçebilirsiniz.
            </p>
            <SitemapLink 
              href="/iletisim" 
              style={{ 
                background: '#3B82F6', 
                color: 'white', 
                display: 'inline-block',
                fontWeight: 500 
              }}
            >
              İletişime Geç
            </SitemapLink>
          </SitemapSection>
        </FadeInSection>
      </Main>
      <Footer />
    </FullPage>
    </>
  );
}
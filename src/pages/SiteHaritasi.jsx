import { useState, useEffect, useRef } from "react";
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

// Styled components for sitemap
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
`;

const LinkItem = styled.li`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SitemapLink = styled.a`
  color: #3B82F6;
  text-decoration: none;
  font-size: 14px;
  display: block;
  padding: 8px 12px;
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
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
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

// Actual sitemap data based on your App.jsx routes
const sitemapData = [
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
    title: "Blog ve İçerikler",
    links: [
      { name: "Blog Ana Sayfa ve Blog Yazılarımız", url: "/blog", popular: true },
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

// Calculate stats
const totalLinks = sitemapData.reduce((total, section) => total + section.links.length, 0);
const popularCount = sitemapData.reduce((total, section) => 
  total + section.links.filter(link => link.popular).length, 0);

export default function SiteHaritasi() {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef([]);
  const scrollIndicatorRef = useRef(null);
  
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
  }, []);
  
  // Set section refs
  const setSectionRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  return (
    <FullPage>
      <ScrollIndicator ref={scrollIndicatorRef} />
      <MainPageHeader />
      <Main>
        <Heading>Vizepedia – Site Haritası</Heading>
        <LastUpdate>Son Güncelleme: 8 Eylül 2025</LastUpdate>
        <SubText>
          Vizepedia platformundaki tüm sayfalar ve bölümler. Aradığınız içeriği 
          kolayca bulabilir, vize başvuru sürecinizi organize edebilirsiniz.
        </SubText>
        
        {/* Site Statistics */}
        <FadeInSection className="visible">
          <SitemapStats>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
              Platform İstatistikleri
            </h3>
            <StatsGrid>
              <StatItem>
                <StatNumber>{totalLinks}</StatNumber>
                <StatLabel>Toplam Sayfa</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{popularCount}</StatNumber>
                <StatLabel>Popüler Sayfa</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{sitemapData.length}</StatNumber>
                <StatLabel>Ana Kategori</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>25+</StatNumber>
                <StatLabel>Ülke Rehberi</StatLabel>
              </StatItem>
            </StatsGrid>
          </SitemapStats>
        </FadeInSection>
        
        {/* Sitemap Sections */}
        <SitemapContainer>
          {sitemapData.map((section, sectionIndex) => (
            <FadeInSection
              key={section.title}
              ref={setSectionRef(sectionIndex)}
              className={visibleSections.includes(sectionIndex) ? 'visible' : ''}
            >
              <SitemapSection>
                <SectionTitle>{section.title}</SectionTitle>
                <LinkList>
                  {section.links.map((link, linkIndex) => (
                    <LinkItem key={linkIndex}>
                      <SitemapLink href={link.url}>
                        {link.name}
                        {link.popular && <PopularBadge>Popüler</PopularBadge>}
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
  );
}
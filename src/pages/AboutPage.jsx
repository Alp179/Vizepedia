import { useState, useEffect, useRef } from "react";
import Footer from "../ui/Footer";
import MainPageHeader from "../ui/MainPageHeader";
// Reuse existing styled components from kvkk.jsx
import {
  FullPage,
  ScrollIndicator,
  Main,
  Heading,
  LastUpdate,
  SubText,
  FadeInSection,
  ContentContainer,
  Section,
  SectionHeader,
  SectionContent,
  ForContactContainer,
  ForContact,
  ForContactInfo,
} from "./Kvkk";
import SEO from "../components/SEO";

const sectionsData = [
  {
    id: 1,
    title: "🎯 Misyonumuz",
    content: `Vizepedia olarak misyonumuz, kullanıcılarımızın yurt dışı seyahatlerini en sorunsuz şekilde planlamalarını, başlatmalarını ve tamamlamalarını sağlamaktır. Vize başvuru süreçlerini karmaşıklıktan arındırarak, herkesin güvenle ilerleyebileceği sade ve anlaşılır bir rehber sunmayı hedefliyoruz.`,
  },
  {
    id: 2,
    title: "🌍 Vizyonumuz",
    content: `Vizepedia'nın vizyonu, Türkiye'nin en güvenilir dijital vize rehberi haline gelerek; bilgi, yönlendirme ve kullanıcı deneyimi açısından sektörde referans platform olmaktır. Uzun vadede global kullanıcılar için de benzer kolaylıklar sunan bir yapı kurmayı hedefliyoruz.`,
  },
  {
    id: 3,
    title: "🎯 Projenin Amacı ve Hedefleri",
    content: `- Vize başvuru sürecini adım adım yönlendiren, kullanıcı dostu bir sistem sunmak.
    - Her ülkeye ve vize türüne özel gerekli belge listelerini, ipuçlarını ve örnekleri göstermek.
    - Seyahat planlaması yapan bireylerin doğru bilgiyle, eksiksiz şekilde başvuru yapabilmelerini sağlamak.
    - Süreç içerisinde randevu, başvuru merkezi bilgileri, red oranları gibi kritik verileri kullanıcıya sunarak başvuru başarısını artırmak.`,
  },
  {
    id: 4,
    title: "🧾 Sunduğumuz Hizmetler",
    content: `Kişiye özel vize başvuru rehberi:
    Kullanıcının verdiği bilgilere göre gereken belgeleri sıralayan dinamik sistem.
    
    Belgeler hakkında açıklamalar ve örnekler:
    Her belgenin ne olduğu, nasıl hazırlanacağı, nereden temin edileceği gibi detaylı açıklamalar.

    Vize firmalarının konumları ve çalışma saatleri:
    Harita destekli gösterimle birlikte başvuru yapılacak yerler hakkında bilgi.

    Konsolosluk istatistikleri ve ipuçları:
    Red oranları, randevu süreleri gibi stratejik veriler.

    Vize Davetiyesi Oluşturucu:
    Kullanıcının verdiği bilgilerle otomatik olarak resmi ve kabul edilebilir formatta davetiye metni hazırlayan araç.

    Blog ve içerik platformu:
    Güncel gelişmeler, vize trendleri, sık yapılan hatalar ve pratik ipuçları içeren yazılar.`,
  },
  {
    id: 5,
    title: "✨ Özel Özelliklerimiz",
    content: `Çoklu başvuru yönetimi:
    Aynı anda birden fazla vize başvuru sürecini kolaylıkla takip etme ve yönetme imkânı.
    
    Akıllı belge kontrol sistemi:
    Yüklediğiniz belgeleri otomatik olarak kontrol eden ve eksiklikleri bildiren sistem.

    Randevu hatırlatma sistemi:
    Önemli tarihleri kaçırmamanız için akıllı hatırlatma sistemi.

    Mobil uyumluluk:
    Her yerden erişebileceğiniz, mobil cihazlara optimize edilmiş platform.

    7/24 destek:
    Soru ve sorunlarınız için kesintisiz destek hizmeti.`,
  },
  {
    id: 6,
    title: "🚀 Neden Vizepedia?",
    content: `Güvenilirlik:
    Güncel ve doğru bilgiler ile desteklenen platform.
    
    Kullanıcı dostu arayüz:
    Karmaşık süreçleri basitleştiren, sezgisel tasarım.

    Zaman tasarrufu:
    Manuel araştırma yerine, size özel hazırlanmış rehberler.

    Başarı odaklı:
    Vize başvuru başarı oranınızı artırmaya odaklı stratejiler.

    Sürekli güncelleme:
    Değişen vize kurallarına göre sürekli güncellenen içerik.`,
  },
];

export const formatContent = (content) => {
  if (!content) return null;

  // Split content into paragraphs
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  const elements = [];

  // URL pattern to detect links
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  paragraphs.forEach((paragraph, pIndex) => {
    const lines = paragraph.split(/\n+/).filter((line) => line.trim());

    // Check if paragraph contains bullet points (starting with "- ")
    if (lines.some((line) => line.trim().startsWith("- "))) {
      // This is a bullet list
      const listItems = lines.map((line, lIndex) => {
        const cleanLine = line.trim().startsWith("- ")
          ? line.trim().substring(2)
          : line.trim();

        // Convert URLs to clickable links
        const parts = cleanLine.split(urlPattern);
        const content = parts.map((part, partIndex) => {
          // Check if this part is a URL
          if (part.match(urlPattern)) {
            return (
              <a
                key={`link-${partIndex}`}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0077b6", textDecoration: "underline" }}
              >
                {part}
              </a>
            );
          }
          return part;
        });

        return <li key={`item-${pIndex}-${lIndex}`}>{content}</li>;
      });

      elements.push(<ul key={`list-${pIndex}`}>{listItems}</ul>);
    }
    // Check if paragraph contains section headers (ending with colon)
    else if (
      lines.length > 1 &&
      lines.some((line) => line.trim().endsWith(":"))
    ) {
      // Process each line
      let currentList = [];
      let inList = false;

      lines.forEach((line, lIndex) => {
        const trimmedLine = line.trim();

        // Line is a header (ends with colon)
        if (trimmedLine.endsWith(":")) {
          // If we were in a list, close it
          if (inList && currentList.length > 0) {
            elements.push(
              <ul key={`sublist-${pIndex}-${lIndex}`}>{currentList}</ul>
            );
            currentList = [];
          }

          // Add the header as strong text
          elements.push(
            <p key={`header-${pIndex}-${lIndex}`}>
              <strong>{trimmedLine}</strong>
            </p>
          );

          inList = true;
        }
        // Regular list item
        else if (inList) {
          // Convert URLs to clickable links
          const parts = trimmedLine.split(urlPattern);
          const content = parts.map((part, partIndex) => {
            // Check if this part is a URL
            if (part.match(urlPattern)) {
              return (
                <a
                  key={`link-${partIndex}`}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0077b6", textDecoration: "underline" }}
                >
                  {part}
                </a>
              );
            }
            return part;
          });

          currentList.push(
            <li key={`subitem-${pIndex}-${lIndex}`}>{content}</li>
          );
        }
        // Regular paragraph
        else {
          // Handle URLs in regular paragraphs
          const parts = trimmedLine.split(urlPattern);
          const content = parts.map((part, partIndex) => {
            // Check if this part is a URL
            if (part.match(urlPattern)) {
              return (
                <a
                  key={`link-${partIndex}`}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0077b6", textDecoration: "underline" }}
                >
                  {part}
                </a>
              );
            }
            return part;
          });

          elements.push(<p key={`text-${pIndex}-${lIndex}`}>{content}</p>);
        }
      });

      // If we ended with an open list, close it
      if (currentList.length > 0) {
        elements.push(<ul key={`final-sublist-${pIndex}`}>{currentList}</ul>);
      }
    }
    // Regular paragraph
    else {
      // Handle URLs in regular paragraphs
      const parts = paragraph.trim().split(urlPattern);
      const content = parts.map((part, partIndex) => {
        // Check if this part is a URL
        if (part.match(urlPattern)) {
          return (
            <a
              key={`link-${partIndex}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0077b6", textDecoration: "underline" }}
            >
              {part}
            </a>
          );
        }
        return part;
      });

      elements.push(<p key={`para-${pIndex}`}>{content}</p>);
    }
  });

  return <>{elements}</>;
};

export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef([]);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.15 };
    const observers = [];

    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o && o.disconnect());
    };
  }, []);

  const setSectionRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  return (
    <>
      <SEO
        title="Hakkımızda – Vizepedia"
        description="Vizepedia’nın misyonu, vizyonu ve sunduğu hizmetler hakkında bilgi edinin. Vize başvuru süreçlerini kolaylaştıran rehberimiz."
        keywords="hakkımızda, misyon, vizyon, vize rehberi, Vizepedia"
        url="/hakkimizda"
        noindex={false}
      />
      <FullPage>
        <ScrollIndicator ref={scrollIndicatorRef} />
        <MainPageHeader />
        <Main>
          <Heading>Vizepedia – Hakkımızda</Heading>
          <LastUpdate>Son Güncelleme: 10.06.2025</LastUpdate>
          <SubText>
            Vize başvuru süreçlerini kolaylaştıran, güvenilir dijital
            rehberiniz. Vizepedia ile yurt dışı seyahat hayallerinizi gerçeğe
            dönüştürün.
          </SubText>

          <ContentContainer>
            {sectionsData.map((section, index) => (
              <FadeInSection
                key={section.id}
                ref={setSectionRef(index)}
                className={visibleSections.includes(index) ? "visible" : ""}
              >
                <Section>
                  <SectionHeader>{section.title}</SectionHeader>
                  <SectionContent>
                    {formatContent(section.content)}
                  </SectionContent>
                </Section>
              </FadeInSection>
            ))}
          </ContentContainer>

          <FadeInSection
            ref={setSectionRef(sectionsData.length)}
            className={
              visibleSections.includes(sectionsData.length) ? "visible" : ""
            }
          >
            <ForContactContainer>
              <ForContact>İletişim:</ForContact>
              <ForContactInfo>
                <a href="mailto:iletisim@vizepedia.com">
                  iletisim@vizepedia.com
                </a>
              </ForContactInfo>
              <ForContactInfo>
                <a
                  href="https://www.vizepedia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.vizepedia.com
                </a>
              </ForContactInfo>
            </ForContactContainer>
          </FadeInSection>
        </Main>
        <Footer />
      </FullPage>
    </>
  );
}

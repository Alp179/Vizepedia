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
  FadeInSection,
  ContentContainer,
  Section,
  SectionHeader,
  SectionContent,
  ForContactContainer,
  ForContact,
  ForContactInfo,
} from "./Kvkk";
import styled from "styled-components";
import SEO from "../components/SEO";

// Additional styled components for contact page
const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ContactCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const ContactIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
  font-size: 20px;
`;

const ContactTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
`;

const ContactText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ContactLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const ResponseTimeTable = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin: 24px 0;
`;

const ResponseRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const ResponseType = styled.span`
  font-weight: 500;
  color: #374151;
`;

const ResponseTime = styled.span`
  color: #059669;
  font-weight: 500;
`;

// Sections data for contact page
const sectionsData = [
  {
    id: 1,
    title: "📧 İletişim Bilgileri",
    content: `Bizimle iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz:`,
  },
  {
    id: 2,
    title: "⏰ Yanıt Süreleri",
    content: `Farklı konular için tahmini yanıt sürelerimiz:`,
  },
  {
    id: 3,
    title: "📝 İletişim Kurarken Dikkat Edilecekler",
    content: `Daha hızlı ve etkili yardım alabilmek için:
    Konu başlığını açık ve net yazın
    Hangi ülke için vize başvurusu yaptığınızı belirtin
    Eğer bir hata ile karşılaştıysanız, ekran görüntüsü ekleyin
    Kayıtlı kullanıcı iseniz, e-posta adresinizi belirtin
    Acil olmayan sorular için e-posta tercih edin`,
  },
  {
    id: 4,
    title: "🏢 Şirket Bilgileri",
    content: `Vizepedia Vize Danışmanlık Hizmetleri
    Türkiye
    
    Faaliyet Alanı: Dijital vize rehberlik platformu
    Kuruluş: 2024
    Hizmet Bölgesi: Türkiye ve uluslararası kullanıcılar`,
  },
  {
    id: 5,
    title: "⚖️ Yasal Bildirimlere İletişim",
    content: `KVKK başvuruları: İletişim e-postanıza "KVKK Başvurusu" konu başlığı ile yazın
    Telif hakkı bildirimleri: "Telif Hakkı" konu başlığı ile bildirin
    Yasal talepler: "Yasal Talep" konu başlığı kullanın
    Reklam şikayetleri: "Reklam Şikayeti" başlığı ile iletişime geçin`,
  },
  {
    id: 6,
    title: "💡 Öneri ve Geri Bildirimler",
    content: `Platform geliştirme önerileriniz bizim için değerlidir:
    Yeni özellik önerileri
    Kullanıcı deneyimi geri bildirimleri
    İçerik iyileştirme önerileri
    Teknik sorun bildirimleri
    Genel memnuniyet değerlendirmeleri
    
    Tüm geri bildirimler değerlendirilir ve mümkün olan durumlarda uygulanır.`,
  },
];

const formatContent = (content) => {
  if (!content) return null;

  const lines = content.split("\n").filter((line) => line.trim());
  const elements = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("- ")) {
      // This is a list item
      if (
        elements.length === 0 ||
        elements[elements.length - 1].type !== "ul"
      ) {
        elements.push({ type: "ul", items: [] });
      }
      elements[elements.length - 1].items.push(trimmedLine.substring(2));
    } else {
      // This is a paragraph
      elements.push({ type: "p", content: trimmedLine });
    }
  });

  return elements.map((element, index) => {
    if (element.type === "ul") {
      return (
        <ul key={index}>
          {element.items.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      );
    } else {
      return <p key={index}>{element.content}</p>;
    }
  });
};

export default function Iletisim() {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef([]);
  const scrollIndicatorRef = useRef(null);

  // Set up scroll progress indicator
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
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Set up intersection observer for fade-in sections
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

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
      }, options);

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Set section refs
  const setSectionRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  return (
    <>
      <SEO
        title="İletişim – Vizepedia"
        description="Vizepedia ile iletişime geçmek için e-posta, yasal başvuru, teknik destek ve öneri kanallarımızı kullanın. Yanıt süreleri ve iletişim bilgileri burada."
        keywords="iletişim, destek, Vizepedia, iletişim bilgileri, contact"
        url="/iletisim"
        noindex={false}
      />
      <FullPage>
        <ScrollIndicator ref={scrollIndicatorRef} />
        <MainPageHeader />
        <Main>
          <Heading>Vizepedia – İletişim</Heading>
          <LastUpdate>Son Güncelleme: 8 Eylül 2025</LastUpdate>
          <SubText>
            Sorularınız, önerileriniz veya yardıma ihtiyacınız mı var? Bizimle
            iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz. Size en
            kısa sürede geri dönüş yapacağız.
          </SubText>

          {/* Contact Cards Grid */}
          <FadeInSection className="visible">
            <ContactGrid>
              <ContactCard>
                <ContactIcon>📧</ContactIcon>
                <ContactTitle>E-posta Desteği</ContactTitle>
                <ContactText>
                  Genel sorular, teknik destek ve geri bildirimler için
                </ContactText>
                <ContactLink href="mailto:iletisim@vizepedia.com">
                  iletisim@vizepedia.com
                </ContactLink>
              </ContactCard>

              <ContactCard>
                <ContactIcon>⚖️</ContactIcon>
                <ContactTitle>Yasal Başvurular</ContactTitle>
                <ContactText>
                  KVKK, telif hakkı ve yasal konular için
                </ContactText>
                <ContactLink href="mailto:iletisim@vizepedia.com?subject=Yasal%20Başvuru">
                  Yasal başvuru gönder
                </ContactLink>
              </ContactCard>

              <ContactCard>
                <ContactIcon>💡</ContactIcon>
                <ContactTitle>Öneri ve Şikayetler</ContactTitle>
                <ContactText>
                  Platform iyileştirmeleri ve şikayetleriniz için
                </ContactText>
                <ContactLink href="mailto:iletisim@vizepedia.com?subject=Öneri">
                  Önerinizi paylaşın
                </ContactLink>
              </ContactCard>

              <ContactCard>
                <ContactIcon>🛠️</ContactIcon>
                <ContactTitle>Teknik Destek</ContactTitle>
                <ContactText>
                  Site kullanımı ve teknik sorunlar için
                </ContactText>
                <ContactLink href="mailto:iletisim@vizepedia.com?subject=Teknik%20Destek">
                  Teknik destek talep et
                </ContactLink>
              </ContactCard>
            </ContactGrid>
          </FadeInSection>

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
                    {section.id === 2 ? (
                      <ResponseTimeTable>
                        <ResponseRow>
                          <ResponseType>Genel Sorular</ResponseType>
                          <ResponseTime>24-48 saat</ResponseTime>
                        </ResponseRow>
                        <ResponseRow>
                          <ResponseType>Teknik Sorunlar</ResponseType>
                          <ResponseTime>12-24 saat</ResponseTime>
                        </ResponseRow>
                        <ResponseRow>
                          <ResponseType>KVKK Başvuruları</ResponseType>
                          <ResponseTime>En geç 30 gün</ResponseTime>
                        </ResponseRow>
                        <ResponseRow>
                          <ResponseType>Acil Güvenlik Konuları</ResponseType>
                          <ResponseTime>2-6 saat</ResponseTime>
                        </ResponseRow>
                        <ResponseRow>
                          <ResponseType>Öneri ve Geri Bildirimler</ResponseType>
                          <ResponseTime>3-7 gün</ResponseTime>
                        </ResponseRow>
                      </ResponseTimeTable>
                    ) : (
                      formatContent(section.content)
                    )}
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
              <ForContact>Hızlı İletişim</ForContact>
              <ForContactInfo>
                <ContactLink href="mailto:iletisim@vizepedia.com">
                  iletisim@vizepedia.com
                </ContactLink>
              </ForContactInfo>
              <ForContactInfo>Yanıt süresi: 24-48 saat içinde</ForContactInfo>
              <ForContactInfo>
                Mesai saatleri: 09:00 - 18:00 (Türkiye saati)
              </ForContactInfo>
              <ForContactInfo style={{ marginTop: "16px", fontSize: "14px" }}>
                <strong>Not:</strong> Vize başvuru sonuçları veya reddedilme
                sebepleri hakkında bilgi veremeyiz. Bu konular için ilgili
                konsoloslukla iletişime geçmeniz gerekmektedir.
              </ForContactInfo>
            </ForContactContainer>
          </FadeInSection>
        </Main>
        <Footer />
      </FullPage>
    </>
  );
}

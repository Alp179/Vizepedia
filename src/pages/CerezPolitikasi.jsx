// pages/CerezPolitikasi.jsx
import { useState, useEffect, useRef } from "react";
import MainPageHeader from "../ui/MainPageHeader";
import Footer from "../ui/Footer";

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

const sectionsData = [
  {
    id: 1,
    title: "1. Çerez (Cookie) Nedir?",
    content: `Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar sayesinde sizi tanıyabilir, tercihlerinizi hatırlayabilir ve size daha iyi bir kullanıcı deneyimi sunabiliriz.`
  },
  {
    id: 2,
    title: "2. Hangi Çerezleri Kullanıyoruz?",
    content: `Zorunlu (Temel) Çerezler:
    Web sitesinin düzgün çalışması için gereklidir. Kullanıcı oturumunu yönetmek, sayfalar arası geçişte bilgileri korumak gibi işlevleri yerine getirir.
    
    İşlevsel Çerezler:
    Kullanıcının tercihlerini (örneğin: seçilen ülke, vize türü, seyahat şekli vb.) hatırlayarak deneyimi kişiselleştirir.

    Performans ve Analiz Çerezleri:
    Google Analytics gibi hizmetler üzerinden site trafiğini analiz etmek için kullanılır.

    Reklam ve Hedefleme Çerezleri:
    Google AdSense tarafından yerleştirilen bu çerezler, kişiselleştirilmiş reklamlar göstermek için kullanılır.`
  },
  {
    id: 3,
    title: "3. Çerezler Yoluyla Toplanan Veriler Nelerdir?",
    content: `- IP adresi
    - Tarayıcı türü ve dili
    - İşletim sistemi
    - Ziyaret zamanı ve süresi
    - Tercih ettiğiniz vize türü ve ülke gibi seçimler
    - Tıklanan sayfalar ve bağlantılar`
  },
  {
    id: 4,
    title: "4. Çerezlerin Yönetimi ve Devre Dışı Bırakılması",
    content: `Çerezlerin kullanılmasını tarayıcı ayarlarınızdan silebilir veya engelleyebilirsiniz. Ancak bazı çerezlerin devre dışı bırakılması, web sitemizin bazı bölümlerinin düzgün çalışmasını engelleyebilir.

    Tarayıcı ayarları için örnek bağlantılar:
    - Google Chrome: https://support.google.com/accounts/answer/61416
    - Mozilla Firefox: https://support.mozilla.org/tr/kb/cerezleri-silme
    - Safari: https://support.apple.com/tr-tr/guide/safari/sfri11471/mac
    - Microsoft Edge: https://support.microsoft.com/tr-tr/help/4027947`
  },
  {
    id: 5,
    title: "5. Üçüncü Taraf Çerezler",
    content: `Web sitemiz, Google AdSense gibi üçüncü taraf hizmet sağlayıcılarının çerezlerini kullanabilir. Bu çerezler, kullanıcıların reklam deneyimini kişiselleştirmek ve kampanya verimliliğini ölçmek amacıyla kullanılır.

    Daha fazla bilgi: https://policies.google.com/technologies/cookies`
  },
  {
    id: 6,
    title: "6. Politika Değişiklikleri",
    content: `Bu çerez politikası, zaman zaman güncellenebilir. Değişiklikler bu sayfa üzerinden yayınlanacaktır. Güncel tarih yukarıda belirtilmiştir.`
  },
];

export const formatContent = (content) => {
  if (!content) return null;
  
  // Split content into paragraphs
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
  const elements = [];
  
  paragraphs.forEach((paragraph, pIndex) => {
    const lines = paragraph.split(/\n+/).filter(line => line.trim());
    
    // Check if paragraph contains bullet points (starting with "- ")
    if (lines.some(line => line.trim().startsWith("- "))) {
      // This is a bullet list
      const listItems = lines.map((line, lIndex) => {
        const cleanLine = line.trim().startsWith("- ") 
          ? line.trim().substring(2) 
          : line.trim();
          
        return <li key={`item-${pIndex}-${lIndex}`}>{cleanLine}</li>;
      });
      
      elements.push(<ul key={`list-${pIndex}`}>{listItems}</ul>);
    } 
    // Check if paragraph contains section headers (ending with colon)
    else if (lines.length > 1 && lines.some(line => line.trim().endsWith(":"))) {
      // Process each line
      let currentList = [];
      let inList = false;
      
      lines.forEach((line, lIndex) => {
        const trimmedLine = line.trim();
        
        // Line is a header (ends with colon)
        if (trimmedLine.endsWith(":")) {
          // If we were in a list, close it
          if (inList && currentList.length > 0) {
            elements.push(<ul key={`sublist-${pIndex}-${lIndex}`}>{currentList}</ul>);
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
          currentList.push(<li key={`subitem-${pIndex}-${lIndex}`}>{trimmedLine}</li>);
        }
        // Regular paragraph
        else {
          elements.push(<p key={`text-${pIndex}-${lIndex}`}>{trimmedLine}</p>);
        }
      });
      
      // If we ended with an open list, close it
      if (currentList.length > 0) {
        elements.push(<ul key={`final-sublist-${pIndex}`}>{currentList}</ul>);
      }
    } 
    // Regular paragraph
    else {
      elements.push(<p key={`para-${pIndex}`}>{paragraph.trim()}</p>);
    }
  });
  
  return <>{elements}</>;
};

export default function CerezPolitikasi() {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef([]);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
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
      }, observerOptions);
      
      observer.observe(ref);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach(o => o && o.disconnect());
    };
  }, []);

  const setSectionRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  return (
    <FullPage>
      <ScrollIndicator ref={scrollIndicatorRef} />
      <MainPageHeader />
      <Main>
        <Heading>Vizepedia – Çerez Politikası</Heading>
        <LastUpdate>Son Güncelleme: 10.05.2025</LastUpdate>
        <SubText>
          Bu sayfa, Vizepedia web sitesinin çerez kullanımına ilişkin bilgi vermek amacıyla hazırlanmıştır. Web sitemizi kullanarak çerez politikamızı kabul etmiş olursunuz.
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
                <SectionContent>{formatContent(section.content)}</SectionContent>
              </Section>
            </FadeInSection>
          ))}
        </ContentContainer>
        
        <FadeInSection
          ref={setSectionRef(sectionsData.length)}
          className={visibleSections.includes(sectionsData.length) ? "visible" : ""}
        >
          <ForContactContainer>
            <ForContact>İletişim:</ForContact>
            <ForContactInfo>
              <a href="mailto:iletisim@vizepedia.com">iletisim@vizepedia.com</a>
            </ForContactInfo>
            <ForContactInfo>
              <a href="https://www.vizepedia.com" target="_blank" rel="noopener noreferrer">www.vizepedia.com</a>
            </ForContactInfo>
          </ForContactContainer>
        </FadeInSection>
      </Main>
      <Footer />
    </FullPage>
  );
}
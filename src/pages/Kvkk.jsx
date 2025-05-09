import { useState, useEffect, useRef } from "react";
import MainPageHeader from "../ui/MainPageHeader";
import styled from "styled-components";
import Footer from "../ui/Footer";

// Styled components
export const FullPage = styled.div`
  min-height: 100vh;
  width: 100%;
  background: var(--color-grey-1);
  overflow-x: hidden;
`;

export const ScrollIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366F1, #10B981, #EC4899);
  transform-origin: 0 0;
  transform: scaleX(0);
  z-index: 1000;
  
  @media (max-width: 480px) {
    height: 3px;
  }
`;

export const Main = styled.div`
  width: 85%;
  max-width: 1000px;
  margin: 150px auto 50px auto;
  padding-bottom: 80px;
  
  @media (max-width: 768px) {
    width: 90%;
    margin: 100px auto 40px auto;
  }
`;

export const Heading = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #3B82F6, #10B981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

export const LastUpdate = styled.p`
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 24px;
`;

export const SubText = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 40px;
  color: var(--color-grey-500);
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const FadeInSection = styled.div`
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  border-bottom: 1px solid #F3F4F6;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const SectionHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1F2937;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const SectionContent = styled.div`
  font-size: 16px;
  line-height: 1.7;
  color: #4B5563;
  
  ul {
    margin: 16px 0;
    padding-left: 20px;
    list-style-type: disc;
    
    li {
      margin-bottom: 10px;
      padding-left: 6px;
    }
  }
  
  p {
    margin-bottom: 16px;
  }
  
  strong {
    color: #1F2937;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

export const ForContactContainer = styled.div`
  margin-top: 40px;
  padding: 24px;
  background: #F9FAFB;
  border-radius: 12px;
  text-align: center;
`;

export const ForContact = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1F2937;
`;

export const ForContactInfo = styled.p`
  font-size: 16px;
  color: #4B5563;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  a {
    color: #3B82F6;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: #2563EB;
      text-decoration: underline;
    }
  }
`;

// Sections data
const sectionsData = [
  {
    id: 1,
    title: "1. Hangi Verileri Topluyoruz?",
    content: `Ziyaretçi (Anonim Kullanıcı) Olarak:
    Ülke tercihi, vize türü, meslek bilgisi, ulaşım ve konaklama tercihleriniz (tarayıcınızın çerezlerinde saklanır)
    IP adresiniz
    Tarayıcı ve cihaz bilgileri
    Web sitesi üzerindeki gezinme davranışınız (hangi sayfaları gezdiğiniz, tıkladığınız belgeler vb.)
    Çerez ve benzeri teknolojiler üzerinden toplanan bilgiler
    
    Üye Kullanıcı Olarak:
    E-posta adresiniz
    Şifreniz (şifrelenmiş şekilde saklanır)
    Üyelik işlemleriyle bağlantılı IP ve oturum verileri`
  },
  {
    id: 2,
    title: "2. Verilerinizi Hangi Amaçlarla İşliyoruz?",
    content: `Toplanan veriler:
    Size özelleştirilmiş belge listeleri sunmak
    Site kullanım deneyiminizi kişiselleştirmek ve geliştirmek
    Web sitemizde reklam gösterimlerini (Google AdSense vb.) optimize etmek
    Blog içerikleri ve yönlendirmelerle sizi bilgilendirmek
    Şifre sıfırlama işlemleri ve hesap güvenliğini sağlamak
    Yasal yükümlülükleri yerine getirmek amaçlarıyla işlenmektedir.`
  },
  {
    id: 3,
    title: "3. Çerez (Cookie) Kullanımı",
    content: "Web sitemiz, kullanıcı tercihlerini hatırlamak ve kişiselleştirilmiş içerik sunmak amacıyla çerezler (cookies) kullanır. Ayrıca, Google AdSense gibi üçüncü taraf reklam sağlayıcıları da çerez kullanarak reklam sunabilir. Bu çerezler sayesinde size daha alakalı reklamlar gösterilebilir. Kullanıcılar tarayıcı ayarları üzerinden çerezleri silebilir veya engelleyebilir. Ancak bazı çerezlerin devre dışı bırakılması, web sitemizin bazı bölümlerinin düzgün çalışmamasına yol açabilir."
  },
  {
    id: 4,
    title: "4. Verilerin Üçüncü Taraflarla Paylaşımı",
    content: `Verileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:
    Google AdSense: Reklam gösterimi için IP adresiniz ve çerezleriniz, Google Inc. ile paylaşılabilir. Bu veriler, Google'ın gizlilik politikası çerçevesinde işlenir.
    Analiz Araçları (ör. Google Analytics): Web sitesinin performansını ve kullanıcı deneyimini analiz etmek amacıyla anonim veriler paylaşılabilir.
    
    Hiçbir koşulda kişisel verileriniz, yasal zorunluluklar haricinde üçüncü taraflarla izinsiz paylaşılmaz.`
  },
  {
    id: 5,
    title: "5. Kişisel Verilerinizi Nasıl Saklıyoruz?",
    content: "Kayıtlı kullanıcıların verileri (örneğin e-posta ve şifre), güvenli bir şekilde barındırdığımız Supabase altyapısı üzerinde korunur. Ziyaretçi seçimleri ise yalnızca cihazınızdaki tarayıcı çerezlerinde saklanır. Her iki durumda da KVKK'nın öngördüğü teknik ve idari güvenlik önlemleri alınmaktadır."
  },
  {
    id: 6,
    title: "6. KVKK Kapsamındaki Haklarınız",
    content: `KVKK'nın 11. maddesi gereğince:
    Kişisel verilerinizin işlenip işlenmediğini öğrenme
    İşlenmişse buna ilişkin bilgi talep etme
    Amacına uygun kullanılıp kullanılmadığını öğrenme
    Verilerinizin düzeltilmesini veya silinmesini talep etme
    Otomatik sistemlerle analiz edilmesine itiraz etme
    Zarara uğramanız halinde tazminat talep etme haklarına sahipsiniz.
    
    Bu haklarınızı kullanmak için bize iletisim@vizepedia.com adresinden ulaşabilirsiniz.`
  },
  {
    id: 7,
    title: "7. Şifre Sıfırlama ve Hesap Güvenliği",
    content: "Kayıtlı kullanıcılar, e-posta adresi üzerinden güvenli bir bağlantı yoluyla şifre sıfırlama işlemi gerçekleştirebilir. Bu işlem yalnızca kullanıcının talebiyle, sistemimiz tarafından gönderilen geçici bir bağlantı ile yapılır. Her bağlantı tek kullanımlıktır ve belirli bir süre sonunda geçerliliğini yitirir. Şifreleriniz, Supabase tarafından modern şifreleme algoritmalarıyla korunur ve üçüncü şahıslarla kesinlikle paylaşılmaz. Vizepedia olarak kullanıcılarımızın hesap güvenliğini sağlamak adına gerekli tüm teknik ve idari tedbirleri alıyoruz."
  },
  {
    id: 8,
    title: "8. Kişisel Verilerin Güvenliği",
    content: `Topladığımız tüm kişisel veriler, yetkisiz erişimlere karşı:
    HTTPS protokolüyle güvenli veri iletimi
    Supabase altyapısında şifreleme
    Erişim sınırlandırmaları ve kontrolleri gibi önlemlerle korunmaktadır.
    
    Tarayıcı çerezlerinde saklanan anonim bilgiler (örneğin ülke, vize türü tercihleri), sadece sizin cihazınızda kalır ve Vizepedia sunucularına iletilmez.`
  },
  {
    id: 9,
    title: "9. Politika Değişiklikleri",
    content: "Bu metin, yasal mevzuat değişiklikleri veya hizmetlerimizde yapılacak güncellemeler doğrultusunda değiştirilebilir. Değişiklikler, bu sayfa üzerinden duyurulur. Güncel tarih yukarıda belirtilmiştir."
  }
];

// Process content for headings and bullet points
export const formatContent = (content, sectionId) => {
  if (!content) return null;
  
  // Only apply bullet points to these sections
  const bulletPointSections = [1, 2, 4, 6, 8];
  const needsBullets = bulletPointSections.includes(sectionId);
  
  // Split by line breaks
  const lines = content.split(/[\n]+/).filter(line => line.trim());
  
  const elements = [];
  let currentList = [];
  let inList = false;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // If line ends with colon, it's a heading
    if (trimmedLine.endsWith(':')) {
      // If we were in a list, close it
      if (inList && currentList.length > 0) {
        elements.push(
          <ul key={`list-${index}`}>
            {currentList}
          </ul>
        );
        currentList = [];
      }
      
      // Add the heading
      elements.push(
        <p key={`heading-${index}`}>
          <strong>{trimmedLine}</strong>
        </p>
      );
      
      inList = true;
    } 
    // Otherwise it's a list item or paragraph
    else if (needsBullets || inList) {
      currentList.push(<li key={`item-${index}`}>{trimmedLine}</li>);
    } 
    else {
      elements.push(<p key={`para-${index}`}>{trimmedLine}</p>);
    }
  });
  
  // If we have an open list at the end, close it
  if (currentList.length > 0) {
    elements.push(
      <ul key="final-list">
        {currentList}
      </ul>
    );
  }
  
  return <>{elements}</>;
};

export default function Kvkk() {
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
        <Heading>Vizepedia – KVKK Aydınlatma Metni ve Gizlilik Politikası</Heading>
        <LastUpdate>Son Güncelleme: 10.05.2025</LastUpdate>
        <SubText>
          Vizepedia (&ldquo;Web Sitemiz&rdquo;) olarak 6698 sayılı Kişisel Verilerin
          Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca, kullanıcılarımızın kişisel
          verilerinin gizliliğini ve güvenliğini korumaya büyük önem veriyoruz.
          Bu metin, web sitemizi kullandığınızda hangi kişisel verilerinizi
          topladığımızı, bu verilerin nasıl işlendiğini ve haklarınızı
          açıklamaktadır.
        </SubText>
        
        <ContentContainer>
          {sectionsData.map((section, index) => (
            <FadeInSection
              key={section.id}
              ref={setSectionRef(index)}
              className={visibleSections.includes(index) ? 'visible' : ''}
            >
              <Section>
                <SectionHeader>{section.title}</SectionHeader>
                <SectionContent>
                  {formatContent(section.content, section.id)}
                </SectionContent>
              </Section>
            </FadeInSection>
          ))}
        </ContentContainer>
        
        <FadeInSection
          ref={setSectionRef(sectionsData.length)}
          className={visibleSections.includes(sectionsData.length) ? 'visible' : ''}
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
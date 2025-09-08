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

// Updated sections data with improved content
// Fixed sections data for KVKK page
const sectionsData = [
  {
    id: 1,
    title: "1. Hangi Verileri Topluyoruz?",
    content: `Ziyaretçi (Anonim Kullanıcı) Olarak:
    Ülke tercihi, vize türü, meslek bilgisi, ulaşım ve konaklama tercihleriniz (tarayıcınızın çerezlerinde saklanır)
    IP adresiniz ve genel konum bilginiz
    Tarayıcı türü, dili, işletim sistemi ve cihaz bilgileri
    Web sitesi üzerindeki gezinme davranışınız (hangi sayfaları ziyaret ettiğiniz, ne kadar süre kaldığınız)
    Çerez ve benzeri teknolojiler üzerinden toplanan analitik veriler
    
    Üye Kullanıcı Olarak:
    E-posta adresiniz (hesap oluşturma ve iletişim için)
    Şifreniz (güvenli şekilde şifrelenmiş olarak saklanır)
    Profil tercihleri ve kişiselleştirme ayarları
    Üyelik işlemleriyle bağlantılı IP ve oturum verileri
    Vize başvuru geçmişi ve belgelerinizin durumu`
  },
  {
    id: 2,
    title: "2. Verilerinizi Hangi Amaçlarla İşliyoruz?",
    content: `Hizmet sağlama amaçları:
    Size özelleştirilmiş vize rehberliği ve belge listeleri sunmak
    Kullanıcı hesabınızı yönetmek ve güvenliğini sağlamak
    Şifre sıfırlama ve hesap kurtarma işlemlerini gerçekleştirmek
    Müşteri destek hizmetleri sağlamak
    
    Site geliştirme ve analiz:
    Site kullanım deneyiminizi kişiselleştirmek ve sürekli iyileştirmek
    Teknik sorunları tespit etmek ve çözmek
    Web sitesi performansını analiz etmek ve optimize etmek
    
    Reklam ve pazarlama:
    Google AdSense ve diğer reklam ağları aracılığıyla size uygun reklamlar göstermek
    Reklam performansını ölçmek ve reklam deneyimini iyileştirmek
    Blog içerikleri ve güncellemeler ile sizi bilgilendirmek
    
    Yasal yükümlülükler:
    KVKK, GDPR ve diğer yasal gereklilikleri yerine getirmek`
  },
  {
    id: 3,
    title: "3. Çerez (Cookie) ve Reklam Teknolojileri",
    content: `Web sitemiz, kullanıcı deneyimini iyileştirmek ve hizmetlerimizi kişiselleştirmek amacıyla çeşitli türde çerezler kullanır:

    Zorunlu çerezler:
    Site işlevselliği için gerekli temel çerezler
    Kullanıcı oturum yönetimi ve güvenlik çerezleri
    
    İşlevsel çerezler:
    Tercihlerinizi hatırlayan çerezler (dil, ülke seçimi vb.)
    Site deneyimini kişiselleştiren çerezler
    
    Analitik çerezler:
    Google Analytics çerezleri (site kullanım analizi için)
    Performans ölçümü ve iyileştirme çerezleri
    
    Reklam çerezleri:
    Google AdSense ve diğer reklam ağlarının çerezleri
    Kişiselleştirilmiş reklam gösterimi için kullanılan çerezler
    Reklam performansını ölçen çerezler
    
    Çerez yönetimi: Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Ancak bazı çerezlerin devre dışı bırakılması, web sitemizin bazı özelliklerinin düzgün çalışmamasına neden olabilir.`
  },
  {
    id: 4,
    title: "4. Verilerin Üçüncü Taraflarla Paylaşımı",
    content: `Reklam ortakları:
    Google AdSense: Kişiselleştirilmiş reklamlar göstermek için IP adresiniz, çerez verileri ve ilgi alanlarınız Google ile paylaşılır
    Diğer reklam ağları: Benzer şekilde reklam gösterimi için gerekli veriler paylaşılabilir
    Bu veriler ilgili şirketlerin gizlilik politikaları çerçevesinde işlenir
    
    Analiz ve hizmet sağlayıcıları:
    Google Analytics: Web sitesi performansını analiz etmek için anonim kullanım verileri
    Supabase: Güvenli veri depolama ve hesap yönetimi hizmetleri
    CDN hizmetleri: Site hızını artırmak için teknik veriler
    
    Yasal gereklilikler:
    Mahkeme kararları ve yasal süreçler kapsamında
    Kamu güvenliği ve ulusal güvenlik gereklilikleri
    Kullanıcı güvenliğini korumak için gerekli durumlarda
    
    Önemli not: Hiçbir koşulda kişisel verilerinizi ticari amaçlarla üçüncü taraflara satmayız veya kiralamayız.`
  },
  {
    id: 5,
    title: "5. Veri Güvenliği ve Saklama",
    content: `Güvenlik önlemleri:
    Tüm veri transferleri HTTPS protokolü ile şifrelenir
    Supabase altyapısında endüstri standardı güvenlik önlemleri
    Düzenli güvenlik güncellemeleri ve yamalar
    Erişim kontrolü ve yetkilendirme sistemleri
    Veri yedekleme ve felaket kurtarma planları
    
    Saklama süreleri:
    Anonim kullanıcı verileri: Tarayıcı çerezlerinde geçici olarak
    Kayıtlı kullanıcı verileri: Hesap aktif olduğu sürece
    İletişim kayıtları: 3 yıl süreyle
    Yasal gereklilik durumunda: İlgili yasaların öngördüğü süre
    
    Veri silme: Hesabınızı sildiğinizde, kişisel verileriniz 30 gün içinde sistemlerimizden tamamen kaldırılır (yasal saklama gereklilikleri hariç).`
  },
  {
    id: 6,
    title: "6. KVKK Kapsamındaki Haklarınız",
    content: `KVKK'nın 11. maddesi gereğince sahip olduğunuz haklar:
    Kişisel verilerinizin işlenip işlenmediğini öğrenme hakkı
    İşlenmişse bu konuda bilgi talep etme hakkı
    Kişisel verilerinizin işlenme amaçlarını öğrenme hakkı
    Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme hakkı
    Eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme hakkı
    Belirli koşullar altında silinmesini veya yok edilmesini isteme hakkı
    Düzeltme, silme veya yok etme işlemlerinin paylaşıldığı üçüncü taraflara bildirilmesini isteme hakkı
    İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi halinde aleyhinize bir sonuç doğması durumunda buna itiraz etme hakkı
    Kişisel verilerinizin kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme hakkı
    
    Bu haklarınızı kullanmak için iletisim@vizepedia.com adresine "KVKK Başvurusu" konulu e-posta gönderebilirsiniz. Başvurularınız en geç 30 gün içinde yanıtlanır.`
  },
  {
    id: 7,
    title: "7. Şifre Güvenliği ve Hesap Koruması",
    content: `Şifre güvenliği:
    Şifreleriniz Supabase tarafından endüstri standardı algoritmalarla şifrelenir ve saklanır
    Hiçbir durumda şifrelerinizi düz metin olarak göremez veya saklayamayız
    Güçlü şifre kullanmanızı önemle tavsiye ederiz (en az 8 karakter, büyük-küçük harf, rakam ve özel karakter)
    
    Şifre sıfırlama süreci:
    E-posta adresiniz üzerinden güvenli bir bağlantı gönderilir
    Her bağlantı tek kullanımlık ve zaman sınırlıdır (24 saat)
    Bağlantı kullanıldıktan sonra otomatik olarak geçersiz hale gelir
    Şifre sıfırlama işlemi sadece sizin taleplerinizle başlatılır
    
    Hesap güvenliği ipuçları:
    Şifrenizi kimseyle paylaşmayın
    Düzenli olarak şifrenizi güncelleyin
    Şüpheli aktivite durumunda derhal iletişime geçin
    Güvenli ağlardan giriş yapın`
  },
  {
    id: 8,
    title: "8. Kişisel Verilerin Korunması ve Uluslararası Transferler",
    content: `Veri koruma önlemleri:
    HTTPS protokolü ile güvenli veri iletimi
    Supabase altyapısında gelişmiş şifreleme teknolojileri
    Düzenli güvenlik denetimleri ve güncellemeleri
    Erişim logları tutulması ve düzenli izleme
    
    Uluslararası veri transferleri:
    Bazı hizmet sağlayıcılarımız (Google, Supabase) verileri uluslararası sunucularda işleyebilir
    Bu transferler GDPR ve KVKK gerekliliklerine uygun şekilde gerçekleştirilir
    Yeterli veri koruma seviyesi sağlayan ülkeler tercih edilir
    Veri işleme anlaşmaları ile ek güvenceler alınır
    
    Tarayıcı çerezlerinde saklanan bilgiler:
    Anonim tercihleriniz (ülke, vize türü vb.) sadece sizin cihazınızda kalır
    Bu bilgiler Vizepedia sunucularına aktarılmaz
    İstediğiniz zaman tarayıcı ayarlarından silebilirsiniz`
  },
  {
    id: 9,
    title: "9. Veri İşleme Yasal Dayanakları ve Politika Değişiklikleri",
    content: `Veri işleme yasal dayanakları:
    Açık rızanız (hizmet kullanımı için)
    Sözleşmenin ifası (üyelik hizmetleri için)
    Meşru menfaat (site güvenliği ve iyileştirme için)
    Yasal yükümlülük (KVKK, vergi mevzuatı vb.)
    
    Politika değişiklikleri:
    Bu metin, yasal mevzuat değişiklikleri veya hizmetlerimizde yapılacak güncellemeler doğrultusunda revize edilebilir
    Önemli değişiklikler kayıtlı kullanıcılara e-posta ile bildirilir
    Değişiklikler bu sayfa üzerinden duyurulur ve yürürlük tarihi belirtilir
    Güncel tarih her zaman sayfa üst kısmında gösterilir
    
    İletişim kanalları:
    E-posta: iletisim@vizepedia.com
    Konu başlığı: "KVKK" veya "Veri Koruma"
    Yanıt süresi: En geç 30 gün
    Şikayet hakkı: Veri Koruma Kurulu'na başvurabilirsiniz`
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
        <LastUpdate>Son Güncelleme: 8 Eylül 2025</LastUpdate>
        <SubText>
          Vizepedia olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) 
          uyarınca, kullanıcılarımızın kişisel verilerinin gizliliğini ve güvenliğini 
          korumaya büyük önem veriyoruz. Bu aydınlatma metni, veri işleme 
          faaliyetlerimizi şeffaf bir şekilde açıklamaktadır.
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
            <ForContact>KVKK Başvuruları İçin İletişim:</ForContact>
            <ForContactInfo>
              <a href="mailto:iletisim@vizepedia.com?subject=KVKK%20Başvurusu">iletisim@vizepedia.com</a>
            </ForContactInfo>
            <ForContactInfo>
              Veri Sorumlusu: Vizepedia
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
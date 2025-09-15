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
  formatContent,
} from "./Kvkk"; // Import styled components from KVKK page
import SEO from "../components/SEO";

// Sections data for Disclaimer
const sectionsData = [
  {
    id: 1,
    title: "1. Genel Bilgilendirme",
    content: `Vizepedia, vize başvuru süreçleri hakkında rehberlik ve bilgilendirme hizmeti sunan bir platformdur. Bu platform:
    Resmi bir devlet kurumu veya konsolosluk değildir
    Hiçbir ülkenin resmi vize başvuru merkezi değildir
    Vize onayı veya reddi konusunda karar verme yetkisine sahip değildir
    Sadece bilgilendirme ve rehberlik amacıyla hizmet vermektedir`,
  },
  {
    id: 2,
    title: "2. Hizmet Kapsamı ve Sınırları",
    content: `Vizepedia olarak sunduğumuz hizmetler:
    Vize başvuru süreçleri hakkında genel bilgilendirme
    Gerekli belgelerin listelenmesi ve hazırlanması konusunda rehberlik
    Farklı ülkelerin vize gereksinimleri hakkında güncel bilgiler
    Başvuru süreçlerinin organize edilmesine yardımcı araçlar
    
    Ancak bu hizmetler:
    Vize onayı garantisi vermez
    Resmi başvuru işlemlerini yerine getirmez
    Yasal danışmanlık hizmeti değildir
    Konsolosluk kararlarını etkilemez`,
  },
  {
    id: 3,
    title: "3. Bilgi Doğruluğu ve Güncellik",
    content: `Web sitemizde yer alan bilgiler:
    Genel rehberlik amacıyla hazırlanmıştır
    Resmi kaynaklardan derlenen bilgilere dayanır
    Düzenli olarak güncellemeye çalışılır
    Ancak değişiklikler anında yansıtılamayabilir
    
    Kullanıcıların sorumluluğu:
    Tüm bilgileri resmi kaynaklardan doğrulamak
    Güncel gereksinimleri konsolosluklardan teyit etmek
    Başvuru öncesi resmi web sitelerini kontrol etmek
    Uzman danışmanlık gerektiğinde profesyonel yardım almak`,
  },
  {
    id: 4,
    title: "4. Sorumluluk Reddi",
    content: `Vizepedia, aşağıdaki konularda sorumluluk kabul etmez:
    Vize başvurularının red edilmesi
    Yanlış veya eksik bilgi nedeniyle yaşanan mağduriyetler
    Başvuru sürecinde karşılaşılan gecikmeler
    Konsolosluk ücretleri veya diğer masraflar
    Seyahat planlarında meydana gelen değişiklikler
    
    Özel durumlar:
    Hamilelik, sağlık durumu, geçmiş vize redleri gibi özel durumlar mutlaka resmi makamlara bildirilmelidir
    Bu durumlar için ek belgeler gerekebilir
    Platformumuz bu özel durumlar için kesin çözüm sunamaz`,
  },
  {
    id: 5,
    title: "5. Üçüncü Taraf Bağlantıları",
    content: `Web sitemizde yer alan dış bağlantılar:
    Kullanıcıların kolaylığı için sağlanmıştır
    Üçüncü taraf web sitelerinin içeriğinden sorumlu değiliz
    Bu sitelerin gizlilik politikaları bizim kontrolümüzde değildir
    Bağlantıları kullanmadan önce ilgili sitelerin şartlarını okuyunuz
    
    Reklam içerikleri:
    Google AdSense ve diğer reklam ağları üzerinden gösterilen reklamlar
    Reklam verenlerin ürün/hizmetlerinden sorumlu değiliz
    Reklam tıklamaları kendi sorumluluğunuzda gerçekleştirilir`,
  },
  {
    id: 6,
    title: "6. Fikri Mülkiyet Hakları",
    content: `Web sitemizdeki tüm içerikler:
    Vizepedia'ya aittir veya lisans altında kullanılmaktadır
    Telif hakları saklıdır
    İzinsiz kopyalama, dağıtma veya ticari kullanım yasaktır
    Kaynak gösterilerek alıntı yapılabilir
    
    Kullanıcı tarafından paylaşılan içerikler:
    Kullanıcının sorumluluğundadır
    Üçüncü taraf haklarını ihlal etmemelidir
    Platformumuz bu içerikleri moderasyon hakkını saklı tutar`,
  },
  {
    id: 7,
    title: "7. Hizmet Kesintileri",
    content: `Web sitemiz aşağıdaki durumlarda geçici olarak erişilemeyebilir:
    Teknik bakım çalışmaları
    Sunucu güncellemeleri
    Beklenmeyen teknik arızalar
    Güvenlik önlemleri
    
    Bu durumlar için kullanıcılara:
    Önceden bildirim yapılmaya çalışılır
    Mümkün olan en kısa sürede hizmet restore edilir
    Ancak kesinti süresi garantisi verilmez
    Oluşabilecek mağduriyetlerden sorumluluk kabul edilmez`,
  },
  {
    id: 8,
    title: "8. Yasal Uyuşmazlıklar",
    content: `Bu disclaimer ve hizmet kullanımından doğan uyuşmazlıklarda:
    Türkiye Cumhuriyeti yasaları geçerlidir
    İstanbul mahkemeleri yetkilidir
    Öncelikle dostane çözüm aranacaktır
    KVKK kapsamındaki haklar saklıdır
    
    Kullanıcı hakları:
    KVKK kapsamında veri işleme itirazı
    Hatalı bilgilerin düzeltilmesi talebi
    Kişisel verilerin silinmesi talebi
    Şikayet ve önerilerin iletilmesi`,
  },
];

export default function Disclaimer() {
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
        title="Yasal Uyarı – Vizepedia"
        description="Vizepedia platformunun kullanım şartları ve sorumluluk reddi beyanını okuyun. Hizmet kapsamı, bilgi doğruluğu ve kullanıcı yükümlülükleri hakkında detaylı bilgi edinin."
        keywords="sorumluluk reddi, yasal uyarı, Vizepedia, hukuki sorumluluk"
        url="https://www.vizepedia.com/yasal-uyari"
      />
      <FullPage>
        <ScrollIndicator ref={scrollIndicatorRef} />
        <MainPageHeader />
        <Main>
          <Heading>Vizepedia – Sorumluluk Reddi Beyanı</Heading>
          <LastUpdate>Son Güncelleme: 8 Eylül 2025</LastUpdate>
          <SubText>
            Bu sorumluluk reddi beyanı, Vizepedia platformunu kullanan tüm
            ziyaretçiler ve üyeler için geçerlidir. Platformumuzu kullanmadan
            önce bu metni dikkatlice okuyunuz. Platform kullanımı, bu şartları
            kabul ettiğiniz anlamına gelir.
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
                    {formatContent(section.content, section.id)}
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

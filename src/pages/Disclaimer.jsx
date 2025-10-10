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
} from "./Kvkk";
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
    Sadece bilgilendirme ve rehberlik amacıyla hizmet vermektedir
    
    ⚖️ Danışmanlık değildir:
    Vizepedia’daki hiçbir bilgi, hukuki, göçmenlik, mali veya tıbbi danışmanlık niteliği taşımaz
    İçerikler genel bilgilendirme amaçlıdır
    Karar almadan önce resmî kurumlarla iletişime geçmeniz tavsiye edilir`,
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
    Konsolosluk kararlarını etkilemez
    
    🧠 Otomatik sistemler:
    Bazı öneriler algoritmik veya otomatik sistemlerle oluşturulabilir
    Bu bilgiler %100 doğruluk garantisi taşımaz`,
  },
  {
    id: 3,
    title: "3. Bilgi Doğruluğu ve Güncellik",
    content: `Web sitemizde yer alan bilgiler:
    Genel rehberlik amacıyla hazırlanmıştır
    Resmi kaynaklardan derlenen bilgilere dayanır
    Düzenli olarak güncellenmeye çalışılır
    Ancak değişiklikler anında yansıtılamayabilir
    
    Kullanıcıların sorumluluğu:
    Tüm bilgileri resmî kaynaklardan doğrulamak
    Güncel gereksinimleri konsolosluklardan teyit etmek
    Başvuru öncesi resmî web sitelerini kontrol etmek
    Uzman danışmanlık gerektiğinde profesyonel yardım almak
    
    🔍 Resmî kaynak önceliği:
    Vize koşulları sık değişir; bağlayıcı ve güncel bilgiler yalnızca resmî konsolosluk veya büyükelçilik sitelerinde yer alır`,
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
    Hamilelik, sağlık durumu, adli kayıt veya geçmiş vize redleri gibi özel durumlar mutlaka resmî makamlara bildirilmelidir
    Bu durumlar için ek belgeler gerekebilir
    Platformumuz bu özel durumlar için kesin çözüm sunamaz
    
    ⚖️ Sorumluluk sınırı:
    Yasal olarak izin verilen azami ölçüde sorumluluğumuz sınırlıdır
    Dolaylı, sonuçsal veya kar kaybına yol açan zararlardan sorumlu değiliz
    Ayrıntılar için Kullanım Şartları sayfasına bakınız`,
  },
  {
    id: 5,
    title: "5. Üçüncü Taraf Bağlantıları ve Reklamlar",
    content: `Web sitemizde yer alan dış bağlantılar:
    Kullanıcıların kolaylığı için sağlanmıştır
    Üçüncü taraf web sitelerinin içeriğinden sorumlu değiliz
    Bu sitelerin gizlilik politikaları kontrolümüzde değildir
    Bağlantı verilmesi, ilgili siteye onay veya teminat anlamına gelmez
    
    Reklam içerikleri:
    Google AdSense ve diğer reklam ağları üzerinden gösterilen reklamlar
    Reklam verenlerin ürün veya hizmetlerinden sorumlu değiliz
    Reklam tıklamaları kendi sorumluluğunuzdadır
    Tıklamaya teşvikte bulunmayız
    
    💰 Affiliate / sponsorluk açıklaması:
    Bazı bağlantılardan gelir elde edebiliriz; bu durum içerik tarafsızlığımızı etkilemez
    Ayrıntılar Gizlilik Politikası ve Çerez Politikası'nda açıklanmıştır`,
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
    title: "7. Hizmet Kesintileri ve Mücbir Sebepler",
    content: `Web sitemiz aşağıdaki durumlarda geçici olarak erişilemeyebilir:
    Teknik bakım çalışmaları
    Sunucu güncellemeleri
    Beklenmeyen teknik arızalar
    Güvenlik önlemleri
    
    Mücbir sebepler:
    Doğal afet, altyapı kesintisi, siber saldırı, savaş, kamu otoritesi kararı gibi kontrolümüz dışı olaylarda hizmet verilememesinden sorumluluk kabul edilmez
    
    Bu durumlar için:
    Önceden bildirim yapılmaya çalışılır
    Hizmet en kısa sürede restore edilir
    Ancak kesinti süresi garantisi verilmez`,
  },
  {
    id: 8,
    title: "8. Yasal Uyuşmazlıklar ve Uygulanacak Hukuk",
    content: `Bu disclaimer ve hizmet kullanımından doğan uyuşmazlıklarda:
    Türkiye Cumhuriyeti yasaları geçerlidir
    İstanbul mahkemeleri yetkilidir
    Öncelikle dostane çözüm aranacaktır
    
    Bu beyan:
    Kullanım Şartları, Gizlilik Politikası ve Çerez Politikası ile birlikte değerlendirilir
    Çelişki halinde Kullanım Şartları metni esas alınır
    
    KVKK kapsamındaki kullanıcı hakları:
    Veri işleme itirazı
    Hatalı bilgilerin düzeltilmesi talebi
    Kişisel verilerin silinmesi talebi
    Şikayet ve önerilerin iletilmesi`,
  },
];

export default function Disclaimer() {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef([]);
  const scrollIndicatorRef = useRef(null);

  // Scroll progress indicator
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

  // Intersection Observer
  useEffect(() => {
    const options = { root: null, rootMargin: "0px", threshold: 0.15 };
    const observers = [];

    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => {
              if (!prev.includes(index)) return [...prev, index];
              return prev;
            });
            observer.unobserve(entry.target);
          }
        });
      }, options);
      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const setSectionRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  return (
    <>
      <SEO
        title="Yasal Uyarı – Vizepedia"
        description="Vizepedia'nın yasal uyarı ve sorumluluk reddi beyanını okuyun. Hizmet kapsamı, veri doğruluğu, üçüncü taraf bağlantıları ve kullanıcı sorumlulukları hakkında detaylı bilgi."
        keywords="sorumluluk reddi, yasal uyarı, Vizepedia, hukuki sorumluluk"
        url="/yasal-uyari"
        noindex={false}
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
            önce bu metni dikkatlice okuyunuz. Platformun kullanımı, bu şartları
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
              <ForContactInfo>
                <a href="/kullanim-sartlari">Kullanım Şartları</a> •{" "}
                <a href="/gizlilik-politikasi">Gizlilik Politikası</a> •{" "}
                <a href="/cerez-politikasi">Çerez Politikası</a>
              </ForContactInfo>
            </ForContactContainer>
          </FadeInSection>
        </Main>
        <Footer />
      </FullPage>
    </>
  );
}

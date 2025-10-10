import { useState, useEffect, useRef } from "react";
import MainPageHeader from "../ui/MainPageHeader";
import styled from "styled-components";
import Footer from "../ui/Footer";
import SEO from "../components/SEO";

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
  background: linear-gradient(90deg, #6366f1, #10b981, #ec4899);
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
  background: linear-gradient(90deg, #3b82f6, #10b981);
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
  color: #6b7280;
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
  border-bottom: 1px solid #f3f4f6;

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
  color: #1f2937;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const SectionContent = styled.div`
  font-size: 16px;
  line-height: 1.7;
  color: #4b5563;

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
    color: #1f2937;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

export const ForContactContainer = styled.div`
  margin-top: 40px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  text-align: center;
`;

export const ForContact = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
`;

export const ForContactInfo = styled.p`
  font-size: 16px;
  color: #4b5563;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  a {
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #2563eb;
      text-decoration: underline;
    }
  }
`;

// Updated sections data with improved content
// Fixed sections data for KVKK page
const sectionsData = [
  {
    id: 1,
    title: "1) Veri Sorumlusu, Kapsam ve Tanımlar",
    content: `Bu "KVKK Aydınlatma Metni", 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca Vizepedia tarafından
    gerçekleştirilen kişisel veri işleme faaliyetlerine ilişkindir. Vizepedia, veri sorumlusu sıfatıyla; kişisel verilerinizi KVKK, ikincil mevzuat
    ve Kurul kararlarına uygun biçimde işler. Bu metin; yalnızca çerezleri değil, localStorage, sessionStorage ve benzeri tarayıcı depolama
    teknolojilerini de kapsar.

    Tanımlar (özet):
    Veri Sorumlusu: Vizepedia
    İlgili Kişi: Vizepedia kullanıcıları/ziyaretçileri
    Kişisel Veri: Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgi
    Veri İşleyen: Vizepedia adına veri işleyen hizmet sağlayıcılar (ör. Supabase)`,
  },
  {
    id: 2,
    title: "2) Hangi Verileri Topluyoruz?",
    content: `Ziyaretçi (Anonim Kullanıcı) Olarak:
     Ülke tercihi, vize türü, meslek/ulaşım/konaklama tercihleri (tarayıcı depolamasında)
     IP adresi ve yaklaşık konum bilgisi
     Tarayıcı/dil/işletim sistemi/cihaz bilgileri
     Ziyaret edilen sayfalar, etkileşim ve süre bilgileri
     Çerez ve benzeri teknolojilerden elde edilen analitik-veri

    Üye Kullanıcı Olarak:
     E-posta adresi (hesap oluşturma/iletişim)
     Şifre (güvenli olarak saklanır, düz metin tutulmaz)
     Profil/tercih bilgileri ve kişiselleştirme ayarları
     Üyelik işlemleriyle bağlantılı IP ve oturum verileri
     Vize başvuru geçmişi ve belge durumları

    Tarayıcı Depolaması (çerez dışı):
     localStorage: tema tercihi (ör. isDarkMode), bildirim/popup durumları (ör. hasSeenWelcomeModal) gibi tercih verileri
     sessionStorage: anonim akış verileri (isAnonymous, anonymousCreatedAt), geçici başvuru/yanıt verileri (userAnswers, userSelections), ilerleme bilgileri (wellcomesAnswered)
    Not: sessionStorage verileri sekme/oturum kapandığında kendiliğinden temizlenir; localStorage verileri kullanıcı tarafından silinebilir.`,
  },
  {
    id: 3,
    title: "3) Verilerinizi Hangi Amaçlarla İşliyoruz?",
    content: `Hizmet Sağlama:
     Özelleştirilmiş vize rehberliği ve belge listeleri sunmak
     Kullanıcı hesabını yönetmek, kimlik doğrulamak ve güvenliği sağlamak
     Şifre sıfırlama ve hesap kurtarma işlemlerini yürütmek
     Müşteri destek süreçlerini yürütmek

    Site Geliştirme ve Analiz:
     Deneyimi kişiselleştirmek ve sürekli iyileştirmek
     Teknik sorunları tespit/çözmek, performansı optimize etmek
     Kullanım istatistikleri üretmek (toplulaştırılmış/anonimleştirilmiş)

    Reklam ve Pazarlama:
     Google AdSense ve benzeri ağlar üzerinden reklam göstermek (kişiselleştirme rızaya tabidir)
     Reklam ve kampanya performansını ölçmek

    Tarayıcı Depolaması:
     localStorage/sessionStorage verileri; akışı sürdürmek, tekrar eden bildirimleri önlemek ve sayfalar arası tutarlılığı sağlamak için kullanılır; üçüncü taraflarla paylaşılmaz.`,
  },
  {
    id: 4,
    title: "4) Çerezler, Consent Mode ve Tercih Yönetimi",
    content: `Çerez Türleri:
     Zorunlu: Temel işlevsellik ve güvenlik
     İşlevsel: Dil/ülke/tema gibi tercihlerin hatırlanması
     Analitik: Google Analytics performans/ölçüm çerezleri
     Reklam: Google AdSense ve benzeri ağların çerezleri

    Rıza ve Consent Mode v2:
     EEA/UK kullanıcıları için Google Consent Mode v2 uygulanır; ad_storage, analytics_storage, ad_user_data, ad_personalization sinyalleri rıza durumuna göre güncellenir.
     Türkiye mevzuatı kapsamında zorunlu olmayan çerezler açık rızaya tabidir.
     Çerez ve rıza tercihleri sitemizdeki tercih aracı (CMP) üzerinden yönetilebilir.

    Yönetim:
     Tarayıcı ayarlarından çerezleri silebilir/engelleyebilirsiniz.
     Site verilerini temizleyerek localStorage/sessionStorage kayıtlarını da silebilirsiniz.
     Reklam tercihleri: https://adssettings.google.com`,
  },
  {
    id: 5,
    title: "5) Verilerin Üçüncü Taraflarla Paylaşımı (Alıcı Grupları)",
    content: `Reklam Ortakları:
     Google AdSense: Reklam gösterimi ve, rıza varsa, kişiselleştirme
     Benzer ağlar: Reklam sunumu/ölçümü (varsa)

    Analiz ve Hizmet Sağlayıcıları:
     Google Analytics: Site kullanım analizi (toplulaştırılmış/anonimleştirilmiş)
     Supabase (Veri İşleyen): Hesap ve içerik verilerinin güvenli barındırılması
     CDN/Altyapı sağlayıcıları: İçerik dağıtımı/performans

    Yasal Paylaşımlar:
     Mahkeme kararları ve yasal süreçler kapsamında
     Kamu güvenliği/ulusal güvenlik gerekleri
     Kullanıcı güvenliğini korumaya yönelik durumlar

    İlke:
     Kişisel verilerinizi hiçbir koşulda ticari amaçla üçüncü kişilere satmayız veya kiralamayız.`,
  },
  {
    id: 6,
    title: "6) Uluslararası Veri Aktarımları",
    content: ` Bazı hizmet sağlayıcılar (Google, Supabase, CDN) verileri ülke dışında işleyebilir.
     Aktarımlar; KVKK, GDPR ve ilgili düzenlemelere uygun şekilde; yeterli korumanın bulunduğu ülkelere, Kurul’ca ilan edilen güvencelere veya açık rızanıza dayanılarak gerçekleştirilir.
     Standart sözleşme hükümleri, şifreleme ve erişim kontrolleri gibi ek teknik/idari önlemler uygulanır.`,
  },
  {
    id: 7,
    title: "7) Hukuki Sebepler (KVKK m.5–6)",
    content: ` Sözleşmenin kurulması/ifası (üyelik, hizmet sunumu)
     Açık rıza (zorunlu olmayan çerezler, pazarlama iletişimi vb.)
     Veri sorumlusunun meşru menfaati (güvenlik/iyileştirme, kötüye kullanımın önlenmesi)
     Hukuki yükümlülüklerin yerine getirilmesi
     Hakkın tesisi, kullanılması veya korunması`,
  },
  {
    id: 8,
    title: "8) Saklama Süreleri, İmha ve Güvenlik",
    content: `Güvenlik Önlemleri:
     HTTPS/TLS, erişim kontrolü, yetkilendirme
     Supabase üzerinde endüstri standardı güvenlik
     Loglama, düzenli güncelleme ve denetimler
     İhlal müdahale planları

    Saklama Süreleri (özet):
     Anonim tarayıcı verileri (sessionStorage): sekme/oturum kapanınca silinir
     localStorage tercih verileri: kullanıcı silene kadar (maks. makul periyodik temizlik uygulanır)
     Kayıtlı kullanıcı verileri: hesap aktif olduğu sürece
     İletişim kayıtları: 3 yıl
     Yasal saklama: ilgili mevzuatın öngördüğü süre

    İmha:
     Hesabınızı sildiğinizde, kişisel verileriniz yasal zorunluluklar hariç en geç 30 gün içinde sistemlerimizden silinir veya anonim hale getirilir.`,
  },
  {
    id: 9,
    title: "9) KVKK Kapsamındaki Haklarınız (m.11) ve Başvuru Usulü",
    content: `Haklar:
     Kişisel verilerin işlenip işlenmediğini öğrenme
     İşlenmişse buna ilişkin bilgi talep etme
     Amacına uygun kullanılıp kullanılmadığını öğrenme
     Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme
     Eksik/yanlış işlenmişse düzeltilmesini isteme
     Kanuni şartlarda silinmesini/yok edilmesini isteme
     Yapılan işlemlerin aktarıldığı kişilere bildirilmesini isteme
     Münhasıran otomatik sistemlerle analiz sonucu aleyhinize bir durum doğmasına itiraz
     Kanuna aykırı işleme nedeniyle zararın giderilmesini talep

    Başvuru:
     E-posta: iletisim@vizepedia.com (Konu: "KVKK Başvurusu")
     Kimlik doğrulaması gerekebilir; talepleriniz en geç 30 gün içinde yanıtlanır.
     Şikayet hakkı: Kişisel Verileri Koruma Kurumu’na başvurabilirsiniz.`,
  },
  {
    id: 10,
    title: "10) Politika Değişiklikleri ve İletişim",
    content: `Değişiklik:
     Mevzuat veya hizmetlerimizdeki değişikliklere göre bu metin güncellenebilir.
     Önemli değişiklikler kayıtlı kullanıcılara e-posta ile bildirilir ve bu sayfada yürürlük tarihiyle yayımlanır.

    İletişim:
     E-posta: iletisim@vizepedia.com
     Konu: "KVKK" veya "Veri Koruma"
     Yanıt süresi: En geç 30 gün`,
  },
];

// Process content for headings and bullet points
export const formatContent = (content, sectionId) => {
  if (!content) return null;

  // Only apply bullet points to these sections
  const bulletPointSections = [1, 2, 4, 6, 8];
  const needsBullets = bulletPointSections.includes(sectionId);

  // Split by line breaks
  const lines = content.split(/[\n]+/).filter((line) => line.trim());

  const elements = [];
  let currentList = [];
  let inList = false;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // If line ends with colon, it's a heading
    if (trimmedLine.endsWith(":")) {
      // If we were in a list, close it
      if (inList && currentList.length > 0) {
        elements.push(<ul key={`list-${index}`}>{currentList}</ul>);
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
    } else {
      elements.push(<p key={`para-${index}`}>{trimmedLine}</p>);
    }
  });

  // If we have an open list at the end, close it
  if (currentList.length > 0) {
    elements.push(<ul key="final-list">{currentList}</ul>);
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
        title="KVKK Aydınlatma Metni – Vizepedia"
        description="Vizepedia’nın KVKK aydınlatma metni ve gizlilik politikası. Kişisel verilerin korunması ve işlenmesi hakkında ayrıntılı bilgi."
        keywords="KVKK, kişisel verilerin korunması, aydınlatma metni, gizlilik, Vizepedia"
        url="/kisisel-verilerin-korunmasi"
        noindex={false}
      />
      <FullPage>
        <ScrollIndicator ref={scrollIndicatorRef} />
        <MainPageHeader />
        <Main>
          <Heading>
            Vizepedia – KVKK Aydınlatma Metni ve Gizlilik Politikası
          </Heading>
          <LastUpdate>Son Güncelleme: 8 Eylül 2025</LastUpdate>
          <SubText>
            Vizepedia olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu
            (KVKK) uyarınca, kullanıcılarımızın kişisel verilerinin gizliliğini
            ve güvenliğini korumaya büyük önem veriyoruz. Bu aydınlatma metni,
            veri işleme faaliyetlerimizi şeffaf bir şekilde açıklamaktadır.
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
              <ForContact>KVKK Başvuruları İçin İletişim:</ForContact>
              <ForContactInfo>
                <a href="mailto:iletisim@vizepedia.com?subject=KVKK%20Başvurusu">
                  iletisim@vizepedia.com
                </a>
              </ForContactInfo>
              <ForContactInfo>Veri Sorumlusu: Vizepedia</ForContactInfo>
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

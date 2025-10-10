// pages/CerezPolitikasi.jsx
import { useState, useEffect, useRef } from "react";
import MainPageHeader from "../ui/MainPageHeader";
import Footer from "../ui/Footer";
import SEO from "../components/SEO";

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
    content: `Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. 
    Çerezler sayesinde sizi tanıyabilir, tercihlerinizi hatırlayabilir ve daha iyi bir kullanıcı deneyimi sunabiliriz. 
    Çerezler yürütülebilir kod içermez ve cihazınıza zarar vermez.`,
  },
  {
    id: 2,
    title: "2. Hangi Çerezleri Kullanıyoruz?",
    content: `Zorunlu (Temel) Çerezler:
    Web sitesinin temel işlevleri için gereklidir (oturum yönetimi, güvenlik, sayfalar arası geçiş).

    İşlevsel Çerezler:
    Tercihlerinizi (örn. dil, ülke, tema) hatırlayarak deneyimi kişiselleştirir.

    Performans ve Analiz Çerezleri:
    Google Analytics gibi hizmetler üzerinden site trafiğini ve etkileşimi ölçümlemek için kullanılır.

    Reklam ve Hedefleme Çerezleri:
    Google AdSense tarafından yerleştirilebilen çerezler, (rıza verilmişse) kişiselleştirilmiş reklam göstermek ve reklam performansını ölçmek için kullanılır.

    Not:
    Zorunlu olmayan çerezler yalnızca açık rızanızla etkinleştirilir.`,
  },
  {
    id: 3,
    title: "3. Çerezler ve Tarayıcı Depolaması Yoluyla İşlenen Veriler",
    content: `Çerezler veya benzer teknolojiler aracılığıyla işlenebilen veriler:
    IP adresi, yaklaşık konum, tarayıcı türü ve dili, işletim sistemi, ziyaret zamanı/süresi, ziyaret edilen sayfalar ve tıklamalar.

    Tarayıcı depolaması (çerez değildir):
    localStorage (örn. tema tercihi isDarkMode, belirli bildirim/popup durumu)
    sessionStorage (örn. anonim akış bilgileri isAnonymous, anonymousCreatedAt; geçici başvuru/yanıt verileri userAnswers, userSelections; ilerleme bilgileri wellcomesAnswered)
    Bu veriler, deneyimi sürdürmek ve tekrar eden bildirimleri önlemek için kullanılır; üçüncü taraflarla paylaşılmaz. 
    sessionStorage verileri sekme/oturum kapanınca silinir; localStorage verileri tarayıcı ayarlarından temizlenebilir.`,
  },
  {
    id: 4,
    title: "4. Rıza Yönetimi (CMP) ve Google Consent Mode v2",
    content: `Rıza:
    Zorunlu olmayan çerezler (analiz ve reklam) yalnızca açık rızanızla etkinleştirilir. Rızanızı dilediğiniz an geri çekebilir veya güncelleyebilirsiniz.

    Consent Mode v2:
    Avrupa Ekonomik Alanı ve Birleşik Krallık kullanıcıları için Google Consent Mode v2 uygulanır.
    ad_storage, analytics_storage, ad_user_data ve ad_personalization sinyalleri rıza durumunuza göre güncellenir.

    Çerez Tercihleri Paneli:
    Sitemizdeki "Çerez Tercihleri" bağlantısı üzerinden kategori bazında onay/ret tercihlerinizi yönetebilirsiniz.`,
  },
  {
    id: 5,
    title: "5. Çerezlerin Yönetimi ve Devre Dışı Bırakılması",
    content: `Tarayıcı ayarlarından çerezleri silebilir veya engelleyebilirsiniz. 
    Bazı çerezlerin devre dışı bırakılması, sitenin belirli bölümlerinin düzgün çalışmamasına yol açabilir. 
    Ayrıca sitemizdeki Çerez Tercihleri paneli üzerinden onaylarınızı istediğiniz zaman güncelleyebilirsiniz.

    Tarayıcı ayarlarına ilişkin bağlantılar:
    - Google Chrome: https://support.google.com/accounts/answer/61416
    - Mozilla Firefox: https://support.mozilla.org/tr/kb/cerezleri-silme
    - Safari: https://support.apple.com/tr-tr/guide/safari/sfri11471/mac
    - Microsoft Edge: https://support.microsoft.com/tr-tr/help/4027947`,
  },
  {
    id: 6,
    title: "6. Üçüncü Taraf Çerezler (Google vb.)",
    content: `Sitemizde Google AdSense ve Google Analytics gibi üçüncü taraf hizmet sağlayıcılarının çerezleri kullanılabilir.
    Bu çerezler, reklamların sunulması/ölçümlenmesi ve site performansının analiz edilmesi amacıyla (rıza verilmişse) kullanılabilir.

    Daha fazla bilgi:
    - Google Çerezler: https://policies.google.com/technologies/cookies
    - Google Gizlilik Politikası: https://policies.google.com/privacy
    - My Ad Center (reklam tercihleri): https://myadcenter.google.com/
    - Ads Settings: https://adssettings.google.com

    Not:
    Üçüncü taraf çerezlerinin kullanımında ilgili sağlayıcıların politika ve saklama süreleri geçerlidir.`,
  },
  {
    id: 7,
    title: "7. Saklama Süreleri ve Örnek Çerezler",
    content: `Saklama:
    Oturum çerezleri tarayıcı kapatıldığında silinir.
    Kalıcı çerezler, amacı doğrultusunda genellikle 13 aya kadar saklanır (bölge ve sağlayıcıya göre değişebilir).

    Örnekler (bilgilendirme amaçlıdır):
    Google Analytics (_ga): 2 yıla kadar (site trafiği analizi)
    Google AdSense/DoubleClick (IDE): genellikle 13 aya kadar (reklam ölçümü/kişiselleştirme)
    Not: Bu liste örnektir; kullanılan çerezler zaman içinde güncellenebilir. Güncel liste için Çerez Tercihleri panelini kontrol edebilirsiniz.`,
  },
  {
    id: 8,
    title: "8. KVKK Kapsamındaki Haklarınız",
    content: `KVKK’nın 11. maddesi uyarınca kişisel verilerinize ilişkin olarak erişim, düzeltme, silme, işlemeyi kısıtlama ve itiraz haklarına sahipsiniz.
    Bu haklarınızı kullanmak veya çerez tercihlerinizi sormak için: iletisim@vizepedia.com adresi üzerinden bize ulaşabilirsiniz.
    Çerezler ve kişisel verilerin işlenmesine ilişkin ayrıntılar için Gizlilik Politikamıza bakınız.`,
  },
  {
    id: 9,
    title: "9. Politika Değişiklikleri",
    content: `Bu Çerez Politikası zaman zaman güncellenebilir. Değişiklikler bu sayfada yayımlanır ve yürürlük tarihi belirtilir. 
    Önemli değişiklikler, mümkün olduğunca e-posta veya site içi bildirim/banner ile duyurulur.`,
  },
];

// Local formatter (links, bullet lists, subheaders)
export const formatContent = (content) => {
  if (!content) return null;

  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  const elements = [];

  const urlPattern = /(https?:\/\/[^\s]+)/g;

  paragraphs.forEach((paragraph, pIndex) => {
    const lines = paragraph.split(/\n+/).filter((line) => line.trim());

    if (lines.some((line) => line.trim().startsWith("- "))) {
      const listItems = lines.map((line, lIndex) => {
        const cleanLine = line.trim().startsWith("- ")
          ? line.trim().substring(2)
          : line.trim();

        const parts = cleanLine.split(urlPattern);
        const content = parts.map((part, partIndex) => {
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
    } else if (lines.length > 1 && lines.some((line) => line.trim().endsWith(":"))) {
      let currentList = [];
      let inList = false;

      lines.forEach((line, lIndex) => {
        const trimmedLine = line.trim();

        if (trimmedLine.endsWith(":")) {
          if (inList && currentList.length > 0) {
            elements.push(
              <ul key={`sublist-${pIndex}-${lIndex}`}>{currentList}</ul>
            );
            currentList = [];
          }

          elements.push(
            <p key={`header-${pIndex}-${lIndex}`}>
              <strong>{trimmedLine.replace(/:$/, "")}</strong>
            </p>
          );

          inList = true;
        } else if (inList) {
          const parts = trimmedLine.split(urlPattern);
          const content = parts.map((part, partIndex) => {
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
        } else {
          const parts = trimmedLine.split(urlPattern);
          const content = parts.map((part, partIndex) => {
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

      if (currentList.length > 0) {
        elements.push(<ul key={`final-sublist-${pIndex}`}>{currentList}</ul>);
      }
    } else {
      const parts = paragraph.trim().split(urlPattern);
      const content = parts.map((part, partIndex) => {
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

export default function CerezPolitikasi() {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef([]);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      if (scrollIndicatorRef.current) {
        const clamped = Math.min(Math.max(progress, 0), 1);
        scrollIndicatorRef.current.style.transform = `scaleX(${clamped})`;
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
        title="Çerez Politikası – Vizepedia"
        description="Vizepedia’nın çerez kullanım politikası: çerez türleri, rıza yönetimi (CMP), Google Consent Mode v2, saklama süreleri ve haklarınız."
        keywords="çerez politikası, cookie policy, Vizepedia, Consent Mode v2, CMP"
        url="/cerez-politikasi"
        noindex={false}
      />
      <FullPage>
        <ScrollIndicator ref={scrollIndicatorRef} />
        <MainPageHeader />
        <Main>
          <Heading>Vizepedia – Çerez Politikası</Heading>
          <LastUpdate>Son Güncelleme: 10 Ekim 2025</LastUpdate>
          <SubText>
            Bu sayfa, Vizepedia web sitesinin çerez kullanımına ilişkin
            bilgilendirme sağlar. Rıza gerektiren çerezler yalnızca açık
            onayınızla etkinleştirilir; tercihlerinizi dilediğiniz zaman
            güncelleyebilirsiniz.
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
                <a href="/gizlilik-politikasi">Gizlilik Politikası</a> •{" "}
                <a href="/kullanim-sartlari">Kullanım Şartları</a>
              </ForContactInfo>
            </ForContactContainer>
          </FadeInSection>
        </Main>
        <Footer />
      </FullPage>
    </>
  );
}

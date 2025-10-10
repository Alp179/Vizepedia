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

// Sections data for Privacy Policy (revized)
const sectionsData = [
  {
    id: 1,
    title: "1. Gizliliğe Yaklaşımımız",
    content: `Vizepedia olarak kullanıcılarımızın gizliliğini korumayı en öncelikli değerlerimizden biri olarak görüyoruz. Bu gizlilik politikası:
    Hangi kişisel bilgileri topladığımızı açıklar
    Bu bilgileri nasıl kullandığımızı detaylandırır
    Verilerinizi kimlerle paylaştığımızı belirtir
    Haklarınızı ve kontrol seçeneklerinizi açıklar

    Bu politika hem Türkiye hem de uluslararası kullanıcılar için geçerlidir ve KVKK, GDPR gibi veri koruma düzenlemelerine uygun olarak hazırlanmıştır.
    Not: Bu politika yalnızca çerezleri değil; localStorage, sessionStorage ve benzeri tarayıcı depolama teknolojilerini de kapsar.`,
  },
  {
    id: 2,
    title: "2. Topladığımız Bilgiler",
    content: `Otomatik olarak toplanan bilgiler:
    IP adresiniz ve yaklaşık coğrafi konumunuz
    Tarayıcı türü, dili ve cihaz bilgileri
    Ziyaret ettiğiniz sayfalar ve tıklama davranışları
    Site kullanım süreleri ve erişim zamanları
    Yönlendiren web sitesi bilgileri

    Siz tarafından sağlanan bilgiler:
    E-posta adresiniz (üye olduğunuzda)
    Vize başvuru tercihleri ve seyahat planları
    Meslek, yaş grubu gibi demografik bilgiler (paylaşırsanız)
    İletişim formları aracılığıyla paylaştığınız bilgiler

    Çerez ve benzer teknolojiler:
    Oturum çerezleri (geçici)
    Kalıcı çerezler (tercihlerinizi hatırlamak için)
    Google Analytics çerezleri
    Google AdSense reklam çerezleri

    Tarayıcı depolama verileri (çerez dışı):
    localStorage: tema tercihi (ör. isDarkMode), belirli bildirim/popup durumları (ör. hasSeenWelcomeModal) gibi tercih verileri
    sessionStorage: anonim akış bilgileri (ör. isAnonymous, anonymousCreatedAt), geçici başvuru/yanıt verileri (ör. userAnswers, userSelections), ilerleme durumları (ör. wellcomesAnswered)
    Not: Tarayıcı depolamasındaki bu veriler yalnızca deneyimi kişiselleştirmek ve akışı sürdürmek için kullanılır, sayfa/sekme kapandığında (sessionStorage) temizlenir veya kullanıcı tarafından silinebilir.`,
  },
  {
    id: 3,
    title: "3. Bilgileri Nasıl Kullanıyoruz?",
    content: `Hizmet sağlama:
    Kişiselleştirilmiş vize rehberliği sunmak
    Belge listelerini özelleştirmek
    Kullanıcı hesaplarını yönetmek
    Şifre sıfırlama ve güvenlik işlemleri

    Site geliştirme:
    Kullanıcı deneyimini analiz etmek ve iyileştirmek
    Teknik sorunları tespit etmek ve çözmek
    Yeni özellikler geliştirmek
    Site performansını optimize etmek

    İletişim:
    Önemli güncellemeler hakkında bilgilendirme
    Kullanıcı destek talepleri yanıtlama
    Yasal bildirimler ve politika değişiklikleri

    Reklam ve pazarlama:
    Size uygun reklamları göstermek (kullanıcı rızasına tabidir)
    Reklam performansını ölçmek
    Pazarlama kampanyalarının etkinliğini analiz etmek

    Tarayıcı depolaması:
    localStorage ve sessionStorage verileri yalnızca kullanıcı deneyimini sürdürmek, sayfa geçişlerinde bilgilerin kaybolmamasını sağlamak ve tekrar eden bildirimleri önlemek için kullanılır; üçüncü taraflarla paylaşılmaz.`,
  },
  {
    id: 4,
    title: "4. Bilgi Paylaşımı ve Üçüncü Taraflar",
    content: `Google hizmetleri:
    Google AdSense: Reklam gösterimi ve (rızaya bağlı) kişiselleştirme için
    Google Analytics: Site analizi için toplulaştırılmış/anonimleştirilmiş veriler
    Google Fonts: Yazı tipi hizmetleri için

    Bu hizmetler Google'ın kendi gizlilik politikasına tabidir:
    https://policies.google.com/privacy

    Reklam rızası ve Consent Mode:
    Avrupa Ekonomik Alanı (EEA) ve Birleşik Krallık kullanıcıları için Google Consent Mode v2 uygulanır. ad_storage, analytics_storage, ad_user_data ve ad_personalization sinyalleri kullanıcı rızasına göre güncellenir.

    Hizmet sağlayıcıları:
    Supabase (veri işleyici): Kullanıcı hesap verileri ve ilgili içeriklerin güvenli depolanması için
    CDN hizmetleri: Site performansı ve içerik dağıtımı için
    E-posta hizmetleri: İletişim ve bildirimler için

    Yasal gereklilikler:
    Mahkeme kararları halinde
    Yasal soruşturmalar kapsamında
    Ulusal güvenlik gereklilikleri
    Kullanıcı güvenliğini korumak için

    Taahhüdümüz:
    Hiçbir durumda ticari amaçlarla üçüncü taraflara kişisel bilgilerinizi satmayız veya kiralamayız.`,
  },
  {
    id: 5,
    title: "5. Uluslararası Veri Transferleri",
    content: `Verileriniz aşağıdaki durumlarda sınır ötesine aktarılabilir:
    Google servisleri için gerekli transferler (ABD/AB)
    CDN hizmetleri için global sunucu ağları
    Bulut depolama/yedekleme süreçleri
    Supabase ve Google veri merkezleri zaman zaman AB dışındaki bölgelerde barındırılabilir

    Bu transferler sırasında:
    Uygun teknik ve sözleşmesel güvenlik önlemleri alınır (örn. Standart Sözleşme Hükümleri)
    Veri koruma seviyesi korunur
    GDPR ve KVKK gerekliliklerine uygun hareket edilir

    AB vatandaşları için özel korumalar:
    GDPR çerçevesinde işlenir
    Yeterlilik kararları olan ülkelere veya SCC’lere dayanılarak aktarılır
    Şifreleme ve erişim kontrolü uygulanır`,
  },
  {
    id: 6,
    title: "6. Veri Güvenliği",
    content: `Teknik güvenlik önlemleri:
    SSL/TLS şifreleme (HTTPS)
    Güvenli veri tabanı saklama ve yedekleme
    Düzenli güvenlik güncellemeleri
    Erişim kontrolü ve yetkilendirme

    İdari güvenlik önlemleri:
    Personel/iş ortağı farkındalık eğitimleri
    Veri erişim politikaları
    Düzenli güvenlik denetimleri
    Veri ihlali müdahale planları

    Kullanıcı güvenliği:
    Güçlü şifre önerileri
    İki faktörlü kimlik doğrulama seçenekleri (uygulanabildiği ölçüde)
    Şüpheli aktivite bildirimleri
    Hesap güvenliği ipuçları

    Ek not:
    Anonim oturum kapsamında tutulan sessionStorage verileri tarayıcı/sekme kapandığında otomatik olarak temizlenir.`,
  },
  {
    id: 7,
    title: "7. Kullanıcı Hakları ve Kontrol",
    content: `KVKK ve GDPR kapsamında haklarınız:
    Verilerinizin işlenip işlenmediğini öğrenme
    İşlenen verilere erişim talep etme
    Yanlış verilerin düzeltilmesini isteme
    Belirli koşullarda verilerin silinmesini talep etme
    Veri işlemeye itiraz etme
    Veri taşınabilirliği hakkı

    Kontrolleriniz:
    Hesap ayarlarından tercihlerinizi değiştirme
    E-posta bildirimlerini yönetme
    Çerez ve rıza tercihlerini güncelleme (CMP üzerinden)
    Hesabınızı istediğiniz zaman kapatma
    Anonim kullanıcılar için: Tarayıcı veri/geçmiş temizliği ile localStorage/sessionStorage verilerini silebilirsiniz

    Bu haklarınızı kullanmak için:
    E-posta: iletisim@vizepedia.com
    Yanıt süresi: En geç 30 gün
    Kimlik doğrulama gerekebilir`,
  },
  {
    id: 8,
    title: "8. Çerezler ve Reklam Tercihleri",
    content: `Çerez ve tarayıcı depolaması yönetimi:
    Tarayıcı ayarlarından tüm çerezleri silebilir veya belirli çerez türlerini engelleyebilirsiniz
    Çerez tercihlerinizi ve rıza durumunuzu sitemizdeki tercih aracı (CMP) üzerinden güncelleyebilirsiniz
    localStorage ve sessionStorage verileri çerez değildir; tarayıcı ayarlarınızdan site verilerini temizleyerek bu kayıtları da silebilirsiniz

    Google AdSense ve Analytics:
    Kişiselleştirilmiş reklamları kapatabilirsiniz (EEA/UK kullanıcılarında rıza alınmadan kişiselleştirme yapılmaz)
    Reklam tercihleri: https://adssettings.google.com
    Google Analytics'i tarayıcı eklentileri veya rıza tercihleriyle devre dışı bırakabilirsiniz

    Reklam engelleme:
    Reklam engelleyici yazılımlar kullanabilirsiniz; bu durum bazı özelliklerin çalışmasını etkileyebilir
    Premium/ücretsiz reklamsız seçenekler gelecekte değerlendirilebilir`,
  },
  {
    id: 9,
    title: "9. Çocukların Gizliliği",
    content: `13 yaş altı çocuklar:
    Bilerek kişisel bilgi toplamıyoruz
    Ebeveyn onayı olmadan kayıt kabul etmiyoruz
    Bu durumu fark ettiğimizde verileri sileriz

    13–18 yaş arası kullanıcılar:
    Ebeveyn veya vasi bilgisi ile kayıt olabilir
    Sınırlı veri toplama politikası uygulanır
    Özel güvenlik önlemleri alınır

    Bölgesel yaş sınırı notu:
    Avrupa Birliği ülkelerinde dijital rıza yaşı ülkeye göre 13 ile 16 arasında değişebilir; ilgili ülke mevzuatına uyulur

    Ebeveynler:
    Çocuğunuzun hesabını kontrol edebilir, veri silme/hak kullanım taleplerinde bulunabilirsiniz`,
  },
  {
    id: 10,
    title: "10. Politika Değişiklikleri ve İletişim",
    content: `Politika güncellemeleri:
    Değişiklikler bu sayfada yayınlanır
    Önemli değişiklikler e-posta ile bildirilir
    Yürürlük tarihi açıkça belirtilir
    Eski versiyonların kaydı tutulur

    Sorularınız için iletişim:
    E-posta: iletisim@vizepedia.com
    Konu: "Gizlilik Politikası"
    Yanıt süresi: 48 saat içinde

    Şikayetler:
    Türkiye: Kişisel Verileri Koruma Kurumu’na başvurabilirsiniz
    AB vatandaşları için: yerel Veri Koruma Otoritesi’ne (DPA) şikayet hakkınız vardır
    Çözüm odaklı yaklaşım benimseriz`,
  },
];

export default function PrivacyPolicy() {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef([]);
  const scrollIndicatorRef = useRef(null);

  // Set up scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;

      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.transform = `scaleX(${Math.min(
          Math.max(progress, 0),
          1
        )})`;
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
        title="Gizlilik Politikası – Vizepedia"
        description="Vizepedia’nın gizlilik politikası; kişisel verilerin nasıl toplandığı, işlendiği ve korunduğu hakkında ayrıntılı bilgi."
        keywords="gizlilik politikası, privacy policy, kişisel veriler, Vizepedia, KVKK, GDPR, çerezler, localStorage, sessionStorage"
        url="/gizlilik-politikasi"
        noindex={false}
      />
      <FullPage>
        <ScrollIndicator ref={scrollIndicatorRef} />
        <MainPageHeader />
        <Main>
          <Heading>Vizepedia – Gizlilik Politikası</Heading>
          <LastUpdate>Son Güncelleme: 9 Ekim 2025</LastUpdate>
          <SubText>
            Bu gizlilik politikası, Vizepedia platformunu kullanan tüm
            kullanıcıların kişisel verilerinin nasıl toplandığını, işlendiğini
            ve korunduğunu açıklar. Gizliliğiniz bizim için önemlidir ve bu
            politika şeffaflık prensibimizin bir yansımasıdır.
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
              <ForContact>Gizlilik ile İlgili İletişim:</ForContact>
              <ForContactInfo>
                <a href="mailto:iletisim@vizepedia.com?subject=Gizlilik%20Politikası">
                  iletisim@vizepedia.com
                </a>
              </ForContactInfo>
              <ForContactInfo>
                Veri Koruma Sorumlusu: Vizepedia Ekibi
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

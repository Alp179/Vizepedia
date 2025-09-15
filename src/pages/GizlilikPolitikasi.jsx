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

// Sections data for Privacy Policy
const sectionsData = [
  {
    id: 1,
    title: "1. Gizliliğe Yaklaşımımız",
    content: `Vizepedia olarak kullanıcılarımızın gizliliğini korumayı en öncelikli değerlerimizden biri olarak görüyoruz. Bu gizlilik politikası:
    Hangi kişisel bilgileri topladığımızı açıklar
    Bu bilgileri nasıl kullandığımızı detaylandırır
    Verilerinizi kimlerle paylaştığımızı belirtir
    Haklarınızı ve kontrol seçeneklerinizi açıklar
    
    Bu politika hem Türkiye hem de uluslararası kullanıcılar için geçerlidir ve KVKK, GDPR gibi veri koruma düzenlemelerine uygun olarak hazırlanmıştır.`,
  },
  {
    id: 2,
    title: "2. Topladığımız Bilgiler",
    content: `Otomatik olarak toplanan bilgiler:
    IP adresiniz ve coğrafi konumunuz
    Tarayıcı türü, dili ve cihaz bilgileri
    Ziyaret ettiğiniz sayfalar ve tıklama davranışları
    Site kullanım süreleri ve erişim zamanları
    Yönlendiren web sitesi bilgileri
    
    Siz tarafından sağlanan bilgiler:
    E-posta adresiniz (üye olduğunuzda)
    Vize başvuru tercihleri ve seyahat planları
    Meslek, yaş grubu gibi demografik bilgiler
    İletişim formları aracılığıyla paylaştığınız bilgiler
    
    Çerez ve benzer teknolojiler:
    Oturum çerezleri (geçici)
    Kalıcı çerezler (tercihlerinizi hatırlamak için)
    Google Analytics çerezleri
    Google AdSense reklam çerezleri`,
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
    Size uygun reklamları göstermek
    Reklam performansını ölçmek
    Pazarlama kampanyalarının etkinliğini analiz etmek`,
  },
  {
    id: 4,
    title: "4. Bilgi Paylaşımı ve Üçüncü Taraflar",
    content: `Google hizmetleri:
    Google AdSense: Kişiselleştirilmiş reklamlar için
    Google Analytics: Site analizi için anonim veriler
    Google Fonts: Yazı tipi hizmetleri için
    
    Bu hizmetler Google'ın kendi gizlilik politikasına tabidir:
    https://policies.google.com/privacy
    
    Hizmet sağlayıcıları:
    Supabase: Güvenli veri depolama için
    CDN hizmetleri: Site performansı için
    E-posta hizmetleri: İletişim için
    
    Yasal gereklilikler:
    Mahkeme kararları halinde
    Yasal soruşturmalar kapsamında
    Ulusal güvenlik gereklilikleri
    Kullanıcı güvenliğini korumak için
    
    Hiçbir durumda ticari amaçlarla üçüncü taraflara kişisel bilgilerinizi satmayız veya kiralamayız.`,
  },
  {
    id: 5,
    title: "5. Uluslararası Veri Transferleri",
    content: `Verileriniz aşağıdaki durumlarda sınır ötesine aktarılabilir:
    Google servisleri (ABD) için gerekli transferler
    CDN hizmetleri için global sunucu ağları
    Bulut depolama hizmetleri için yedekleme
    
    Bu transferler sırasında:
    Uygun güvenlik önlemleri alınır
    Veri koruma seviyesi korunur
    GDPR ve KVKK gerekliliklerine uygun hareket edilir
    Verilerin korunması için sözleşmeli güvenceler sağlanır
    
    AB vatandaşları için özel korumalar:
    GDPR çerçevesinde işlenir
    Yeterlilik kararları olan ülkelere aktarılır
    Standart sözleşme hükümleri uygulanır`,
  },
  {
    id: 6,
    title: "6. Veri Güvenliği",
    content: `Teknik güvenlik önlemleri:
    SSL/TLS şifreleme (HTTPS)
    Güvenli veri tabanı saklama
    Düzenli güvenlik güncellemeleri
    Erişim kontrolü ve yetkilendirme
    
    İdari güvenlik önlemleri:
    Personel eğitimleri
    Veri erişim politikaları
    Düzenli güvenlik denetimleri
    Veri ihlali müdahale planları
    
    Kullanıcı güvenliği:
    Güçlü şifre önerileri
    İki faktörlü kimlik doğrulama seçenekleri
    Şüpheli aktivite bildirimleri
    Hesap güvenliği ipuçları`,
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
    Çerez tercihlerini ayarlama
    Hesabınızı istediğiniz zaman kapatma
    
    Bu haklarınızı kullanmak için:
    E-posta: iletisim@vizepedia.com
    Yanıt süresi: En geç 30 gün
    Kimlik doğrulama gerekebilir`,
  },
  {
    id: 8,
    title: "8. Çerezler ve Reklam Tercihleri",
    content: `Çerez yönetimi:
    Tarayıcı ayarlarından tüm çerezleri silebilirsiniz
    Belirli çerez türlerini engelleyebilirsiniz
    Çerez tercihlerinizi güncelleyebilirsiniz
    
    Google AdSense reklamları:
    Kişiselleştirilmiş reklamları kapatabilirsiniz
    Reklam tercihleri: https://adssettings.google.com
    Google Analytics'i devre dışı bırakabilirsiniz
    
    Reklam engelleme:
    Reklam engelleyici yazılımlar kullanabilirsiniz
    Bu durum site işlevselliğini etkileyebilir
    Premium abonelik seçenekleri değerlendirilebilir`,
  },
  {
    id: 9,
    title: "9. Çocukların Gizliliği",
    content: `13 yaş altı çocuklar:
    Bilerek kişisel bilgi toplamıyoruz
    Ebeveyn onayı olmadan kayıt kabul etmiyoruz
    Bu durumu fark ettiğimizde verileri sileriz
    
    13-18 yaş arası kullanıcılar:
    Ebeveyn veya vasi bilgisi ile kayıt olabilir
    Sınırlı veri toplama politikası uygulanır
    Özel güvenlik önlemleri alınır
    
    Ebeveynler:
    Çocuğunuzun hesabını kontrol edebilirsiniz
    Veri silme talebinde bulunabilirsiniz
    Hesap kapatma işlemi yapabilirsiniz`,
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
    Veri Koruma Kurulu'na başvurabilirsiniz
    AB vatandaşları için: yerel DPA'ya şikayet
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
        title="Gizlilik Politikası – Vizepedia"
        description="Vizepedia’nın gizlilik politikası; kişisel verilerin nasıl toplandığı, işlendiği ve korunduğu hakkında ayrıntılı bilgi edinmek için bu sayfayı okuyun."
        keywords="gizlilik politikası, privacy policy, kişisel veriler, Vizepedia"
        url="https://www.vizepedia.com/gizlilik-politikasi"
      />
      <FullPage>
        <ScrollIndicator ref={scrollIndicatorRef} />
        <MainPageHeader />
        <Main>
          <Heading>Vizepedia – Gizlilik Politikası</Heading>
          <LastUpdate>Son Güncelleme: 8 Eylül 2025</LastUpdate>
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

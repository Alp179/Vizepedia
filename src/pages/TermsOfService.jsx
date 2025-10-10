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

// Sections data for Terms of Service (revized)
const sectionsData = [
  {
    id: 1,
    title: "1. Kabul ve Onay",
    content: `Bu Kullanım Şartları ("Şartlar"), Vizepedia web sitesi ve platformunu kullanımınızı düzenler:
    Web sitemizi ziyaret etmekle bu şartları kabul etmiş sayılırsınız
    Şartları kabul etmiyorsanız lütfen siteyi kullanmayınız
    Bu şartlar tüm ziyaretçiler ve kayıtlı kullanıcılar için geçerlidir
    Platformu kullanmaya devam etmeniz sürekli kabulünüzü ifade eder

    Yasal ehliyet ve yaş uygunluğu:
    18 yaşından küçükseniz, ebeveyn veya vasi onayı ile kullanabilirsiniz
    Avrupa Birliği ülkelerinde dijital rıza yaşı ülkeye göre 13–16 arasında değişebilir; yerel mevzuata uyulur
    Ticari kullanım için yetkili kişi olduğunuzu beyan edersiniz
    Yasadışı amaçlarla kullanım kesinlikle yasaktır`,
  },
  {
    id: 2,
    title: "2. Tanımlar, Lisans ve Teknik Kısıtlar",
    content: `Tanımlar:
    "Platform": Vizepedia'ya ait web sitesi ve ilişkili hizmetler
    "İçerik": Metin, grafik, görsel, yazılım, veri ve tüm materyaller
    "Kullanıcı İçeriği": Kullanıcıların Platforma yüklediği/payılaştığı içerik

    Kullanım lisansı:
    Size kişisel, devredilemez ve münhasır olmayan sınırlı bir kullanım lisansı sağlarız
    Bu lisans, yürürlükteki mevzuata ve bu Şartlara uymak koşuluyla verilir

    Teknik kısıtlar:
    Tersine mühendislik, kaynak koda dönüştürme, dekompilasyon yasaktır
    Otomatik erişim/scraping, rate limit aşımı, yetkisiz tarama yasaktır
    Güvenlik testi ve zafiyet taraması için önceden yazılı izin gerekir`,
  },
  {
    id: 3,
    title: "3. Hizmet Tanımı ve Kapsamı",
    content: `Vizepedia şunları sunar:
    Vize başvuru süreçleri hakkında bilgilendirme
    Gerekli belge listelerinin oluşturulması
    Kişiselleştirilmiş rehberlik sistemi
    Seyahat ve vize ile ilgili güncel içerikler

    Hizmet sınırları ve feragat:
    Resmî vize başvuru işlemleri yapmıyoruz; konsolosluk/kurum değiliz
    Vize onay/red kararlarında rolümüz yok; sonuçları garanti etmeyiz
    Yasal/göçmenlik danışmanlığı vermiyoruz; içerikler genel bilgi amaçlıdır
    Öneriler zaman zaman otomatik işleme/algoritmalarla üretilebilir; hatasız olduğu garanti edilmez
    Kullanıcı, kritik kararlarını resmî kaynaklardan doğrulamakla yükümlüdür`,
  },
  {
    id: 4,
    title: "4. Kullanıcı Hesapları ve Sorumluluklar",
    content: `Hesap oluşturma:
    Doğru ve güncel bilgiler vermeyi kabul edersiniz
    Şifrenizin güvenliğinden siz sorumlusunuz
    Hesap bilgilerinizi üçüncü taraflarla paylaşmayacaksınız
    Şüpheli aktiviteleri derhal bildirmeyi kabul edersiniz

    Kullanıcı sorumlulukları:
    Platform kurallarına uymak; başkalarının haklarına saygı göstermek
    Doğru bilgi paylaşmak; sistemi kötüye kullanmamak
    Teknik saldırı girişiminde bulunmamak

    Elektronik iletişim:
    E-posta ve platform içi bildirimler, yazılı bildirim yerine geçebilir`,
  },
  {
    id: 5,
    title: "5. Yasak Kullanımlar",
    content: `Aşağıdaki aktiviteler kesinlikle yasaktır:
    Sahte bilgi veya belge oluşturmak; başka kullanıcıları yanıltmak
    Zararlı yazılım/virüs yüklemek; sistem güvenliğini ihlal etmeye çalışmak
    Spam veya istenmeyen içerik göndermek
    Scraping, bot/otomasyonla sistematik veri çekimi
    Tersine mühendislik, rate limit aşımı, yetkisiz API kullanımı

    Fikri mülkiyet ihlalleri:
    İçerikleri izinsiz kopyalamak/çoğaltmak
    Ticari amaçla yeniden dağıtmak
    Platformu taklit etmek; marka haklarını ihlal etmek
    Telif korumalı materyali izinsiz paylaşmak`,
  },
  {
    id: 6,
    title: "6. İçerik, Fikri Mülkiyet ve Geri Bildirim",
    content: `Vizepedia içerikleri:
    Tüm özgün içerikler Vizepedia'ya aittir
    Kaynak göstererek kısmi alıntı yapabilirsiniz
    Ticari kullanım için yazılı izin gerekir; logo ve marka öğeleri korunur

    Kullanıcı içerikleri:
    Paylaştığınız içeriklerden siz sorumlusunuz; üçüncü taraf haklarını ihlal etmeyeceğinizi taahhüt edersiniz
    Platform moderasyon/kaldırma hakkını saklı tutar
    İçerik yedekleri fesih sonrası makul sürelerle sistemde kalabilir

    Lisanslar:
    Bize sağladığınız geri bildirim/önerileri herhangi bir yükümlülük doğurmaksızın kullanabiliriz
    Kullanıcı İçeriğini barındırmak, çoğaltmak, görüntülemek ve iletmek için sınırlı, devredilebilir olmayan bir lisans verirsiniz`,
  },
  {
    id: 7,
    title: "7. Gizlilik, Çerezler ve Rıza Yönetimi",
    content: `Kişisel veriler:
    KVKK ve GDPR'a uygun şekilde işlenir; ayrıntılar Gizlilik Politikamızda ve Çerez Politikamızda açıklanır
    Rıza gereken hâllerde rıza alınır; reklam kişiselleştirme rızaya tabidir

    Çerez ve benzeri teknolojiler:
    Site deneyimini iyileştirmek için çerezler ve tarayıcı depolaması kullanılabilir
    EEA/UK kullanıcıları için Google Consent Mode v2 sinyalleri (ad_storage, analytics_storage, ad_user_data, ad_personalization) rıza durumuna göre yönetilir

    Referans:
    Gizlilik ve Çerez Politikaları bu Şartların ayrılmaz parçasıdır`,
  },
  {
    id: 8,
    title: "8. Reklamlar, Sponsorluklar ve Ortaklık Bağlantıları",
    content: `Reklamlar:
    Üçüncü taraf reklamları yayınlanabilir; bunlar onay/teminat anlamına gelmez
    Reklamlara tıklamaya/etkileşime girmeye yönelik hiçbir teşvik sunulmaz; kullanıcı kendi takdiriyle hareket eder

    Ortaklık/affiliate:
    Bazı bağlantılardan gelir elde edebiliriz; bu durum içerik tarafsızlığını etkilemez
    Ayrıntılar Gizlilik ve Çerez Politikalarında açıklanır`,
  },
  {
    id: 9,
    title: "9. Üçüncü Taraf Linkleri ve Hizmetleri",
    content: `Üçüncü taraf sitelere yönlendiren bağlantılar bulunabilir
    Bu sitelerin içerik/güvenliği kontrolümüz dışında olup sorumluluk kabul edilmez
    Üçüncü taraf hizmetlerinin (ör. ödeme, analiz, reklam) şartları kendi politikalarına tabidir`,
  },
  {
    id: 10,
    title: "10. Hizmet Değişiklikleri ve Kesintiler",
    content: `Hizmet güncellemeleri:
    Platformu sürekli geliştirme hakkımız vardır
    Önemli değişiklikler mümkün olduğunca önceden duyurulur
    Yeni özellikler eklenebilir veya kaldırılabilir
    Gelecekte ücretli modüller eklenebilir; koşulları ayrıca duyurulur

    Hizmet kesintileri:
    Bakım çalışmaları için geçici kesintiler olabilir
    Teknik arızalarda hizmet askıya alınabilir
    Güvenlik tehditleri halinde acil müdahale yapılabilir
    Belirli bir kesintisiz hizmet/uptime garantisi verilmez`,
  },
  {
    id: 11,
    title: "11. Mücbir Sebepler (Force Majeure)",
    content: `Doğal afet, savaş, grev, altyapı/enerji kesintileri, regülasyonlar, siber saldırılar ve kontrolümüz dışındaki diğer olaylar sebebiyle yükümlülüklerin yerine getirilememesinden sorumlu tutulmayız`,
  },
  {
    id: 12,
    title: "12. Sorumluluk Sınırları",
    content: `Genel sınırlama:
    Yürürlükteki zorunlu mevzuatın izin verdiği azami ölçüde, Vizepedia ve iştiraklerinin toplam sorumluluğu; ilgili talebe sebep olan olaydan önceki 12 ay içinde kullanıcı tarafından ödenen bedellerin toplamı (varsa) veya 1.000 TL (hangisi yüksekse) ile sınırlıdır

    Kapsam dışı zararlar:
    Dolaylı, arızi, cezai veya sonuçsal zararlar; kâr/itibar/kullanım/veri kaybı; fırsat maliyeti nedeniyle sorumluluk kabul edilmez

    Feragat:
    Bilgi doğruluğu için çaba gösteririz ancak her zaman güncel/doğru olduğuna dair garanti verilmez; kullanıcı resmî kaynakları esas alır`,
  },
  {
    id: 13,
    title: "13. Tazmin",
    content: `Kullanıcının Platformu mevzuata/Şartlara aykırı kullanımı veya üçüncü kişi haklarının ihlali nedeniyle Vizepedia'ya yöneltilecek her türlü iddia, zarar ve makul avukatlık ücretlerinden kullanıcı sorumludur`,
  },
  {
    id: 14,
    title: "14. Hesap Kapatma ve Fesih",
    content: `Kullanıcı tarafından:
    Hesabınızı dilediğiniz zaman kapatabilirsiniz; veri silme talebinde bulunabilirsiniz
    Bazı veriler yasal gereklilikler nedeniyle belirli sürelerle saklanabilir

    Platform tarafından:
    Şartların ihlali hâlinde hesabınız askıya alınabilir veya kapatılabilir
    Kötüye kullanım durumunda derhal işlem yapılabilir
    Fesih sonrası nitelikleri gereği yürürlükte kalması gereken hükümler (fikri mülkiyet, sorumluluk sınırlamaları, tazmin, uygulanacak hukuk) yürürlükte kalır`,
  },
  {
    id: 15,
    title: "15. Uygulanacak Hukuk ve Uyuşmazlık Çözümü",
    content: `Uygulanacak hukuk ve yetkili yargı:
    Bu Şartlar Türkiye Cumhuriyeti yasalarına tabidir; İstanbul mahkemeleri ve icra daireleri yetkilidir
    Çok dilli sürümler arasında çelişki hâlinde Türkçe metin esas alınır

    Uyuşmazlık çözümü:
    Öncelikle dostane çözüm aranır; arabuluculuk sürecine açığız
    Yargılama giderleri ve vekâlet ücretleri yargı mercilerinin takdirine tabidir`,
  },
  {
    id: 16,
    title: "16. Şartlarda Değişiklik ve Bildirim",
    content: `Değişiklik:
    Mevzuat veya hizmetlerdeki değişikliklere göre bu Şartlar güncellenebilir
    Önemli değişiklikler e-posta veya platform içi bildirimlerle duyurulabilir
    Güncel sürüm bu sayfada yayımlanır; yürürlük tarihi belirtilir

    Bildirim:
    Kullanıcı, elektronik iletişimlerin (e-posta, platform içi mesajlar) yazılı bildirim yerine geçebileceğini kabul eder
    Değişiklikleri kabul etmiyorsanız hesabınızı kapatabilirsiniz`,
  },
  {
    id: 17,
    title: "17. Devredilebilirlik, Bütün Sözleşme, Feragat ve Bölünebilirlik",
    content: `Devredilebilirlik:
    Bu Şartlar kapsamındaki hak ve yükümlülüklerimizi iş devri/yeniden yapılanma gibi hâllerde devredebiliriz; kullanıcı devredemez

    Bütün sözleşme:
    Bu metin, konuya ilişkin taraflar arasındaki tam mutabakatı oluşturur

    Feragat:
    Herhangi bir hakkın kullanılmaması feragat sayılmaz

    Bölünebilirlik:
    Herhangi bir hükmün geçersizliği diğer hükümleri etkilemez`,
  },
];

export default function TermsOfService() {
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
        const clamped = Math.min(Math.max(progress, 0), 1);
        scrollIndicatorRef.current.style.transform = `scaleX(${clamped})`;
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
        title="Kullanım Şartları – Vizepedia"
        description="Vizepedia kullanım şartları: hizmet kapsamı, yasak kullanımlar, gizlilik-çerez politikalarına atıf, sorumluluk sınırı, tazmin ve uyuşmazlık çözümü."
        keywords="kullanım şartları, terms of service, hizmet koşulları, üyelik şartları, sorumluluk sınırı, tazmin, reklam politikası"
        url="/kullanim-sartlari"
        noindex={false}
      />
      <FullPage>
        <ScrollIndicator ref={scrollIndicatorRef} />
        <MainPageHeader />
        <Main>
          <Heading>Vizepedia – Kullanım Şartları</Heading>
          <LastUpdate>Son Güncelleme: 10 Ekim 2025</LastUpdate>
          <SubText>
            Bu kullanım şartları, Vizepedia platformunun kullanımını düzenleyen
            bağlayıcı koşulları açıklar. Platformu kullanarak bu şartları kabul
            etmiş olursunuz. Lütfen tüm maddeleri dikkatle okuyun.
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

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
  formatContent
} from "./Kvkk"; // Import styled components from KVKK page

// Sections data for Terms of Service
const sectionsData = [
  {
    id: 1,
    title: "1. Kabul ve Onay",
    content: `Bu Kullanım Şartları ("Şartlar"), Vizepedia web sitesi ve platformunu kullanımınızı düzenler:
    Web sitemizi ziyaret etmekle bu şartları kabul etmiş sayılırsınız
    Şartları kabul etmiyorsanız lütfen siteyi kullanmayınız
    Bu şartlar tüm ziyaretçiler ve kayıtlı kullanıcılar için geçerlidir
    Platformu kullanmaya devam etmeniz sürekli kabulünüzü ifade eder
    
    Yasal ehliyet:
    18 yaşından küçükseniz, ebeveyn veya vasi onayı ile kullanabilirsiniz
    Ticari kullanım için yetkili kişi olduğunuzu beyan edersiniz
    Yasadışı amaçlarla kullanım kesinlikle yasaktır`
  },
  {
    id: 2,
    title: "2. Hizmet Tanımı ve Kapsamı",
    content: `Vizepedia aşağıdaki hizmetleri sunar:
    Vize başvuru süreçleri hakkında bilgilendirme
    Gerekli belge listelerinin oluşturulması
    Kişiselleştirilmiş rehberlik sistemi
    Seyahat ve vize ile ilgili güncel içerikler
    
    Hizmet sınırları:
    Resmi vize başvuru işlemleri yapmıyoruz
    Konsolosluk veya devlet kurumu değiliz
    Vize onay/red kararlarında rolümüz yoktur
    Yasal danışmanlık hizmeti vermiyoruz
    Sadece bilgilendirme ve rehberlik sağlıyoruz`
  },
  {
    id: 3,
    title: "3. Kullanıcı Hesapları ve Sorumluluklar",
    content: `Hesap oluşturma:
    Doğru ve güncel bilgiler vermeyi kabul edersiniz
    Şifrenizin güvenliğinden siz sorumlusunuz
    Hesap bilgilerinizi üçüncü taraflarla paylaşmayacaksınız
    Şüpheli aktiviteleri derhal bildirmeyi kabul edersiniz
    
    Kullanıcı sorumlulukları:
    Platform kurallarına uymak
    Başkalarının haklarına saygı göstermek
    Doğru bilgi paylaşmak
    Sistemi kötüye kullanmamak
    Teknik saldırılarda bulunmamak`
  },
  {
    id: 4,
    title: "4. Yasak Kullanımlar",
    content: `Aşağıdaki aktiviteler kesinlikle yasaktır:
    Sahte bilgi veya belge oluşturmak
    Başka kullanıcıları yanıltmak
    Zararlı yazılım veya virüs yüklemek
    Sistem güvenliğini ihlal etmeye çalışmak
    Spam veya istenmeyen içerik göndermek
    
    Fikri mülkiyet ihlalleri:
    İçerikleri izinsiz kopyalamak
    Ticari amaçla yeniden dağıtmak
    Platformu taklit etmek
    Marka haklarını ihlal etmek
    Telif hakkı korumalı materyali paylaşmak`
  },
  {
    id: 5,
    title: "5. İçerik ve Fikri Mülkiyet",
    content: `Vizepedia içerikleri:
    Tüm özgün içerikler Vizepedia'ya aittir
    Kaynak göstererek kısmi alıntı yapabilirsiniz
    Ticari kullanım için yazılı izin gereklidir
    Logo ve marka öğeleri korunmaktadır
    
    Kullanıcı içerikleri:
    Paylaştığınız içeriklerden siz sorumlusunuz
    Üçüncü taraf haklarını ihlal etmeyeceğinizi garantilersiniz
    Platform bu içerikleri moderasyon hakkını saklı tutar
    Uygunsuz içerikler kaldırılabilir
    Yasal süreçlerde işbirliği yapacağınızı kabul edersiniz`
  },
  {
    id: 6,
    title: "6. Gizlilik ve Veri Koruma",
    content: `Kişisel verileriniz:
    KVKK ve GDPR uyumlu olarak işlenir
    Detaylar Gizlilik Politikamızda açıklanmıştır
    Verilerinizi üçüncü taraflarla paylaşmayız (reklamverenler hariç)
    Güvenlik önlemleri alınmıştır
    
    Çerez kullanımı:
    Site deneyimini iyileştirmek için çerezler kullanılır
    Reklam çerezleri üçüncü taraf sağlayıcılar tarafından yönetilir
    Tarayıcı ayarlarından çerezleri kontrol edebilirsiniz
    Bazı çerezleri reddetmeniz site işlevselliğini etkileyebilir`
  },
  {
    id: 7,
    title: "7. Hizmet Değişiklikleri ve Kesintiler",
    content: `Hizmet güncellemeleri:
    Platformu sürekli geliştirme hakkımız vardır
    Önemli değişiklikler önceden duyurulur
    Yeni özellikler eklenebilir veya kaldırılabilir
    Fiyatlandırma değişebilir (ücretli hizmetler için)
    
    Hizmet kesintileri:
    Bakım çalışmaları için geçici kesintiler olabilir
    Teknik arızalar durumunda hizmet askıya alınabilir
    Güvenlik tehditleri halinde acil müdahale yapabiliriz
    Kesinti süresi garantisi vermiyoruz`
  },
  {
    id: 8,
    title: "8. Sorumluluk Sınırları",
    content: `Vizepedia'nın sorumluluğu aşağıdaki durumlarla sınırlıdır:
    Vize başvuru sonuçlarından sorumlu değiliz
    Bilgi doğruluğu için çaba gösteririz ancak garanti vermeyiz
    Kullanıcı kararlarının sonuçlarından sorumlu değiliz
    Üçüncü taraf hizmetlerinden kaynaklanan sorunlar kapsamımız dışındadır
    
    Zarar sınırları:
    Doğrudan zararlar için sorumluluğumuz hizmet bedeliyle sınırlıdır
    Dolaylı zararlardan sorumlu değiliz
    Kar kaybı, fırsat maliyeti gibi kayıplar kapsamımız dışındadır
    Kullanıcı ihmalinden kaynaklanan zararlardan sorumlu değiliz`
  },
  {
    id: 9,
    title: "9. Hesap Kapatma ve Fesih",
    content: `Kullanıcı tarafından hesap kapatma:
    İstediğiniz zaman hesabınızı kapatabilirsiniz
    Veri silme talebinde bulunabilirsiniz
    İşlem geri alınamaz olabilir
    Bazı veriler yasal gereklilikler nedeniyle saklanabilir
    
    Platform tarafından hesap kapatma:
    Şartları ihlal eden hesaplar kapatılabilir
    Uyarı yapılmaya çalışılır ancak zorunlu değildir
    Hesap kapatma kararı nihai ve bağlayıcıdır
    Kötüye kullanım durumunda anında işlem yapılabilir`
  },
  {
    id: 10,
    title: "10. Yasal Hükümler",
    content: `Uygulanacak hukuk:
    Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir
    İstanbul mahkemeleri yetkilidir
    Türkçe metin esas alınır
    Uluslararası kullanıcılar için yerel yasalar da geçerli olabilir
    
    Uyuşmazlık çözümü:
    Öncelikle dostane çözüm aranır
    Arabuluculuk sürecine açığız
    Mahkeme süreci son çare olarak değerlendirilir
    Yasal masraflar kaybeden taraf tarafından karşılanır`
  },
  {
    id: 11,
    title: "11. Şartlarda Değişiklik",
    content: `Bu kullanım şartları:
    Platform gelişimine paralel olarak güncellenebilir
    Yasal değişiklikler nedeniyle revize edilebilir
    Önemli değişiklikler e-posta ile duyurulur
    Web sitesinde güncel hali yayınlanır
    
    Kullanıcı bildirimi:
    Kayıtlı kullanıcılara e-posta ile bildirim yapılır
    Web sitesinde duyuru banner'ı gösterilir
    30 gün önceden bildirim yapılmaya çalışılır
    Değişiklikleri kabul etmiyorsanız hesabınızı kapatabilirsiniz`
  }
];

export default function TermsOfService() {
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
        <Heading>Vizepedia – Kullanım Şartları</Heading>
        <LastUpdate>Son Güncelleme: 8 Eylül 2025</LastUpdate>
        <SubText>
          Bu kullanım şartları, Vizepedia platformunun kullanımını düzenleyen yasal 
          bir sözleşmedir. Platform kullanımınızla bu şartları kabul etmiş olursunuz. 
          Lütfen devam etmeden önce tüm maddeleri dikkatlice okuyunuz.
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
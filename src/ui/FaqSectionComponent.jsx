import { FaqSection, FaqTitle, FaqSubtitle, Faq } from "../ui/FaqComponents";
import GroupedCountryList from "../ui/GroupedCountryList";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";

function FaqSectionComponent() {
  // SEO-optimized FAQ data with structured content
  const faqData = [
    {
      question: "Vizepedia ile hangi ülkelerin vize sürecini yönetebilirim?",
      answer:
        "Vizepedia kullanıcıları, platformumuzun rehberliğinde aşağıdaki ülkelerin vize başvurularını tamamlayabilir ve bu ülkelerin vize işlemlerini gerçekleştirebilirler: Schengen Bölgesi ülkeleri (Almanya, Fransa, İtalya, İspanya, Hollanda, Belçika, Lüksemburg, İsveç, Finlandiya, Danimarka, Avusturya, Çek Cumhuriyeti, Estonya, Macaristan, Letonya, Litvanya, Malta, Polonya, Portekiz, Slovakya, Slovenya, Yunanistan), Amerika Birleşik Devletleri, Birleşik Krallık, İsviçre, Norveç, İzlanda, Lihtenştayn, Kanada, Avustralya, Japonya, Çin ve daha birçok ülke. Vizepedia, bu ülkelerin vize süreçlerini yönetmekle ilgili tüm gerekli bilgileri sunarak kullanıcıların vize başvurularını tamamlamalarına yardımcı olur.",
    },
    {
      question:
        "Vizepedia'nın sunduğu bilgiler için herhangi bir ücret ödemem gerekiyor mu?",
      answer:
        "Hayır, Vizepedia'nın sunduğu bilgiler tamamen ücretsizdir. Platformumuz, vize başvuru sürecinde size rehberlik etmek için gerekli tüm bilgileri sağlar ve bu hizmetten yararlanmak için herhangi bir ücret talep etmez. Amacımız, vize başvurularınızı daha kolay ve anlaşılır hale getirmektir. Tüm vize rehberleri, belge listeleri ve başvuru adımları ücretsiz olarak erişime açıktır.",
    },
    {
      question: "Vizepedia'nın sunduğu bilgilerin kaynağı nedir?",
      answer:
        "Vizepedia'nın sunduğu bilgiler, bir dizi resmi ve güvenilir kaynaklardan toplanmıştır. Bunlar arasında hükümet web siteleri, büyükelçilikler ve konsolosluklar, uluslararası göçmenlik ve vize politikaları üzerine resmi yayınlar bulunmaktadır. Bilgiler ayrıca, vize süreçleri ve gereklilikleri konusunda geniş bir deneyime sahip olan Vizepedia'nın uzman ekibinin derinlemesine araştırmaları ve analizleri ile de desteklenmektedir. Bu şekilde, kullanıcılarımıza en doğru ve güncel bilgileri sunabilmekteyiz.",
    },
    {
      question: "Vize başvurusu için ne kadar önceden hazırlanmalıyım?",
      answer:
        "Vize başvurusu için hazırlık süresi ülkeye ve vize türüne göre değişmekle birlikte genellikle en az 1-3 ay önceden başlanması önerilir. Schengen vizesi için genellikle 15 gün içinde sonuçlanırken, Amerika vizesi için 3-5 iş günü sürebilir. Ancak yoğun dönemlerde bu süreler uzayabilir. Vizepedia, her ülke için ortalama işlem sürelerini ve en iyi başvuru zamanlamasını göstererek zamanında hazırlık yapmanızı sağlar.",
    },
    {
      question: "Vize başvurusu için gerekli belgeler nelerdir?",
      answer:
        "Vize başvurusu için gereken belgeler ülkeye ve vize türüne göre değişir. Genellikle pasaport (son 6 ayda çekilmiş, en az 2 boş sayfası olan), biyometrik fotoğraf, başvuru formu, finansal belgeler (banka hesap özeti, maaş bordrosu), seyahat sağlık sigortası, konaklama rezervasyonu ve uçak biletleri gereklidir. Vizepedia, her ülke ve vize türü için özel belge listeleri sunarak eksiksiz başvuru yapmanızı sağlar.",
    },
    {
      question: "Vize başvurusu reddedilirse ne yapmalıyım?",
      answer:
        "Vize başvurunuz reddedilirse panik yapmayın. Öncelikle red nedenini öğrenmek için konsolosluktan detaylı açıklama isteyin. Yaygın red nedenleri arasında eksik belgeler, yetersiz finansal kanıt, yanlış doldurulmuş başvuru formu veya şüpheli seyahat amacı bulunur. Red nedenlerini giderdikten sonra yeniden başvurabilirsiniz. Vizepedia, red nedenlerini anlama ve düzeltme konusunda size rehberlik eder.",
    },
  ];

  // SEO data for the FAQ section
  const seoData = {
    title: "Sıkça Sorulan Sorular – Vizepedia",
    description:
      "Vize başvuruları hakkında en sık sorulan sorular ve cevapları. Schengen, Amerika, İngiltere vizesi ve daha fazlası için kapsamlı FAQ bölümü.",
    keywords: [
      "vize soruları",
      "vize başvurusu",
      "vize reddi",
      "vize belgeleri",
      "vize süreci",
      "Schengen vizesi",
      "Amerika vizesi",
      "İngiltere vizesi",
      "vize harç ücreti",
      "vize randevu",
      "vize işlem süresi",
      "vize reddedilirse ne yapmalı",
      "Vizepedia FAQ",
    ],
    url: "https://www.vizepedia.com/#faq-section",
    image: "https://www.vizepedia.com/og-image.jpg",
  };

  // Structured data for FAQ page
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // Breadcrumb structured data
  const breadcrumbData = [
    {
      name: "Ana Sayfa",
      url: "https://www.vizepedia.com/",
    },
    {
      name: "Sıkça Sorulan Sorular",
      url: "https://www.vizepedia.com/#faq-section",
    },
  ];

  return (
    <>
      {/* SEO Component with comprehensive optimization */}
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={seoData.url}
        image={seoData.image}
        faqData={faqData}
        breadcrumbs={breadcrumbData}
        openGraphType="website"
        twitterCard="summary_large_image"
      />

      {/* Structured Data as JSON-LD */}
      <JsonLd data={faqStructuredData} />

      <FaqSection id="faq-section">
        <FaqTitle>Sıkça Sorulan Sorular</FaqTitle>
        <FaqSubtitle>Sizler için buradayız!</FaqSubtitle>

        {/* Enhanced FAQ with internal links */}
        <Faq
          title={"Vizepedia ile hangi ülkelerin vize sürecini yönetebilirim?"}
        >
          <p>
            Vizepedia kullanıcıları, platformumuzun rehberliğinde aşağıdaki
            ülkelerin vize başvurularını tamamlayabilir ve bu ülkelerin vize
            işlemlerini gerçekleştirebilirler:
          </p>
          <GroupedCountryList />
          <p>
            Vizepedia, bu ülkelerin vize süreçlerini yönetmekle ilgili tüm
            gerekli bilgileri sunarak kullanıcıların vize başvurularını
            tamamlamalarına yardımcı olur. Hangi belgelerin gerekeceğini, nasıl
            bir başvuru formu doldurulması gerektiğini, ne tür bir vizeye
            ihtiyaç duyulduğunu ve başvuru sürecinin nasıl ilerleyeceğini içeren
            kapsamlı bilgiler sağlarız.
          </p>
          {/* Internal links for SEO */}
          <div style={{ marginTop: "15px" }}>
            <a
              href="/ready-documents/schengen-vizesi"
              style={{
                color: "#00ffa2",
                textDecoration: "none",
                fontWeight: "500",
                marginRight: "15px",
              }}
            >
              Schengen Vizesi →
            </a>
            <a
              href="/ready-documents/amerika-vizesi"
              style={{
                color: "#00ffa2",
                textDecoration: "none",
                fontWeight: "500",
                marginRight: "15px",
              }}
            >
              Amerika Vizesi →
            </a>
            <a
              href="/ready-documents/ingiltere-vizesi"
              style={{
                color: "#00ffa2",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              İngiltere Vizesi →
            </a>
          </div>
        </Faq>

        <Faq
          title={`Vizepedia'nın sunduğu bilgiler için herhangi bir ücret ödemem gerekiyor mu?`}
        >
          <p>
            Hayır, Vizepedia&apos;nın sunduğu bilgiler tamamen ücretsizdir.
            Platformumuz, vize başvuru sürecinde size rehberlik etmek için
            gerekli tüm bilgileri sağlar ve bu hizmetten yararlanmak için
            herhangi bir ücret talep etmez. Amacımız, vize başvurularınızı daha
            kolay ve anlaşılır hale getirmektir.
          </p>
          <p>
            Tüm vize rehberleri, belge listeleri ve başvuru adımları ücretsiz
            olarak erişime açıktır. Özellikle{" "}
            <a
              href="/blog"
              style={{
                color: "#00ffa2",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              blog bölümümüzde
            </a>{" "}
            paylaştığımız detaylı rehberlerle vize süreçlerini adım adım takip
            edebilirsiniz.
          </p>
        </Faq>

        <Faq title={`Vizepedia'nın sunduğu bilgilerin kaynağı nedir?`}>
          <p>
            Vizepedia&apos;nın sunduğu bilgiler, bir dizi resmi ve güvenilir
            kaynaklardan toplanmıştır. Bunlar arasında hükümet web siteleri,
            büyükelçilikler ve konsolosluklar, uluslararası göçmenlik ve vize
            politikaları üzerine resmi yayınlar bulunmaktadır.
          </p>
          <p>
            Bilgiler ayrıca, vize süreçleri ve gereklilikleri konusunda geniş
            bir deneyime sahip olan Vizepedia&apos;ın uzman ekibinin
            derinlemesine araştırmaları ve analizleri ile de desteklenmektedir.
            Bu şekilde, kullanıcılarımıza en doğru ve güncel bilgileri
            sunabilmekteyiz.
          </p>
          {/* Additional internal links */}
          <div style={{ marginTop: "15px" }}>
            <a
              href="/blog/kategori/vize"
              style={{
                color: "#00ffa2",
                textDecoration: "none",
                fontWeight: "500",
                marginRight: "15px",
              }}
            >
              Vize Haberleri →
            </a>
            <a
              href="/blog/kategori/seyahat"
              style={{
                color: "#00ffa2",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Seyahat İpuçları →
            </a>
          </div>
        </Faq>

        {/* New FAQ items with enhanced SEO content */}
        <Faq title={`Vize başvurusu için ne kadar önceden hazırlanmalıyım?`}>
          <p>
            Vize başvurusu için hazırlık süresi ülkeye ve vize türüne göre
            değişmekle birlikte genellikle en az 1-3 ay önceden başlanması
            önerilir. Schengen vizesi için genellikle 15 gün içinde
            sonuçlanırken, Amerika vizesi için 3-5 iş günü sürebilir. Ancak
            yoğun dönemlerde bu süreler uzayabilir.
          </p>
          <p>
            Vizepedia, her ülke için ortalama işlem sürelerini ve en iyi başvuru
            zamanlamasını göstererek zamanında hazırlık yapmanızı sağlar.
            Özellikle yaz aylarında ve tatil sezonlarında başvuruların daha
            yoğun olduğunu göz önünde bulundurun.
          </p>
        </Faq>

        <Faq title={`Vize başvurusu için gerekli belgeler nelerdir?`}>
          <p>
            Vize başvurusu için gereken belgeler ülkeye ve vize türüne göre
            değişir. Genellikle pasaport (son 6 ayda çekilmiş, en az 2 boş
            sayfası olan), biyometrik fotoğraf, başvuru formu, finansal belgeler
            (banka hesap özeti, maaş bordrosu), seyahat sağlık sigortası,
            konaklama rezervasyonu ve uçak biletleri gereklidir.
          </p>
          <p>
            Vizepedia, her ülke ve vize türü için özel belge listeleri sunarak
            eksiksiz başvuru yapmanızı sağlar.{" "}
            <a
              href="/ready-documents"
              style={{
                color: "#00ffa2",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Hazır belgeler bölümümüzde
            </a>{" "}
            tüm detaylı belge listelerini bulabilirsiniz.
          </p>
        </Faq>

        <Faq title={`Vize başvurusu reddedilirse ne yapmalıyım?`}>
          <p>
            Vize başvurunuz reddedilirse panik yapmayın. Öncelikle red nedenini
            öğrenmek için konsolosluktan detaylı açıklama isteyin. Yaygın red
            nedenleri arasında eksik belgeler, yetersiz finansal kanıt, yanlış
            doldurulmuş başvuru formu veya şüpheli seyahat amacı bulunur.
          </p>
          <p>
            Red nedenlerini giderdikten sonra yeniden başvurabilirsiniz.
            Vizepedia, red nedenlerini anlama ve düzeltme konusunda size
            rehberlik eder.{" "}
            <a
              href="/blog/vize-reddi-ne-yapmali"
              style={{
                color: "#00ffa2",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Vize reddi durumunda yapılması gerekenler
            </a>{" "}
            hakkında detaylı rehberimizi okuyabilirsiniz.
          </p>
        </Faq>
      </FaqSection>
    </>
  );
}

export default FaqSectionComponent;

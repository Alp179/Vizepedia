
import { FaqSection, FaqTitle, FaqSubtitle, Faq } from "../ui/FaqComponents";
import GroupedCountryList from "../ui/GroupedCountryList";

function FaqSectionComponent() {
  return (
    <FaqSection id="faq-section">
      <FaqTitle>Sıkça Sorulan Sorular</FaqTitle>
      <FaqSubtitle>Sizler için buradayız!</FaqSubtitle>

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
      </Faq>

      <Faq title={`Vizepedia'nın sunduğu bilgilerin kaynağı nedir?`}>
        <p>
          Vizepedia&apos;nın sunduğu bilgiler, bir dizi resmi ve güvenilir
          kaynaklardan toplanmıştır. Bunlar arasında hükümet web siteleri,
          büyükelçilikler ve konsolosluklar, uluslararası göçmenlik ve vize
          politikaları üzerine resmi yayınlar bulunmaktadır. Bilgiler ayrıca,
          vize süreçleri ve gereklilikleri konusunda geniş bir deneyime sahip
          olan Vizepedia&apos;nın uzman ekibinin derinlemesine araştırmaları
          ve analizleri ile de desteklenmektedir. Bu şekilde,
          kullanıcılarımıza en doğru ve güncel bilgileri sunabilmekteyiz.
        </p>
      </Faq>
    </FaqSection>
  );
}

export default FaqSectionComponent;
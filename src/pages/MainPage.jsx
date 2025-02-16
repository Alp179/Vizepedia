import styled from "styled-components";
import Heading from "../ui/Heading";
import Footer from "../ui/Footer";
import Marquee from "react-fast-marquee";
import MailerLiteForm from "../ui/MailerLiteForm";
import SlideShow from "../ui/SlideShow";
import Faq from "../ui/Faq";
import HeroScrollDemo from "../ui/HeroScrollDemo";

const CountryList = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(240px, 1fr)
  ); /* Ekrana sığacak şekilde sütunları oluştur */
  gap: 20px;
  padding: 10px 0;
  @media (max-width: 850px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  @media (max-width: 470px) {
    gap: 4px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  @media (max-width: 337px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
`;

const CountryItem = styled.div`
  font-size: 20px;
  @media (max-width: 1000px) {
    font-size: 18px;
  }
  @media (max-width: 450px) {
    font-size: 16px;
  }
  color: var(--color-grey-600);
  display: flex;
  align-items: center; /* Nokta ve metnin aynı hizaya gelmesi için */

  &::before {
    content: "•"; /* Madde işareti olarak nokta ekler */
    color: var(--color-grey-600);
    margin-right: 8px; /* Nokta ile metin arasında boşluk */
    font-size: 24px;
  }
`;

const Why = styled.p`
  text-align: center;
  font-size: 40px;
  color: var(--color-grey-904);
  z-index: 3000;
  margin-top: 50px;
  font-weight: bold;
  @media (max-width: 1200px) {
    font-size: 32px;
  }
  @media (max-width: 360px) {
    font-size: 24px;
  }
`;

const WhyCardsContainer = styled.div`
  margin-top: 100px;
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
  @media (max-width: 1225px) {
    flex-wrap: wrap;
    gap: 12px;
  }
  @media (max-width: 732px) {
    flex-flow: column;
    margin-top: 36px;
  }
`;

const BackgroundContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

const WhyCards = styled.div`
  mix-blend-mode: normal;
  background: var(--color-grey-919);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 20px;
  width: 265px;
  box-shadow: 0px 26px 35px 6px rgba(0, 0, 0, 0.2);

  height: 565px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 1225px) {
    width: 360px;
    height: 500px;
  }
  @media (max-width: 360px) {
    width: 100%;
    height: auto;
  }
`;

const WhyCardsHeading = styled.p`
  color: var(--color-grey-904);
  font-size: 24px;
  margin-top: 32px;
  margin-left: 29px;
  font-weight: 600;
  @media (max-width: 732px) {
    font-size: 28px;
  }
  @media (max-width: 360px) {
    font-size: 20px;
  }
`;

const WhyCardsContext = styled.p`
  color: var(--color-grey-904);
  margin-left: 29px;
  margin-right: 20px;
  font-size: 16px;
  line-height: 193%;
  @media (max-width: 732px) {
    font-size: 20px;
  }
  @media (max-width: 360px) {
    font-size: 16px;
  }
`;

const WhyCardsImagesSavings = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  width: 212px;
  height: 212px;
  margin-top: auto;
  margin-left: auto;
  @media (max-width: 732px) {
    height: 35%;
    width: auto;
    align-self: flex-end;
  }
`;

const WhyCardsImagesWatch = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  width: 212px;
  height: 212px;
  margin-top: auto;
  margin-left: auto;
  @media (max-width: 732px) {
    margin: -80px 10px 50px auto;
  }
  @media (max-width: 360px) {
    margin: auto 20px 20px auto;
  }
`;

const WhyCardsImagesHappy = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  width: 212px;
  height: 212px;
  margin-top: auto;
  margin-left: auto;
  @media (max-width: 732px) {
    height: 30%;
    width: auto;
    margin: 0;
    align-self: flex-end;
  }
`;

const WhyCardsImagesPhone = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  width: 212px;
  height: 212px;
  margin-top: auto;
  margin-left: auto;
  @media (max-width: 732px) {
    height: 30%;
    width: auto;
    margin: -30px 10px 50px auto;
  }
`;

const WhyCardsContainer2 = styled.div`
  margin-top: 32px;
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
  @media (max-width: 1200px) {
    margin-top: 12px;
    gap: 12px;
  }
  @media (max-width: 732px) {
    flex-flow: column;
  }
`;

const WhyCards2 = styled.div`
  background: var(--color-grey-919);
  box-shadow: 0px 26px 35px 6px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  height: 265px;
  width: 565px;
  display: flex;
  gap: 22px;
  @media (max-width: 1225px) {
    width: 360px;
    height: 500px;
    flex-flow: column;
  }
  @media (max-width: 360px) {
    width: 100%;
    height: auto;
  }
`;

const WhyCards2Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const WhyCardsHeading2 = styled.p`
  color: var(--color-grey-904);
  font-size: 24px;
  margin-top: 39px;
  margin-left: 29px;
  font-weight: 600;
  @media (max-width: 732px) {
    font-size: 28px;
  }
  @media (max-width: 360px) {
    font-size: 20px;
  }
`;

const WhyCardsContext2 = styled.p`
  color: var(--color-grey-904);
  margin-left: 29px;
  margin-right: 20px;
  font-size: 16px;
  line-height: 193%;
  @media (max-width: 732px) {
    font-size: 20px;
  }
  @media (max-width: 360px) {
    font-size: 16px;
  }
`;

const WhyCards2DocImage = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  width: 142px;
  height: 185px;
  margin: auto 10px auto 0;
  @media (max-width: 1225px) {
    margin: auto 10px 10px auto;
  }
  @media (max-width: 732px) {
    margin-top: -10px;
  }
`;

const WhyCards2PlaneImage = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  margin: auto 10px auto 0;
  width: 203px;
  height: 115px;
  @media (max-width: 1225px) {
    margin: auto 10px 10px auto;
  }
  @media (max-width: 732px) {
    margin: 50px 20px 10px auto;
  }
`;

const RahatProfesyonelContainer = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
  @media (max-width: 800px) {
    gap: 40px;
  }
  @media (max-width: 580px) {
    gap: 8px;
  }
`;

const RahatProfesyonelImage = styled.div`
  width: 300px;
  height: 600px;
  background: red;
  @media (max-width: 732px) {
    width: 175px;
    height: 350px;
  }
  @media (max-width: 410px) {
    width: 150px;
    height: 300px;
  }
  @media (max-width: 350px) {
    width: 120px;
    height: 240px;
  }
`;

const RahatProfesyonelMobileHeading = styled.p`
  @media (min-width: 500px) {
    display: none !important;
  }
  color: var(--color-grey-904);
  font-weight: 600;
  text-align: center;
  font-size: 36px;
  margin-top: 70px;
  margin-bottom: -70px;
  display: block;
  @media (max-width: 370px) {
    font-size: 32px;
  }
  @media (max-width: 360px) {
    font-size: 28px;
  }
`;

const FaqSection = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 100px;
  max-width: 1200px;
  width: 90%;
  @media (max-width: 450px) {
    margin-top: 150px;
  }
`;

const FaqTitle = styled.p`
  font-size: 40px;
  font-weight: bold;
  color: var(--color-grey-600);
  text-align: center;
  @media (max-width: 1000px) {
    font-size: 32px;
  }
  @media (max-width: 450px) {
    font-size: 28px;
  }
`;

const FaqSmallTitle = styled.p`
  margin-top: 20px;
  margin-bottom: 50px;
  font-size: 24px;
  color: var(--color-grey-600);
  text-align: center;
  @media (max-width: 1000px) {
    font-size: 20px;
  }
  @media (max-width: 450px) {
    font-size: 18px;
    margin-bottom: 30px;
  }
`;

const BackgroundContainer2 = styled.div`
  position: absolute;
  display: flex;
  height: 1100px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

const Background1 = styled.div`
  margin-top: -600px;
  width: 50%;
  height: 100%;
  background: var(--color-grey-917);
`;

const Background2 = styled.div`
  margin-top: -600px;
  background: var(--color-grey-918);
  transform: scaleX(-1);
  width: 50%;
  height: 100%;
`;


function MainPage() {
  
  const countries = [
    "Almanya",
    "Avusturya",
    "Belçika",
    "Çek Cumhuriyeti",
    "Danimarka",
    "Estonya",
    "Finlandiya",
    "Fransa",
    "Yunanistan",
    "Hollanda",
    "Hırvatistan",
    "İtalya",
    "Letonya",
    "Litvanya",
    "Lüksemburg",
    "Malta",
    "Polonya",
    "Portekiz",
    "Slovakya",
    "Slovenya",
    "İspanya",
    "İsveç",
    "İsviçre",
    "Norveç",
    "İzlanda",
    "Lihtenştayn",
    "Çin",
    "Amerika Birleşik Devletleri",
    "Birleşik Arap Emirlikleri",
    "Rusya",
    "Birleşik Krallık",
    "Kanada",
  ];

  
  return (
    <>
      <HeroScrollDemo />
      
      <BackgroundContainer>
        <BackgroundContainer2>
          <Background1 />
          <Background2 />
        </BackgroundContainer2>
        <Why>Neden Vizepedia</Why>
        <WhyCardsContainer>
          <WhyCards>
            <WhyCardsHeading>Tamamen Ücretsiz</WhyCardsHeading>
            <WhyCardsContext>
              Vizepedia, size ücretsiz bir hizmet sunarak, vize başvuru
              sürecindeki danışmanlık giderlerinden tasarruf etmenize yardımcı
              olur ve seyahat bütçenizi optimize eder.
            </WhyCardsContext>
            <WhyCardsImagesSavings
              src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-savings.png?t=2024-10-01T13%3A58%3A51.889Z"
              alt="bonbon-savings"
            />
          </WhyCards>
          <WhyCards>
            <WhyCardsHeading>Zaman Tasarrufu</WhyCardsHeading>
            <WhyCardsContext>
              Vizepedia, vize başvuru sürecine ilişkin bilgilere kolay ve hızlı
              bir şekilde erişimenizi sağlayarak, süreç yönetimini daha verimli
              hale getirir. Böylece, süreci daha rahat ve keyifli bir deneyime
              dönüştürebilirsiniz.
            </WhyCardsContext>
            <WhyCardsImagesWatch
              src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-watch.png?t=2024-10-01T13%3A59%3A14.116Z"
              alt="bonbon-watch"
            />
          </WhyCards>
          <WhyCards>
            <WhyCardsHeading>Ferah Arayüz</WhyCardsHeading>
            <WhyCardsContext>
              Vizepedia, kullanıcıların ihtiyaçlarına göre tasarlanmış kullanıcı
              dostu bir arayüz sunarak, vize başvuru süreci boyunca rahat ve
              sorunsuz bir deneyim yaşamanıza yardımcı olur.
            </WhyCardsContext>
            <WhyCardsImagesHappy
              src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-happy.png?t=2024-10-01T13%3A59%3A27.902Z"
              alt="bonbon-happy"
            />
          </WhyCards>
          <WhyCards>
            <WhyCardsHeading>Güncel ve Doğru</WhyCardsHeading>
            <WhyCardsContext>
              Vizepedia, vize başvuru süreçlerindeki değişiklikleri ve
              güncellemeleri yakından takip ederek, size her zaman en güncel ve
              doğru bilgileri sunar. Bu sayede, güncel bilgilere güvenerek
              başvurularınızı gerçekleştirin.
            </WhyCardsContext>
            <WhyCardsImagesPhone
              src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-phone.png?t=2024-10-01T14%3A00%3A19.108Z"
              alt="bonbon-phone"
            />
          </WhyCards>
        </WhyCardsContainer>
      </BackgroundContainer>
      <WhyCardsContainer2>
        <WhyCards2>
          <WhyCards2Inner>
            <WhyCardsHeading2>En Uygun Belgeler</WhyCardsHeading2>
            <WhyCardsContext2>
              Vizepedia, seyahat planlarınıza özel olarak hazırlanmış belge
              listeleriyle, vize başvuru sürecinizi profesyonel ve sistematik
              bir şekilde yönetmenize imkan tanır.
            </WhyCardsContext2>
          </WhyCards2Inner>
          <WhyCards2DocImage
            src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-doc.png?t=2024-10-01T14%3A00%3A36.059Z"
            alt="bonbon-doc"
          />
        </WhyCards2>
        <WhyCards2>
          <WhyCards2Inner>
            <WhyCardsHeading2>Süreç Takibi</WhyCardsHeading2>
            <WhyCardsContext2>
              Vizepedia, vize başvuru sürecinde her adımda size rehberlik eder
              ve sürecinizi kolayca takip etmenize imkan tanır. Kontrol hep
              sizde!
            </WhyCardsContext2>
          </WhyCards2Inner>
          <WhyCards2PlaneImage
            src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-flight.png?t=2024-10-01T14%3A00%3A47.915Z"
            alt="bonbon-flight"
          />
        </WhyCards2>
      </WhyCardsContainer2>
      <section
        style={{
          width: "100%",
          marginTop: "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Heading as="h11">38 Ülke</Heading>
        <Marquee>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/us.svg"
              alt="Amerika Birleşik Devletleri"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/gb.svg"
              alt="Birleşik Krallık"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/ae.svg"
              alt="Birleşik Arap Emirlikleri"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/gr.svg"
              alt="Yunanistan"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/nl.svg"
              alt="Hollanda"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/it.svg"
              alt="İtalya"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/ca.svg"
              alt="Kanada"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/ch.svg"
              alt="İsviçre"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/bg.svg"
              alt="Bulgaristan"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/be.svg"
              alt="Belçika"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/cz.svg"
              alt="Çekya"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/dk.svg"
              alt="Danimarka"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/de.svg"
              alt="Almanya"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/ee.svg"
              alt="Estonya"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/ie.svg"
              alt="İrlanda"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/es.svg"
              alt="İspanya"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/fr.svg"
              alt="Fransa"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/lv.svg"
              alt="Litvanya"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/hu.svg"
              alt="Macaristan"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/fi.svg"
              alt="Finlandiya"
            />
          </div>
          <div className="slide">
            <img
              src="https://github.com/HatScripts/circle-flags/raw/gh-pages/flags/se.svg"
              alt="İsveç"
            />
          </div>
        </Marquee>
        <Heading as="h11">Tek Rehber</Heading>
      </section>
      <RahatProfesyonelMobileHeading>Çok Rahat</RahatProfesyonelMobileHeading>
      <RahatProfesyonelContainer>
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          <Heading as="h15">Çok Rahat</Heading>
          <Heading as="h13">
            Vize başvuru sürecinin karmaşıklığını ve bilgi kirliliğinin negatif
            hissiyatını unutun ve her adımda size sunulan rehberlikle rahat,
            güvenli ve başarıya odaklı bir deneyimi yaşayın!
          </Heading>
        </div>
        <RahatProfesyonelImage>s</RahatProfesyonelImage>
      </RahatProfesyonelContainer>
      <RahatProfesyonelMobileHeading>
        Çok Profesyonel
      </RahatProfesyonelMobileHeading>
      <RahatProfesyonelContainer>
        <RahatProfesyonelImage>s</RahatProfesyonelImage>
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          <Heading as="h15">Çok Profesyonel</Heading>
          <Heading as="h13">
            Vizepedia, alanında uzman ekibi ve profesyonel yaklaşımıyla vize
            başvurularınızda güvenilir ve etkili bir çözüm ortağı olarak
            yanınızda!
          </Heading>
        </div>
      </RahatProfesyonelContainer>

      <SlideShow />

      <FaqSection id="faq-section">
        <FaqTitle>Sıkça Sorulan Sorular</FaqTitle>
        <FaqSmallTitle>Sizler için buradayız!</FaqSmallTitle>

        <Faq
          title={"Vizepedia ile hangi ülkelerin vize sürecini yönetebilirim?"}
        >
          <p>
            Vizepedia kullanıcıları, platformumuzun rehberliğinde aşağıdaki
            ülkelerin vize başvurularını tamamlayabilir ve bu ülkelerin vize
            işlemlerini gerçekleştirebilirler:
          </p>
          <CountryList>
            {countries.map((country, index) => (
              <CountryItem key={index}>{country}</CountryItem>
            ))}
          </CountryList>
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

      <MailerLiteForm />

      <Footer />
    </>
  );
}

export default MainPage;

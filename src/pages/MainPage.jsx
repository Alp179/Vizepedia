// MainPage.jsx içerisindeki import düzeltmesi
import styled from "styled-components";
import Heading from "../ui/Heading";
import Footer from "../ui/Footer";
import Marquee from "react-fast-marquee";
import MailerLiteForm from "../ui/MailerLiteForm";
import SlideShow from "../ui/SlideShow";
import HeroScrollDemo from "../ui/HeroScrollDemo";
import { FaqSection, FaqTitle, FaqSubtitle, Faq } from "../ui/FaqComponents";
import GroupedCountryList from "../ui/GroupedCountryList"; // CountryGroups yerine GroupedCountryList
import {
  FeatureTitle,
  FeaturesContainer,
  FeatureCard,
  CardTitle,
  CardContent,
  CardImage,
  SecondaryFeaturesContainer,
  HorizontalFeatureCard,
  HorizontalCardContent,
  HorizontalCardImageWrapper,
  HorizontalCardImage,
} from "../ui/FeatureComponents";

const BackgroundContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
`;

const BackgroundContainer2 = styled.div`
  position: absolute;
  margin-top: 100px;
  display: flex;
  height: 1100px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  z-index: 1;
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

function MainPage() {
  // Features kartları için veriler
  const featuresData = [
    {
      title: "Tamamen Ücretsiz",
      content:
        "Vizepedia, size ücretsiz bir hizmet sunarak, vize başvuru sürecindeki danışmanlık giderlerinden tasarruf etmenize yardımcı olur ve seyahat bütçenizi optimize eder.",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-savings.png?t=2024-10-01T13%3A58%3A51.889Z",
      alt: "bonbon-savings",
    },
    {
      title: "Zaman Tasarrufu",
      content:
        "Vizepedia, vize başvuru sürecine ilişkin bilgilere kolay ve hızlı bir şekilde erişimenizi sağlayarak, süreç yönetimini daha verimli hale getirir. Böylece, süreci daha rahat ve keyifli bir deneyime dönüştürebilirsiniz.",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-watch.png?t=2024-10-01T13%3A59%3A14.116Z",
      alt: "bonbon-watch",
    },
    {
      title: "Ferah Arayüz",
      content:
        "Vizepedia, kullanıcıların ihtiyaçlarına göre tasarlanmış kullanıcı dostu bir arayüz sunarak, vize başvuru süreci boyunca rahat ve sorunsuz bir deneyim yaşamanıza yardımcı olur.",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-happy.png?t=2024-10-01T13%3A59%3A27.902Z",
      alt: "bonbon-happy",
    },
    {
      title: "Güncel ve Doğru",
      content:
        "Vizepedia, vize başvuru süreçlerindeki değişiklikleri ve güncellemeleri yakından takip ederek, size her zaman en güncel ve doğru bilgileri sunar. Bu sayede, güncel bilgilere güvenerek başvurularınızı gerçekleştirin.",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-phone.png?t=2024-10-01T14%3A00%3A19.108Z",
      alt: "bonbon-phone",
    },
  ];

  // İkincil özellikler için veriler
  const secondaryFeaturesData = [
    {
      title: "En Uygun Belgeler",
      content:
        "Vizepedia, seyahat planlarınıza özel olarak hazırlanmış belge listeleriyle, vize başvuru sürecinizi profesyonel ve sistematik bir şekilde yönetmenize imkan tanır.",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-doc.png?t=2024-10-01T14%3A00%3A36.059Z",
      alt: "bonbon-doc",
    },
    {
      title: "Süreç Takibi",
      content:
        "Vizepedia, vize başvuru sürecinde her adımda size rehberlik eder ve sürecinizi kolayca takip etmenize imkan tanır. Kontrol hep sizde!",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/bucketto/bonbon-flight.png?t=2024-10-01T14%3A00%3A47.915Z",
      alt: "bonbon-flight",
    },
  ];

  return (
    <>
      <HeroScrollDemo />

      <BackgroundContainer>
        <BackgroundContainer2>
          <Background1 />
          <Background2 />
        </BackgroundContainer2>

        <FeatureTitle>Neden Vizepedia</FeatureTitle>

        <FeaturesContainer>
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} index={index}>
              <CardTitle>{feature.title}</CardTitle>
              <CardContent>{feature.content}</CardContent>
              <CardImage src={feature.image} alt={feature.alt} />
            </FeatureCard>
          ))}
        </FeaturesContainer>

        <SecondaryFeaturesContainer>
          {secondaryFeaturesData.map((feature, index) => (
            <HorizontalFeatureCard key={index} index={index}>
              <HorizontalCardContent>
                <CardTitle>{feature.title}</CardTitle>
                <CardContent>{feature.content}</CardContent>
              </HorizontalCardContent>
              <HorizontalCardImageWrapper>
                <HorizontalCardImage src={feature.image} alt={feature.alt} />
              </HorizontalCardImageWrapper>
            </HorizontalFeatureCard>
          ))}
        </SecondaryFeaturesContainer>
      </BackgroundContainer>

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

      <MailerLiteForm />

      <Footer />
    </>
  );
}

export default MainPage;

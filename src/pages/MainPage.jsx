import styled from "styled-components";
import Heading from "../ui/Heading";
import Logo from "../ui/Logo";
import DarkModeToggle from "../ui/DarkModeToggle";
import Button from "../ui/Button";

const Navbar = styled.div`
  width: 80%;
  margin: 0 auto 0 auto;
  display: flex;
  gap: 52px;
  justify-content: space-around;
  align-items: center;
  @media (max-width: 1200px) {
    gap: 32px;
  }
  @media (max-width: 360px) {
    gap: 16px;
  }
`;

const BigTexts = styled.div`
  justify-content: center;
  align-items: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 100px;
  @media (max-width: 732px) {
    margin: 48px auto 0 auto;
    width: 95%;
  }
`;

const HeroImage = styled.img`
  z-index: 1;
  @media (max-width: 1200px) {
    width: 90%;
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

const WhyCards = styled.div`
  background: var(--color-grey-905);
  border-radius: 20px;
  width: 265px;
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
  background: var(--color-grey-905);
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

function MainPage() {
  return (
    <>
      <Navbar>
        <Logo variant="mainpage" />
        <Heading as="h10">Hakkımızda</Heading>
        <Heading as="h10">SSS</Heading>
        <Logo variant="mainpage2" />
        <div style={{ display: "flex", gap: "16px", marginLeft: "auto" }}>
          <Button variation="mainpage2">Oturum Aç</Button>
          <Button variation="mainpage">Başlayalım</Button>
          <DarkModeToggle />
        </div>
      </Navbar>
      <BigTexts>
        <Heading as="h11">
          Düşlerinizdeki Seyahate Doğru İlk Adımı Vizepedia ile Atın!
        </Heading>
        <Heading as="h12">
          Size özel hazırlanmış belge listesi ve adım adım rehberle başvuru
          sürecinizi kolayca yönetin ve dünyayı keşfetmeye başlayın!
        </Heading>
        <HeroImage src="../public/heroimage.png" />
      </BigTexts>
      <Why>Neden Vizepedia</Why>
      <WhyCardsContainer>
        <WhyCards>
          <WhyCardsHeading>Tamamen Ücretsiz</WhyCardsHeading>
          <WhyCardsContext>
            Vizepedia, size ücretsiz bir hizmet sunarak, vize başvuru
            sürecindeki danışmanlık giderlerinden tasarruf etmenize yardımcı
            olur ve seyahat bütçenizi optimize eder.
          </WhyCardsContext>
          <WhyCardsImagesSavings src="../public/bonbon-savings.png" />
        </WhyCards>
        <WhyCards>
          <WhyCardsHeading>Zaman Tasarrufu</WhyCardsHeading>
          <WhyCardsContext>
            Vizepedia, vize başvuru sürecine ilişkin bilgilere kolay ve hızlı
            bir şekilde erişimenizi sağlayarak, süreç yönetimini daha verimli
            hale getirir. Böylece, süreci daha rahat ve keyifli bir deneyime
            dönüştürebilirsiniz.
          </WhyCardsContext>
          <WhyCardsImagesWatch src="../public/bonbon-watch.png" />
        </WhyCards>
        <WhyCards>
          <WhyCardsHeading>Ferah Arayüz</WhyCardsHeading>
          <WhyCardsContext>
            Vizepedia, kullanıcıların ihtiyaçlarına göre tasarlanmış kullanıcı
            dostu bir arayüz sunarak, vize başvuru süreci boyunca rahat ve
            sorunsuz bir deneyim yaşamanıza yardımcı olur.
          </WhyCardsContext>
          <WhyCardsImagesHappy src="../public/bonbon-happy.png" />
        </WhyCards>
        <WhyCards>
          <WhyCardsHeading>Güncel ve Doğru</WhyCardsHeading>
          <WhyCardsContext>
            Vizepedia, vize başvuru süreçlerindeki değişiklikleri ve
            güncellemeleri yakından takip ederek, size her zaman en güncel ve
            doğru bilgileri sunar. Bu sayede, güncel bilgilere güvenerek
            başvurularınızı gerçekleştirin.
          </WhyCardsContext>
          <WhyCardsImagesPhone src="../public/bonbon-phone.png" />
        </WhyCards>
      </WhyCardsContainer>
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
          <WhyCards2DocImage src="../public/bonbon-doc.png" />
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
          <WhyCards2PlaneImage src="../public/bonbon-plane.png" />
        </WhyCards2>
      </WhyCardsContainer2>
    </>
  );
}

export default MainPage;

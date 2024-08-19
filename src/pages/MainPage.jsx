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
`;

const BigTexts = styled.div`
  justify-content: center;
  align-items: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 100px;
`;

const HeroImage = styled.img`
  z-index: 1;
`;

const Why = styled.p`
  text-align: center;
  font-size: 40px;
  color: var(--color-grey-904);
  z-index: 3000;
  margin-top: 50px;
  font-weight: bold;
`;

const WhyCardsContainer = styled.div`
  margin-top: 100px;
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
`;

const WhyCards = styled.div`
  background: var(--color-grey-905);
  border-radius: 20px;
  width: 265px;
  height: 565px;
`;

function MainPage() {
  return (
    <>
      <Navbar>
        <Logo variant="mainpage" />
        <Heading as="h10">Hakkımızda</Heading>
        <Heading as="h10">SSS</Heading>
        <Logo variant="mainpage" />
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
        <WhyCards>aaa</WhyCards>
        <WhyCards>bb</WhyCards>
        <WhyCards>ccc</WhyCards>
        <WhyCards>ddd</WhyCards>
      </WhyCardsContainer>
    </>
  );
}

export default MainPage;

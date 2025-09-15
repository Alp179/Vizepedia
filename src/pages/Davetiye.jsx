import { useState } from "react";
import MainPageHeader from "../ui/MainPageHeader";
import styled from "styled-components";
import Footer from "../ui/Footer";
import SlideShow from "../ui/SlideShow";
import VisaInvitationGenerator from "../ui/VisaInvitationGenerator";
import AnimatedFlag from "../ui/AnimatedFlag";
import SEO from "../components/SEO";

const FlagContainer = styled.div`
  position: absolute !important;
  transform: translateX(0);
  z-index: 1;
  right: 0;
`;

const Fullpage = styled.div`
  margin: 0 0;
  min-height: 100vh;
  overflow: hidden;
  height: 100%;
  max-width: 100vw;
  background: var(--color-grey-1);
  position: relative; /* AnimatedFlag için gerekli */
`;

const DavetiyeContainer = styled.div`
  padding-top: 120px;
  margin-bottom: 150px;
  z-index: 3;
  @media (max-width: 500px) {
    padding-top: 85px;
  }
`;

function Davetiye() {
  const [selectedCountryCode, setSelectedCountryCode] = useState("gb"); // Varsayılan olarak İngiltere

  // Ülke kodunu belirlemek için mapping objesi
  const countryToCode = {
    "United Kingdom": "gb",
    Austria: "at",
    Belgium: "be",
    Croatia: "hr",
    "Czech Republic": "cz",
    Denmark: "dk",
    Estonia: "ee",
    Finland: "fi",
    France: "fr",
    Germany: "de",
    Greece: "gr",
    Hungary: "hu",
    Iceland: "is",
    Italy: "it",
    Latvia: "lv",
    Liechtenstein: "li",
    Lithuania: "lt",
    Luxembourg: "lu",
    Malta: "mt",
    Netherlands: "nl",
    Norway: "no",
    Poland: "pl",
    Portugal: "pt",
    Slovakia: "sk",
    Slovenia: "si",
    Spain: "es",
    Sweden: "se",
    Switzerland: "ch",
  };

  // VisaInvitationGenerator'dan seçilen ülkeyi almak için callback fonksiyon
  const handleCountryChange = (selectedCountry) => {
    const code = countryToCode[selectedCountry] || "gb";
    setSelectedCountryCode(code);
  };

  return (
    <>
      <SEO
        title="Vize Davetiyesi Oluştur – Vizepedia"
        description="Vize davetiyesi oluşturma aracımız ile davetiye metninizi adım adım hazırlayın. Seyahat planlarınıza uygun ve resmi formatta davetiye oluşturun."
        keywords="vize davetiyesi, davetiye oluşturma, vize başvurusu, Vizepedia"
        url="https://www.vizepedia.com/davetiye-olustur"
      />
      <Fullpage>
        {/* AnimatedFlag'i en üstte yerleştir */}
        <FlagContainer>
          <AnimatedFlag countryCode={selectedCountryCode} />
        </FlagContainer>
        <MainPageHeader />
        <DavetiyeContainer>
          <VisaInvitationGenerator onCountryChange={handleCountryChange} />
        </DavetiyeContainer>
        <SlideShow />
        <Footer />
      </Fullpage>
    </>
  );
}

export default Davetiye;

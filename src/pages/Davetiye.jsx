import { useState } from "react";
import MainPageHeader from "../ui/MainPageHeader";
import styled from "styled-components";
import Footer from "../ui/Footer";
import SlideShow from "../ui/SlideShow";
import VisaInvitationGenerator from "../ui/VisaInvitationGenerator";
import AnimatedFlag from "../ui/AnimatedFlag";

const FlagContainer = styled.div`
z-index: -1!important;

`;

const Fullpage = styled.div`
  margin: 0 0;
  min-height: 100vh;
  height: 100%;
  max-width: 100vw;
  background: var(--color-grey-1);
  position: relative; /* AnimatedFlag için gerekli */
`;

const DavetiyeContainer = styled.div`
  padding-top: 120px;
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
  );
}

export default Davetiye;

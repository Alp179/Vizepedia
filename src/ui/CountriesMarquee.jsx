
import styled from "styled-components";
import Marquee from "react-fast-marquee";
import Heading from "../ui/Heading";

const MarqueeContainer = styled.section`
  width: 100%;
  margin-top: 80px;
  margin-bottom: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function CountriesMarquee() {
  return (
    <MarqueeContainer>
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
    </MarqueeContainer>
  );
}

export default CountriesMarquee;
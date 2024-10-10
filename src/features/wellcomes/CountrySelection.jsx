/* eslint-disable react/prop-types */
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useCountries } from "./useCountries";
import Spinner from "../../ui/Spinner";
import ReactDOM from 'react-dom';

// Stil tanımlamaları
const StyledSelectContainer = styled.div`
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 150px;
  height: 150px;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5); /* Buzlu cam efekti */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  position: relative;
  border: ${({ isSelected }) => (isSelected ? "2px solid #3498db" : "none")};
  transition: background-color 0.3s ease;

  @media (max-width: 450px) {
    width: 135px;
    height: 135px;
  }

  @media (max-width: 400px) {
    font-size: 15px;
  }

  @media (max-width: 370px) {
    width: 125px;
    height: 125px;
    font-size: 14px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.7); /* Hover durumu için daha açık renk */
  }

  &:active {
    transform: scale(0.95); /* Active durumu için küçültme efekti */
  }

  img {
    width: 80px;
    height: 50px;
    margin-bottom: 10px;
  }
`;

const RadioLabel = styled.label`
  line-height: 22px;
  z-index: -0;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.5); /* Buzlu cam efekti */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  position: relative;
  border: ${({ checked }) => (checked ? "2px solid #3498db" : "none")};
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.7); /* Hover durumu için daha açık renk */
  }

  &:active {
    transform: scale(0.95); /* Active durumu için küçültme efekti */
  }

  @media (max-width: 450px) {
    font-size: 16px;
    width: 135px;
    height: 135px;
  }

  @media (max-width: 400px) {
    font-size: 15px;
  }

  @media (max-width: 370px) {
    width: 125px;
    height: 125px;
    font-size: 14px;
  }

  input[type="radio"] {
    display: none;
  }

  img {
    width: 80px; /* Bayrak boyutlarını büyütüyoruz */
    height: 50px;
    margin-bottom: 10px;
  }
`;

const Container = styled.div`
  position: relative;
  max-height: calc(100vh - 40rem);
  overflow: auto;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-radius: 16px;
  gap: 20px;
  max-width: 900px;
  position: relative;
  background-color: ${({ hasOverflow }) =>
    hasOverflow ? "rgba(255, 255, 255, 0.37)" : "transparent"};
  -webkit-backdrop-filter: ${({ hasOverflow }) =>
    hasOverflow ? "blur(6.3px)" : "none"};
  border: ${({ hasOverflow }) =>
    hasOverflow ? "1px solid rgba(255, 255, 255, 0.52)" : "none"};

  @media (max-width: 768px) {
    justify-content: space-around;
  }
  @media (max-width: 450px) {
    gap: 0;
  }
`;

const DropdownContainer = styled.div`
  z-index: 9999;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DropdownButton = styled.button`
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  line-height: 10px;
  font-size: 18px;
  @media (max-width: 450px) {
    font-size: 16px;
  }
  @media (max-width: 400px) {
    font-size: 15px;
  }
  @media (max-width: 370px) {
    font-size: 14px;
  }

  .chevron {
    margin-left: 5px;
  }

  &:hover {
    color: #3498db; /* Hover durumunda yazı rengi değişir */
  }

  &:active {
    transform: scale(0.95); /* Active durumu için küçültme efekti */
  }
`;

const DropdownMenu = styled(motion.ul)`
  position: absolute; /* Konumu sabitle */
  top: 50%; /* Butonun hemen altında açılmasını sağlar */
  left: 50%;
  transform: translateX(-50%); /* Ortalar */
  border: 1px solid white;
  background: var(--color-grey-51);
  border-radius: 10px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 9999; /* Üstte görünmesini sağlar */
  width: 170px;
  max-height: 300px; /* Maksimum yükseklik */
  overflow-y: auto; /* İçerik fazla olursa kaydırma çubuğu ekler */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-54);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
  }
`;

const DropdownItem = styled(motion.li)`
  list-style: none;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  &:hover {
    background-color: rgba(100, 100, 255, 0.1); /* Light indigo background */
  }

  &:active {
    transform: scale(0.95); /* Active durumu için küçültme efekti */
  }
`;

const chevronVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const menuVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
  },
  closed: {
    opacity: 0,
    y: -10,
  },
};

const CountrySelection = ({ selectedCountry, onCountryChange }) => {
  const { isLoading, schCounData, mainCounData } = useCountries();
  const [flags, setFlags] = useState({});
  const [schengenFlag, setSchengenFlag] = useState(
    "https://flagcdn.com/eu.svg"
  );
  const [schengenSelected, setSchengenSelected] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null); // Button için ref ekledik

  useEffect(() => {
    if (!schCounData || !mainCounData) return;

    const fetchFlags = async () => {
      const flagUrls = {};
      for (let country of [...schCounData, ...mainCounData]) {
        const countryName = country.schCountryNames || country.mainCountryNames;
        const code = countryToCode[countryName];
        if (code) {
          flagUrls[countryName] = `https://flagcdn.com/${code}.svg`;
        }
      }
      setFlags(flagUrls);
    };

    fetchFlags();
  }, [schCounData, mainCounData]);

  useEffect(() => {
    if (
      schCounData &&
      schCounData.some((country) => country.schCountryNames === selectedCountry)
    ) {
      setSchengenFlag(flags[selectedCountry]);
      setSchengenSelected(true);
    } else {
      setSchengenFlag("https://flagcdn.com/eu.svg");
      setSchengenSelected(false);
    }
  }, [selectedCountry, flags, schCounData]);

  const handleChange = (value) => {
    onCountryChange(value);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    if (!dropdownOpen && dropdownButtonRef.current) {
      const buttonRect = dropdownButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY,
        left: buttonRect.left + window.scrollX,
        width: buttonRect.width,
      });
    }
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !dropdownButtonRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        setHasOverflow(scrollHeight > clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container ref={containerRef} hasOverflow={hasOverflow}>
      <DropdownContainer ref={dropdownButtonRef}>
        <StyledSelectContainer
          isSelected={schengenSelected}
          onClick={toggleDropdown}
        >
          <DropdownButton>
            <img src={schengenFlag} alt="Schengen flag" />
            <div style={{ marginTop: "px", alignItems: "center" }}>
              <span>
                {schengenSelected ? selectedCountry : "Schengen Ülkeleri"}
              </span>
              <motion.span
                className="chevron"
                animate={dropdownOpen ? "open" : "closed"}
                variants={chevronVariants}
              >
                <FiChevronDown />
              </motion.span>
            </div>
          </DropdownButton>
          {dropdownOpen &&
            ReactDOM.createPortal(
              <DropdownMenu
                ref={dropdownRef}
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                style={{
                  position: "absolute",
                  top: `calc(${dropdownPosition.top}px - 10px)`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                }}
              >
                {schCounData.map((country) => (
                  <DropdownItem
                    key={country.id}
                    variants={itemVariants}
                    onClick={() => handleChange(country.schCountryNames)}
                  >
                    {country.schCountryNames}
                  </DropdownItem>
                ))}
              </DropdownMenu>,
              document.body
            )}
        </StyledSelectContainer>
      </DropdownContainer>

      {mainCounData.map((country) => {
        const countryName = country.mainCountryNames;
        return (
          <RadioLabel
            key={country.id}
            checked={selectedCountry === countryName}
          >
            <input
              type="radio"
              name={countryName}
              value={countryName}
              checked={selectedCountry === countryName}
              onChange={() => handleChange(countryName)}
            />
            {flags[countryName] && (
              <img src={flags[countryName]} alt={`${countryName} flag`} />
            )}
            {countryName}
          </RadioLabel>
        );
      })}
    </Container>
  );
};


// Ülke adlarının bayrak kodlarına dönüştürülmesi
const countryToCode = {
  Almanya: "de",
  Avusturya: "at",
  Belçika: "be",
  Çekya: "cz",
  Danimarka: "dk",
  Estonya: "ee",
  Finlandiya: "fi",
  Fransa: "fr",
  Yunanistan: "gr",
  Macaristan: "hu",
  İzlanda: "is",
  İtalya: "it",
  Letonya: "lv",
  Litvanya: "lt",
  Lüksemburg: "lu",
  Malta: "mt",
  Hollanda: "nl",
  Norveç: "no",
  Polonya: "pl",
  Portekiz: "pt",
  Slovakya: "sk",
  Slovenya: "si",
  İspanya: "es",
  İsveç: "se",
  İsviçre: "ch",
  Lihtenştayn: "li",
  Rusya: "ru",
  ABD: "us",
  Çin: "cn",
  BAE: "ae",
  Avustralya: "au",
  "Birleşik Krallık": "gb",
  Hırvatistan: "hr",
};

export default CountrySelection;

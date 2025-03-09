/* eslint-disable react/prop-types */
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { usePurpose } from "./usePurpose";

// Stil tanımlamaları
const StyledSelectContainer = styled.div`
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

  &:hover {
    background: rgba(255, 255, 255, 0.7); /* Hover durumu için daha açık renk */
  }

  @media (max-width: 450px) {
    width: 135px;
    height: 135px;
    font-size: 18px;
  }

  @media (max-width: 400px) {
    font-size: 18px;
  }

  @media (max-width: 370px) {
    width: 125px;
    height: 125px;
    font-size: 14px;
  }

  &:active {
    transform: scale(0.95); /* Active durumu için küçültme efekti */
  }
`;

const RadioLabel = styled.label`
  font-size: 18px;
  display: flex;
  flex-direction: column;
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

  @media (max-width: 450px) {
    width: 135px;
    height: 135px;
    font-size: 18px;
  }

  @media (max-width: 400px) {
    font-size: 18px;
  }

  @media (max-width: 370px) {
    width: 125px;
    height: 125px;
    font-size: 14px!important;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.7); /* Hover durumu için daha açık renk */
  }

  &:active {
    transform: scale(0.95); /* Active durumu için küçültme efekti */
  }

  @media (max-width: 450px) {
    font-size: 18px;
  }

  input[type="radio"] {
    display: none;
  }

  img {
    width: 80px; /* Bayrak boyutlarını büyütüyoruz */
    height: 50px;
    margin-bottom: 10px;
  }

  .icon {
    width: 60px; /* İkon boyutları */
    height: 60px;
    margin-bottom: 10px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 1000px; /* Genişlik sınırı */

  @media (max-width: 768px) {
    justify-content: space-around; /* Mobil ekranlarda düzgün sıralama için */
  }
  @media (max-width: 450px) {
    gap: 0;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 3000;
  align-items: center;
`;

const DropdownButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 18px;
  @media (max-width: 450px) {
    font-size: 18px;
  }
  @media (max-width: 400px) {
    font-size: 18px;
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
  position: absolute;
  top: 100%;
  transform: translateX(-50%);
  background: var(--color-grey-51);
  border-radius: 10px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  padding: 10px;
  z-index: 3000;
  width: 170px;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.7); /* Hover durumu için daha açık renk */
  }

  &:active {
    transform: scale(0.95); /* Active durumu için küçültme efekti */
  }
`;

const DropdownItem = styled(motion.li)`
  list-style: none;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
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

function PurposeSelection({ onPurposeChange, selectedPurpose }) {
  const { isLoading, purposeRegData, purposeEdData } = usePurpose();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handlePurposeChange = (value) => {
    onPurposeChange(value);
    setOpen(false);
  };

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      <DropdownContainer ref={dropdownRef}>
        <StyledSelectContainer
          isSelected={selectedPurpose.includes("Eğitim")}
          onClick={toggleDropdown}
        >
          <DropdownButton>
            <img
            style={{width: "68px", height: "68px"}}
              src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/icons/noun-education-5553332_1.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpY29ucy9ub3VuLWVkdWNhdGlvbi01NTUzMzMyXzEuc3ZnIiwiaWF0IjoxNzE5MTQyMTMxLCJleHAiOjM5MjQ2Mzc3MzMxfQ.KVC3QDDNooCSvW50ccFcZlubNak8AktSbrSVdeefRUg&t=2024-06-23T11%3A28%3A51.044Z"
              alt="Eğitim"
              className="icon"
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Eğitim</span>
              <motion.span
                className="chevron"
                animate={open ? "open" : "closed"}
                variants={chevronVariants}
              >
                <FiChevronDown />
              </motion.span>
            </div>
          </DropdownButton>
          {open && (
            <DropdownMenu
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              {purposeEdData &&
                purposeEdData.map((purpose) => (
                  <DropdownItem
                    key={purpose.id}
                    variants={itemVariants}
                    onClick={() =>
                      handlePurposeChange(purpose.purposeEdDescription)
                    }
                  >
                    {purpose.purposeEdDescription}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          )}
        </StyledSelectContainer>
      </DropdownContainer>

      {purposeRegData &&
        purposeRegData.map((purpose) => {
          let iconUrl;
          switch (purpose.purposeRegDescription) {
            case "Ticari":
              iconUrl =
                "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/icons/noun-business-1162295_1.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpY29ucy9ub3VuLWJ1c2luZXNzLTExNjIyOTVfMS5zdmciLCJpYXQiOjE3MTkxNDIxMTMsImV4cCI6MTA3MjQyMjI2OTEzfQ.8964hbXAXbJJPBORy_hzAOFhaHROuZfiGMlVgXKdAyU&t=2024-06-23T11%3A28%3A33.759Z";
              break;
            case "Ziyaret":
              iconUrl =
                "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/icons/noun-friends-963723_1.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpY29ucy9ub3VuLWZyaWVuZHMtOTYzNzIzXzEuc3ZnIiwiaWF0IjoxNzE5MTQyMTY4LCJleHAiOjEzMTUxNzYyOTY4fQ.mgtTK3YGuj3ZtW4HlLDMmIz1cBrUFbgWE5AiPyKzTvs&t=2024-06-23T11%3A29%3A28.212Z";
              break;
            case "Turistik":
              iconUrl =
                "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/icons/noun-tourist-destination-5141887_1.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpY29ucy9ub3VuLXRvdXJpc3QtZGVzdGluYXRpb24tNTE0MTg4N18xLnN2ZyIsImlhdCI6MTcxOTE0MjIxOCwiZXhwIjo1NDcxODM5ODE4fQ.Qggr2GkcbZ_RkBDvOMFFJgi7YKTyPQpOxGpyQ3HJmDc&t=2024-06-23T11%3A30%3A18.797Z";
              break;
            default:
              iconUrl = "";
              break;
          }

          return (
            <RadioLabel
              key={purpose.id}
              checked={selectedPurpose === purpose.purposeRegDescription}
            >
              <input
                type="radio"
                name={purpose.purposeRegDescription}
                value={purpose.purposeRegDescription}
                checked={selectedPurpose === purpose.purposeRegDescription}
                onChange={() =>
                  handlePurposeChange(purpose.purposeRegDescription)
                }
              />
              {iconUrl && (
                <img
                  src={iconUrl}
                  alt={purpose.purposeRegDescription}
                  className="icon"
                />
              )}
              {purpose.purposeRegDescription}
            </RadioLabel>
          );
        })}
    </Container>
  );
}

export default PurposeSelection;

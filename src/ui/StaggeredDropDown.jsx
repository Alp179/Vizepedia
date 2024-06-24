/* eslint-disable react/prop-types */
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  height: 150px;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5); /* Buzlu cam efekti */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  cursor: pointer;
  border: ${({ isSelected }) => (isSelected ? "2px solid #3498db" : "none")};
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 2px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #4d4442;
`;

const DropdownMenu = styled(motion.ul)`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  padding: 10px;
  z-index: 1000;
  width: 150px;
`;

const DropdownItem = styled(motion.li)`
  list-style: none;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(52, 152, 219, 0.2);
  }
`;

const StaggeredDropDown = ({ options, selectedOption, onOptionSelect }) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const handleOptionSelect = (value) => {
    onOptionSelect(value);
    setOpen(false);
  };

  return (
    <DropdownContainer isSelected={selectedOption.includes("Eğitim")}>
      <img
        src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/icons/noun-education-5553332_1.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpY29ucy9ub3VuLWVkdWNhdGlvbi01NTUzMzMyXzEuc3ZnIiwiaWF0IjoxNzE5MTQyMTMxLCJleHAiOjM5MjQ2Mzc3MzMxfQ.KVC3QDDNooCSvW50ccFcZlubNak8AktSbrSVdeefRUg&t=2024-06-23T11%3A28%3A51.044Z"
        alt="Eğitim"
        className="icon"
      />
      <DropdownButton onClick={toggleDropdown}>
        <span>{selectedOption || "Eğitim"}</span>
        <motion.span animate={open ? "open" : "closed"} variants={iconVariants}>
          <FiChevronDown />
        </motion.span>
      </DropdownButton>
      {open && (
        <DropdownMenu
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.3 }}
        >
          {options.map((option) => (
            <DropdownItem
              key={option}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

export default StaggeredDropDown;

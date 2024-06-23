/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  height: 200px;
`;

const DropdownButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 18px;
  color: #4d4442;

  .chevron {
    margin-left: 5px;
  }

  &:hover {
    color: #3498db;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DropdownMenu = styled(motion.ul)`
  position: absolute;
  top: 100%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.3px);
  -webkit-backdrop-filter: blur(6.3px);
  padding: 10px;
  z-index: 1000;
  width: 200px;
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;
`;

const DropdownItem = styled(motion.li)`
  list-style: none;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(100, 100, 255, 0.1);
  }

  &:active {
    transform: scale(0.95);
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

const DropdownMenuComponent = ({
  options,
  selected,
  onSelect,
  displayText,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownContainer ref={dropdownRef} onClick={toggleDropdown}>
      <DropdownButton>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img
            src="https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/icons/noun-education-5553332_1.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpY29ucy9ub3VuLWVkdWNhdGlvbi01NTUzMzMyXzEuc3ZnIiwiaWF0IjoxNzE5MTQyMTMxLCJleHAiOjM5MjQ2Mzc3MzMxfQ.KVC3QDDNooCSvW50ccFcZlubNak8AktSbrSVdeefRUg&t=2024-06-23T11%3A28%3A51.044Z"
            alt="icon"
            className="icon"
          />
          <span>{displayText}</span>
          <motion.span
            className="chevron"
            animate={dropdownOpen ? "open" : "closed"}
            variants={chevronVariants}
          >
            <FiChevronDown />
          </motion.span>
        </div>
      </DropdownButton>
      {dropdownOpen && (
        <DropdownMenu
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
        >
          {options.map((option) => (
            <DropdownItem
              key={option.id}
              variants={itemVariants}
              onClick={() => {
                onSelect(option.value);
                setDropdownOpen(false);
              }}
            >
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default DropdownMenuComponent;

import styled from "styled-components";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const StyledInviteCreatorButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  /* Hover effect için gradient overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  /* Dark mode styles */
  .dark-mode & {
    background: linear-gradient(135deg, #4c63d2 0%, #5a4fcf 100%);
    
    &:hover {
      box-shadow: 0 8px 25px rgba(76, 99, 210, 0.4);
    }

    &:active {
      box-shadow: 0 4px 15px rgba(76, 99, 210, 0.3);
    }
  }

  /* Responsive styles */
  @media (max-width: 1100px) {
    padding: 8px 12px;
    font-size: 13px;
    gap: 6px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 960px) {
    display: none; /* Tablet ve mobil boyutlarda gizle */
  }

  /* Loading state */
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const IconInvite = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
    <path d="M16 16h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
    <path d="M12 11v6"></path>
    <path d="M9 14l3 3 3-3"></path>
  </svg>
);

function DavetiyeOlusturucu({ className, disabled = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled) {
      navigate("/davetiye-olustur");
    }
  };

  return (
    <StyledInviteCreatorButton
      onClick={handleClick}
      className={className}
      disabled={disabled}
      aria-label="Davetiye oluşturucu sayfasına git"
    >
      <IconInvite />
      Davetiye Oluştur
    </StyledInviteCreatorButton>
  );
}

DavetiyeOlusturucu.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default DavetiyeOlusturucu;
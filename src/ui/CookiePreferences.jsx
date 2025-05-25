// components/CookiePreferences.jsx
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useCookieConsent } from "../hooks/useCookieConsent";
import { CookieManager } from "../utils/cookieManager";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Modal = styled.div`
  background: var(--color-grey-0);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0 1.5rem;

  h2 {
    margin: 0;
    color: var(--color-grey-900);
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-grey-600);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    background: var(--color-grey-100);
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Description = styled.p`
  color: var(--color-grey-600);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryItem = styled.div`
  border: 1px solid var(--color-grey-200);
  border-radius: 8px;
  overflow: hidden;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-grey-50);

  div {
    h3 {
      margin: 0 0 0.25rem 0;
      color: var(--color-grey-900);
      font-size: 1rem;
    }

    p {
      margin: 0;
      color: var(--color-grey-600);
      font-size: 0.9rem;
    }
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${(props) =>
      props.disabled ? "var(--color-green-500)" : "var(--color-grey-300)"};
    transition: 0.3s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: var(--color-brand-600);
  }

  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--color-grey-200);
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(Button)`
  background: var(--color-brand-600);
  color: white;

  &:hover {
    background: var(--color-brand-700);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: var(--color-grey-600);
  border: 1px solid var(--color-grey-300);

  &:hover {
    background: var(--color-grey-50);
  }
`;

export const CookiePreferences = () => {
  const { showPreferences, closePreferences, savePreferences, consent } =
    useCookieConsent();
  const [preferences, setPreferences] = useState({
    [CookieManager.COOKIE_CATEGORIES.NECESSARY]: true,
    [CookieManager.COOKIE_CATEGORIES.ANALYTICS]: false,
    [CookieManager.COOKIE_CATEGORIES.ADVERTISING]: false,
  });

  useEffect(() => {
    if (consent?.preferences) {
      setPreferences(consent.preferences);
    }
  }, [consent]);

  const handleToggle = (category) => {
    if (category === CookieManager.COOKIE_CATEGORIES.NECESSARY) return;

    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    savePreferences(preferences);
  };

  if (!showPreferences) return null;

  return (
    <Overlay onClick={closePreferences}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <h2>Çerez Tercihleri</h2>
          <CloseButton onClick={closePreferences}>×</CloseButton>
        </Header>

        <Content>
          <Description>
            Vizepediada hangi çerez türlerinin kullanılmasına izin vermek
            istediğinizi seçebilirsiniz.
          </Description>

          <CategoryList>
            {Object.entries(CookieManager.COOKIE_DEFINITIONS).map(
              ([categoryKey, categoryData]) => (
                <CategoryItem key={categoryKey}>
                  <CategoryHeader>
                    <div>
                      <h3>{categoryData.name}</h3>
                      <p>{categoryData.description}</p>
                    </div>
                    <Toggle disabled={categoryData.required}>
                      <input
                        type="checkbox"
                        checked={preferences[categoryKey]}
                        onChange={() => handleToggle(categoryKey)}
                        disabled={categoryData.required}
                      />
                      <span></span>
                    </Toggle>
                  </CategoryHeader>
                </CategoryItem>
              )
            )}
          </CategoryList>
        </Content>

        <Footer>
          <SecondaryButton onClick={closePreferences}>İptal</SecondaryButton>
          <PrimaryButton onClick={handleSave}>Tercihleri Kaydet</PrimaryButton>
        </Footer>
      </Modal>
    </Overlay>
  );
};

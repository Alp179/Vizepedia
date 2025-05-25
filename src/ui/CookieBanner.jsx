// components/CookieBanner.jsx

import styled from "styled-components";
import { useCookieConsent } from "../hooks/useCookieConsent";

const BannerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-grey-0);
  border-top: 1px solid var(--color-grey-200);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BannerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const BannerText = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: var(--color-grey-900);
    font-weight: 600;
  }

  p {
    margin: 0;
    color: var(--color-grey-600);
    font-size: 0.9rem;
    line-height: 1.4;

    a {
      color: var(--color-brand-600);
      text-decoration: underline;

      &:hover {
        color: var(--color-brand-700);
      }
    }
  }
`;

const BannerActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
  }
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
    border-color: var(--color-grey-400);
  }
`;

export const CookieBanner = () => {
  const { showBanner, acceptAll, rejectOptional, openPreferences } =
    useCookieConsent();

  if (!showBanner) return null;

  return (
    <BannerContainer>
      <BannerContent>
        <BannerText>
          <h3>🍪 Çerez Kullanımı</h3>
          <p>
            Size daha iyi hizmet verebilmek için çerezler kullanıyoruz. Detaylı
            bilgi için <a href="/cerez-politikasi">Çerez Politikamızı</a>{" "}
            inceleyebilirsiniz.
          </p>
        </BannerText>
        <BannerActions>
          <SecondaryButton onClick={rejectOptional}>
            Sadece Zorunlu
          </SecondaryButton>
          <SecondaryButton onClick={openPreferences}>Ayarlar</SecondaryButton>
          <PrimaryButton onClick={acceptAll}>Tümünü Kabul Et</PrimaryButton>
        </BannerActions>
      </BannerContent>
    </BannerContainer>
  );
};

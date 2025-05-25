// components/CookieSettingsButton.jsx

import styled from "styled-components";
import { useCookieConsent } from "../hooks/useCookieConsent";

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: var(--color-grey-500);
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;

  &:hover {
    color: var(--color-brand-600);
  }
`;

export const CookieSettingsButton = () => {
  const { openPreferences } = useCookieConsent();

  return (
    <SettingsButton onClick={openPreferences}>Çerez Ayarları</SettingsButton>
  );
};

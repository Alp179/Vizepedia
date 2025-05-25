/* eslint-disable react/prop-types */
// hooks/useCookieConsent.js
import { useState, useEffect, createContext, useContext } from "react";
import { CookieManager } from "../utils/cookieManager";

const CookieConsentContext = createContext();

export const CookieConsentProvider = ({ children }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    // Lazy loading - 2 saniye sonra kontrol et
    const timer = setTimeout(() => {
      const currentConsent = CookieManager.getConsent();
      setConsent(currentConsent);
      setShowBanner(CookieManager.needsConsent());
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const acceptAll = () => {
    const allPreferences = {
      [CookieManager.COOKIE_CATEGORIES.NECESSARY]: true,
      [CookieManager.COOKIE_CATEGORIES.ANALYTICS]: true,
      [CookieManager.COOKIE_CATEGORIES.ADVERTISING]: true,
    };

    CookieManager.saveConsent(allPreferences);
    setConsent(CookieManager.getConsent());
    setShowBanner(false);

    // Google Analytics'i başlat
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    }
  };

  const rejectOptional = () => {
    const minimalPreferences = {
      [CookieManager.COOKIE_CATEGORIES.NECESSARY]: true,
      [CookieManager.COOKIE_CATEGORIES.ANALYTICS]: false,
      [CookieManager.COOKIE_CATEGORIES.ADVERTISING]: false,
    };

    CookieManager.saveConsent(minimalPreferences);
    setConsent(CookieManager.getConsent());
    setShowBanner(false);
  };

  const openPreferences = () => {
    setShowPreferences(true);
  };

  const closePreferences = () => {
    setShowPreferences(false);
  };

  const savePreferences = (preferences) => {
    CookieManager.saveConsent(preferences);
    setConsent(CookieManager.getConsent());
    setShowBanner(false);
    setShowPreferences(false);

    // Google Analytics consent güncelle
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: preferences[
          CookieManager.COOKIE_CATEGORIES.ANALYTICS
        ]
          ? "granted"
          : "denied",
        ad_storage: preferences[CookieManager.COOKIE_CATEGORIES.ADVERTISING]
          ? "granted"
          : "denied",
      });
    }
  };

  const hasConsent = (category) => {
    return CookieManager.hasConsent(category);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        showBanner,
        showPreferences,
        consent,
        acceptAll,
        rejectOptional,
        openPreferences,
        closePreferences,
        savePreferences,
        hasConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider"
    );
  }
  return context;
};

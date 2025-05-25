// utils/cookieManager.js
export class CookieManager {
  static COOKIE_CATEGORIES = {
    NECESSARY: "necessary",
    ANALYTICS: "analytics",
    ADVERTISING: "advertising",
  };

  static CONSENT_COOKIE_NAME = "vizepedia_cookie_consent";
  static CONSENT_VERSION = "1.0";

  // Minimal çerez tanımları - AdSense onayı için
  static COOKIE_DEFINITIONS = {
    [this.COOKIE_CATEGORIES.NECESSARY]: {
      name: "Zorunlu Çerezler",
      description: "Web sitesinin temel işlevleri için gerekli çerezler",
      required: true,
      cookies: ["vizepedia_session", "vizepedia_cookie_consent", "isDarkMode"],
    },
    [this.COOKIE_CATEGORIES.ANALYTICS]: {
      name: "Analiz Çerezleri",
      description: "Site performansını ölçmek ve iyileştirmek için kullanılır",
      required: false,
      cookies: ["_ga", "_ga_*", "_gid"],
    },
    [this.COOKIE_CATEGORIES.ADVERTISING]: {
      name: "Reklam Çerezleri",
      description: "Kişiselleştirilmiş reklamlar göstermek için kullanılır",
      required: false,
      cookies: ["_gcl_au", "__gads", "__gpi"],
    },
  };

  // Çerez okuma
  static getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
    return null;
  }

  // Çerez yazma
  static setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  // Onay durumunu kaydetme
  static saveConsent(preferences) {
    const consentData = {
      version: this.CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      preferences: preferences,
    };
    this.setCookie(this.CONSENT_COOKIE_NAME, JSON.stringify(consentData), 365);
  }

  // Onay durumunu okuma
  static getConsent() {
    const consentCookie = this.getCookie(this.CONSENT_COOKIE_NAME);
    if (!consentCookie) return null;

    try {
      return JSON.parse(consentCookie);
    } catch (e) {
      return null;
    }
  }

  // Onay gerekli mi kontrol et
  static needsConsent() {
    const consent = this.getConsent();
    return !consent || consent.version !== this.CONSENT_VERSION;
  }

  // Belirli kategori için izin var mı
  static hasConsent(category) {
    const consent = this.getConsent();
    if (!consent) return category === this.COOKIE_CATEGORIES.NECESSARY;
    return consent.preferences[category] === true;
  }
}

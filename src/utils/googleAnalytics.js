// utils/googleAnalytics.js
import { CookieManager } from "./cookieManager";

export class GoogleAnalytics {
  static GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // AdSense hesabı açıldıktan sonra değiştirilecek

  static initialize() {
    // GA ID henüz ayarlanmamışsa çalıştırma
    if (!this.GA_MEASUREMENT_ID || this.GA_MEASUREMENT_ID === "G-XXXXXXXXXX") {
      console.log(
        "Google Analytics ID henüz ayarlanmamış. AdSense onayından sonra güncelleyiniz."
      );
      return;
    }

    // Google Analytics script'ini dinamik olarak yükle
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Google Analytics'i başlat (consent mode ile)
    window.gtag =
      window.gtag ||
      function () {
        (window.gtag.q = window.gtag.q || []).push(arguments);
      };
    window.gtag("js", new Date());

    // Consent mode başlat
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      wait_for_update: 500,
    });

    // GA4 konfigürasyonu
    window.gtag("config", this.GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      cookie_flags: "SameSite=Lax;Secure",
    });

    // Mevcut consent'i kontrol et
    const consent = CookieManager.getConsent();
    if (consent?.preferences) {
      window.gtag("consent", "update", {
        analytics_storage: consent.preferences[
          CookieManager.COOKIE_CATEGORIES.ANALYTICS
        ]
          ? "granted"
          : "denied",
        ad_storage: consent.preferences[
          CookieManager.COOKIE_CATEGORIES.ADVERTISING
        ]
          ? "granted"
          : "denied",
      });
    }

    console.log("Google Analytics başlatıldı:", this.GA_MEASUREMENT_ID);
  }

  static trackPageView(path) {
    if (this.GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

    if (
      CookieManager.hasConsent(CookieManager.COOKIE_CATEGORIES.ANALYTICS) &&
      window.gtag
    ) {
      window.gtag("config", this.GA_MEASUREMENT_ID, {
        page_path: path,
      });
    }
  }

  static trackEvent(eventName, parameters = {}) {
    if (this.GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

    if (
      CookieManager.hasConsent(CookieManager.COOKIE_CATEGORIES.ANALYTICS) &&
      window.gtag
    ) {
      window.gtag("event", eventName, parameters);
    }
  }
}

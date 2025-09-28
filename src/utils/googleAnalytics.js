// utils/googleAnalytics.js
import { CookieManager } from "./cookieManager";

export class GoogleAnalytics {
  static GA_MEASUREMENT_ID = "G-Y39N376SJL"; // ✅ GA4 ID güncellendi

  static initialize() {
    // GA ID kontrolü
    if (!this.GA_MEASUREMENT_ID || this.GA_MEASUREMENT_ID === "G-XXXXXXXXXX") {
      console.log(
        "Google Analytics ID henüz ayarlanmamış. AdSense onayından sonra güncelleyiniz."
      );
      return;
    }

    console.log("🚀 Google Analytics başlatılıyor:", this.GA_MEASUREMENT_ID);

    // Google Analytics script'ini dinamik olarak yükle
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Gtag fonksiyonunu tanımla
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    // Google Analytics'i başlat
    window.gtag('js', new Date());

    // Consent mode başlat (GDPR/KVKK uyumlu)
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      wait_for_update: 500,
    });

    // GA4 konfigürasyonu
    window.gtag('config', this.GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Lax;Secure',
      // AdSense uyumluluğu için ek ayarlar
      custom_map: {
        'custom_parameter_1': 'user_type',
        'custom_parameter_2': 'visa_country'
      }
    });

    // Mevcut çerez consent'ini kontrol et
    const consent = CookieManager.getConsent();
    if (consent?.preferences) {
      this.updateConsent(consent.preferences);
    }

    console.log("✅ Google Analytics başlatıldı!");
  }

  // Yeni: Consent güncelleme metodu
  static updateConsent(preferences) {
    if (!window.gtag) return;

    window.gtag('consent', 'update', {
      analytics_storage: preferences[CookieManager.COOKIE_CATEGORIES.ANALYTICS] 
        ? 'granted' : 'denied',
      ad_storage: preferences[CookieManager.COOKIE_CATEGORIES.ADVERTISING] 
        ? 'granted' : 'denied',
    });

    console.log("🔄 GA Consent güncellendi:", preferences);
  }

  static trackPageView(path, title = '') {
    if (this.GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

    if (CookieManager.hasConsent(CookieManager.COOKIE_CATEGORIES.ANALYTICS) && window.gtag) {
      window.gtag('config', this.GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title
      });
      
      console.log(`📊 Page view tracked: ${path}`);
    }
  }

  static trackEvent(eventName, parameters = {}) {
    if (this.GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

    if (CookieManager.hasConsent(CookieManager.COOKIE_CATEGORIES.ANALYTICS) && window.gtag) {
      window.gtag('event', eventName, {
        event_category: parameters.category || 'general',
        event_label: parameters.label || '',
        value: parameters.value || 0,
        ...parameters
      });
      
      console.log(`📈 Event tracked: ${eventName}`, parameters);
    }
  }

  // Yeni: Vizepedia özel tracking metodları
  static trackVisaGuideStart(country, purpose) {
    this.trackEvent('visa_guide_start', {
      category: 'engagement',
      label: `${country}_${purpose}`,
      custom_parameter_1: 'anonymous',
      custom_parameter_2: country
    });
  }

  static trackUserSignup(method = 'email') {
    this.trackEvent('sign_up', {
      category: 'authentication',
      method: method,
      value: 1
    });
  }

  static trackDocumentView(documentType, country) {
    this.trackEvent('document_view', {
      category: 'content',
      label: `${documentType}_${country}`,
      custom_parameter_2: country
    });
  }

  static trackBlogRead(slug, category) {
    this.trackEvent('blog_read', {
      category: 'content',
      label: slug,
      content_group1: category
    });
  }

  // Hata tracking
  static trackError(error, location) {
    this.trackEvent('exception', {
      description: error.message || 'Unknown error',
      fatal: false,
      location: location
    });
  }
}
const selectionDocumentRules = {
  all: [
    "Biyometrik Fotoğraf",
    "Kimlik Fotokopisi",
    "Nüfus Kaydı Örneği",
    "Sağlık Sigortası",
    "İkametgah Belgesi",
    "Pasaport",
    "Malvarlık Belgeleri",
  ],
  sponsorAll: [
    "Sponsor Nüfus Kaydı Örneği",
    "Sponsor Malvarlık Belgeleri",
    "Sponsor Kimlik Fotokopisi",
    "Sponsor İkametgah Belgesi",
    "Sponsor SGK Tescil ve Hizmet Dökümü",
    "Sponsor Son 3 Aylık Banka Hesap Dökümü",
  ],

  // Kullanıcı seçim türleri (ans_country, ans_purpose, vs.) ile uyumlu yapı
  country: {
    Almanya: [], // Eğer belirli ülkeler için özel belgeler gerekiyorsa buraya ekleyin
  },
  purpose: {
    Ticari: ["Ticari Davetiye Belgesi"],
    Turistik: [], // Örnek amaçlar
    AileArkadasZiyareti: ["Davetiye Mektubu"],
    Egitim: [], // Eğitim amaçlı seyahatler için belgeler
  },
  profession: {
    Emekli: [
      "4A Emekli Aylık Bilgisi",
      "SGK Tescil ve Hizmet Dökümü",
      "Son 3 Aylık Banka Hesap Dökümü",
      "Emekli Maaşı Hesabı Dökümü",
      "Emeklilik Belgesi",
    ],
    Öğrenci: ["Öğrenci Belgesi"],
    Çalışan: [

      "Faaliyet Belgesi",
      "SGK İşe Giriş Belgesi",
      "Ticaret Sicil Gazetesi Fotokopisi",
      "SGK Tescil ve Hizmet Dökümü",
      "Son 3 Aylık Maaş Bordrosu",
      "Vergi Levhası",
      "Şirket İmza Sirküleri",
      "Son 3 Aylık Banka Hesap Dökümü",
      "Şirket Dilekçesi",
    ],
    "Çalışmayan kişi": [

      "SGK Tescil ve Hizmet Dökümü",
      "Son 3 Aylık Banka Hesap Dökümü",
    ],
    "İş Veren/Şirket Ortağı": [

      "Son 3 Aylık Banka Hesap Dökümü",
      "Şirket Vergi Levhası",
      "Ticaret Sicil Gazetesi Fotokopisi",
      "Şirket İmza Sirküleri",
      "Faaliyet Belgesi",
      "Şirket Dilekçesi",
    ],
  },
  sponsorProfession: {
    Emekli: [
      "Sponsor Emeklilik Belgesi",
      "Sponsor 4A Emekli Aylık Bilgisi",
      "Sponsor SGK Tescil ve Hizmet Dökümü",
      
      "Sponsor Emekli Maaşı Hesabı Dökümü",

    ],
    Çalışan: [
      "Sponsor SGK İşe Giriş Belgesi",
      "Sponsor Son 3 Aylık Maaş Bordrosu",
      "Sponsor İşyerinden Dilekçe",
      "Sponsor Faaliyet Belgesi",
      "Sponsor Ticaret Sicil Gazetesi Fotokopisi",
      "Sponsor SGK Tescil ve Hizmet Dökümü",
      "Sponsor Şirket Vergi Levhası",
      "Sponsor Şirket İmza Sirküleri",
      
      
    ],
    "İş Veren/Şirket Ortağı": [
      "Sponsor Şirket Vergi Levhası",
      "Sponsor Ticaret Sicil Gazetesi Fotokopisi",
      "Sponsor Şirket İmza Sirküleri",
      "Sponsor Faaliyet Belgesi",
      "Sponsor Şirket Dilekçesi",

    ],
  },
  vehicle: {
    Uçak: ["Uçak Rezervasyonu"],
    Otobüs: ["Otobüs Rezervasyonu"],
    "Tren/Interrail": ["Tren Rezervasyonu"],
    Gemi: ["Gemi Rezervasyonu"],
    Otomobil: [""],
  },
  accommodation: {
    Davetiye: ["Davetiye Mektubu"],
    Otel: ["Otel Rezervasyonu"],
  },
  kid: {
    Evet: [],
    Hayir: [],
  },
  // Belirli kombinasyonlar için özel kurallar
  combinations: [
    {
      country: "Almanya",
      purpose: "Ziyaret",
      documents: ["Sarı Davetiye"], // Kombinasyon için gerekli belgeler
    },
  ],
};

export default selectionDocumentRules;

const selectionDocumentRules = {
  all: [
    "Biyometrik Fotoğraf",
    "Kimlik Fotokopisi",
    "Nüfus Kaydı Örneği",
    "Sağlık Sigortası",
    "İkametgah Belgesi",
    "Pasaport",
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
      "Malvarlık Belgeleri",
      "Emeklilik Belgesi",
      "SGK Tescil ve Hizmet Dökümü",
      "Son 3 Aylık Banka Hesap Dökümü",
      "Emekli Maaşı Hesabı Dökümü",
    ],
    Öğrenci: ["Öğrenci Belgesi", "Sponsor Evrakları"],
    Çalışan: [
      "Malvarlık Belgeleri",
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
      "Sponsor Evrakları",
      "SGK Tescil ve Hizmet Dökümü",
      "Son 3 Aylık Banka Hesap Dökümü",
    ],
    "İş veren": [
      "Malvarlık Belgeleri",
      "Son 3 Aylık Banka Hesap Dökümü",
      "Şirket Vergi Levhası",
      "Ticaret Sicil Gazetesi Fotokopisi",
      "Şirket İmza Sirküleri",
      "Faaliyet Belgesi",
      "Şirket Dilekçesi",
    ], // İş verenler için gerekli belgeler
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

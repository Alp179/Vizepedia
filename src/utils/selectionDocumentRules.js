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
      "Emeklilik Belgesi",
      "Ekonomik Gösterge Belgeleri",
      "Son 3 Aylık Banka Hesap Dökümü",
    ],
    Öğrenci: ["Öğrenci Belgesi", "Sponsor Evrakları"],
    Çalışan: [
      "Faaliyet Belgesi",
      "SGK İşe Giriş Belgesi",
      "Ticaret Sicil Gazetesi Fotokopisi",
      "SGK Tescil ve Hizmet Dökümü",
      "Son 3 Aylık Maaş Bordrosu",
      "Vergi Levhası",
      "Şirket İmza Sirküleri",
      "Son 3 Aylık Banka Hesap Dökümü",
      "Ekonomik Gösterge Belgeleri",
      "Şirket Dilekçesi",
    ],
    Calismayan: [
      "Ekonomik Gösterge Belgeleri",
      "Sponsor Evrakları",
      "Son 3 Aylık Banka Hesap Dökümü",
    ],
    "İş Veren": [
      "Ticaret Sicil Gazetesi Fotokopisi",
      "Şirket İmza Sirküleri",
      "Faaliyet Belgesi",
      "Şirket Dilekçesi",
    ], // İş verenler için gerekli belgeler
  },
  vehicle: {
    Uçak: ["Uçak Rezervasyonu"],
    Otobus: ["Otobüs Rezervasyonu"],
    Tren: [],
    Gemi: [],
    Otomobil: [],
  },
  accommodation: {
    Davetiye: ["Davetiye Mektubu"],
    Otel: ["Otel Rezervasyonu"],
  },
  kid: {
    Evet: [], // Çocuklu seyahatler için ekstra belgeler
    Hayir: [],
  },
};

export default selectionDocumentRules;

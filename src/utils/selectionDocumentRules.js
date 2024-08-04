const selectionDocumentRules = {
  all: [
    "Biyometrik Fotoğraf",
    "Kimlik Fotokopisi",
    "Nüfus Kaydı Örneği",
    "Sağlık Sigortası",
    "İkametgah Belgesi",
  ],

  // Kullanıcı seçim türleri (ans_country, ans_purpose, vs.) ile uyumlu yapı
  country: {
    Almanya: [], // Eğer belirli ülkeler için özel belgeler gerekiyorsa buraya ekleyin
  },
  purpose: {
    Ticari: [
      "Faaliyet Belgesi",
      "Ticaret Sicil Gazetesi Fotokopisi",
      "Ticari Davetiye Belgesi",
    ],
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
      "SGK İşe Giriş Belgesi",
      "SGK Tescil ve Hizmet Dökümü",
      "Son 3 Aylık Maaş Bordrosu",
      "Vergi Levhası",
      "Şirket İmza Sirküleri",
      "Son 3 Aylık Banka Hesap Dökümü",
      "Ekonomik Gösterge Belgeleri",
    ],
    Calismayan: [
      "Ekonomik Gösterge Belgeleri",
      "Sponsor Evrakları",
      "Son 3 Aylık Banka Hesap Dökümü",
    ],
    "İs&nbsp;Veren": [], // İş verenler için gerekli belgeler
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

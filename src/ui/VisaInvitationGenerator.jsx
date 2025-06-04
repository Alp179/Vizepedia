import { useState } from "react";
import styled from "styled-components";
import Button from "./Button";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 10px 0 0 0;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.hasError ? "#e53e3e" : "#e2e8f0")};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${(props) => (props.hasError ? "#fed7d7" : "white")};

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#e53e3e" : "#667eea")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.hasError ? "rgba(229, 62, 62, 0.1)" : "rgba(102, 126, 234, 0.1)"};
    transform: translateY(-1px);
  }

  &:hover {
    border-color: ${(props) => (props.hasError ? "#c53030" : "#cbd5e0")};
  }

  /* Tarih input'ları için özel stil */
  &[type="date"],
  &[type="month"] {
    cursor: pointer;
    position: relative;
  }

  &[type="date"]::-webkit-calendar-picker-indicator,
  &[type="month"]::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    height: auto;
    color: transparent;
    background: transparent;
    cursor: pointer;
  }

  /* Firefox için */
  &[type="date"]::-moz-focus-inner,
  &[type="month"]::-moz-focus-inner {
    border: 0;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.hasError ? "#e53e3e" : "#e2e8f0")};
  border-radius: 10px;
  font-size: 1rem;
  background: ${(props) => (props.hasError ? "#fed7d7" : "white")};
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#e53e3e" : "#667eea")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.hasError ? "rgba(229, 62, 62, 0.1)" : "rgba(102, 126, 234, 0.1)"};
  }

  &:hover {
    border-color: ${(props) => (props.hasError ? "#c53030" : "#cbd5e0")};
  }
`;

const SectionTitle = styled.h3`
  color: #4a5568;
  font-size: 1.2rem;
  margin: 30px 0 15px 0;
  padding: 10px 15px;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-left: 4px solid #667eea;
  border-radius: 5px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const SectionDivider = styled.div`
  grid-column: 1 / -1;
`;

const HelpText = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-top: 4px;
  font-style: italic;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.3s ease;
  height: ${(props) => (props.show ? "auto" : "0")};
  overflow: hidden;
`;

const GenerateButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LetterContainer = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  font-family: "Times New Roman", serif;
  line-height: 1.6;
  color: #2d3748;
`;

const LetterDate = styled.div`
  margin-bottom: 20px;
  color: #4a5568;
  text-align: right;
`;

const LetterBody = styled.div`
  margin: 30px 0;
`;

const LetterSignature = styled.div`
  margin-top: 50px;

  background: #48bb78;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: #38a169;
    transform: translateY(-1px);
  }
`;

export default function VisaInvitationGenerator() {
  const [formData, setFormData] = useState({
    country: "United Kingdom",
    yourAddress: "",
    consularCity: "",
    familyMemberName: "",
    relationship: "anne",
    familyMemberBirthDate: "",
    familyMemberPassport: "",
    arrivalDate: "",
    exitDate: "",
    occupation: "",
    workplace: "",
    workStartDate: "",
    livingInCountryDuration: "",
    status: "citizen",
    accommodationAddress: "",
    yourName: "",
    email: "",
    phone: "",
  });

  const [showLetter, setShowLetter] = useState(false);
  const [showOccupationHelp, setShowOccupationHelp] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);

  const schengenCountries = [
    { en: "United Kingdom", tr: "Birleşik Krallık" },
    { en: "Austria", tr: "Avusturya" },
    { en: "Belgium", tr: "Belçika" },
    { en: "Croatia", tr: "Hırvatistan" },
    { en: "Czech Republic", tr: "Çek Cumhuriyeti" },
    { en: "Denmark", tr: "Danimarka" },
    { en: "Estonia", tr: "Estonya" },
    { en: "Finland", tr: "Finlandiya" },
    { en: "France", tr: "Fransa" },
    { en: "Germany", tr: "Almanya" },
    { en: "Greece", tr: "Yunanistan" },
    { en: "Hungary", tr: "Macaristan" },
    { en: "Iceland", tr: "İzlanda" },
    { en: "Italy", tr: "İtalya" },
    { en: "Latvia", tr: "Letonya" },
    { en: "Liechtenstein", tr: "Liechtenstein" },
    { en: "Lithuania", tr: "Litvanya" },
    { en: "Luxembourg", tr: "Lüksemburg" },
    { en: "Malta", tr: "Malta" },
    { en: "Netherlands", tr: "Hollanda" },
    { en: "Norway", tr: "Norveç" },
    { en: "Poland", tr: "Polonya" },
    { en: "Portugal", tr: "Portekiz" },
    { en: "Slovakia", tr: "Slovakya" },
    { en: "Slovenia", tr: "Slovenya" },
    { en: "Spain", tr: "İspanya" },
    { en: "Sweden", tr: "İsveç" },
    { en: "Switzerland", tr: "İsviçre" },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const requiredFields = [
      "country",
      "consularCity",
      "yourName",
      "yourAddress",
      "email",
      "phone",
      "occupation",
      "workplace",
      "livingInCountryDuration",
      "status",
      "accommodationAddress",
      "familyMemberName",
      "relationship",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ];

    const emptyFieldsList = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ""
    );

    setEmptyFields(emptyFieldsList);

    if (emptyFieldsList.length > 0) {
      // Sayfayı ilk boş alana kaydır
      setTimeout(() => {
        const firstEmptyElement = document.querySelector('[data-error="true"]');
        if (firstEmptyElement) {
          firstEmptyElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
      return false;
    }

    return true;
  };

  const generateLetter = () => {
    if (validateForm()) {
      setShowLetter(true);
    }
  };

  const getRelationshipInEnglish = (relationship) => {
    const relationshipMap = {
      anne: "mother",
      baba: "father",
      kardeş: "brother",
      "kız kardeş": "sister",
      oğul: "son",
      kız: "daughter",
      büyükanne: "grandmother",
      büyükbaba: "grandfather",
      "amca/dayı": "uncle",
      "teyze/hala": "aunt",
      eş: "spouse",
      arkadaş: "friend",
    };
    return relationshipMap[relationship] || relationship;
  };

  const getStatusInEnglish = (status) => {
    const statusMap = {
      citizen: "citizen",
      "permanent resident": "permanent resident",
      "EU settled status": "EU settled status",
      "Tier 2 visa holder": "Tier 2 visa holder",
      "Student visa": "student visa holder",
      "Work permit": "work permit holder",
    };
    return statusMap[status] || status;
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const downloadLetter = () => {
    const letterContent = document.getElementById("letter-content").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Visa Invitation Letter</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              line-height: 1.6; 
              color: #333; 
              padding: 40px; 
              margin: 0;
            }
            .no-print { 
              display: none !important; 
            }
            @media print {
              body { 
                margin: 0;
                padding: 20px;
              }
              .no-print { 
                display: none !important; 
              }
            }
          </style>
        </head>
        <body>${letterContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Container>
      <Header>
        <Title>🌍 Vizepedia</Title>
        <Subtitle>Aile Ziyareti Vizesi - Davetiye Mektubu Oluşturucu</Subtitle>
      </Header>

      <FormContainer>
        <FormGrid>
          <SectionDivider>
            <SectionTitle>🌍 Genel Bilgiler</SectionTitle>
          </SectionDivider>

          <FormGroup>
            <Label>Ülke Seçimi</Label>
            <Select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              hasError={emptyFields.includes("country")}
              data-error={emptyFields.includes("country")}
            >
              {schengenCountries.map((country) => (
                <option key={country.en} value={country.en}>
                  {country.tr}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Konsolosluk Şehri</Label>
            <Input
              type="text"
              name="consularCity"
              value={formData.consularCity}
              onChange={handleInputChange}
              placeholder="İstanbul, Ankara, İzmir vb."
              hasError={emptyFields.includes("consularCity")}
              data-error={emptyFields.includes("consularCity")}
            />
          </FormGroup>

          <SectionDivider>
            <SectionTitle>👤 Davet Eden Kişi Bilgileri</SectionTitle>
          </SectionDivider>

          <FormGroup>
            <Label>Adınız Soyadınız</Label>
            <Input
              type="text"
              name="yourName"
              value={formData.yourName}
              onChange={handleInputChange}
              placeholder="Ayşe Yılmaz"
              hasError={emptyFields.includes("yourName")}
              data-error={emptyFields.includes("yourName")}
            />
          </FormGroup>

          <FormGroup>
            <Label>Adresiniz</Label>
            <Input
              type="text"
              name="yourAddress"
              value={formData.yourAddress}
              onChange={handleInputChange}
              placeholder="123 Main Street, London, SW1A 1AA"
              hasError={emptyFields.includes("yourAddress")}
              data-error={emptyFields.includes("yourAddress")}
            />
          </FormGroup>

          <FormGroup>
            <Label>E-posta Adresi</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ayse@example.com"
              hasError={emptyFields.includes("email")}
              data-error={emptyFields.includes("email")}
            />
          </FormGroup>

          <FormGroup>
            <Label>Telefon Numarası</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+44 7123 456789"
              hasError={emptyFields.includes("phone")}
              data-error={emptyFields.includes("phone")}
            />
          </FormGroup>

          <FormGroup>
            <Label>Mesleğiniz</Label>
            <Input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              onFocus={() => setShowOccupationHelp(true)}
              onBlur={() => setShowOccupationHelp(false)}
              placeholder="Yazılım Mühendisi"
              hasError={emptyFields.includes("occupation")}
              data-error={emptyFields.includes("occupation")}
            />
            <HelpText show={showOccupationHelp}>
              (Mesleğinizi yerel dil ile yazınız)
            </HelpText>
          </FormGroup>

          <FormGroup>
            <Label>İş Yeriniz</Label>
            <Input
              type="text"
              name="workplace"
              value={formData.workplace}
              onChange={handleInputChange}
              placeholder="ABC Teknoloji Ltd"
              hasError={emptyFields.includes("workplace")}
              data-error={emptyFields.includes("workplace")}
            />
          </FormGroup>

          <FormGroup>
            <Label>İşe Başlama Tarihi</Label>
            <Input
              type="month"
              name="workStartDate"
              value={formData.workStartDate}
              onChange={handleInputChange}
              hasError={emptyFields.includes("workStartDate")}
              data-error={emptyFields.includes("workStartDate")}
            />
          </FormGroup>

          <FormGroup>
            <Label>Ülkede Yaşama Süresi</Label>
            <Select
              name="livingInCountryDuration"
              value={formData.livingInCountryDuration}
              onChange={handleInputChange}
              hasError={emptyFields.includes("livingInCountryDuration")}
              data-error={emptyFields.includes("livingInCountryDuration")}
            >
              <option value="">Süre seçiniz</option>
              {[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 25, 30,
              ].map((year) => (
                <option key={year} value={year}>
                  {year} yıl
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Durumunuz</Label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              hasError={emptyFields.includes("status")}
              data-error={emptyFields.includes("status")}
            >
              <option value="citizen">Vatandaş</option>
              <option value="permanent resident">Daimi İkamet</option>
              <option value="EU settled status">AB Yerleşik Statüsü</option>
              <option value="Tier 2 visa holder">Tier 2 Vize Sahibi</option>
              <option value="Student visa">Öğrenci Vizesi</option>
              <option value="Work permit">Çalışma İzni</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Konaklama Adresi</Label>
            <Input
              type="text"
              name="accommodationAddress"
              value={formData.accommodationAddress}
              onChange={handleInputChange}
              placeholder="Adresinizle aynı veya farklı"
              hasError={emptyFields.includes("accommodationAddress")}
              data-error={emptyFields.includes("accommodationAddress")}
            />
          </FormGroup>

          <SectionDivider>
            <SectionTitle>👥 Davet Edilen Kişi Bilgileri</SectionTitle>
          </SectionDivider>

          <FormGroup>
            <Label>Aile Üyesi Adı Soyadı</Label>
            <Input
              type="text"
              name="familyMemberName"
              value={formData.familyMemberName}
              onChange={handleInputChange}
              placeholder="Ahmet Yılmaz"
              hasError={emptyFields.includes("familyMemberName")}
              data-error={emptyFields.includes("familyMemberName")}
            />
          </FormGroup>

          <FormGroup>
            <Label>Yakınlık Derecesi</Label>
            <Select
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              hasError={emptyFields.includes("relationship")}
              data-error={emptyFields.includes("relationship")}
            >
              <option value="anne">Anne</option>
              <option value="baba">Baba</option>
              <option value="kardeş">Kardeş (Erkek)</option>
              <option value="kız kardeş">Kız Kardeş</option>
              <option value="oğul">Oğul</option>
              <option value="kız">Kız</option>
              <option value="büyükanne">Büyükanne</option>
              <option value="büyükbaba">Büyükbaba</option>
              <option value="amca/dayı">Amca/Dayı</option>
              <option value="teyze/hala">Teyze/Hala</option>
              <option value="eş">Eş</option>
              <option value="arkadaş">Arkadaş</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Doğum Tarihi</Label>
            <Input
              type="date"
              name="familyMemberBirthDate"
              value={formData.familyMemberBirthDate}
              onChange={handleInputChange}
              hasError={emptyFields.includes("familyMemberBirthDate")}
              data-error={emptyFields.includes("familyMemberBirthDate")}
            />
          </FormGroup>

          <FormGroup>
            <Label>Pasaport Numarası</Label>
            <Input
              type="text"
              name="familyMemberPassport"
              value={formData.familyMemberPassport}
              onChange={handleInputChange}
              placeholder="A12345678"
              hasError={emptyFields.includes("familyMemberPassport")}
              data-error={emptyFields.includes("familyMemberPassport")}
            />
          </FormGroup>

          <FormGroup>
            <Label>Varış Tarihi</Label>
            <Input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleInputChange}
              hasError={emptyFields.includes("arrivalDate")}
              data-error={emptyFields.includes("arrivalDate")}
            />
          </FormGroup>

          <FormGroup>
            <Label>Ayrılış Tarihi</Label>
            <Input
              type="date"
              name="exitDate"
              value={formData.exitDate}
              onChange={handleInputChange}
              hasError={emptyFields.includes("exitDate")}
              data-error={emptyFields.includes("exitDate")}
            />
          </FormGroup>
        </FormGrid>

        <div style={{ textAlign: "center" }}>
          <GenerateButton onClick={generateLetter}>
            Davetiye Mektubu Oluştur
          </GenerateButton>
        </div>
      </FormContainer>

      {showLetter && (
        <LetterContainer id="letter-content">
          <LetterDate>
            <strong>{getCurrentDate()}</strong>
          </LetterDate>

          <div style={{ margin: "20px 0" }}>
            <strong>
              {formData.country} Consulate General,{" "}
              {formData.consularCity || "[Consular City]"}
            </strong>
          </div>

          <div style={{ margin: "20px 0" }}>
            <strong>
              Subject: Visitor Visa Application for{" "}
              {formData.familyMemberName || "[Visitor's Full Name]"}
            </strong>
          </div>

          <div style={{ margin: "20px 0" }}>
            <strong>To Whom It May Concern,</strong>
          </div>

          <LetterBody>
            <p>
              I am writing to invite my{" "}
              {getRelationshipInEnglish(formData.relationship)},{" "}
              <strong>
                {formData.familyMemberName || "[Visitor's Full Name]"}
              </strong>
              , to visit me in {formData.country}.
              {formData.relationship === "anne" ||
              formData.relationship === "kız kardeş" ||
              formData.relationship === "kız" ||
              formData.relationship === "büyükanne" ||
              formData.relationship === "teyze/hala" ||
              formData.relationship === "eş"
                ? "She"
                : "He"}{" "}
              intends to stay with me from{" "}
              <strong>{formData.arrivalDate || "[proposed entry date]"}</strong>{" "}
              until{" "}
              <strong>{formData.exitDate || "[proposed exit date]"}</strong>.
            </p>

            <p>
              {formData.relationship === "anne" ||
              formData.relationship === "kız kardeş" ||
              formData.relationship === "kız" ||
              formData.relationship === "büyükanne" ||
              formData.relationship === "teyze/hala" ||
              formData.relationship === "eş"
                ? "Her"
                : "His"}{" "}
              details are as follows:
              <br />
              <strong>Full name:</strong>{" "}
              {formData.familyMemberName || "[Visitor's Full Name]"}
              <br />
              <strong>Passport Number:</strong>{" "}
              {formData.familyMemberPassport || "[Passport Number]"}
              <br />
              <strong>Date of birth:</strong>{" "}
              {formData.familyMemberBirthDate
                ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                    "en-GB"
                  )
                : "[DD/MM/YYYY]"}
              <br />
              <strong>Relationship to me:</strong>{" "}
              {getRelationshipInEnglish(formData.relationship)
                ? getRelationshipInEnglish(formData.relationship)
                    .charAt(0)
                    .toUpperCase() +
                  getRelationshipInEnglish(formData.relationship).slice(1)
                : "[Relationship]"}
            </p>

            <p>
              I am currently employed as a{" "}
              <strong>{formData.occupation || "[Your Job Title]"}</strong> at{" "}
              <strong>{formData.workplace || "[Company Name]"}</strong>. I have
              been living in {formData.country} for the past{" "}
              {formData.livingInCountryDuration
                ? `${formData.livingInCountryDuration} years`
                : "[duration]"}{" "}
              and hold <strong>{getStatusInEnglish(formData.status)}</strong>.
            </p>

            <p>
              I will accommodate my{" "}
              {getRelationshipInEnglish(formData.relationship)} at my residence
              throughout the duration of{" "}
              {formData.relationship === "anne" ||
              formData.relationship === "kız kardeş" ||
              formData.relationship === "kız" ||
              formData.relationship === "büyükanne" ||
              formData.relationship === "teyze/hala" ||
              formData.relationship === "eş"
                ? "her"
                : "his"}{" "}
              visit. My home has sufficient space to host{" "}
              {formData.relationship === "anne" ||
              formData.relationship === "kız kardeş" ||
              formData.relationship === "kız" ||
              formData.relationship === "büyükanne" ||
              formData.relationship === "teyze/hala" ||
              formData.relationship === "eş"
                ? "her"
                : "him"}{" "}
              comfortably. The address is:
              <br />
              <strong>
                {formData.accommodationAddress ||
                  formData.yourAddress ||
                  "[Your Full Address]"}
              </strong>
            </p>

            <p>
              Should you require any additional information, please do not
              hesitate to contact me.
            </p>
          </LetterBody>

          <LetterSignature>
            <p>Sincerely,</p>

            <div style={{ margin: "40px 0 20px 0" }}>
              <div
                style={{
                  borderBottom: "1px solid #000",
                  width: "200px",
                  marginBottom: "5px",
                }}
              ></div>
              <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
                Signature
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                {formData.yourName || "[Your Full Name]"}
              </p>
              <p style={{ margin: "5px 0" }}>
                {formData.email || "[Email Address]"}
              </p>
              <p style={{ margin: "5px 0" }}>
                {formData.phone || "[Phone Number]"}
              </p>
            </div>
          </LetterSignature>

          <div
            style={{ textAlign: "center", marginTop: "30px" }}
            className="no-print"
          >
            <Button onClick={downloadLetter}>📄 Mektubu İndir/Yazdır</Button>
          </div>
        </LetterContainer>
      )}
    </Container>
  );
}

/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../ui/Logo.jsx";

// ===============================
// STYLED COMPONENTS
// ===============================
const Container = styled.div`
  max-width: 800px;
  border-radius: 16px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
  background: var(--color-grey-927);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: var(--color-grey-1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  margin: 10px 0 0 0;
`;

const FormContainer = styled.div`
  background: var(--color-grey-1);
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
  color: var(--color-grey-930);
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
  color: black;
  background: ${(props) =>
    props.hasError ? "#fed7d7" : "var(--color-grey-929)"};

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

  /* Tarih input'ları için özel stil - Her yere tıklanabilir */
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
    opacity: 0;
  }

  /* Firefox için */
  &[type="date"]::-moz-focus-inner,
  &[type="month"]::-moz-focus-inner {
    border: 0;
  }

  /* Tarih input'larına click event için */
  &[type="date"],
  &[type="month"] {
    &::-webkit-datetime-edit,
    &::-webkit-datetime-edit-fields-wrapper,
    &::-webkit-datetime-edit-text,
    &::-webkit-datetime-edit-month-field,
    &::-webkit-datetime-edit-day-field,
    &::-webkit-datetime-edit-year-field {
      cursor: pointer;
    }
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
  color: black;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#e53e3e" : "#667eea")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.hasError ? "rgba(229, 62, 62, 0.1)" : "rgba(102, 126, 234, 0.1)"};
  }
`;

const SectionTitle = styled.h3`
  color: var(--color-grey-930);
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

const GenerateButton = styled.button`
  background: linear-gradient(135deg, #004466, #00ffa2);
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
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 600px;
  height: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  margin: auto;

  @media (max-width: 768px) {
    width: 90vw;
    height: 100%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #00ffa2 0%, #004466 100%);
  border-radius: 20px 20px 0 0;
`;

const ModalTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 0;
`;

const LetterContainer = styled.div`
  background: white;
  padding: 30px;
  font-family: "Times New Roman", serif;
  line-height: 1.5;
  color: #2d3748;
  font-size: 0.9rem;
`;

const LetterDate = styled.div`
  margin-bottom: 20px;
  color: #4a5568;
  text-align: right;
`;

const DownloadButton = styled.button`
  background: #48bb78;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: #38a169;
    transform: translateY(-1px);
  }
`;

// ===============================
// COUNTRY CONFIGURATIONS (KÜMELER)
// ===============================

const COUNTRY_CONFIGS = {
  // İNGİLİZCE KÜME - UK ve diğer İngilizce konuşan ülkeler için
  "United Kingdom": {
    // Zorunlu alanlar
    requiredFields: [
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
    ],

    // Cinsiyet seçimi gereken ilişkiler (UK için yok)
    genderRequiredRelationships: [],

    // Status çevirme fonksiyonu
    getStatus: (status) => {
      const statusMap = {
        citizen: "British citizen",
        "permanent resident": "permanent resident",
        "EU settled status": "EU settled status",
        "Tier 2 visa holder": "Tier 2 visa holder",
        "Student visa": "student visa holder",
        "Work permit": "work permit holder",
      };
      return statusMap[status] || status;
    },

    // İngilizce mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["United Kingdom"];

      return `
        <div style="margin: 20px 0">
          <strong>UK Visa Application Centre, ${
            formData.consularCity || "[Consular City]"
          }</strong>
        </div>

        <div style="margin: 20px 0">
          <strong>Subject: Invitation Letter for Visitor Visa for ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>
        </div>

        <div style="margin: 20px 0">
          <strong>Dear Visa Officer,</strong>
        </div>

        <div style="margin: 30px 0">
          <p>
            I hereby formally invite my ${formData.relationship}, 
            <strong>${
              formData.familyMemberName || "[Visitor's Full Name]"
            }</strong>, 
            to visit me in the United Kingdom. They intend to visit me from 
            <strong>${
              formData.arrivalDate || "[proposed entry date]"
            }</strong> until 
            <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
          </p>

          <p>
            The details of the visitor are as follows:<br/>
            <strong>Full Name:</strong> ${
              formData.familyMemberName || "[Visitor's Full Name]"
            }<br/>
            <strong>Passport Number:</strong> ${
              formData.familyMemberPassport || "[Passport Number]"
            }<br/>
            <strong>Date of Birth:</strong> ${
              formData.familyMemberBirthDate
                ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                    "en-GB"
                  )
                : "[DD/MM/YYYY]"
            }<br/>
            <strong>Relationship to me:</strong> ${formData.relationship}
          </p>

          <p>
            I am currently employed as <strong>${
              formData.occupation || "[Your Job Title]"
            }</strong> 
            at <strong>${formData.workplace || "[Company Name]"}</strong>. 
            I have been living in the UK for 
            ${
              formData.livingInCountryDuration
                ? `${formData.livingInCountryDuration} years`
                : "[duration]"
            } 
            and hold <strong>${config.getStatus(
              formData.status
            )}</strong> status.
          </p>

          <p>
            I will accommodate my ${
              formData.relationship
            } during their entire stay at my residence. 
            My accommodation has adequate space for proper lodging. The address is:<br/>
            <strong>${
              formData.accommodationAddress ||
              formData.yourAddress ||
              "[Your Full Address]"
            }</strong>
          </p>

          <p>Should you require any additional information, please do not hesitate to contact me.</p>
        </div>

        <div style="margin-top: 50px">
          <p>Yours sincerely,</p>

          <div style="margin: 40px 0 20px 0">
            <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">Signature</p>
          </div>

          <div style="margin-top: 20px">
            <p style="margin: 5px 0; font-weight: bold;">${
              formData.yourName || "[Your Full Name]"
            }</p>
            <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
            <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
          </div>
        </div>
      `;
    },
  },

  // Diğer ülke kümeleri buraya eklenecek...
  // ALMANCA KÜME - Germany için
  Germany: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "brother"],

    // Almanca gramer fonksiyonları
    getGermanRelationship: (relationship, gender) => {
      const relationships = {
        mother: "meine Mutter",
        father: "meinen Vater",
        brother: gender === "male" ? "meinen Bruder" : "meine Schwester",
        sister: "meine Schwester",
        son: "meinen Sohn",
        daughter: "meine Tochter",
        grandmother: "meine Großmutter",
        grandfather: "meinen Großvater",
        uncle: "meinen Onkel",
        aunt: "meine Tante",
        spouse: gender === "male" ? "meinen Ehemann" : "meine Ehefrau",
        friend: gender === "male" ? "meinen Freund" : "meine Freundin",
      };
      return relationships[relationship] || relationship;
    },

    getGermanPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Er" : "Sie";
    },

    getGermanRelationshipEn: (relationship) => {
      const map = {
        mother: "Mutter",
        father: "Vater",
        brother: "Bruder",
        sister: "Schwester",
        son: "Sohn",
        daughter: "Tochter",
        grandmother: "Großmutter",
        grandfather: "Großvater",
        uncle: "Onkel",
        aunt: "Tante",
        spouse: "Ehepartner",
        friend: "Freund/Freundin",
      };
      return map[relationship] || relationship;
    },

    getStatusInGerman: (status) => {
      const map = {
        citizen: "deutsche Staatsbürgerschaft",
        "permanent resident": "unbefristete Aufenthaltserlaubnis",
        "EU settled status": "EU-Niederlassungserlaubnis",
        "Tier 2 visa holder": "Arbeitsvisum",
        "Student visa": "Studentenvisum",
        "Work permit": "Arbeitserlaubnis",
      };
      return map[status] || status;
    },

    // Almanca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Germany"];

      return `
      <div style="margin: 20px 0">
        <strong>Deutsches Generalkonsulat, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Antrag auf Besuchervisum für ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Sehr geehrte Damen und Herren,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          hiermit möchte ich ${config.getGermanRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          zu einem Besuch nach Deutschland einladen. ${config.getGermanPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          beabsichtigt, mich in Deutschland vom 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> bis zum 
          <strong>${
            formData.exitDate || "[proposed exit date]"
          }</strong> zu besuchen.
        </p>

        <p>
          Die Angaben zur Person sind wie folgt:<br/>
          <strong>Vollständiger Name:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Reisepassnummer:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Geburtsdatum:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "de-DE"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Verwandtschaftsverhältnis zu mir:</strong> ${config.getGermanRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Ich bin derzeit als <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          bei <strong>${
            formData.workplace || "[Company Name]"
          }</strong> beschäftigt. 
          Ich lebe seit ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          Jahren in Deutschland und besitze <strong>${config.getStatusInGerman(
            formData.status
          )}</strong>.
        </p>

        <p>
          Ich werde ${config.getGermanRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          während des gesamten Aufenthalts in meiner Wohnung unterbringen. 
          Meine Wohnung bietet ausreichend Platz für eine angemessene Unterbringung. Die Adresse lautet:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Sollten Sie weitere Informationen benötigen, zögern Sie bitte nicht, mich zu kontaktieren.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Mit freundlichen Grüßen</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Unterschrift</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // FRANSIZCA KÜME - France için
  France: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Fransızca gramer fonksiyonları
    getFrenchRelationship: (relationship, gender) => {
      const relationships = {
        mother: "ma mère",
        father: "mon père",
        brother: "mon frère",
        sister: "ma sœur",
        son: "mon fils",
        daughter: "ma fille",
        grandmother: "ma grand-mère",
        grandfather: "mon grand-père",
        uncle: "mon oncle",
        aunt: "ma tante",
        spouse: gender === "male" ? "mon mari" : "ma femme",
        friend: gender === "male" ? "mon ami" : "mon amie",
        cousin: gender === "male" ? "mon cousin" : "ma cousine",
      };
      return relationships[relationship] || relationship;
    },

    getFrenchPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Il" : "Elle";
    },

    getFrenchRelationshipEn: (relationship) => {
      const map = {
        mother: "Mère",
        father: "Père",
        brother: "Frère",
        sister: "Sœur",
        son: "Fils",
        daughter: "Fille",
        grandmother: "Grand-mère",
        grandfather: "Grand-père",
        uncle: "Oncle",
        aunt: "Tante",
        spouse: "Époux/Épouse",
        friend: "Ami(e)",
        cousin: "Cousin(e)",
      };
      return map[relationship] || relationship;
    },

    getStatusInFrench: (status) => {
      const map = {
        citizen: "citoyen français",
        "permanent resident": "résident permanent",
        "EU settled status": "statut de résident UE",
        "Tier 2 visa holder": "détenteur de visa de travail",
        "Student visa": "visa étudiant",
        "Work permit": "permis de travail",
      };
      return map[status] || status;
    },

    // Fransızca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["France"];

      return `
      <div style="margin: 20px 0">
        <strong>Consulat de France, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Objet: Demande de visa de visite pour ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Madame, Monsieur,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Par la présente, j'ai l'honneur d'inviter ${config.getFrenchRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          à me rendre visite en France. ${config.getFrenchPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          prévoit de me rendre visite du 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> au 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Les informations concernant le visiteur sont les suivantes :<br/>
          <strong>Nom complet :</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Numéro de passeport :</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Date de naissance :</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "fr-FR"
                )
              : "[DD/MM/YYYY]"
          }<br/>
          <strong>Lien de parenté avec moi :</strong> ${config.getFrenchRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Je suis actuellement employé(e) en tant que <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          chez <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Je vis en France depuis ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          ans et je détiens <strong>${config.getStatusInFrench(
            formData.status
          )}</strong>.
        </p>

        <p>
          J'hébergerai ${config.getFrenchRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          pendant toute la durée de son séjour à mon domicile. 
          Mon logement dispose d'un espace suffisant pour un hébergement approprié. L'adresse est :<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Si vous avez besoin d'informations supplémentaires, n'hésitez pas à me contacter.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Signature</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // İTALYANCA KÜME - Italy için
  Italy: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // İtalyanca gramer fonksiyonları
    getItalianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "mia madre",
        father: "mio padre",
        brother: "mio fratello",
        sister: "mia sorella",
        son: "mio figlio",
        daughter: "mia figlia",
        grandmother: "mia nonna",
        grandfather: "mio nonno",
        uncle: "mio zio",
        aunt: "mia zia",
        spouse: gender === "male" ? "mio marito" : "mia moglie",
        friend: gender === "male" ? "il mio amico" : "la mia amica",
        cousin: gender === "male" ? "mio cugino" : "mia cugina",
      };
      return relationships[relationship] || relationship;
    },

    getItalianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Egli" : "Ella";
    },

    getItalianRelationshipEn: (relationship) => {
      const map = {
        mother: "Madre",
        father: "Padre",
        brother: "Fratello",
        sister: "Sorella",
        son: "Figlio",
        daughter: "Figlia",
        grandmother: "Nonna",
        grandfather: "Nonno",
        uncle: "Zio",
        aunt: "Zia",
        spouse: "Coniuge",
        friend: "Amico/a",
        cousin: "Cugino/a",
      };
      return map[relationship] || relationship;
    },

    getStatusInItalian: (status) => {
      const map = {
        citizen: "cittadino italiano",
        "permanent resident": "residente permanente",
        "EU settled status": "status di residente UE",
        "Tier 2 visa holder": "titolare di visto di lavoro",
        "Student visa": "visto per studenti",
        "Work permit": "permesso di lavoro",
      };
      return map[status] || status;
    },

    // İtalyanca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Italy"];

      return `
      <div style="margin: 20px 0">
        <strong>Consolato d'Italia, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Oggetto: Richiesta di visto turistico per ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Egregio Ufficiale Visti,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Con la presente, invito formalmente ${config.getItalianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          a farmi visita in Italia. ${config.getItalianPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          intende visitarmi dal 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> al 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          I dettagli del visitatore sono i seguenti:<br/>
          <strong>Nome completo:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Numero di passaporto:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Data di nascita:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "it-IT"
                )
              : "[DD/MM/YYYY]"
          }<br/>
          <strong>Rapporto di parentela con me:</strong> ${config.getItalianRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Attualmente sono impiegato/a come <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          presso <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Vivo in Italia da ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          anni e possiedo <strong>${config.getStatusInItalian(
            formData.status
          )}</strong>.
        </p>

        <p>
          Ospiterò ${config.getItalianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          per tutta la durata del soggiorno nella mia residenza. 
          La mia abitazione dispone di spazio adeguato per un alloggio appropriato. L'indirizzo è:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Qualora aveste bisogno di ulteriori informazioni, non esitate a contattarmi.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Distinti saluti,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Firma</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // İSPANYOLCA KÜME - Spain için
  Spain: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // İspanyolca gramer fonksiyonları
    getSpanishRelationship: (relationship, gender) => {
      const relationships = {
        mother: "mi madre",
        father: "mi padre",
        brother: "mi hermano",
        sister: "mi hermana",
        son: "mi hijo",
        daughter: "mi hija",
        grandmother: "mi abuela",
        grandfather: "mi abuelo",
        uncle: "mi tío",
        aunt: "mi tía",
        spouse: gender === "male" ? "mi esposo" : "mi esposa",
        friend: gender === "male" ? "mi amigo" : "mi amiga",
        cousin: gender === "male" ? "mi primo" : "mi prima",
      };
      return relationships[relationship] || relationship;
    },

    getSpanishPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Él" : "Ella";
    },

    getSpanishRelationshipEn: (relationship) => {
      const map = {
        mother: "Madre",
        father: "Padre",
        brother: "Hermano",
        sister: "Hermana",
        son: "Hijo",
        daughter: "Hija",
        grandmother: "Abuela",
        grandfather: "Abuelo",
        uncle: "Tío",
        aunt: "Tía",
        spouse: "Cónyuge",
        friend: "Amigo/a",
        cousin: "Primo/a",
      };
      return map[relationship] || relationship;
    },

    getStatusInSpanish: (status) => {
      const map = {
        citizen: "ciudadano español",
        "permanent resident": "residente permanente",
        "EU settled status": "estatus de residente UE",
        "Tier 2 visa holder": "portador de visa de trabajo",
        "Student visa": "visa de estudiante",
        "Work permit": "permiso de trabajo",
      };
      return map[status] || status;
    },

    // İspanyolca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Spain"];

      return `
      <div style="margin: 20px 0">
        <strong>Consulado de España, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Asunto: Solicitud de visa de turista para ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Estimado Oficial de Visas,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Por medio de la presente, invito formalmente a ${config.getSpanishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          a visitarme en España. ${config.getSpanishPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          tiene la intención de visitarme desde el 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> hasta el 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Los detalles del visitante son los siguientes:<br/>
          <strong>Nombre completo:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Número de pasaporte:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Fecha de nacimiento:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "es-ES"
                )
              : "[DD/MM/YYYY]"
          }<br/>
          <strong>Relación conmigo:</strong> ${config.getSpanishRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Actualmente estoy empleado/a como <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          en <strong>${formData.workplace || "[Company Name]"}</strong>. 
          He estado viviendo en España durante ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          años y poseo <strong>${config.getStatusInSpanish(
            formData.status
          )}</strong>.
        </p>

        <p>
          Hospedaré a ${config.getSpanishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          durante toda su estancia en mi residencia. 
          Mi alojamiento tiene espacio adecuado para un hospedaje apropiado. La dirección es:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Si necesitan información adicional, no duden en contactarme.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Atentamente,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Firma</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // LEHÇE KÜME - Poland için
  Poland: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Lehçe gramer fonksiyonları
    getPolishRelationship: (relationship, gender) => {
      const relationships = {
        mother: "moją matkę",
        father: "mojego ojca",
        brother: "mojego brata",
        sister: "moją siostrę",
        son: "mojego syna",
        daughter: "moją córkę",
        grandmother: "moją babcię",
        grandfather: "mojego dziadka",
        uncle: "mojego wuja",
        aunt: "moją ciocię",
        spouse: gender === "male" ? "mojego męża" : "moją żonę",
        friend: gender === "male" ? "mojego przyjaciela" : "moją przyjaciółkę",
        cousin: gender === "male" ? "mojego kuzyna" : "moją kuzynkę",
      };
      return relationships[relationship] || relationship;
    },

    getPolishPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "On" : "Ona";
    },

    getPolishRelationshipEn: (relationship) => {
      const map = {
        mother: "Matka",
        father: "Ojciec",
        brother: "Brat",
        sister: "Siostra",
        son: "Syn",
        daughter: "Córka",
        grandmother: "Babcia",
        grandfather: "Dziadek",
        uncle: "Wuj",
        aunt: "Ciocia",
        spouse: "Małżonek",
        friend: "Przyjaciel",
        cousin: "Kuzyn",
      };
      return map[relationship] || relationship;
    },

    getStatusInPolish: (status) => {
      const map = {
        citizen: "obywatel polski",
        "permanent resident": "stały mieszkaniec",
        "EU settled status": "status mieszkańca UE",
        "Tier 2 visa holder": "posiadacz wizy pracowniczej",
        "Student visa": "wiza studencka",
        "Work permit": "zezwolenie na pracę",
      };
      return map[status] || status;
    },

    // Lehçe mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Poland"];

      return `
      <div style="margin: 20px 0">
        <strong>Konsulat Rzeczypospolitej Polskiej, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Temat: Wniosek o wizę turystyczną dla ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Szanowny Panie/Pani,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Niniejszym formalnie zapraszam ${config.getPolishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          do odwiedzenia mnie w Polsce. ${config.getPolishPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          planuje wizytę u mnie od 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> do 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Dane osobowe gościa:<br/>
          <strong>Imię i nazwisko:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Numer paszportu:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Data urodzenia:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "pl-PL"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Stopień pokrewieństwa:</strong> ${config.getPolishRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Jestem obecnie zatrudniony/a jako <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          w <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Mieszkam w Polsce od ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          lat i posiadam <strong>${config.getStatusInPolish(
            formData.status
          )}</strong>.
        </p>

        <p>
          Zakwateruję ${config.getPolishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          przez cały okres pobytu w moim mieszkaniu. 
          Moje mieszkanie ma odpowiednią przestrzeń dla właściwego zakwaterowania. Adres:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>W razie potrzeby dodatkowych informacji, proszę o kontakt.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Z poważaniem,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Podpis</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // MACARCA KÜME - Hungary için
  Hungary: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Macarca gramer fonksiyonları
    getHungarianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "édesanyámat",
        father: "édesapámat",
        brother: "bátyámat",
        sister: "nővéremet",
        son: "fiamat",
        daughter: "lányomat",
        grandmother: "nagyanyámat",
        grandfather: "nagyapámat",
        uncle: "bácsikámat",
        aunt: "nénikémet",
        spouse: gender === "male" ? "férjemet" : "feleségemet",
        friend: gender === "male" ? "barátomat" : "barátnőmet",
        cousin: gender === "male" ? "unokatestvéremet" : "unokatestvéremet",
      };
      return relationships[relationship] || relationship;
    },

    getHungarianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Ő" : "Ő"; // Macarca'da tek zamir
    },

    getHungarianRelationshipEn: (relationship) => {
      const map = {
        mother: "Édesanya",
        father: "Édesapa",
        brother: "Báty",
        sister: "Nővér",
        son: "Fiú",
        daughter: "Lány",
        grandmother: "Nagyanya",
        grandfather: "Nagyapa",
        uncle: "Bácsi",
        aunt: "Néni",
        spouse: "Házastárs",
        friend: "Barát",
        cousin: "Unokatestvér",
      };
      return map[relationship] || relationship;
    },

    getStatusInHungarian: (status) => {
      const map = {
        citizen: "magyar állampolgár",
        "permanent resident": "állandó lakos",
        "EU settled status": "EU letelepedett státusz",
        "Tier 2 visa holder": "munkavízum tulajdonos",
        "Student visa": "diákvízum",
        "Work permit": "munkavállalási engedély",
      };
      return map[status] || status;
    },

    // Macarca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Hungary"];

      return `
      <div style="margin: 20px 0">
        <strong>Magyar Konzulátus, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Tárgy: Turistavízum kérelem ${
          formData.familyMemberName || "[Visitor's Full Name]"
        } részére</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Tisztelt Vízumhivatal,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Ezennel hivatalosan meghívom ${config.getHungarianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>-t, 
          hogy meglátogasson Magyarországon. ${config.getHungarianPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          tervezi, hogy meglátogat 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong>-tól 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>-ig.
        </p>

        <p>
          A látogató adatai a következők:<br/>
          <strong>Teljes név:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Útlevél száma:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Születési dátum:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "hu-HU"
                )
              : "[YYYY.MM.DD]"
          }<br/>
          <strong>Rokonsági fok:</strong> ${config.getHungarianRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Jelenleg <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          munkakörben dolgozom a <strong>${
            formData.workplace || "[Company Name]"
          }</strong>-nál. 
          ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          éve élek Magyarországon és <strong>${config.getStatusInHungarian(
            formData.status
          )}</strong> vagyok.
        </p>

        <p>
          ${config.getHungarianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          a teljes tartózkodási idő alatt az otthonomban fogom elszállásolni. 
          A lakásom megfelelő helyet biztosít a megfelelő elhelyezéshez. A cím:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>További információk szükségessége esetén kérem, vegyenek fel velem a kapcsolatot.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Tisztelettel,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Aláírás</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // FLEMENKÇE KÜME - Netherlands için
  Netherlands: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Flemenkçe gramer fonksiyonları
    getDutchRelationship: (relationship, gender) => {
      const relationships = {
        mother: "mijn moeder",
        father: "mijn vader",
        brother: "mijn broer",
        sister: "mijn zus",
        son: "mijn zoon",
        daughter: "mijn dochter",
        grandmother: "mijn oma",
        grandfather: "mijn opa",
        uncle: "mijn oom",
        aunt: "mijn tante",
        spouse: gender === "male" ? "mijn echtgenoot" : "mijn echtgenote",
        friend: gender === "male" ? "mijn vriend" : "mijn vriendin",
        cousin: gender === "male" ? "mijn neef" : "mijn nicht",
      };
      return relationships[relationship] || relationship;
    },

    getDutchPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Hij" : "Zij";
    },

    getDutchRelationshipEn: (relationship) => {
      const map = {
        mother: "Moeder",
        father: "Vader",
        brother: "Broer",
        sister: "Zus",
        son: "Zoon",
        daughter: "Dochter",
        grandmother: "Oma",
        grandfather: "Opa",
        uncle: "Oom",
        aunt: "Tante",
        spouse: "Echtgenoot/Echtgenote",
        friend: "Vriend(in)",
        cousin: "Neef/Nicht",
      };
      return map[relationship] || relationship;
    },

    getStatusInDutch: (status) => {
      const map = {
        citizen: "Nederlandse burger",
        "permanent resident": "permanent inwoner",
        "EU settled status": "EU gevestigde status",
        "Tier 2 visa holder": "werkvisum houder",
        "Student visa": "studentenvisum",
        "Work permit": "werkvergunning",
      };
      return map[status] || status;
    },

    // Flemenkçe mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Netherlands"];

      return `
      <div style="margin: 20px 0">
        <strong>Nederlandse Consulaat, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Betreft: Aanvraag toeristenvisum voor ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Geachte visumambtenaar,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Hierbij nodig ik formeel ${config.getDutchRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          uit om mij te bezoeken in Nederland. ${config.getDutchPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          is van plan mij te bezoeken van 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> tot 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          De gegevens van de bezoeker zijn als volgt:<br/>
          <strong>Volledige naam:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Paspoortnummer:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Geboortedatum:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "nl-NL"
                )
              : "[DD-MM-YYYY]"
          }<br/>
          <strong>Verwantschap met mij:</strong> ${config.getDutchRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Ik ben momenteel werkzaam als <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          bij <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Ik woon al ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          jaar in Nederland en bezit <strong>${config.getStatusInDutch(
            formData.status
          )}</strong>.
        </p>

        <p>
          Ik zal ${config.getDutchRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          gedurende het gehele verblijf onderbrengen in mijn woning. 
          Mijn accommodatie heeft voldoende ruimte voor een passende huisvesting. Het adres is:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Mocht u aanvullende informatie nodig hebben, aarzel dan niet om contact met mij op te nemen.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Met vriendelijke groet,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Handtekening</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // İSVEÇÇE KÜME - Sweden için
  Sweden: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // İsveççe gramer fonksiyonları
    getSwedishRelationship: (relationship, gender) => {
      const relationships = {
        mother: "min mor",
        father: "min far",
        brother: "min bror",
        sister: "min syster",
        son: "min son",
        daughter: "min dotter",
        grandmother: "min mormor",
        grandfather: "min morfar",
        uncle: "min farbror",
        aunt: "min faster",
        spouse: gender === "male" ? "min man" : "min fru",
        friend: gender === "male" ? "min vän" : "min vän",
        cousin: gender === "male" ? "min kusin" : "min kusin",
      };
      return relationships[relationship] || relationship;
    },

    getSwedishPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Han" : "Hon";
    },

    getSwedishRelationshipEn: (relationship) => {
      const map = {
        mother: "Mor",
        father: "Far",
        brother: "Bror",
        sister: "Syster",
        son: "Son",
        daughter: "Dotter",
        grandmother: "Mormor",
        grandfather: "Morfar",
        uncle: "Farbror",
        aunt: "Faster",
        spouse: "Make/Maka",
        friend: "Vän",
        cousin: "Kusin",
      };
      return map[relationship] || relationship;
    },

    getStatusInSwedish: (status) => {
      const map = {
        citizen: "svensk medborgare",
        "permanent resident": "permanent bosatt",
        "EU settled status": "EU-bosatt status",
        "Tier 2 visa holder": "arbetsvisuminnehavare",
        "Student visa": "studentvisum",
        "Work permit": "arbetstillstånd",
      };
      return map[status] || status;
    },

    // İsveççe mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Sweden"];

      return `
      <div style="margin: 20px 0">
        <strong>Svenska Konsulatet, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Ämne: Ansökan om turistvisum för ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Bästa visumhandläggare,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Härmed inbjuder jag formellt ${config.getSwedishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          att besöka mig i Sverige. ${config.getSwedishPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          planerar att besöka mig från 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> till 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Besökarens uppgifter är följande:<br/>
          <strong>Fullständigt namn:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Passnummer:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Födelsedatum:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "sv-SE"
                )
              : "[YYYY-MM-DD]"
          }<br/>
          <strong>Relation till mig:</strong> ${config.getSwedishRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Jag är för närvarande anställd som <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          på <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Jag har bott i Sverige i ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          år och har <strong>${config.getStatusInSwedish(
            formData.status
          )}</strong>.
        </p>

        <p>
          Jag kommer att härbärgera ${config.getSwedishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          under hela vistelsen i mitt hem. 
          Min bostad har tillräckligt utrymme för lämpligt boende. Adressen är:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Skulle ni behöva ytterligare information, tveka inte att kontakta mig.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Med vänliga hälsningar,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Underskrift</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // DANCA KÜME - Denmark için
  Denmark: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Danca gramer fonksiyonları
    getDanishRelationship: (relationship, gender) => {
      const relationships = {
        mother: "min mor",
        father: "min far",
        brother: "min bror",
        sister: "min søster",
        son: "min søn",
        daughter: "min datter",
        grandmother: "min mormor",
        grandfather: "min morfar",
        uncle: "min onkel",
        aunt: "min tante",
        spouse: gender === "male" ? "min mand" : "min kone",
        friend: gender === "male" ? "min ven" : "min veninde",
        cousin: gender === "male" ? "min fætter" : "min kusine",
      };
      return relationships[relationship] || relationship;
    },

    getDanishPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Han" : "Hun";
    },

    getDanishRelationshipEn: (relationship) => {
      const map = {
        mother: "Mor",
        father: "Far",
        brother: "Bror",
        sister: "Søster",
        son: "Søn",
        daughter: "Datter",
        grandmother: "Mormor",
        grandfather: "Morfar",
        uncle: "Onkel",
        aunt: "Tante",
        spouse: "Ægtefælle",
        friend: "Ven",
        cousin: "Fætter/Kusine",
      };
      return map[relationship] || relationship;
    },

    getStatusInDanish: (status) => {
      const map = {
        citizen: "dansk statsborger",
        "permanent resident": "permanent beboer",
        "EU settled status": "EU-bosiddende status",
        "Tier 2 visa holder": "arbejdsvisumindehaver",
        "Student visa": "studentervisum",
        "Work permit": "arbejdstilladelse",
      };
      return map[status] || status;
    },

    // Danca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Denmark"];

      return `
      <div style="margin: 20px 0">
        <strong>Danmarks Konsulat, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Emne: Ansøgning om turistvisum for ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Kære visumbehandler,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Hermed inviterer jeg formelt ${config.getDanishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          til at besøge mig i Danmark. ${config.getDanishPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          planlægger at besøge mig fra 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> til 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Besøgerens oplysninger er som følger:<br/>
          <strong>Fulde navn:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Pasnummer:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Fødselsdato:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "da-DK"
                )
              : "[DD-MM-YYYY]"
          }<br/>
          <strong>Relation til mig:</strong> ${config.getDanishRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Jeg er i øjeblikket ansat som <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          hos <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Jeg har boet i Danmark i ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          år og har <strong>${config.getStatusInDanish(
            formData.status
          )}</strong>.
        </p>

        <p>
          Jeg vil huse ${config.getDanishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          i hele opholdsperioden i mit hjem. 
          Min bolig har tilstrækkelig plads til passende indkvartering. Adressen er:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Skulle I have brug for yderligere oplysninger, så tøv ikke med at kontakte mig.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Med venlig hilsen,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Underskrift</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // AVUSTURYA ALMANCASI KÜME - Austria için
  Austria: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Avusturya Almancası gramer fonksiyonları
    getAustrianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "meine Mutter",
        father: "meinen Vater",
        brother: "meinen Bruder",
        sister: "meine Schwester",
        son: "meinen Sohn",
        daughter: "meine Tochter",
        grandmother: "meine Großmutter",
        grandfather: "meinen Großvater",
        uncle: "meinen Onkel",
        aunt: "meine Tante",
        spouse: gender === "male" ? "meinen Gatten" : "meine Gattin",
        friend: gender === "male" ? "meinen Freund" : "meine Freundin",
        cousin: gender === "male" ? "meinen Cousin" : "meine Cousine",
      };
      return relationships[relationship] || relationship;
    },

    getAustrianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Er" : "Sie";
    },

    getAustrianRelationshipEn: (relationship) => {
      const map = {
        mother: "Mutter",
        father: "Vater",
        brother: "Bruder",
        sister: "Schwester",
        son: "Sohn",
        daughter: "Tochter",
        grandmother: "Großmutter",
        grandfather: "Großvater",
        uncle: "Onkel",
        aunt: "Tante",
        spouse: "Gatte/Gattin",
        friend: "Freund/Freundin",
        cousin: "Cousin/Cousine",
      };
      return map[relationship] || relationship;
    },

    getStatusInAustrian: (status) => {
      const map = {
        citizen: "österreichische Staatsbürgerschaft",
        "permanent resident": "Daueraufenthaltsberechtigung",
        "EU settled status": "EU-Niederlassungserlaubnis",
        "Tier 2 visa holder": "Arbeitsvisum",
        "Student visa": "Studentenvisum",
        "Work permit": "Beschäftigungsbewilligung",
      };
      return map[status] || status;
    },

    // Avusturya Almancası mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Austria"];

      return `
      <div style="margin: 20px 0">
        <strong>Österreichisches Generalkonsulat, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Betreff: Antrag auf Besuchervisum für ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Sehr geehrte Damen und Herren,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          hiermit möchte ich ${config.getAustrianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          zu einem Aufenthalt nach Österreich einladen. ${config.getAustrianPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          beabsichtigt, mich in Österreich vom 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> bis zum 
          <strong>${
            formData.exitDate || "[proposed exit date]"
          }</strong> zu besuchen.
        </p>

        <p>
          Die Angaben zur Person sind wie folgt:<br/>
          <strong>Vollständiger Name:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Reisepassnummer:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Geburtsdatum:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "de-AT"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Verwandtschaftsverhältnis zu mir:</strong> ${config.getAustrianRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Ich bin derzeit als <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          bei <strong>${
            formData.workplace || "[Company Name]"
          }</strong> beschäftigt. 
          Ich lebe seit ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          Jahren in Österreich und besitze <strong>${config.getStatusInAustrian(
            formData.status
          )}</strong>.
        </p>

        <p>
          Ich werde ${config.getAustrianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          während des gesamten Aufenthalts in meiner Wohnung beherbergen. 
          Meine Wohnung bietet ausreichend Platz für eine angemessene Unterbringung. Die Adresse lautet:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Sollten Sie weitere Informationen benötigen, zögern Sie bitte nicht, mich zu kontaktieren.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Mit freundlichen Grüßen</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Unterschrift</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // PORTEKİZCE KÜME - Portugal için
  Portugal: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Portekizce gramer fonksiyonları
    getPortugueseRelationship: (relationship, gender) => {
      const relationships = {
        mother: "minha mãe",
        father: "meu pai",
        brother: "meu irmão",
        sister: "minha irmã",
        son: "meu filho",
        daughter: "minha filha",
        grandmother: "minha avó",
        grandfather: "meu avô",
        uncle: "meu tio",
        aunt: "minha tia",
        spouse: gender === "male" ? "meu marido" : "minha esposa",
        friend: gender === "male" ? "meu amigo" : "minha amiga",
        cousin: gender === "male" ? "meu primo" : "minha prima",
      };
      return relationships[relationship] || relationship;
    },

    getPortuguesePronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Ele" : "Ela";
    },

    getPortugueseRelationshipEn: (relationship) => {
      const map = {
        mother: "Mãe",
        father: "Pai",
        brother: "Irmão",
        sister: "Irmã",
        son: "Filho",
        daughter: "Filha",
        grandmother: "Avó",
        grandfather: "Avô",
        uncle: "Tio",
        aunt: "Tia",
        spouse: "Cônjuge",
        friend: "Amigo/a",
        cousin: "Primo/a",
      };
      return map[relationship] || relationship;
    },

    getStatusInPortuguese: (status) => {
      const map = {
        citizen: "cidadão português",
        "permanent resident": "residente permanente",
        "EU settled status": "estatuto de residente UE",
        "Tier 2 visa holder": "portador de visto de trabalho",
        "Student visa": "visto de estudante",
        "Work permit": "autorização de trabalho",
      };
      return map[status] || status;
    },

    // Portekizce mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Portugal"];

      return `
      <div style="margin: 20px 0">
        <strong>Consulado de Portugal, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Assunto: Pedido de visto de turista para ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Exmo.(a) Sr.(a) Funcionário(a) de Vistos,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Pela presente, convido formalmente ${config.getPortugueseRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          a visitar-me em Portugal. ${config.getPortuguesePronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          pretende visitar-me de 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> até 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Os dados do visitante são os seguintes:<br/>
          <strong>Nome completo:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Número do passaporte:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Data de nascimento:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "pt-PT"
                )
              : "[DD/MM/YYYY]"
          }<br/>
          <strong>Grau de parentesco comigo:</strong> ${config.getPortugueseRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Atualmente estou empregado(a) como <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          na <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Vivo em Portugal há ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          anos e possuo <strong>${config.getStatusInPortuguese(
            formData.status
          )}</strong>.
        </p>

        <p>
          Irei alojar ${config.getPortugueseRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          durante toda a estadia na minha residência. 
          A minha habitação tem espaço adequado para um alojamento apropriado. O endereço é:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Caso necessitem de informações adicionais, não hesitem em contactar-me.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Com os melhores cumprimentos,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Assinatura</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // YUNANCA KÜME - Greece için
  Greece: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Yunanca gramer fonksiyonları
    getGreekRelationship: (relationship, gender) => {
      const relationships = {
        mother: "τη μητέρα μου",
        father: "τον πατέρα μου",
        brother: "τον αδελφό μου",
        sister: "την αδελφή μου",
        son: "τον γιο μου",
        daughter: "την κόρη μου",
        grandmother: "τη γιαγιά μου",
        grandfather: "τον παππού μου",
        uncle: "τον θείο μου",
        aunt: "τη θεία μου",
        spouse: gender === "male" ? "τον σύζυγό μου" : "τη σύζυγό μου",
        friend: gender === "male" ? "τον φίλο μου" : "τη φίλη μου",
        cousin: gender === "male" ? "τον ξάδελφό μου" : "την ξαδέλφη μου",
      };
      return relationships[relationship] || relationship;
    },

    getGreekPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Αυτός" : "Αυτή";
    },

    getGreekRelationshipEn: (relationship) => {
      const map = {
        mother: "Μητέρα",
        father: "Πατέρας",
        brother: "Αδελφός",
        sister: "Αδελφή",
        son: "Γιος",
        daughter: "Κόρη",
        grandmother: "Γιαγιά",
        grandfather: "Παππούς",
        uncle: "Θείος",
        aunt: "Θεία",
        spouse: "Σύζυγος",
        friend: "Φίλος/η",
        cousin: "Ξάδελφος/η",
      };
      return map[relationship] || relationship;
    },

    getStatusInGreek: (status) => {
      const map = {
        citizen: "Έλληνας πολίτης",
        "permanent resident": "μόνιμος κάτοικος",
        "EU settled status": "κάτοχος στάτους διαμονής ΕΕ",
        "Tier 2 visa holder": "κάτοχος εργασιακής βίζας",
        "Student visa": "φοιτητική βίζα",
        "Work permit": "άδεια εργασίας",
      };
      return map[status] || status;
    },

    // Yunanca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Greece"];

      return `
      <div style="margin: 20px 0">
        <strong>Προξενείο της Ελλάδας, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Θέμα: Αίτηση για τουριστική βίζα για ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Αξιότιμε Υπάλληλε Βίζας,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Με την παρούσα επιστολή, προσκαλώ επίσημα ${config.getGreekRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          να με επισκεφθεί στην Ελλάδα. ${config.getGreekPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          σχεδιάζει να με επισκεφθεί από 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> έως 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Τα στοιχεία του επισκέπτη είναι τα εξής:<br/>
          <strong>Πλήρες όνομα:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Αριθμός διαβατηρίου:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Ημερομηνία γέννησης:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "el-GR"
                )
              : "[DD/MM/YYYY]"
          }<br/>
          <strong>Σχέση συγγένειας μαζί μου:</strong> ${config.getGreekRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Αυτή τη στιγμή εργάζομαι ως <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          στην <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Ζω στην Ελλάδα εδώ και ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          χρόνια και είμαι <strong>${config.getStatusInGreek(
            formData.status
          )}</strong>.
        </p>

        <p>
          Θα φιλοξενήσω ${config.getGreekRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          καθ' όλη τη διάρκεια της παραμονής στην κατοικία μου. 
          Η κατοικία μου διαθέτει επαρκή χώρο για κατάλληλη διαμονή. Η διεύθυνση είναι:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Εάν χρειάζεστε περισσότερες πληροφορίες, μη διστάσετε να επικοινωνήσετε μαζί μου.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Με εκτίμηση,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Υπογραφή</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // BULGARCA KÜME - Bulgaria için
  Bulgaria: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Bulgarca gramer fonksiyonları
    getBulgarianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "майка ми",
        father: "баща ми",
        brother: "брат ми",
        sister: "сестра ми",
        son: "син ми",
        daughter: "дъщеря ми",
        grandmother: "баба ми",
        grandfather: "дядо ми",
        uncle: "чичо ми",
        aunt: "леля ми",
        spouse: gender === "male" ? "съпруг ми" : "съпруга ми",
        friend: gender === "male" ? "приятел ми" : "приятелка ми",
        cousin: gender === "male" ? "братовчед ми" : "братовчедка ми",
      };
      return relationships[relationship] || relationship;
    },

    getBulgarianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Той" : "Тя";
    },

    getBulgarianRelationshipEn: (relationship) => {
      const map = {
        mother: "Майка",
        father: "Баща",
        brother: "Брат",
        sister: "Сестра",
        son: "Син",
        daughter: "Дъщеря",
        grandmother: "Баба",
        grandfather: "Дядо",
        uncle: "Чичо",
        aunt: "Леля",
        spouse: "Съпруг/а",
        friend: "Приятел/ка",
        cousin: "Братовчед/ка",
      };
      return map[relationship] || relationship;
    },

    getStatusInBulgarian: (status) => {
      const map = {
        citizen: "български гражданин",
        "permanent resident": "постоянен жител",
        "EU settled status": "статут на заселен в ЕС",
        "Tier 2 visa holder": "притежател на работна виза",
        "Student visa": "студентска виза",
        "Work permit": "разрешение за работа",
      };
      return map[status] || status;
    },

    // Bulgarca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Bulgaria"];

      return `
      <div style="margin: 20px 0">
        <strong>Консулство на България, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Относно: Заявление за туристическа виза за ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Уважаеми служителю по визи,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          С настоящото официално каня ${config.getBulgarianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          да ме посети в България. ${config.getBulgarianPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          планира да ме посети от 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> до 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Данните на посетителя са следните:<br/>
          <strong>Пълно име:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Номер на паспорт:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Дата на раждане:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "bg-BG"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Родственост с мен:</strong> ${config.getBulgarianRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          В момента работя като <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          в <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Живея в България от ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          години и имам <strong>${config.getStatusInBulgarian(
            formData.status
          )}</strong>.
        </p>

        <p>
          Ще настаня ${config.getBulgarianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          през цялото време на престоя в моето жилище. 
          Моето жилище има достатъчно място за подходящо настаняване. Адресът е:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Ако имате нужда от допълнителна информация, моля не се колебайте да се свържете с мен.</p>
      </div>

      <div style="margin-top: 50px">
        <p>С уважение,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Подпис</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  }, // ESTONCA KÜME - Estonia için
  Estonia: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Estonca gramer fonksiyonları
    getEstonianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "oma ema",
        father: "oma isa",
        brother: "oma venda",
        sister: "oma õde",
        son: "oma poega",
        daughter: "oma tütart",
        grandmother: "oma vanaema",
        grandfather: "oma vanaisa",
        uncle: "oma onu",
        aunt: "oma tädi",
        spouse: gender === "male" ? "oma meest" : "oma naist",
        friend: gender === "male" ? "oma sõpra" : "oma sõbrannat",
        cousin: gender === "male" ? "oma nõbu" : "oma nõbu",
      };
      return relationships[relationship] || relationship;
    },

    getEstonianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Ta" : "Ta"; // Estonca'da tek zamir
    },

    getEstonianRelationshipEn: (relationship) => {
      const map = {
        mother: "Ema",
        father: "Isa",
        brother: "Vend",
        sister: "Õde",
        son: "Poeg",
        daughter: "Tütar",
        grandmother: "Vanaema",
        grandfather: "Vanaisa",
        uncle: "Onu",
        aunt: "Tädi",
        spouse: "Abikaasa",
        friend: "Sõber",
        cousin: "Nõbu",
      };
      return map[relationship] || relationship;
    },

    getStatusInEstonian: (status) => {
      const map = {
        citizen: "Eesti kodanik",
        "permanent resident": "alaline elanik",
        "EU settled status": "EL elaniku staatus",
        "Tier 2 visa holder": "tööviisa omanik",
        "Student visa": "üliõpilasviisa",
        "Work permit": "tööluba",
      };
      return map[status] || status;
    },

    // Estonca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Estonia"];

      return `
        <div style="margin: 20px 0">
          <strong>Eesti Konsulaat, ${
            formData.consularCity || "[Consular City]"
          }</strong>
        </div>
  
        <div style="margin: 20px 0">
          <strong>Teema: Taotlus turistiviisa saamiseks isikule ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>
        </div>
  
        <div style="margin: 20px 0">
          <strong>Lugupeetud viisaspetsialist,</strong>
        </div>
  
        <div style="margin: 30px 0">
          <p>
            Käesolevaga kutsun ametlikult ${config.getEstonianRelationship(
              formData.relationship,
              formData.familyMemberGender
            )}, 
            <strong>${
              formData.familyMemberName || "[Visitor's Full Name]"
            }</strong>, 
            mind Eestis külastama. ${config.getEstonianPronoun(
              formData.relationship,
              formData.familyMemberGender
            )} 
            kavatseb mind külastada 
            <strong>${
              formData.arrivalDate || "[proposed entry date]"
            }</strong> kuni 
            <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
          </p>
  
          <p>
            Külastaja andmed on järgmised:<br/>
            <strong>Täisnimi:</strong> ${
              formData.familyMemberName || "[Visitor's Full Name]"
            }<br/>
            <strong>Passi number:</strong> ${
              formData.familyMemberPassport || "[Passport Number]"
            }<br/>
            <strong>Sünniaeg:</strong> ${
              formData.familyMemberBirthDate
                ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                    "et-EE"
                  )
                : "[DD.MM.YYYY]"
            }<br/>
            <strong>Sugulus minuga:</strong> ${config.getEstonianRelationshipEn(
              formData.relationship
            )}
          </p>
  
          <p>
            Hetkel töötan <strong>${
              formData.occupation || "[Your Job Title]"
            }</strong> 
            ettevõttes <strong>${
              formData.workplace || "[Company Name]"
            }</strong>. 
            Olen elanud Eestis ${
              formData.livingInCountryDuration
                ? `${formData.livingInCountryDuration}`
                : "[duration]"
            } 
            aastat ja mul on <strong>${config.getStatusInEstonian(
              formData.status
            )}</strong>.
          </p>
  
          <p>
            Majutan ${config.getEstonianRelationship(
              formData.relationship,
              formData.familyMemberGender
            )} 
            kogu viibimise aja jooksul oma kodus. 
            Mu eluruumis on piisavalt ruumi sobivaks majutuseks. Aadress on:<br/>
            <strong>${
              formData.accommodationAddress ||
              formData.yourAddress ||
              "[Your Full Address]"
            }</strong>
          </p>
  
          <p>Kui vajate täiendavat teavet, palun ärge kõhelge minuga ühendust võtmast.</p>
        </div>
  
        <div style="margin-top: 50px">
          <p>Lugupidamisega,</p>
  
          <div style="margin: 40px 0 20px 0">
            <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">Allkiri</p>
          </div>
  
          <div style="margin-top: 20px">
            <p style="margin: 5px 0; font-weight: bold;">${
              formData.yourName || "[Your Full Name]"
            }</p>
            <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
            <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
          </div>
        </div>
      `;
    },
  },
  // LİTVANYACA KÜME - Lithuania için
  Lithuania: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Litvanyaca gramer fonksiyonları
    getLithuanianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "savo motiną",
        father: "savo tėvą",
        brother: "savo brolį",
        sister: "savo seserį",
        son: "savo sūnų",
        daughter: "savo dukterį",
        grandmother: "savo močiutę",
        grandfather: "savo senelį",
        uncle: "savo dėdę",
        aunt: "savo tetą",
        spouse: gender === "male" ? "savo vyrą" : "savo žmoną",
        friend: gender === "male" ? "savo draugą" : "savo draugę",
        cousin: gender === "male" ? "savo pusbrolį" : "savo pusseserę",
      };
      return relationships[relationship] || relationship;
    },

    getLithuanianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Jis" : "Ji";
    },

    getLithuanianRelationshipEn: (relationship) => {
      const map = {
        mother: "Motina",
        father: "Tėvas",
        brother: "Brolis",
        sister: "Sesuo",
        son: "Sūnus",
        daughter: "Duktė",
        grandmother: "Močiutė",
        grandfather: "Senelis",
        uncle: "Dėdė",
        aunt: "Teta",
        spouse: "Sutuoktinis",
        friend: "Draugas/ė",
        cousin: "Pusbrolis/ė",
      };
      return map[relationship] || relationship;
    },

    getStatusInLithuanian: (status) => {
      const map = {
        citizen: "Lietuvos pilietis",
        "permanent resident": "nuolatinis gyventojas",
        "EU settled status": "ES gyventojo statusas",
        "Tier 2 visa holder": "darbo vizos turėtojas",
        "Student visa": "studento viza",
        "Work permit": "darbo leidimas",
      };
      return map[status] || status;
    },

    // Litvanyaca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Lithuania"];

      return `
      <div style="margin: 20px 0">
        <strong>Lietuvos konsulatas, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Tema: Prašymas išduoti turistinę vizą ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Gerbiamas vizų specialiste,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Šiuo laišku oficialiai kviečiu ${config.getLithuanianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          apsilankyti pas mane Lietuvoje. ${config.getLithuanianPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          planuoja mane aplankyti nuo 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> iki 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Lankytojo duomenys yra šie:<br/>
          <strong>Pilnas vardas:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Paso numeris:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Gimimo data:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "lt-LT"
                )
              : "[YYYY-MM-DD]"
          }<br/>
          <strong>Giminystės ryšys su manimi:</strong> ${config.getLithuanianRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Šiuo metu dirbu <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          įmonėje <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Lietuvoje gyvenu ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          metų ir turiu <strong>${config.getStatusInLithuanian(
            formData.status
          )}</strong>.
        </p>

        <p>
          ${config.getLithuanianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          apgyvendinsiu visą apsilankymo laikotarpį savo namuose. 
          Mano būstas turi pakankamai vietos tinkamam apgyvendinimui. Adresas:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Jei prireiks papildomos informacijos, nedvejodami susisiekite su manimi.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Pagarbiai,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Parašas</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // LETONCA KÜME - Latvia için
  Latvia: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Letonca gramer fonksiyonları
    getLatvianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "savu māti",
        father: "savu tēvu",
        brother: "savu brāli",
        sister: "savu māsu",
        son: "savu dēlu",
        daughter: "savu meitu",
        grandmother: "savu vecmāmiņu",
        grandfather: "savu vectēvu",
        uncle: "savu tēvoci",
        aunt: "savu tanti",
        spouse: gender === "male" ? "savu vīru" : "savu sievu",
        friend: gender === "male" ? "savu draugu" : "savu draudzeni",
        cousin: gender === "male" ? "savu brālēnu" : "savu māsīcu",
      };
      return relationships[relationship] || relationship;
    },

    getLatvianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Viņš" : "Viņa";
    },

    getLatvianRelationshipEn: (relationship) => {
      const map = {
        mother: "Māte",
        father: "Tēvs",
        brother: "Brālis",
        sister: "Māsa",
        son: "Dēls",
        daughter: "Meita",
        grandmother: "Vecmāmiņa",
        grandfather: "Vectēvs",
        uncle: "Tēvocis",
        aunt: "Tante",
        spouse: "Laulātais draugs",
        friend: "Draugs/dzene",
        cousin: "Brālēns/Māsīca",
      };
      return map[relationship] || relationship;
    },

    getStatusInLatvian: (status) => {
      const map = {
        citizen: "Latvijas pilsonis",
        "permanent resident": "pastāvīgs iedzīvotājs",
        "EU settled status": "ES iedzīvotāja statuss",
        "Tier 2 visa holder": "darba vīzas īpašnieks",
        "Student visa": "studenta vīza",
        "Work permit": "darba atļauja",
      };
      return map[status] || status;
    },

    // Letonca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Latvia"];

      return `
      <div style="margin: 20px 0">
        <strong>Latvijas konsulāts, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Temats: Lūgums izsniegt tūrisma vīzu ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Cienījamais vīzu speciālista kungs/kundze,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Ar šo vēstuli oficiāli aicinu ${config.getLatvianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          apmeklēt mani Latvijā. ${config.getLatvianPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          plāno mani apmeklēt no 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> līdz 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Apmeklētāja dati ir šādi:<br/>
          <strong>Pilns vārds:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Pases numurs:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Dzimšanas datums:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "lv-LV"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Radniecības saikne ar mani:</strong> ${config.getLatvianRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Pašlaik strādāju kā <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          uzņēmumā <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Latvijā dzīvoju ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          gadus un man ir <strong>${config.getStatusInLatvian(
            formData.status
          )}</strong>.
        </p>

        <p>
          Es izmitināšu ${config.getLatvianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          visa uzturēšanās laika garumā savās mājās. 
          Manā dzīvoklī ir pietiekami daudz vietas piemērotai izmitināšanai. Adrese ir:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Ja nepieciešama papildu informācija, lūdzu nevilcinieties sazināties ar mani.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Ar cieņu,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Paraksts</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // ROMENCE KÜME - Romania için
  Romania: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Romence gramer fonksiyonları
    getRomanianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "mama mea",
        father: "tatăl meu",
        brother: "fratele meu",
        sister: "sora mea",
        son: "fiul meu",
        daughter: "fiica mea",
        grandmother: "bunica mea",
        grandfather: "bunicul meu",
        uncle: "unchiul meu",
        aunt: "mătușa mea",
        spouse: gender === "male" ? "soțul meu" : "soția mea",
        friend: gender === "male" ? "prietenul meu" : "prietena mea",
        cousin: gender === "male" ? "vărul meu" : "verișoara mea",
      };
      return relationships[relationship] || relationship;
    },

    getRomanianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "El" : "Ea";
    },

    getRomanianRelationshipEn: (relationship) => {
      const map = {
        mother: "Mamă",
        father: "Tată",
        brother: "Frate",
        sister: "Soră",
        son: "Fiu",
        daughter: "Fiică",
        grandmother: "Bunică",
        grandfather: "Bunic",
        uncle: "Unchi",
        aunt: "Mătușă",
        spouse: "Soț/Soție",
        friend: "Prieten/ă",
        cousin: "Văr/Verișoară",
      };
      return map[relationship] || relationship;
    },

    getStatusInRomanian: (status) => {
      const map = {
        citizen: "cetățean român",
        "permanent resident": "rezident permanent",
        "EU settled status": "statut de rezident UE",
        "Tier 2 visa holder": "posesor de viză de muncă",
        "Student visa": "viză de student",
        "Work permit": "permis de muncă",
      };
      return map[status] || status;
    },

    // Romence mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Romania"];

      return `
      <div style="margin: 20px 0">
        <strong>Consulatul României, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Subiect: Cerere de viză turistică pentru ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Stimate domnule/doamnă ofițer de vize,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Prin prezenta, invit oficial pe ${config.getRomanianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          să mă viziteze în România. ${config.getRomanianPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          plănuiește să mă viziteze din 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> până în 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Datele vizitatorului sunt următoarele:<br/>
          <strong>Numele complet:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Numărul pașaportului:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Data nașterii:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "ro-RO"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Relația de rudenie cu mine:</strong> ${config.getRomanianRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          În prezent sunt angajat/ă ca <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          la <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Locuiesc în România de ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          ani și am <strong>${config.getStatusInRomanian(
            formData.status
          )}</strong>.
        </p>

        <p>
          Voi găzdui pe ${config.getRomanianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          pe toată durata șederii în locuința mea. 
          Locuința mea are spațiu adecvat pentru o cazare corespunzătoare. Adresa este:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Dacă aveți nevoie de informații suplimentare, vă rog să nu ezitați să mă contactați.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Cu stimă,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Semnătura</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // LÜKSEMBURGCA KÜME - Luxembourg için
  Luxembourg: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Lüksemburgca gramer fonksiyonları
    getLuxembourgishRelationship: (relationship, gender) => {
      const relationships = {
        mother: "meng Mamm",
        father: "mäin Papp",
        brother: "mäin Brudder",
        sister: "meng Schwëster",
        son: "mäin Jong",
        daughter: "meng Duechter",
        grandmother: "meng Groussmamm",
        grandfather: "mäin Grousspapp",
        uncle: "mäin Monni",
        aunt: "meng Tant",
        spouse: gender === "male" ? "mäin Mann" : "meng Fra",
        friend: gender === "male" ? "mäin Frënd" : "meng Frëndin",
        cousin: gender === "male" ? "mäin Cousin" : "meng Cousine",
      };
      return relationships[relationship] || relationship;
    },

    getLuxembourgishPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Hien" : "Si";
    },

    getLuxembourgishRelationshipEn: (relationship) => {
      const map = {
        mother: "Mamm",
        father: "Papp",
        brother: "Brudder",
        sister: "Schwëster",
        son: "Jong",
        daughter: "Duechter",
        grandmother: "Groussmamm",
        grandfather: "Grousspapp",
        uncle: "Monni",
        aunt: "Tant",
        spouse: "Mann/Fra",
        friend: "Frënd(in)",
        cousin: "Cousin(e)",
      };
      return map[relationship] || relationship;
    },

    getStatusInLuxembourgish: (status) => {
      const map = {
        citizen: "lëtzebuergesche Bierger",
        "permanent resident": "permanent Awunner",
        "EU settled status": "EU-Awunner Status",
        "Tier 2 visa holder": "Aarbechtsvisum Besëtzer",
        "Student visa": "Studentevisum",
        "Work permit": "Aarbechtserlabnis",
      };
      return map[status] || status;
    },

    // Lüksemburgca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Luxembourg"];

      return `
      <div style="margin: 20px 0">
        <strong>Lëtzebuerger Konsulat, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Betreff: Ufro fir Tourismusvisum fir ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Léif Visumbeamtin/Léiwe Visumbeamten,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Mat dësem Schreiwen invitéieren ech offiziell ${config.getLuxembourgishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          fir mech zu Lëtzebuerg ze besichen. ${config.getLuxembourgishPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          plangt mech ze besichen vum 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> bis de 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          D'Donnéeën vum Besuch sinn déi folgend:<br/>
          <strong>Kompletten Numm:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Passnummer:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Gebuertsdag:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "lb-LU"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Verwandtschaft mat mir:</strong> ${config.getLuxembourgishRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          Ech schaffen aktuell als <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          bei <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Ech wunnen zanter ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          Joer zu Lëtzebuerg an hun <strong>${config.getStatusInLuxembourgish(
            formData.status
          )}</strong>.
        </p>

        <p>
          Ech wäerd ${config.getLuxembourgishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          während der ganzer Zäit vum Openhalt a mengem Haus ënnerbréngen. 
          Meng Wunnung huet genuch Plaz fir eng passend Ënnerkunft. D'Adress ass:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Wann Dir zousätzlech Informatiounen braucht, zéckt net mech ze kontaktéieren.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Mat fréndlechen Gréiss,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Ënnerschrëft</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // MALTA İNGİLİZCE KÜME - Malta için
  Malta: {
    // Zorunlu alanlar
    requiredFields: [
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
    ],

    // Cinsiyet seçimi gereken ilişkiler (Malta için yok)
    genderRequiredRelationships: [],

    // Status çevirme fonksiyonu
    getStatus: (status) => {
      const statusMap = {
        citizen: "Maltese citizen",
        "permanent resident": "permanent resident",
        "EU settled status": "EU settled status",
        "Tier 2 visa holder": "work permit holder",
        "Student visa": "student visa holder",
        "Work permit": "work permit holder",
      };
      return statusMap[status] || status;
    },

    // Malta İngilizce mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Malta"];

      return `
      <div style="margin: 20px 0">
        <strong>Malta High Commission, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Subject: Invitation Letter for Visitor Visa for ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Dear Visa Officer,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          I hereby formally invite my ${formData.relationship}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          to visit me in Malta. They intend to visit me from 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> until 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          The details of the visitor are as follows:<br/>
          <strong>Full Name:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Passport Number:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Date of Birth:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "en-MT"
                )
              : "[DD/MM/YYYY]"
          }<br/>
          <strong>Relationship to me:</strong> ${formData.relationship}
        </p>

        <p>
          I am currently employed as <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          at <strong>${formData.workplace || "[Company Name]"}</strong>. 
          I have been living in Malta for 
          ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration} years`
              : "[duration]"
          } 
          and hold <strong>${config.getStatus(formData.status)}</strong> status.
        </p>

        <p>
          I will accommodate my ${
            formData.relationship
          } during their entire stay at my residence. 
          My accommodation has adequate space for proper lodging. The address is:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Should you require any additional information, please do not hesitate to contact me.</p>
      </div>

      <div style="margin-top: 50px">
        <p>Yours sincerely,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Signature</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // ÇEKÇE KÜME - Czech Republic için
  "Czech Republic": {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Çekçe gramer fonksiyonları
    getCzechRelationship: (relationship, gender) => {
      const relationships = {
        mother: "svou matku",
        father: "svého otce",
        brother: "svého bratra",
        sister: "svou sestru",
        son: "svého syna",
        daughter: "svou dceru",
        grandmother: "svou babičku",
        grandfather: "svého děda",
        uncle: "svého strýce",
        aunt: "svou tetu",
        spouse: gender === "male" ? "svého manžela" : "svou manželku",
        friend: gender === "male" ? "svého přítele" : "svou přítelkyni",
        cousin: gender === "male" ? "svého bratrance" : "svou sestřenici",
      };
      return relationships[relationship] || relationship;
    },

    getCzechPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "On" : "Ona";
    },

    getCzechRelationshipEn: (relationship) => {
      const map = {
        mother: "Matka",
        father: "Otec",
        brother: "Bratr",
        sister: "Sestra",
        son: "Syn",
        daughter: "Dcera",
        grandmother: "Babička",
        grandfather: "Děda",
        uncle: "Strýc",
        aunt: "Teta",
        spouse: "Manžel/ka",
        friend: "Přítel/kyně",
        cousin: "Bratranec/Sestřenice",
      };
      return map[relationship] || relationship;
    },

    getStatusInCzech: (status) => {
      const map = {
        citizen: "český občan",
        "permanent resident": "stálý obyvatel",
        "EU settled status": "status usazeného občana EU",
        "Tier 2 visa holder": "držitel pracovního víza",
        "Student visa": "studentské vízum",
        "Work permit": "pracovní povolení",
      };
      return map[status] || status;
    },

    // Çekçe mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Czech Republic"];

      return `
      <div style="margin: 20px 0">
        <strong>Generální konzulát České republiky, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Předmět: Žádost o turistické vízum pro ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>

      <div style="margin: 20px 0">
        <strong>Vážený vízovém úředníku,</strong>
      </div>

      <div style="margin: 30px 0">
        <p>
          Tímto oficiálně zvu ${config.getCzechRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          aby mě navštívila v České republice. ${config.getCzechPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          plánuje mě navštívit od 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> do 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>

        <p>
          Údaje o návštěvníkovi jsou následující:<br/>
          <strong>Celé jméno:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Číslo pasu:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Datum narození:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "cs-CZ"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Příbuzenský vztah ke mně:</strong> ${config.getCzechRelationshipEn(
            formData.relationship
          )}
        </p>

        <p>
          V současné době pracuji jako <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          ve společnosti <strong>${
            formData.workplace || "[Company Name]"
          }</strong>. 
          V České republice žiji ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          let a mám <strong>${config.getStatusInCzech(
            formData.status
          )}</strong>.
        </p>

        <p>
          Budu ubytovávat ${config.getCzechRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          po celou dobu pobytu v mém bytě. 
          Můj byt má dostatečný prostor pro vhodné ubytování. Adresa je:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>

        <p>Pokud budete potřebovat další informace, neváhejte mě kontaktovat.</p>
      </div>

      <div style="margin-top: 50px">
        <p>S pozdravem,</p>

        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Podpis</p>
        </div>

        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // FİNLANDİYACA KÜME - Finland için
  Finland: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Fince gramer fonksiyonları
    getFinnishRelationship: (relationship, gender) => {
      const relationships = {
        mother: "äitini",
        father: "isäni",
        brother: "veljeni",
        sister: "sisareni",
        son: "poikani",
        daughter: "tyttäreni",
        grandmother: "isoäitini",
        grandfather: "isoisäni",
        uncle: "setäni",
        aunt: "täitini",
        spouse: gender === "male" ? "aviomieheni" : "aviovaimoni",
        friend: gender === "male" ? "ystäväni" : "ystävättäreni",
        cousin: gender === "male" ? "serkkuni" : "serkkuni",
      };
      return relationships[relationship] || relationship;
    },

    getFinnishPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Hän" : "Hän";
    },

    getFinnishRelationshipEn: (relationship) => {
      const map = {
        mother: "Äiti",
        father: "Isä",
        brother: "Veli",
        sister: "Sisar",
        son: "Poika",
        daughter: "Tytär",
        grandmother: "Isoäiti",
        grandfather: "Isoisä",
        uncle: "Setä",
        aunt: "Täti",
        spouse: "Puoliso",
        friend: "Ystävä",
        cousin: "Serkku",
      };
      return map[relationship] || relationship;
    },

    getStatusInFinnish: (status) => {
      const map = {
        citizen: "Suomen kansalainen",
        "permanent resident": "pysyvä asukas",
        "EU settled status": "EU:n vakituinen asukas",
        "Tier 2 visa holder": "työviisainhaltija",
        "Student visa": "opiskelijaviisumi",
        "Work permit": "työlupa",
      };
      return map[status] || status;
    },

    // Fince mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Finland"];

      return `
      <div style="margin: 20px 0">
        <strong>Suomen konsulaatti, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Aihe: Turistiviisumin hakeminen henkilölle ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Arvoisa viisumiupseeri,</strong>
      </div>
 
      <div style="margin: 30px 0">
        <p>
          Kutsun täten virallisesti ${config.getFinnishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          vierailemaan luonani Suomessa. ${config.getFinnishPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          suunnittelee vierailevansa luonani 
          <strong>${formData.arrivalDate || "[proposed entry date]"}</strong> - 
          <strong>${
            formData.exitDate || "[proposed exit date]"
          }</strong> välisenä aikana.
        </p>
 
        <p>
          Vierailijan tiedot ovat seuraavat:<br/>
          <strong>Koko nimi:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Passin numero:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Syntymäaika:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "fi-FI"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Sukulaisuussuhde minuun:</strong> ${config.getFinnishRelationshipEn(
            formData.relationship
          )}
        </p>
 
        <p>
          Työskentelen tällä hetkellä <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          yrityksessä <strong>${
            formData.workplace || "[Company Name]"
          }</strong>. 
          Olen asunut Suomessa ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          vuotta ja minulla on <strong>${config.getStatusInFinnish(
            formData.status
          )}</strong>.
        </p>
 
        <p>
          Majoitan ${config.getFinnishRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          koko oleskelun ajan kodissani. 
          Asunnossani on riittävästi tilaa asianmukaiseen majoitukseen. Osoite on:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>
 
        <p>Jos tarvitsette lisätietoja, älkää epäröikö ottaa minuun yhteyttä.</p>
      </div>
 
      <div style="margin-top: 50px">
        <p>Ystävällisin terveisin,</p>
 
        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Allekirjoitus</p>
        </div>
 
        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // HIRVATÇA KÜME - Croatia için
  Croatia: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Hırvatça gramer fonksiyonları
    getCroatianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "svoju majku",
        father: "svog oca",
        brother: "svog brata",
        sister: "svoju sestru",
        son: "svog sina",
        daughter: "svoju kćer",
        grandmother: "svoju baku",
        grandfather: "svog djeda",
        uncle: "svog ujaka",
        aunt: "svoju tetku",
        spouse: gender === "male" ? "svog muža" : "svoju ženu",
        friend: gender === "male" ? "svog prijatelja" : "svoju prijateljicu",
        cousin: gender === "male" ? "svog rođaka" : "svoju rođakinju",
      };
      return relationships[relationship] || relationship;
    },

    getCroatianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "On" : "Ona";
    },

    getCroatianRelationshipEn: (relationship) => {
      const map = {
        mother: "Majka",
        father: "Otac",
        brother: "Brat",
        sister: "Sestra",
        son: "Sin",
        daughter: "Kćer",
        grandmother: "Baka",
        grandfather: "Djed",
        uncle: "Ujak",
        aunt: "Tetka",
        spouse: "Supružnik/ca",
        friend: "Prijatelj/ica",
        cousin: "Rođak/inja",
      };
      return map[relationship] || relationship;
    },

    getStatusInCroatian: (status) => {
      const map = {
        citizen: "hrvatski državljanin",
        "permanent resident": "stalni stanovnik",
        "EU settled status": "status nastanjenog građanina EU",
        "Tier 2 visa holder": "nositelj radne vize",
        "Student visa": "studentska viza",
        "Work permit": "radna dozvola",
      };
      return map[status] || status;
    },

    // Hırvatça mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Croatia"];

      return `
      <div style="margin: 20px 0">
        <strong>Generalni konzulat Republike Hrvatske, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Predmet: Zahtjev za turističku vizu za ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Poštovani vizni službenici,</strong>
      </div>
 
      <div style="margin: 30px 0">
        <p>
          Ovim putem službeno pozivam ${config.getCroatianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          da me posjeti u Hrvatskoj. ${config.getCroatianPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          planira me posjetiti od 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> do 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>
 
        <p>
          Podaci o posjetitelju su sljedeći:<br/>
          <strong>Puno ime:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Broj putovnice:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Datum rođenja:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "hr-HR"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Rodbinska veza sa mnom:</strong> ${config.getCroatianRelationshipEn(
            formData.relationship
          )}
        </p>
 
        <p>
          Trenutno radim kao <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          u tvrtki <strong>${formData.workplace || "[Company Name]"}</strong>. 
          U Hrvatskoj živim ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          godina i imam <strong>${config.getStatusInCroatian(
            formData.status
          )}</strong>.
        </p>
 
        <p>
          Smjestit ću ${config.getCroatianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          tijekom cijelog boravka u mom stanu. 
          Moj stan ima dovoljno prostora za prikladni smještaj. Adresa je:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>
 
        <p>Ako trebate dodatne informacije, ne ustručavajte se kontaktirati me.</p>
      </div>
 
      <div style="margin-top: 50px">
        <p>S poštovanjem,</p>
 
        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Potpis</p>
        </div>
 
        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // NORVEÇÇE KÜME - Norway için
  Norway: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Norveççe gramer fonksiyonları
    getNorwegianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "min mor",
        father: "min far",
        brother: "min bror",
        sister: "min søster",
        son: "min sønn",
        daughter: "min datter",
        grandmother: "min bestemor",
        grandfather: "min bestefar",
        uncle: "min onkel",
        aunt: "min tante",
        spouse: gender === "male" ? "min mann" : "min kone",
        friend: gender === "male" ? "min venn" : "min venninne",
        cousin: gender === "male" ? "min fetter" : "min kusine",
      };
      return relationships[relationship] || relationship;
    },

    getNorwegianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Han" : "Hun";
    },

    getNorwegianRelationshipEn: (relationship) => {
      const map = {
        mother: "Mor",
        father: "Far",
        brother: "Bror",
        sister: "Søster",
        son: "Sønn",
        daughter: "Datter",
        grandmother: "Bestemor",
        grandfather: "Bestefar",
        uncle: "Onkel",
        aunt: "Tante",
        spouse: "Ektefelle",
        friend: "Venn",
        cousin: "Fetter/Kusine",
      };
      return map[relationship] || relationship;
    },

    getStatusInNorwegian: (status) => {
      const map = {
        citizen: "norsk statsborger",
        "permanent resident": "fast bosatt",
        "EU settled status": "EU/EØS fast bosatt",
        "Tier 2 visa holder": "arbeidsvisum innehaver",
        "Student visa": "studentvisum",
        "Work permit": "arbeidstillatelse",
      };
      return map[status] || status;
    },

    // Norveççe mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Norway"];

      return `
      <div style="margin: 20px 0">
        <strong>Norges konsulat, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Emne: Søknad om turistvisum for ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Kjære visumsaksbehandler,</strong>
      </div>
 
      <div style="margin: 30px 0">
        <p>
          Med dette brevet inviterer jeg offisielt ${config.getNorwegianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          til å besøke meg i Norge. ${config.getNorwegianPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          planlegger å besøke meg fra 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> til 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>
 
        <p>
          Besøkendes opplysninger er som følger:<br/>
          <strong>Fullt navn:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Passnummer:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Fødselsdato:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "no-NO"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Slektskapsforhold til meg:</strong> ${config.getNorwegianRelationshipEn(
            formData.relationship
          )}
        </p>
 
        <p>
          Jeg jobber for tiden som <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          hos <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Jeg har bodd i Norge i ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          år og har <strong>${config.getStatusInNorwegian(
            formData.status
          )}</strong>.
        </p>
 
        <p>
          Jeg vil innlosjere ${config.getNorwegianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          under hele oppholdet i mitt hjem. 
          Min bolig har tilstrekkelig plass for passende innkvartering. Adressen er:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>
 
        <p>Hvis dere trenger ytterligere informasjon, ikke nøl med å kontakte meg.</p>
      </div>
 
      <div style="margin-top: 50px">
        <p>Med vennlig hilsen,</p>
 
        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Underskrift</p>
        </div>
 
        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // SLOVAKÇA KÜME - Slovakia için
  Slovakia: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Slovakça gramer fonksiyonları
    getSlovakRelationship: (relationship, gender) => {
      const relationships = {
        mother: "svoju matku",
        father: "svojho otca",
        brother: "svojho brata",
        sister: "svoju sestru",
        son: "svojho syna",
        daughter: "svoju dcéru",
        grandmother: "svoju babičku",
        grandfather: "svojho dedka",
        uncle: "svojho strýka",
        aunt: "svoju tetu",
        spouse: gender === "male" ? "svojho manžela" : "svoju manželku",
        friend: gender === "male" ? "svojho priateľa" : "svoju priateľku",
        cousin: gender === "male" ? "svojho bratranca" : "svoju sesterničku",
      };
      return relationships[relationship] || relationship;
    },

    getSlovakPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "On" : "Ona";
    },

    getSlovakRelationshipEn: (relationship) => {
      const map = {
        mother: "Matka",
        father: "Otec",
        brother: "Brat",
        sister: "Sestra",
        son: "Syn",
        daughter: "Dcéra",
        grandmother: "Babička",
        grandfather: "Dedko",
        uncle: "Strýko",
        aunt: "Teta",
        spouse: "Manžel/ka",
        friend: "Priateľ/ka",
        cousin: "Bratranec/Sesternica",
      };
      return map[relationship] || relationship;
    },

    getStatusInSlovak: (status) => {
      const map = {
        citizen: "slovenský občan",
        "permanent resident": "stály obyvateľ",
        "EU settled status": "status usadeného občana EÚ",
        "Tier 2 visa holder": "držiteľ pracovnej vízy",
        "Student visa": "študentská víza",
        "Work permit": "pracovné povolenie",
      };
      return map[status] || status;
    },

    // Slovakça mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Slovakia"];

      return `
      <div style="margin: 20px 0">
        <strong>Generálny konzulát Slovenskej republiky, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Predmet: Žiadosť o turistickú vízu pre ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Vážený vízový úradník,</strong>
      </div>
 
      <div style="margin: 30px 0">
        <p>
          Týmto oficiálne pozývam ${config.getSlovakRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          aby ma navštívila na Slovensku. ${config.getSlovakPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          plánuje ma navštíviť od 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> do 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>
 
        <p>
          Údaje o návštevníkovi sú nasledovné:<br/>
          <strong>Celé meno:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Číslo pasu:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Dátum narodenia:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "sk-SK"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Príbuzenský vzťah ku mne:</strong> ${config.getSlovakRelationshipEn(
            formData.relationship
          )}
        </p>
 
        <p>
          V súčasnosti pracujem ako <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          v spoločnosti <strong>${
            formData.workplace || "[Company Name]"
          }</strong>. 
          Na Slovensku žijem ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          rokov a mám <strong>${config.getStatusInSlovak(
            formData.status
          )}</strong>.
        </p>
 
        <p>
          Budem ubytovávať ${config.getSlovakRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          počas celého pobytu vo svojom byte. 
          Môj byt má dostatok priestoru pre vhodné ubytovanie. Adresa je:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>
 
        <p>Ak budete potrebovať ďalšie informácie, neváhajte ma kontaktovať.</p>
      </div>
 
      <div style="margin-top: 50px">
        <p>S pozdravom,</p>
 
        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Podpis</p>
        </div>
 
        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // SLOVENCE KÜME - Slovenia için
  Slovenia: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Slovence gramer fonksiyonları
    getSlovenianRelationship: (relationship, gender) => {
      const relationships = {
        mother: "svojo mater",
        father: "svojega očeta",
        brother: "svojega brata",
        sister: "svojo sestro",
        son: "svojega sina",
        daughter: "svojo hčer",
        grandmother: "svojo babico",
        grandfather: "svojega dedka",
        uncle: "svojega strica",
        aunt: "svojo teto",
        spouse: gender === "male" ? "svojega moža" : "svojo ženo",
        friend: gender === "male" ? "svojega prijatelja" : "svojo prijateljico",
        cousin: gender === "male" ? "svojega bratranca" : "svojo sestrično",
      };
      return relationships[relationship] || relationship;
    },

    getSlovenianPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "On" : "Ona";
    },

    getSlovenianRelationshipEn: (relationship) => {
      const map = {
        mother: "Mati",
        father: "Oče",
        brother: "Brat",
        sister: "Sestra",
        son: "Sin",
        daughter: "Hči",
        grandmother: "Babica",
        grandfather: "Dedek",
        uncle: "Stric",
        aunt: "Teta",
        spouse: "Zakonec/ka",
        friend: "Prijatelj/ica",
        cousin: "Bratranec/Sestrična",
      };
      return map[relationship] || relationship;
    },

    getStatusInSlovenian: (status) => {
      const map = {
        citizen: "slovenski državljan",
        "permanent resident": "stalni prebivalec",
        "EU settled status": "status nastanjene osebe EU",
        "Tier 2 visa holder": "imetnik delovne vize",
        "Student visa": "študentska viza",
        "Work permit": "delovno dovoljenje",
      };
      return map[status] || status;
    },

    // Slovence mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Slovenia"];

      return `
      <div style="margin: 20px 0">
        <strong>Generalni konzulat Republike Slovenije, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Zadeva: Prošnja za turistično vizo za ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Spoštovani vizni uradnik,</strong>
      </div>
 
      <div style="margin: 30px 0">
        <p>
          S tem pismom uradno vabim ${config.getSlovenianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          da me obišče v Sloveniji. ${config.getSlovenianPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          načrtuje obisk od 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> do 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>
 
        <p>
          Podatki o obiskovalcu so naslednji:<br/>
          <strong>Polno ime:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Številka potnega lista:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Datum rojstva:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "sl-SI"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Sorodstveno razmerje z mano:</strong> ${config.getSlovenianRelationshipEn(
            formData.relationship
          )}
        </p>
 
        <p>
          Trenutno delam kot <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          v podjetju <strong>${
            formData.workplace || "[Company Name]"
          }</strong>. 
          V Sloveniji živim ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          let in imam <strong>${config.getStatusInSlovenian(
            formData.status
          )}</strong>.
        </p>
 
        <p>
          Nameščal bom ${config.getSlovenianRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          ves čas obiska v svojem stanovanju. 
          Moje stanovanje ima dovolj prostora za primerno nastanitev. Naslov je:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>
 
        <p>Če potrebujete dodatne informacije, me prosim kontaktirajte.</p>
      </div>
 
      <div style="margin-top: 50px">
        <p>Lep pozdrav,</p>
 
        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Podpis</p>
        </div>
 
        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // İZLANDCA KÜME - Iceland için
  Iceland: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // İzlandca gramer fonksiyonları
    getIcelandicRelationship: (relationship, gender) => {
      const relationships = {
        mother: "móður mína",
        father: "föður minn",
        brother: "bróður minn",
        sister: "systur mína",
        son: "son minn",
        daughter: "dóttur mína",
        grandmother: "ömmu mína",
        grandfather: "afa minn",
        uncle: "frænda minn",
        aunt: "frænku mína",
        spouse: gender === "male" ? "eiginmann minn" : "eiginkonu mína",
        friend: gender === "male" ? "vin minn" : "vinkonu mína",
        cousin: gender === "male" ? "frænda minn" : "frænku mína",
      };
      return relationships[relationship] || relationship;
    },

    getIcelandicPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Hann" : "Hún";
    },

    getIcelandicRelationshipEn: (relationship) => {
      const map = {
        mother: "Móðir",
        father: "Faðir",
        brother: "Bróðir",
        sister: "Systir",
        son: "Sonur",
        daughter: "Dóttir",
        grandmother: "Amma",
        grandfather: "Afi",
        uncle: "Frændi",
        aunt: "Frænka",
        spouse: "Maki",
        friend: "Vinur/Vinkona",
        cousin: "Frændi/Frænka",
      };
      return map[relationship] || relationship;
    },

    getStatusInIcelandic: (status) => {
      const map = {
        citizen: "íslenskur ríkisborgari",
        "permanent resident": "fastur íbúi",
        "EU settled status": "EES búseturéttindi",
        "Tier 2 visa holder": "vinnuvísuhafi",
        "Student visa": "námsmannsvísa",
        "Work permit": "vinnuleyfi",
      };
      return map[status] || status;
    },

    // İzlandca mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Iceland"];

      return `
      <div style="margin: 20px 0">
        <strong>Sendiræði Íslands, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Efni: Umsókn um ferðamannsvísu fyrir ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Virðulegi vísumstarfsmaður,</strong>
      </div>
 
      <div style="margin: 30px 0">
        <p>
          Með þessu bréfi bjóð ég opinberlega ${config.getIcelandicRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          að heimsækja mig til Íslands. ${config.getIcelandicPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          ætlar að heimsækja mig frá 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> til 
          <strong>${formData.exitDate || "[proposed exit date]"}</strong>.
        </p>
 
        <p>
          Upplýsingar um gestinn eru eftirfarandi:<br/>
          <strong>Fullt nafn:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Vegabréfsnúmer:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Fæðingardagur:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "is-IS"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Skyldleiki við mig:</strong> ${config.getIcelandicRelationshipEn(
            formData.relationship
          )}
        </p>
 
        <p>
          Ég vinn sem <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          hjá <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Ég hef búið á Íslandi í ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          ár og er með <strong>${config.getStatusInIcelandic(
            formData.status
          )}</strong>.
        </p>
 
        <p>
          Ég mun hýsa ${config.getIcelandicRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          allan tíma dvalarinnar í mínu heimili. 
          Íbúð mín er nægilega rúmgóð fyrir viðeigandi gistingu. Heimilisfangið er:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>
 
        <p>Ef þú þarft frekari upplýsingar, vinsamlegast hafðu samband við mig.</p>
      </div>
 
      <div style="margin-top: 50px">
        <p>Virðingarfyllst,</p>
 
        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Undirskrift</p>
        </div>
 
        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
  // ALMANCA KÜME - Switzerland için
  Switzerland: {
    // Zorunlu alanlar (familyMemberGender eklendi)
    requiredFields: [
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
      "familyMemberGender",
      "familyMemberBirthDate",
      "familyMemberPassport",
      "arrivalDate",
      "exitDate",
    ],

    // Cinsiyet seçimi gereken ilişkiler
    genderRequiredRelationships: ["spouse", "friend", "cousin"],

    // Almanca (İsviçre) gramer fonksiyonları
    getSwissGermanRelationship: (relationship, gender) => {
      const relationships = {
        mother: "meine Mutter",
        father: "meinen Vater",
        brother: "meinen Bruder",
        sister: "meine Schwester",
        son: "meinen Sohn",
        daughter: "meine Tochter",
        grandmother: "meine Grossmutter",
        grandfather: "meinen Grossvater",
        uncle: "meinen Onkel",
        aunt: "meine Tante",
        spouse: gender === "male" ? "meinen Ehemann" : "meine Ehefrau",
        friend: gender === "male" ? "meinen Freund" : "meine Freundin",
        cousin: gender === "male" ? "meinen Cousin" : "meine Cousine",
      };
      return relationships[relationship] || relationship;
    },

    getSwissGermanPronoun: (relationship, gender) => {
      const genderMap = {
        mother: "female",
        father: "male",
        sister: "female",
        son: "male",
        daughter: "female",
        grandmother: "female",
        grandfather: "male",
        uncle: "male",
        aunt: "female",
      };
      const finalGender = genderMap[relationship] || gender;
      return finalGender === "male" ? "Er" : "Sie";
    },

    getSwissGermanRelationshipEn: (relationship) => {
      const map = {
        mother: "Mutter",
        father: "Vater",
        brother: "Bruder",
        sister: "Schwester",
        son: "Sohn",
        daughter: "Tochter",
        grandmother: "Grossmutter",
        grandfather: "Grossvater",
        uncle: "Onkel",
        aunt: "Tante",
        spouse: "Ehepartner/in",
        friend: "Freund/in",
        cousin: "Cousin/e",
      };
      return map[relationship] || relationship;
    },

    getStatusInSwissGerman: (status) => {
      const map = {
        citizen: "Schweizer Bürger",
        "permanent resident": "Niedergelassene/r",
        "EU settled status": "EU/EFTA Aufenthaltsberechtigung",
        "Tier 2 visa holder": "Arbeitsbewilligungsinhaber",
        "Student visa": "Studentenvisum",
        "Work permit": "Arbeitsbewilligung",
      };
      return map[status] || status;
    },

    // İsviçre Almancası mektup render fonksiyonu
    renderLetter: (formData) => {
      const config = COUNTRY_CONFIGS["Switzerland"];

      return `
      <div style="margin: 20px 0">
        <strong>Schweizer Konsulat, ${
          formData.consularCity || "[Consular City]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Betreff: Antrag auf Touristenvisum für ${
          formData.familyMemberName || "[Visitor's Full Name]"
        }</strong>
      </div>
 
      <div style="margin: 20px 0">
        <strong>Sehr geehrte Damen und Herren,</strong>
      </div>
 
      <div style="margin: 30px 0">
        <p>
          Mit diesem Schreiben lade ich offiziell ${config.getSwissGermanRelationship(
            formData.relationship,
            formData.familyMemberGender
          )}, 
          <strong>${
            formData.familyMemberName || "[Visitor's Full Name]"
          }</strong>, 
          zu einem Besuch in der Schweiz ein. ${config.getSwissGermanPronoun(
            formData.relationship,
            formData.familyMemberGender
          )} 
          plant mich vom 
          <strong>${
            formData.arrivalDate || "[proposed entry date]"
          }</strong> bis zum 
          <strong>${
            formData.exitDate || "[proposed exit date]"
          }</strong> zu besuchen.
        </p>
 
        <p>
          Die Angaben zum Besucher sind wie folgt:<br/>
          <strong>Vollständiger Name:</strong> ${
            formData.familyMemberName || "[Visitor's Full Name]"
          }<br/>
          <strong>Reisepassnummer:</strong> ${
            formData.familyMemberPassport || "[Passport Number]"
          }<br/>
          <strong>Geburtsdatum:</strong> ${
            formData.familyMemberBirthDate
              ? new Date(formData.familyMemberBirthDate).toLocaleDateString(
                  "de-CH"
                )
              : "[DD.MM.YYYY]"
          }<br/>
          <strong>Verwandtschaftsverhältnis zu mir:</strong> ${config.getSwissGermanRelationshipEn(
            formData.relationship
          )}
        </p>
 
        <p>
          Ich arbeite derzeit als <strong>${
            formData.occupation || "[Your Job Title]"
          }</strong> 
          bei <strong>${formData.workplace || "[Company Name]"}</strong>. 
          Ich lebe seit ${
            formData.livingInCountryDuration
              ? `${formData.livingInCountryDuration}`
              : "[duration]"
          } 
          Jahren in der Schweiz und bin <strong>${config.getStatusInSwissGerman(
            formData.status
          )}</strong>.
        </p>
 
        <p>
          Ich werde ${config.getSwissGermanRelationship(
            formData.relationship,
            formData.familyMemberGender
          )} 
          während des gesamten Aufenthalts in meinem Zuhause beherbergen. 
          Meine Wohnung bietet ausreichend Platz für eine angemessene Unterbringung. Die Adresse lautet:<br/>
          <strong>${
            formData.accommodationAddress ||
            formData.yourAddress ||
            "[Your Full Address]"
          }</strong>
        </p>
 
        <p>Falls Sie weitere Informationen benötigen, zögern Sie bitte nicht, mich zu kontaktieren.</p>
      </div>
 
      <div style="margin-top: 50px">
        <p>Mit freundlichen Grüssen,</p>
 
        <div style="margin: 40px 0 20px 0">
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Unterschrift</p>
        </div>
 
        <div style="margin-top: 20px">
          <p style="margin: 5px 0; font-weight: bold;">${
            formData.yourName || "[Your Full Name]"
          }</p>
          <p style="margin: 5px 0;">${formData.email || "[Email Address]"}</p>
          <p style="margin: 5px 0;">${formData.phone || "[Phone Number]"}</p>
        </div>
      </div>
    `;
    },
  },
};

// ===============================
// MAIN COMPONENT
// ===============================

export default function VisaInvitationGenerator({ onCountryChange }) {
  const [formData, setFormData] = useState({
    country: "United Kingdom",
    yourAddress: "",
    consularCity: "",
    familyMemberName: "",
    relationship: "mother",
    familyMemberGender: "female",
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
  const [emptyFields, setEmptyFields] = useState([]);

  const countries = [
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

  // Component mount olduğunda varsayılan ülkeyi parent'a bildir
  useEffect(() => {
    if (onCountryChange) {
      onCountryChange(formData.country);
    }
  }, []);

  // Ülke değiştiğinde parent komponenti bilgilendir
  useEffect(() => {
    if (onCountryChange) {
      onCountryChange(formData.country);
    }
  }, [formData.country, onCountryChange]);

  // Aktif ülke konfigürasyonunu al
  const getActiveConfig = () => {
    return (
      COUNTRY_CONFIGS[formData.country] || COUNTRY_CONFIGS["United Kingdom"]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value && value.trim() !== "") {
      setEmptyFields((prev) => prev.filter((field) => field !== name));
    }
  };

  const validateForm = () => {
    const activeConfig = getActiveConfig();
    const requiredFields = activeConfig.requiredFields;

    const emptyFieldsList = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ""
    );

    setEmptyFields(emptyFieldsList);

    if (emptyFieldsList.length > 0) {
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
      document.body.style.overflow = "hidden";
      setShowLetter(true);
    }
  };

  const closeLetter = () => {
    document.body.style.overflow = "auto";
    setShowLetter(false);
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

  const activeConfig = getActiveConfig();

  return (
    <Container>
      <Header>
        <Logo variant="davetiye" />

        <Subtitle>Ziyaret Vizesi - Davetiye Mektubu Oluşturucu</Subtitle>
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
              {countries.map((country) => (
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
              placeholder="Yazılım Mühendisi"
              hasError={emptyFields.includes("occupation")}
              data-error={emptyFields.includes("occupation")}
            />
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
              <option value="mother">Anne</option>
              <option value="father">Baba</option>
              <option value="brother">Kardeş (Erkek)</option>
              <option value="sister">Kız Kardeş</option>
              <option value="son">Oğul</option>
              <option value="daughter">Kız</option>
              <option value="grandmother">Büyükanne</option>
              <option value="grandfather">Büyükbaba</option>
              <option value="uncle">Amca/Dayı</option>
              <option value="aunt">Teyze/Hala</option>
              <option value="spouse">Eş</option>
              <option value="friend">Arkadaş</option>
            </Select>
          </FormGroup>

          {/* Dinamik cinsiyet alanı */}
          {activeConfig.genderRequiredRelationships?.includes(
            formData.relationship
          ) && (
            <FormGroup>
              <Label>Cinsiyet</Label>
              <Select
                name="familyMemberGender"
                value={formData.familyMemberGender}
                onChange={handleInputChange}
                hasError={emptyFields.includes("familyMemberGender")}
                data-error={emptyFields.includes("familyMemberGender")}
              >
                <option value="female">Kadın</option>
                <option value="male">Erkek</option>
              </Select>
            </FormGroup>
          )}

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
        <Modal onClick={closeLetter}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>📄 Davetiye Mektubu</ModalTitle>
              <CloseButton onClick={closeLetter}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <LetterContainer id="letter-content">
                <LetterDate>
                  <strong>{getCurrentDate()}</strong>
                </LetterDate>

                {/* Dinamik mektup içeriği - Aktif konfigürasyondan render */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeConfig.renderLetter(formData),
                  }}
                />
              </LetterContainer>

              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  borderTop: "1px solid #e2e8f0",
                }}
                className="no-print"
              >
                <DownloadButton onClick={downloadLetter}>
                  📄 Mektubu İndir/Yazdır
                </DownloadButton>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

/* eslint-disable react/prop-types */
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { usePurpose } from "./usePurpose";
import { useCountries } from "./useCountries";
import { useProfessions } from "./useProfession";
import { useKids } from "./useKids";
import { useAccommodations } from "./useAccommodations";
import { useVehicles } from "./useVehicles";
import { useUserSelections } from "./useUserSelections";
import Heading from "../../ui/Heading";

// Select kutusu için stil
const StyledSelect = styled.select`
  padding: 10px 14px;
  border-radius: 16px;
  border: 1px solid transparent;
  margin: 5px 0;
  width: 100%;
  color: #000000;
  background-color: transparent;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;

  &:hover,
  &:active {
    border: 1px solid #00c853;
  }

  option {
    color: #000000;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 750px) {
    font-size: 12px;
    padding: 6px 10px;
  }
  @media (max-width: 600px) {
    @media (max-height: 900px) {
      font-size: 1.5rem;
    }
  }
`;

const Section = styled.div`
  margin-bottom: 0rem; /* Mesafeyi azaltıldı */
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Divider = styled.div`
  width: 80%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.2);
  margin: 0.8rem 0; /* Mesafeyi azaltıldı */
`;

const ControlLayout = styled.div`
  @media (max-width: 600px) {
    @media (max-height: 900px) {
      display: flex;
      flex-direction: column;
      gap: 12px;
      @media (max-height: 870px) {
        gap: 10px;
      }
      @media (max-height: 850px) {
        gap: 8px;
      }
      @media (max-height: 830px) {
        gap: 6px;
      }
      @media (max-height: 810px) {
        gap: 5px;
      }
      @media (max-height: 800px) {
        gap: 4px;
      }
      @media (max-height: 790px) {
        gap: 3px;
      }
    }
  }
`;

function ControlScreenDropdowns({
  onPurposeChange,
  selectedPurpose,
  onCountryChange,
  selectedCountry,
  onProfessionChange,
  selectedProfession,
  selectedAccommodation,
  selectedKid,
  selectedVehicle,
  onVehicleChange,
  onKidChange,
  onAccommodationChange,
}) {
  const { state } = useUserSelections();

  const { isLoading, purposeRegData, purposeEdData } = usePurpose();
  const { isLoading: isLoading1, schCounData, mainCounData } = useCountries();
  const { isLoading: isLoading2, professionsData } = useProfessions();
  const { isLoadingVehicles, vehiclesData } = useVehicles();
  const { isLoadingKids, kidsData } = useKids();
  const { isLoadingAccommodation, accommodationsData } = useAccommodations();

  const handlePurposeChange = (e) => {
    onPurposeChange(e.target.value);
  };

  const handleChange = (e) => {
    onCountryChange(e.target.value);
  };

  const handleProfessionChange = (e) => {
    onProfessionChange(e.target.value);
  };

  const handleVehicleChange = (e) => {
    onVehicleChange(e.target.value);
  };

  const handleKidChange = (e) => {
    onKidChange(e.target.value);
  };

  const handleAccommodationChange = (e) => {
    onAccommodationChange(e.target.value);
  };

  const combinedCountries = [
    ...(schCounData || []),
    ...(mainCounData || []),
  ].map((country, index) => ({
    id: country.id ? `${country.id}-${index}` : `country-${index}`,
    name: country.schCountryNames || country.mainCountryNames,
  }));

  const combinedData = [
    ...(purposeEdData || []),
    ...(purposeRegData || []),
  ].map((purpose, index) => ({
    id: purpose.id ? `${purpose.id}-${index}` : `purpose-${index}`,
    description: purpose.purposeEdDescription || purpose.purposeRegDescription,
  }));

  if (
    isLoading &&
    isLoading1 &&
    isLoading2 &&
    isLoadingAccommodation &&
    isLoadingKids &&
    isLoadingVehicles
  ) {
    return <Spinner />;
  }

  return (
    <>
      <ControlLayout>
        <Section>
          <Heading as="h9">Vize almak istediğiniz ülke</Heading>
          <StyledSelect value={selectedCountry} onChange={handleChange}>
            <option value="">{state.country}</option>
            {combinedCountries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </StyledSelect>
        </Section>
        <Divider />
        <Section>
          <Heading as="h9">Gidiş amacınız</Heading>
          <StyledSelect value={selectedPurpose} onChange={handlePurposeChange}>
            <option value="">{state.purpose}</option>
            {combinedData.map((purpose) => (
              <option key={purpose.id} value={purpose.description}>
                {purpose.description}
              </option>
            ))}
          </StyledSelect>
        </Section>
        <Divider />
        <Section>
          <Heading as="h9">Mesleğiniz</Heading>
          <StyledSelect
            value={selectedProfession}
            onChange={handleProfessionChange}
          >
            <option value="">{state.profession}</option>
            {professionsData &&
              professionsData.map((profession, index) => (
                <option
                  key={`profession-${index}`}
                  value={profession.professionName}
                >
                  {profession.professionName}
                </option>
              ))}
          </StyledSelect>
        </Section>
        <Divider />
        <Section>
          <Heading as="h9">Konaklama türünüz</Heading>
          <StyledSelect
            value={selectedAccommodation}
            onChange={handleAccommodationChange}
          >
            <option value="">{state.accommodation}</option>
            {accommodationsData.map((accommodation, index) => (
              <option
                key={`accommodation-${index}`}
                value={accommodation.accommodationTypeName}
              >
                {accommodation.accommodationTypeName}
              </option>
            ))}
          </StyledSelect>
        </Section>
        <Divider />
        <Section>
          <Heading as="h9">Seyahat aracınız</Heading>
          <StyledSelect value={selectedVehicle} onChange={handleVehicleChange}>
            <option value="">{state.vehicle}</option>
            {vehiclesData.map((vehicle, index) => (
              <option
                key={`vehicle-${index}`}
                value={vehicle.travelVehicleName}
              >
                {vehicle.travelVehicleName}
              </option>
            ))}
          </StyledSelect>
        </Section>
        <Divider />
        <Section>
          <Heading as="h9">Çocuklu yolculuk</Heading>
          <StyledSelect value={selectedKid} onChange={handleKidChange}>
            <option value="">{state.kid}</option>
            {kidsData.map((kid, index) => (
              <option key={`kid-${index}`} value={kid.kidState}>
                {kid.kidState}
              </option>
            ))}
          </StyledSelect>
        </Section>
      </ControlLayout>
    </>
  );
}

export default ControlScreenDropdowns;

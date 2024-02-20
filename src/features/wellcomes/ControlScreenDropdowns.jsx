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
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 10px 0;
  width: 100%;
`;

// Üst div için stil
const Container = styled.div`
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
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
  ].map((country) => ({
    id: country.id,
    name: country.schCountryNames || country.mainCountryNames,
  }));

  // Eğitim ve Düzenleme verilerini birleştir
  const combinedData = [
    ...(purposeEdData || []),
    ...(purposeRegData || []),
  ].map((purpose) => ({
    id: purpose.id,
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
    <Container>
      <div>
        <Heading as="h2">Vize almak istediğiniz ülke</Heading>
        <StyledSelect value={selectedCountry} onChange={handleChange}>
          <option value="">{state.country}</option>
          {combinedCountries.map((country) => (
            <option key={country.id} value={country.name}>
              {country.name}
            </option>
          ))}
        </StyledSelect>
      </div>
      <div>
        <Heading as="h2">Gidiş amacınız</Heading>
        <StyledSelect value={selectedPurpose} onChange={handlePurposeChange}>
          <option value="">{state.purpose}</option>
          {combinedData.map((purpose) => (
            <option key={purpose.id} value={purpose.description}>
              {purpose.description}
            </option>
          ))}
        </StyledSelect>
      </div>
      <div>
        <Heading as="h2">Mesleğiniz</Heading>
        <StyledSelect
          value={selectedProfession}
          onChange={handleProfessionChange}
        >
          <option value="">{state.profession}</option>
          {professionsData &&
            professionsData?.map((profession) => (
              <option key={profession.id} value={profession.professionName}>
                {profession.professionName}
              </option>
            ))}
        </StyledSelect>
      </div>
      <div>
        <Heading as="h2">Konaklama türünüz</Heading>
        <StyledSelect
          value={selectedAccommodation}
          onChange={handleAccommodationChange}
        >
          <option value="">{state.accommodation}</option>
          {accommodationsData?.map((accommodation) => (
            <option
              key={accommodation.id}
              value={accommodation.accommodationTypeName}
            >
              {accommodation.accommodationTypeName}
            </option>
          ))}
        </StyledSelect>
      </div>
      <div>
        <Heading as="h2">Seyahat aracınız</Heading>
        <StyledSelect value={selectedVehicle} onChange={handleVehicleChange}>
          <option value="">{state.vehicle}</option>
          {vehiclesData?.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.travelVehicleName}>
              {vehicle.travelVehicleName}
            </option>
          ))}
        </StyledSelect>
      </div>
      <div>
        <Heading as="h2">Çocuklu yolculuk</Heading>
        <StyledSelect value={selectedKid} onChange={handleKidChange}>
          <option value="">{state.kid}</option>
          {kidsData?.map((kid) => (
            <option key={kid.id} value={kid.kidState}>
              {kid.kidState}
            </option>
          ))}
        </StyledSelect>
      </div>
    </Container>
  );
}

export default ControlScreenDropdowns;

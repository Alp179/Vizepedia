import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useUserSelections } from "./useUserSelections";
import Button from "../../ui/Button";
import ControlScreenDropdowns from "./ControlScreenDropdowns";

function ControlScreen() {
  const { state, dispatch } = useUserSelections();
  const [selectedVehicle, setSelectedVehicle] = useState(state.vehicle);
  const [selectedKid, setSelectedKid] = useState(state.kid);
  const [selectedAccommodation, setSelectedAccommodation] = useState(
    state.accommodation
  );
  const [selectedProfession, setSelectedProfession] = useState(
    state.profession
  );
  const [selectedPurpose, setSelectedPurpose] = useState(state.purpose);
  const [selectedCountry, setSelectedCountry] = useState(state.country);

  const navigate = useNavigate();

  useEffect(() => {
    // Tüm seçimlerin yapıldığından emin olmak için bir kontrol işlevi
    const allSelectionsMade =
      state.country &&
      state.purpose &&
      state.profession &&
      state.vehicle &&
      state.kid &&
      state.accommodation;
    if (!allSelectionsMade) {
      // Eğer herhangi bir seçim yapılmamışsa, kullanıcıyı '/wellcome' sayfasına yönlendir
      navigate("/wellcome");
    }
  }, [state, navigate]); // Bağımlılıkları belirtmeyi unutmayın

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    dispatch({ type: "SET_COUNTRY", payload: country });
  };

  const handlePurposeChange = (purpose) => {
    setSelectedPurpose(purpose);
    dispatch({ type: "SET_PURPOSE", payload: purpose }); // Global state'i güncelleyin
  };

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    dispatch({ type: "SET_PROFESSION", payload: profession }); // Global state'i güncelleyin
  };

  const handleVehicleChange = (vehicle) => {
    setSelectedVehicle(vehicle);
    dispatch({ type: "SET_VEHICLE", payload: vehicle });
  };

  const handleKidChange = (kid) => {
    setSelectedKid(kid);
    dispatch({ type: "SET_KID", payload: kid });
  };

  const handleAccommodationChange = (accommodation) => {
    setSelectedAccommodation(accommodation);
    dispatch({ type: "SET_ACCOMMODATION", payload: accommodation });
  };

  const handleSubmit = () => {
    // Kullanıcı bilgileri doğrulama işlemi burada yapılabilir.
    // Sonra kullanıcıyı dashboard'a veya başka bir sayfaya yönlendirebilirsiniz.
    navigate("/dashboard");
  };

  // Bilgiler tamamsa, kontrol ekranını render et
  return (
    <div>
      <h1>Bilgi Kontrol Ekranı</h1>
      <ControlScreenDropdowns
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
        selectedPurpose={selectedPurpose}
        onPurposeChange={handlePurposeChange}
        selectedProfession={selectedProfession}
        onProfessionChange={handleProfessionChange}
        selectedAccommodation={selectedAccommodation}
        selectedKid={selectedKid}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleVehicleChange}
        onKidChange={handleKidChange}
        onAccommodationChange={handleAccommodationChange}
      />

      <Button onClick={handleSubmit}>Başlayalım</Button>
    </div>
  );
}

export default ControlScreen;

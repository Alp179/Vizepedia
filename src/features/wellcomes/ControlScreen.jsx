import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useUserSelections } from "./useUserSelections";
import Button from "../../ui/Button";

function ControlScreen() {
  const { state } = useUserSelections();
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

  const handleSubmit = () => {
    // Kullanıcı bilgileri doğrulama işlemi burada yapılabilir.
    // Sonra kullanıcıyı dashboard'a veya başka bir sayfaya yönlendirebilirsiniz.
    navigate("/dashboard");
  };

  // Bilgiler tamamsa, kontrol ekranını render et
  return (
    <div>
      <h1>Bilgi Kontrol Ekranı</h1>
      <ul>
        <li>Vize almak istediğiniz ülke: {state.country}</li>
        <li>Gidiş amacınız: {state.purpose}</li>
        <li>Mesleğiniz: {state.profession}</li>
        <li>Konaklama türünüz: {state.accommodation}</li>
        <li>Seyahat aracınız: {state.vehicle}</li>
        <li>Çocuklu yolculuk: {state.kid}</li>
      </ul>
      <Button onClick={handleSubmit}>Başlayalım</Button>
    </div>
  );
}

export default ControlScreen;

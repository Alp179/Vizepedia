import { useNavigate } from "react-router-dom";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";

function WellcomeA() {
  const navigate = useNavigate();

  return (
    <>
      <Heading as="h1">Vizepedia’ya hoş geldiniz</Heading>
      <h4>
        Lütfen seyahat amacınızı, mesleğinizi, konaklama türünüzü ve seyahat
        aracınızı aşağıdaki alanlarda belirtin. Bu bilgiler doğru belgeleri
        sunmamız için önemlidir ve size en iyi şekilde rehberlik edebilmemize
        yardımcı olacaktır.
      </h4>
      <Button onClick={() => navigate("/wellcome-2")}>Devam et</Button>
    </>
  );
}

export default WellcomeA;

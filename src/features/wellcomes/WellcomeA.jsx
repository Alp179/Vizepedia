import { useNavigate } from "react-router-dom";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";

function WellcomeA() {
  const navigate = useNavigate();

  return (
    <>
      <Heading as="h1">Vizepedia’ya hoş geldiniz</Heading>
      <h4>
        Vize alma sürecindeki karmaşıklığı ortadan kaldırmak için buradayız!
        Akıcı ve kolay bir vize başvuru deneyimi için hazır olun.
      </h4>
      <Button onClick={() => navigate("/wellcome-2")}>Devam et</Button>
    </>
  );
}

export default WellcomeA;

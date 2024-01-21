import { styled } from "styled-components";

import Heading from "../ui/Heading";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

const StyledInput = styled.input`
  background-color: lightgreen;
  border-radius: 11px;
  border: 2px solid #ebebec;
`;

function Wellcome() {
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
      <StyledInput placeholder="Ad (isteğe bağlı)"></StyledInput>
      <Button onClick={() => navigate("/wellcome-1")}>Devam et</Button>
    </>
  );
}

export default Wellcome;

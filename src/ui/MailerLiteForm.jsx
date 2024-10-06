import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Logo from "../ui/Logo";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const FormContainer = styled.div`
  padding: 32px;
  margin-bottom: 92px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  width: 1111px;
  height: 400px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40px;
  background-image: var(--color-grey-906);
  @media (max-width: 1150px) {
    width: 90%;
    height: auto;
  }
  @media (max-width: 710px) {
    width: 350px !important;
    height: 620px !important;
    flex-flow: wrap !important;
    justify-content: space-around !important;
    padding: 16px;
  }
  @media (max-width: 360px) {
    width: 280px!important;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const FormResponsive = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 710px) {
    padding: 12px;
    flex-flow: column;
    align-items: center;
    margin-top: 12px;
  }
`;

const FormHeader = styled.h4`
  max-width: 400px;
  font-weight: 700;
  font-size: 67px;
  letter-spacing: -0.055em;
  background: linear-gradient(
    89.93deg,
    rgba(77, 64, 244, 0.9) 3.65%,
    rgba(133, 58, 204, 0.9) 86.54%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  @media (max-width: 1000px) {
    font-size: 50px !important;
    line-height: 55px;
  }
  @media (max-width: 710px) {
    margin-left: 16px;
    margin-bottom: 0px;
  }
  @media (max-width: 360px) {
    margin-left: 0;
    font-size: 42px!important;
  }
`;

const FormParagraph = styled.p`
  max-width: 500px;
  font-weight: 600;
  font-size: 22px;
  line-height: 141%;
  letter-spacing: 0.01em;
  color: var(--color-grey-600);
  @media (max-width: 1000px) {
    font-size: 16px !important;
  }
  @media (max-width: 710px) {
    font-size: 20px !important;
    margin-left: 16px;
  }
  @media (max-width: 360px) {
    margin-left: 0;
    font-size: 16px!important;
  }
`;

const InputAndLogo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
`;

const InputField = styled.input`
@media (min-width: 1150px) {
  margin-top: 50px;
}
  display: flex;
  width: 467px;
  height: 57px;
  padding: 8px;
  background: #ffffff;
  box-shadow: 0px 4px 120px rgba(142, 131, 113, 0.15);
  border-radius: 11px;
  @media (max-width: 1120px) {
    width: 400px;
  }
  @media (max-width: 1000px) {
    height: 40px;
    font-size: 15px;
  }
  @media (max-width: 850px) {
    width: 350px;
  }
  @media (max-width: 710px) {
    width: 300px !important;
  }
  @media (max-width: 360px) {
    width: 250px!important;
  }
`;

const CheckboxRow = styled.div`
  margin-bottom: 20px;
  @media (max-width: 1000px) {
    margin-bottom: -10px;
  }
`;

const CheckboxLabel = styled.label`
  margin-top: 8px;
  display: flex;
  gap: 4px;
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 12px;
  color: #000;
`;

const Izin = styled.p`
  font-size: 12px;
  color: var(--color-grey-600);
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  width: 198px;
  height: 47px;
  background: #004466;
  box-shadow: 0px 6px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  font-weight: 700;
  border: 2px solid #87f9cd;
  font-size: 20px;
  text-align: center;
  color: #00ffa2;

  &:hover {
    background: #87f9cd;
    color: #004466;
  }
  @media (max-width: 1000px) {
    margin-bottom: -15px;
  }
  @media (max-width: 900px) {
    width: 150px;
  }
  @media (max-width: 710px) {
    width: 198px;
    margin-bottom: 0;
    margin-top: 20px;
  }
`;

const LoadingButton = styled.button`
  display: none;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 4px solid #fff;
  border-color: #fff #fff #fff transparent;
  animation: ${rotate} 1.2s linear infinite;
`;

const SuccessMessage = styled.div`
  display: none;
  text-align: center;
`;

const SuccessHeader = styled.h4`
  color: #000;
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 24px;
  margin-bottom: 10px;
`;

const SuccessText = styled.p`
  color: #000;
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 14px;
`;

const FormContainer2 = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
  align-items: flex-end;
  @media (max-width: 710px) {
    flex-flow: column-reverse !important;
    align-items: center !important;
    margin-top: 40px;
    gap: 16px;
  }
`;

const MailerLiteForm = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://groot.mailerlite.com/js/w/webforms.min.js?v2d8fb22bb5b3677f161552cd9e774127";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <FormContainer id="mlb2-18366039">
      <FormResponsive>
        <FormWrapper>
          <FormHeader>Bültenimize Abone Ol</FormHeader>
          <FormParagraph>
            <strong>
              Vize duyuruları ve en son blog yazılarımızdan ilk sizin haberiniz
              olsun. Hemen abone olun!
            </strong>
          </FormParagraph>
        </FormWrapper>

        <InputAndLogo>
          <FormContainer2
            action="https://assets.mailerlite.com/jsonp/1118748/forms/133525940249560192/subscribe"
            method="post"
            target="_blank"
          >
            <Logo variant="bulten" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <InputField
                aria-label="email"
                aria-required="true"
                type="email"
                name="fields[email]"
                placeholder="Email"
                autoComplete="email"
              />

              <CheckboxRow>
                <CheckboxLabel>
                  <input type="checkbox" required />
                  <Izin>
                    Kişisel verilerimin burada yer alan Gizlilik Bildirimi
                    kapsamında işlenmesine izin veriyorum.
                  </Izin>
                </CheckboxLabel>
              </CheckboxRow>

              <SubmitButton type="submit">Abone Ol</SubmitButton>

              <LoadingButton disabled="disabled" type="button">
                <LoadingSpinner />
                <span>Loading...</span>
              </LoadingButton>
            </div>
          </FormContainer2>
        </InputAndLogo>
      </FormResponsive>

      <SuccessMessage>
        <SuccessHeader>Thank you!</SuccessHeader>
        <SuccessText>
          You have successfully joined our subscriber list.
        </SuccessText>
      </SuccessMessage>
    </FormContainer>
  );
};

export default MailerLiteForm;

import { useEffect } from "react";
import styled, { keyframes } from "styled-components";

// Animasyonları styled-components ile tanımlayalım
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const FormContainer = styled.div`
  box-sizing: border-box;
  display: table;
  margin: 0 auto;
  position: static;
  width: 100%;
`;

const FormWrapper = styled.div`
  background-color: #f6f6f6;
  border: none;
  border-radius: 4px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
`;

const FormBody = styled.div`
  text-align: left;
  margin-bottom: 20px;
`;

const FormHeader = styled.h4`
  color: #000;
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 30px;
  font-weight: 400;
`;

const FormParagraph = styled.p`
  color: #000;
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 14px;
  line-height: 20px;
  margin: 0 0 10px 0;
`;

const InputField = styled.input`
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  font-size: 14px;
  margin-bottom: 10px;

  &::placeholder {
    color: #333;
  }
`;

const CheckboxRow = styled.div`
  margin-bottom: 20px;
`;

const CheckboxLabel = styled.label`
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 12px;
  color: #000;
`;

const SubmitButton = styled.button`
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #333;
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
    <FormContainer
      id="mlb2-18366039"
      className="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-18366039"
    >
      <div className="ml-form-align-center">
        <FormWrapper>
          <FormBody>
            <FormHeader>Bültenimize Abone Ol</FormHeader>
            <FormParagraph>
              <strong>
                Vize duyuruları ve en son blog yazılarımızdan ilk sizin
                haberiniz olsun. Hemen abone olun!
              </strong>
            </FormParagraph>

            <form
              className="ml-block-form"
              action="https://assets.mailerlite.com/jsonp/1118748/forms/133525940249560192/subscribe"
              method="post"
              target="_blank"
            >
              <div className="ml-form-formContent">
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
                    <span>
                      Kişisel verilerimin burada yer alan Gizlilik Bildirimi
                      kapsamında işlenmesine izin veriyorum.
                    </span>
                  </CheckboxLabel>
                </CheckboxRow>

                <SubmitButton type="submit">Abone Ol</SubmitButton>

                <LoadingButton disabled="disabled" type="button">
                  <LoadingSpinner />
                  <span className="sr-only">Loading...</span>
                </LoadingButton>
              </div>
            </form>
          </FormBody>

          <SuccessMessage className="ml-form-successBody row-success">
            <SuccessHeader>Thank you!</SuccessHeader>
            <SuccessText>
              You have successfully joined our subscriber list.
            </SuccessText>
          </SuccessMessage>
        </FormWrapper>
      </div>
    </FormContainer>
  );
};

export default MailerLiteForm;

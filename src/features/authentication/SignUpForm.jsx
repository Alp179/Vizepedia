import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import styled from "styled-components";
import Input from "../../ui/Input";
import FormRow from "../../ui/FormRow";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";
import { signInWithGoogle } from "../../services/apiAuth";

const BracketContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  justify-content: center;
  @media (max-width: 370px) {
    gap: 8px;
  }
`;

const Bracket = styled.div`
  height: 1px;
  border: 1px solid var(--color-grey-300);
  width: 135px;
  @media (max-width: 450px) {
    width: 100px;
  }
  @media (max-width: 370px) {
    width: 70px;
  }
`;

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useLogin();
  const navigate = useNavigate(); // Yönlendirme fonksiyonu

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  // Google oturum açma butonu için event handler
  async function handleGoogleSignIn() {
    const { data, error } = await signInWithGoogle();
    if (!error && data) {
      // Yönlendirme işlemi
      navigate("/dashboard");
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(
      window.location.hash.replace("#", "?")
    );
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
      // Token'ı işleyebilir veya gerekli işlemleri yapabilirsiniz
      navigate("/dashboard"); // Yönlendirme işlemi
    }
  }, [navigate]);

  return (
    <Form onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p className="hosgeldiniz">Vizepedia`ya Hoş geldiniz</p>
        <p className="subtext">
          Vize alma sürecindeki karmaşıklığı ortadan kaldırmak için buradayız!
          Akıcı ve kolay bir vize başvuru deneyimi için hazır olun.
        </p>
      </div>
      <FormRow orientation="vertical">
        <Button
          size="login"
          variation="googleauth"
          type="button"
          onClick={handleGoogleSignIn}
        >
          Google ile Giriş Yap
        </Button>
      </FormRow>
      <BracketContainer>
        <Bracket />
        <p style={{ color: "var(--color-grey-700)" }}>ya da</p>
        <Bracket />
      </BracketContainer>
      <FormRow orientation="vertical" label="E-posta Adresi">
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow orientation="vertical" label="Şifre">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </FormRow>
      <FormRow orientation="vertical">
        <Button size="login" variation="login" disabled={isLoading}>
          {!isLoading ? "Hesap Oluştur" : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignUpForm;

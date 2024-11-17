import { useState, useEffect } from "react";
import supabase from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import styled from "styled-components";
import Input from "../../ui/Input";
import FormRow from "../../ui/FormRow";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";
import { signInWithGoogle } from "../../services/apiAuth"; // Supabase'den anonim giriş

const BracketContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  justify-content: center;
  @media (max-width: 370px) {
    gap: 8px;
  }
  @media (max-height: 725px) {
    font-size: 12px;
    gap: 12px;
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
  @media (max-height: 725px) {
    width: 80px !important;
  }
`;

function LoginForm() {
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

  // Anonim oturum açma butonu için event handler
  async function handleGuestSignIn() {
    try {
      // Supabase anonim oturum açma fonksiyonu
      const { data, error } = await supabase.auth.signInAnonymously();
      localStorage.setItem("isAnonymous", "true"); // LocalStorage'a isAnonymous bilgisi ekliyoruz

      if (error) {
        console.error("Anonim oturum açma hatası:", error.message);
        return;
      }

      if (data) {
        // LocalStorage'da wellcomes sorularının cevaplanıp cevaplanmadığını kontrol ediyoruz
        const wellcomesAnswered =
          localStorage.getItem("wellcomesAnswered") || "false"; // Varsayılan olarak 'false'

        if (wellcomesAnswered === "true") {
          // Eğer sorular cevaplanmışsa /dashboard'a yönlendir
          navigate("/dashboard");
        } else {
          // LocalStorage boşsa wellcome-1 (WellcomeA) sayfasına yönlendir
          navigate("/wellcome-1");
        }
      }
    } catch (error) {
      console.error("Oturum açma sırasında hata oluştu:", error.message);
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
        <p className="hosgeldiniz">Vizepedia&apos;ya Hoş geldiniz</p>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-google"
            viewBox="0 0 16 16"
          >
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
          </svg>
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
        <Button
          size="login"
          variation="guest"
          type="button"
          onClick={handleGuestSignIn}
        >
          Anonim Giriş
        </Button>
      </FormRow>
      <FormRow orientation="vertical">
        <Button size="login" variation="login" disabled={isLoading}>
          {!isLoading ? "Giriş yap" : <SpinnerMini />}
        </Button>
      </FormRow>

      {/* Anonim giriş butonunu ekliyoruz */}
    </Form>
  );
}

export default LoginForm;

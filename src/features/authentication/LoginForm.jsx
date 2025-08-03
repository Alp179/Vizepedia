import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import styled from "styled-components";
import Input from "../../ui/Input";
import FormRow from "../../ui/FormRow";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";
import { toast } from "react-hot-toast"; // toast import edildi
import { resetPassword, signInWithGoogle } from "../../services/apiAuth";
import { AnonymousDataService } from "../../utils/anonymousDataService";

const BracketContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: nowrap !important;
  align-items: center;
  width: 100%;
  justify-content: center;
  @media (max-width: 370px) {
    gap: 8px;
  }
  @media (max-width: 450px) {
    @media (max-height: 800px) {
      font-size: 12px;
      gap: 12px;
    }
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

const Girisyap = styled.div`
  margin: 0 auto;
  @media (max-width: 300px) {
    font-size: 15px;
  }
`;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useLogin();
  const navigate = useNavigate(); // Yönlendirme fonksiyonu

  // Şifremi unuttum için state'ler
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

  // Şifre sıfırlama işlemi
  async function handlePasswordReset() {
    if (!resetEmail) return;

    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
      toast.success("Şifre sıfırlama bağlantısı gönderildi.", {
        duration: 4000,
      });
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
      toast.error("Şifre sıfırlama bağlantısı gönderilirken bir hata oluştu.", {
        duration: 4000,
      });
    } finally {
      setResetLoading(false);
    }
  }

  // UPDATED: Anonim oturum açma - HeroParallax ile aynı mantık
  async function handleGuestSignIn() {
    try {
      // Initialize empty user data for anonymous user
      AnonymousDataService.saveUserSelections({});
      
      console.log("Anonymous mode activated (localStorage only)");

      // Always redirect to dashboard
      // Dashboard will handle the three scenarios:
      // 1. Static Dashboard (no onboarding completed)
      // 2. Anonymous Dashboard (onboarding completed, anonymous)
      // 3. Authenticated Dashboard (onboarding completed, authenticated)
      navigate("/dashboard");

    } catch (error) {
      console.error("Anonymous mode activation error:", error);
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
    <>
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
          <p
            style={{
              color: "var(--color-grey-700)",
              textWrap: "nowrap",
              fontSize: "14px",
            }}
          >
            ya da
          </p>
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

        {/* Şifremi unuttum bağlantısı */}
        <FormRow orientation="vertical">
          <div style={{ width: "100%", textAlign: "right" }}>
            <a
              onClick={() => setShowResetPassword(true)}
              style={{
                cursor: "pointer",
                color: "var(--color-grey-600)",
                fontSize: "14px",
              }}
            >
              Şifremi unuttum
            </a>
          </div>
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
        <FormRow orientation="vertical">
          <Girisyap>
            Bir hesabın yok mu?{" "}
            <a
              onClick={() => navigate("/sign-up")}
              style={{
                cursor: "pointer",
                color: "#00ffa2",
                textDecoration: "underline",
              }}
            >
              Kayıt ol
            </a>
          </Girisyap>
        </FormRow>
      </Form>

      {/* Şifremi unuttum modalı - İyileştirilmiş */}
      {showResetPassword && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            // Modal dışına tıklayınca kapatma - daha güvenilir kontrol
            if (e.target.classList.contains("modal-overlay")) {
              setShowResetPassword(false);
            }
          }}
        >
          <div className="modal-content">
            <h3>Şifre Sıfırlama</h3>
            {!resetSent ? (
              <>
                <p>Şifrenizi sıfırlamak için e-posta adresinizi girin.</p>
                <Input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  autoFocus // Otomatik odaklanma ekledik
                  disabled={resetLoading}
                />
                <div className="button-group">
                  <Button
                    type="button"
                    variation="secondary"
                    onClick={() => setShowResetPassword(false)}
                    disabled={resetLoading}
                  >
                    İptal
                  </Button>
                  <Button
                    type="button"
                    disabled={resetLoading || !resetEmail.trim()} // Email boşsa buton devre dışı
                    onClick={handlePasswordReset}
                  >
                    {resetLoading ? (
                      <SpinnerMini />
                    ) : (
                      "Sıfırlama Bağlantısı Gönder"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p>
                  Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
                  Lütfen e-postanızı kontrol edin.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1rem",
                  }}
                >
                  <Button
                    type="button"
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetSent(false);
                      setResetEmail("");
                    }}
                  >
                    Tamam
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default LoginForm;
/* eslint-disable react/prop-types */
import { useState } from "react";
import supabase from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import styled from "styled-components";
import Input from "../../ui/Input";
import FormRow from "../../ui/FormRow";
import SpinnerMini from "../../ui/SpinnerMini";
import {
  signInWithGoogle,
  convertAnonymousToUser,
} from "../../services/apiAuth";
import { useSignup } from "./useSignup";
import { useUser } from "./useUser";
import { AnonymousDataService } from "../../utils/anonymousDataService";
import SEO from "../../components/SEO";

const BracketContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: nowrap !important;
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

const Girisyap = styled.div`
  margin: 0 auto;
  @media (max-width: 300px) {
    font-size: 15px;
  }
`;

function SignupForm({ onCloseModal, onAuthComplete, isInModal = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { isLoading } = useSignup();
  const navigate = useNavigate();
  const { refetchUser } = useUser();

  // ENHANCED: Handle guest sign in for modal flow
  async function handleGuestSignIn() {
    try {
      // Instead of Supabase, use our AnonymousDataService
      AnonymousDataService.saveUserSelections({});

      console.log("Anonymous mode activated (localStorage only)");

      if (isInModal) {
        // In modal flow - proceed to next step
        if (onAuthComplete) {
          onAuthComplete();
        }
      } else {
        // Traditional flow - check if onboarding completed
        const hasOnboardingData = AnonymousDataService.hasCompletedOnboarding();

        if (hasOnboardingData) {
          const applicationId = AnonymousDataService.getApplicationId();
          navigate(`/dashboard/${applicationId}`);
        } else {
          // Redirect to dashboard instead of wellcome pages
          // User will see StaticDashboardContent for new visitors
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Anonymous mode activation error:", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    const isAnonymous = AnonymousDataService.isAnonymousUser();

    try {
      if (isAnonymous) {
        // Convert anonymous localStorage data to authenticated user
        await convertAnonymousToUser({ email, password });
      } else {
        // Regular signup with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("already registered")) {
            setErrorMessage(
              <>
                Bu e-posta adresi zaten kullanılıyor.{" "}
                <a
                  onClick={() => !isInModal && navigate("/login")}
                  style={{
                    cursor: "pointer",
                    color: "#00ffa2",
                    textDecoration: "underline",
                  }}
                >
                  Giriş yapın
                </a>
              </>
            );
            return;
          }
          throw new Error(error.message);
        }

        if (data.user) {
          // Clear any anonymous data since user is now authenticated
          AnonymousDataService.clearData();
        }
      }

      if (onCloseModal) {
        onCloseModal();
      }

      refetchUser();

      if (isInModal) {
        // In modal flow - proceed to next step
        if (onAuthComplete) {
          onAuthComplete();
        }
      } else {
        // Traditional flow - navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Hata Detayı:", error);
      setErrorMessage(error.message || "Üye olurken bir hata oluştu.");
    }
  }

  async function handleGoogleSignIn() {
    const { data, error } = await signInWithGoogle();
    if (!error && data) {
      // Clear anonymous data when signing in with Google
      AnonymousDataService.clearData();

      if (onCloseModal) {
        onCloseModal();
      }

      refetchUser();

      if (isInModal) {
        // In modal flow - proceed to next step
        if (onAuthComplete) {
          onAuthComplete();
        }
      } else {
        // Traditional flow - navigate to dashboard
        navigate("/dashboard");
      }
    } else {
      setErrorMessage("Google ile giriş sırasında bir hata oluştu.");
    }
  }

  const handleLoginClick = () => {
    if (isInModal) {
      // In modal, we might want to show login form instead
      // For now, just show a message or handle differently
      setErrorMessage(
        "Giriş yapmak için modal'ı kapatın ve 'Giriş Yap' butonunu kullanın."
      );
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {!isInModal && (
        <SEO
          title="Kayıt Ol – Vizepedia"
          description="Vizepedia hesabı oluşturun ve vize başvurularınızı yönetin."
          url="https://www.vizepedia.com/sign-up"
          noindex
        />
      )}

      <Form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p className="hosgeldiniz">Vizepedia&apos;ya Hoş geldiniz</p>
          <p className="subtext">
            Akıcı ve kolay bir vize başvuru deneyimi için hazır olun.
          </p>
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
          <label
            style={{
              display: "flex",
              gap: "8px",
              fontSize: "0.85rem",
              color: "var(--color-grey-600)",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              required
              style={{ width: "16px", height: "16px" }}
            />
            <span style={{ fontSize: "12px" }}>
              <a
                href="/kisisel-verilerin-korunmasi"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--color-grey-600)",
                  textDecoration: "underline",
                }}
              >
                KVKK Aydınlatma Metni
              </a>
              &apos;ni okudum ve kabul ediyorum.
            </span>
          </label>
        </FormRow>
        <FormRow orientation="vertical">
          <Button size="login" variation="login" disabled={isLoading}>
            {!isLoading ? "Hesap oluştur" : <SpinnerMini />}
          </Button>
        </FormRow>
        <BracketContainer>
          <Bracket />
          <p style={{ color: "var(--color-grey-700)" }}>ya da</p>
          <Bracket />
        </BracketContainer>
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
        <FormRow orientation="vertical">
          <Button
            size="login"
            variation="guest"
            type="button"
            onClick={handleGuestSignIn}
          >
            Anonim Giriş
          </Button>
          <FormRow orientation="vertical">
            <Girisyap>
              Zaten bir hesabın var mı?{" "}
              <a
                onClick={handleLoginClick}
                style={{
                  cursor: "pointer",
                  color: "#00ffa2",
                  textDecoration: "underline",
                }}
              >
                Giriş yap
              </a>
            </Girisyap>
          </FormRow>
        </FormRow>
      </Form>
    </>
  );
}

export default SignupForm;

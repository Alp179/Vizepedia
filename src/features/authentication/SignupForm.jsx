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

function SignupForm({ onCloseModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // Hata mesajı durumu
  const { isLoading } = useSignup(); // useSignup hook'u çağrılıyor
  const navigate = useNavigate(); // Yönlendirme fonksiyonu
  const { refetchUser } = useUser(); // refetchUser fonksiyonu eklendi

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
          // LocalStorage boşsa wellcome-2 (WellcomeA) sayfasına yönlendir
          navigate("/wellcome-2");
        }
      }
    } catch (error) {
      console.error("Oturum açma sırasında hata oluştu:", error.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(null); // Hata mesajını sıfırla

    if (!email || !password) {
      setErrorMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    const isAnonymous = localStorage.getItem("isAnonymous") === "true"; // Kullanıcı anonim mi?

    try {
      if (isAnonymous) {
        // Kullanıcı anonimse anonim hesabı tam hesaba çevir
        await convertAnonymousToUser({ email, password });
      } else {
        // Kullanıcı anonim değilse yeni bir hesap oluştur
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          // E-posta zaten kullanılıyorsa özel hata mesajı göster ve login bağlantısı ekle
          if (error.message.includes("already registered")) {
            setErrorMessage(
              <>
                Bu e-posta adresi zaten kullanılıyor.{" "}
                <a
                  onClick={() => navigate("/login")}
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

        // Kullanıcı başarılı şekilde oluşturulduysa localStorage temizle
        if (data.user) {
          localStorage.removeItem("isAnonymous");
          localStorage.removeItem("userSelections");
        }
      }

      // Eğer onCloseModal fonksiyonu varsa çağır
      if (onCloseModal) {
        onCloseModal(); // Modalı kapat
      }

      refetchUser(); // Kullanıcı verisini güncelle
      navigate("/dashboard"); // Kullanıcıyı yönlendir
    } catch (error) {
      console.log("Hata Detayı:", error); // Konsola hata yazdır
      setErrorMessage(error.message || "Üye olurken bir hata oluştu.");
    }
  }

  // Google oturum açma butonu için event handler
  async function handleGoogleSignIn() {
    const { data, error } = await signInWithGoogle();
    if (!error && data) {
      localStorage.removeItem("isAnonymous");
      localStorage.removeItem("userSelections");
      onCloseModal(); // Google ile giriş yapıldıktan sonra modalı kapatma
      refetchUser(); // Kullanıcı sorgusunu tekrar çalıştır
      navigate("/dashboard"); // Google ile giriş yapıldığında yönlendirme
    } else {
      setErrorMessage("Google ile giriş sırasında bir hata oluştu.");
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p className="hosgeldiniz">Vizepedia&apos;ya Hoş geldiniz</p>
        <p className="subtext">
          Akıcı ve kolay bir vize başvuru deneyimi için hazır olun.
        </p>
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
      {/* Hata mesajı göstergesi */}
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
          <span style={{fontSize: "12px"}}>
            <a
              href="/kisisel-verilerin-korunmasi"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-grey-600)", textDecoration: "underline" }}
            >
              KVKK Aydınlatma Metni
            </a>
            ’ni okudum ve kabul ediyorum.
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
              onClick={() => navigate("/login")}
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
  );
}

export default SignupForm;

/* eslint-disable react/prop-types */
import { useState } from "react";
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

function SignupForm({ onCloseModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // Hata mesajı durumu
  const { isLoading } = useSignup(); // useSignup hook'u çağrılıyor
  const navigate = useNavigate(); // Yönlendirme fonksiyonu
  const { refetchUser } = useUser(); // refetchUser fonksiyonu eklendi

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    // Anonim kullanıcıyı güncelleme fonksiyonunu çağırıyoruz
    convertAnonymousToUser({ email, password })
      .then(() => {
        // Başarılı olursa localStorage temizle, modalı kapat ve refetch yap
        localStorage.removeItem("isAnonymous");
        localStorage.removeItem("userSelections");
        setErrorMessage(null);
        onCloseModal(); // Modalı kapatma işlemi
        refetchUser(); // Kullanıcı sorgusunu tekrar çalıştır
        navigate("/dashboard"); // Başarılı olursa kullanıcıyı yönlendiriyoruz
      })
      .catch((error) => {
        console.log("Hata Detayı:", error); // Hata detayını görmek için log ekliyoruz
        setErrorMessage(error.message || "Üye olurken bir hata oluştu."); // Hata mesajını kullanıcıya göster
      });
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
        <p className="hosgeldiniz">Vizepedia`ya Hoş geldiniz</p>
        <p className="subtext">
          Vize alma sürecindeki karmaşıklığı ortadan kaldırmak için buradayız!
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
          Google ile Giriş Yap
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;

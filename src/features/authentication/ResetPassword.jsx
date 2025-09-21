import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import supabase from "../../services/supabase";
import toast from "react-hot-toast";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import SpinnerMini from "../../ui/SpinnerMini";
import Logo from "../../ui/Logo";

// Styling components
const ResetPasswordContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--color-grey-50);
`;

const ResetPasswordCard = styled.div`
  background-color: var(--color-grey-0);
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 480px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: var(--color-grey-800);
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  color: var(--color-grey-600);
  text-align: center;
  margin-bottom: 2rem;
`;

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Başlangıçta yükleniyor durumunda
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sayfa yüklendiğinde token geçerliliğini kontrol et
  useEffect(() => {
    async function validateToken() {
      try {
        // URL'den parametreleri al
        const hashFragment = location.hash.substring(1);
        const params = new URLSearchParams(hashFragment);

        // Hata kontrolü
        const error = params.get("error");
        const errorCode = params.get("error_code");
        const errorDescription = params.get("error_description");

        if (error) {
          // Token hatası varsa
          if (errorCode === "otp_expired") {
            setError(
              "Şifre sıfırlama bağlantınızın süresi dolmuş. Lütfen yeni bir şifre sıfırlama talebinde bulunun."
            );
          } else if (error === "access_denied") {
            setError(
              "Şifre sıfırlama bağlantınız geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama talebinde bulunun."
            );
          } else {
            setError(
              `Şifre sıfırlama sırasında bir hata oluştu: ${
                errorDescription || error
              }`
            );
          }
          setIsValidToken(false);
          setIsLoading(false);
          return;
        }

        // Token kontrolü
        const accessToken = params.get("access_token");
        const type = params.get("type");

        if (!accessToken || type !== "recovery") {
          setError(
            "Geçersiz şifre sıfırlama bağlantısı. Lütfen yeni bir şifre sıfırlama talebinde bulunun."
          );
          setIsValidToken(false);
          setIsLoading(false);
          return;
        }

        // Supabase oturumunu kontrol et
        const { data: session } = await supabase.auth.getSession();

        if (!session || !session.session) {
          setError(
            "Oturum bilgisi bulunamadı. Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş olabilir."
          );
          setIsValidToken(false);
          setIsLoading(false);
          return;
        }

        // Her şey yolunda ise
        setIsValidToken(true);
        setIsLoading(false);
      } catch (err) {
        console.error("Token doğrulama hatası:", err);
        setError(
          "Şifre sıfırlama bağlantısı doğrulanamadı. Lütfen yeni bir şifre sıfırlama talebinde bulunun."
        );
        setIsValidToken(false);
        setIsLoading(false);
      }
    }

    validateToken();
  }, [location]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!password || !passwordConfirm) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setIsLoading(true);
    try {
      // Şifreyi güncelle - Supabase otomatik olarak URL'deki token'ı kullanır
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      toast.success("Şifreniz başarıyla güncellendi!");

      // Sign out after successful password reset
      await supabase.auth.signOut();

      // Kullanıcıyı giriş sayfasına yönlendir
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Şifre güncelleme hatası:", error);
      setError(
        error.message ||
          "Şifre güncelleme sırasında bir hata oluştu. Lütfen tekrar deneyin."
      );
      setIsValidToken(false);
    } finally {
      setIsLoading(false);
    }
  }

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <ResetPasswordContainer>
        <ResetPasswordCard>
          <Logo>
            <img src="/logo.png" alt="vizepedia-logo" />
          </Logo>
          <Title>Şifre Sıfırlama</Title>
          <Description>Bağlantı doğrulanıyor, lütfen bekleyin...</Description>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SpinnerMini />
          </div>
        </ResetPasswordCard>
      </ResetPasswordContainer>
    );
  }

  // Token geçerli değilse hata göster
  if (!isValidToken) {
    return (
      <ResetPasswordContainer>
        <ResetPasswordCard>
          <Logo>
            <img src="/logo.png" alt="vizepedia-logo" />
          </Logo>
          <Title>Şifre Sıfırlama Hatası</Title>
          <Description>{error}</Description>
          <Button
            size="login"
            variation="login"
            onClick={() => navigate("/login")}
            style={{ width: "100%" }}
          >
            Giriş Sayfasına Dön
          </Button>
        </ResetPasswordCard>
      </ResetPasswordContainer>
    );
  }

  // Token geçerliyse şifre formunu göster
  return (
    <ResetPasswordContainer>
      <ResetPasswordCard>
        <Logo>
          <img src="/logo.png" alt="vizepedia-logo" />
        </Logo>
        <Title>Yeni Şifre Belirle</Title>
        <Description>Hesabınız için güçlü bir şifre oluşturun.</Description>

        <Form onSubmit={handleSubmit}>
          {error && (
            <p
              style={{
                color: "var(--color-red-700)",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              {error}
            </p>
          )}

          <FormRow orientation="vertical" label="Yeni Şifre">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="En az 6 karakter"
            />
          </FormRow>

          <FormRow orientation="vertical" label="Şifre Onayı">
            <Input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              disabled={isLoading}
              placeholder="Şifrenizi tekrar girin"
            />
          </FormRow>

          <FormRow orientation="vertical">
            <Button
              size="login"
              variation="login"
              disabled={isLoading}
              style={{ width: "100%" }}
            >
              {!isLoading ? "Şifreyi Güncelle" : <SpinnerMini />}
            </Button>
          </FormRow>
        </Form>
      </ResetPasswordCard>
    </ResetPasswordContainer>
  );
}

export default ResetPassword;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import { getCurrentUser, updateCurrentUser, logout } from "../services/apiAuth";
import supabase from "../services/supabase";

const AccountPageContainer = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.danger ? "#ff4d4f" : "#4caf50")};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

function AccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setEmail(user.email);
        } else {
          toast.error("Oturum açılmamış. Lütfen giriş yapın.");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Kullanıcı verileri alınamadı: " + error.message);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  // E-posta Güncelleme
  const handleEmailUpdate = async () => {
    if (!newEmail) {
      toast.error("Lütfen yeni bir e-posta adresi girin.");
      return;
    }

    try {
      await updateCurrentUser({ email: newEmail });
      toast.success("E-posta başarıyla güncellendi!");
      setEmail(newEmail);
      setNewEmail("");
    } catch (error) {
      toast.error("E-posta güncellenemedi: " + error.message);
    }
  };

  // Şifre Güncelleme
  const handlePasswordUpdate = async () => {
    if (!password) {
      toast.error("Lütfen yeni bir şifre girin.");
      return;
    }

    try {
      await updateCurrentUser({ password });
      toast.success("Şifre başarıyla güncellendi!");
      setPassword("");
    } catch (error) {
      toast.error("Şifre güncellenemedi: " + error.message);
    }
  };

  // Hesabı Pasifleştirme ve Verileri Silme
  const handleDeactivateAccount = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        toast.error("Kullanıcı oturumu bulunamadı.");
        return;
      }

      const { id: userId } = user;

      // Kullanıcının app_metadata alanını güncelle
      const { error: updateError } = await supabase.auth.updateUser({
        app_metadata: { isDeleted: true },
      });

      if (updateError) {
        throw new Error("Kullanıcı pasifleştirilemedi: " + updateError.message);
      }

      // Kullanıcıyla ilişkili tüm verileri sil
      const { error: deleteAnswersError } = await supabase
        .from("userAnswers")
        .delete()
        .eq("userId", userId);

      const { error: deleteDocumentsError } = await supabase
        .from("completed_documents")
        .delete()
        .eq("userId", userId);

      if (deleteAnswersError || deleteDocumentsError) {
        throw new Error("Kullanıcı verileri silinirken bir hata oluştu.");
      }

      // Oturumdan çıkış yap
      await logout();
      toast.success("Hesabınız pasifleştirildi ve ilişkili veriler silindi.");
      navigate("/login");
    } catch (error) {
      toast.error("Hesap pasifleştirilemedi: " + error.message);
    }
  };

  return (
    <AccountPageContainer>
      <h1>Hesap Ayarları</h1>
      <p>
        Mevcut E-posta: <strong>{email}</strong>
      </p>

      {/* E-posta Güncelleme */}
      <label>
        Yeni E-posta Adresi:
        <Input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Yeni e-posta adresinizi girin"
        />
      </label>
      <Button onClick={handleEmailUpdate}>E-posta Güncelle</Button>

      {/* Şifre Güncelleme */}
      <label>
        Yeni Şifre:
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Yeni şifrenizi girin"
        />
      </label>
      <Button onClick={handlePasswordUpdate}>Şifre Güncelle</Button>

      {/* Hesabı Pasifleştirme */}
      <Button danger onClick={handleDeactivateAccount}>
        Hesabı Pasifleştir ve Verileri Sil
      </Button>
    </AccountPageContainer>
  );
}

export default AccountPage;

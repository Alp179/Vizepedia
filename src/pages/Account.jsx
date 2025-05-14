import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import { getCurrentUser, updateCurrentUser, logout } from "../services/apiAuth";
import supabase from "../services/supabase";

// Main container that works with the sidebar and top navigation
const PageContainer = styled.div`
  flex: 1;
  min-height: calc(100vh - 80px);
  margin-left: 100px;

  @media (max-width: 1550px) {
    margin-left: 0;
    margin-right: 50px;
  }

  @media (max-width: 1250px) {
    margin-left: -100px;
  }
  
  @media (max-width: 960px) {
    padding: 1.5rem;
  }

  @media (max-width: 710px) {
    margin:0;
  }
`;

const ContentWrapper = styled.div`
  max-width: 700px;
  margin: 0 0 50px 0;
  background-color: var(--color-grey-909);
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  @media (max-width: 710px) {
    margin-top: 60px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-grey-200, #e5e7eb);
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-grey-600, #111827);
    margin: 0;
  }
  
  @media (max-width: 640px) {
    padding: 1rem 1.5rem;
    
    h1 {
      font-size: 20px;
    }
  }
`;

const FormSection = styled.div`
  padding: 2rem;
  
  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-grey-700, #374151);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-grey-300, #d1d5db);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  background-color: white;
  color: black;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: var(--color-grey-400, #9ca3af);
  }
`;

const CurrentEmail = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--color-grey-100, #f3f4f6);
  border-radius: 8px;
  
  .email-label {
    font-size: 14px;
    color: var(--color-grey-600, #4b5563);
    margin-right: 0.5rem;
  }
  
  .email-value {
    font-weight: 600;
    color: var(--color-grey-800, #1f2937);
    word-break: break-all; /* Ensures long emails wrap properly */
  }
  
  /* Mobile responsiveness */
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    
    .email-label {
      margin-bottom: 0.25rem;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--color-grey-200, #e5e7eb);
  margin: 2rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-grey-800, #1f2937);
  margin-bottom: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;
  background-color: ${props => 
    props.danger 
      ? "var(--color-error, #ef4444)" 
      : props.secondary 
        ? "white" 
        : "var(--color-primary, #004466)"};
  color: ${props => 
    props.danger 
      ? "white" 
      : props.secondary 
        ? "var(--color-grey-700, #374151)" 
        : "var(--color-success, #00ffa2)"};
  border: ${props => 
    props.secondary 
      ? "1px solid var(--color-grey-300, #d1d5db)" 
      : "none"};
  box-shadow: ${props => 
    props.danger 
      ? "0 1px 3px rgba(239, 68, 68, 0.1)" 
      : "0 1px 3px rgba(0, 0, 0, 0.1)"};
      
  &:hover {
    background-color: ${props => 
      props.danger 
        ? "#dc2626" 
        : props.secondary 
          ? "var(--color-grey-100, #f3f4f6)" 
          : "#003752"};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    margin-right: 8px;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 640px) {
    width: 100%; /* Full width on mobile */
    padding: 1rem 1rem;
    font-size: 13px;
    
    svg {
      margin-right: 6px;
    }
  }

  @media (max-width: 375px) {
    padding: 1rem 0.75rem;
    font-size: 12px;
    white-space: normal; /* Allow text to wrap */
    height: auto; /* Adjust height based on content */
    text-align: center; /* Center the wrapped text */
    line-height: 1.3; /* Proper line height for wrapped text */
    
    svg {
      margin-right: 5px;
      width: 14px;
      height: 14px;
    }
  }

`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const DangerSection = styled.div`
  background-color: rgba(239, 68, 68, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  
  h3 {
    color: var(--color-error, #ef4444);
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--color-grey-700, #374151);
    font-size: 14px;
    margin-bottom: 1rem;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 640px) {
    padding: 1.25rem;
    
    h3 {
      font-size: 15px;
    }
    
    p {
      font-size: 13px;
    }
  }
`;

// Icons
const IconSave = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const IconLock = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconTrash = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

function AccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isDeactivateLoading, setIsDeactivateLoading] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        console.log("User data received:", user); // Debug log
        if (user) {
          setEmail(user.email || "");
          console.log("Email set to:", user.email); // Debug log
        } else {
          toast.error("Oturum açılmamış. Lütfen giriş yapın.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error); // Debug log
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
      setIsEmailLoading(true);
      await updateCurrentUser({ email: newEmail });
      toast.success("E-posta başarıyla güncellendi!");
      setEmail(newEmail);
      setNewEmail("");
    } catch (error) {
      toast.error("E-posta güncellenemedi: " + error.message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  // Şifre Güncelleme
  const handlePasswordUpdate = async () => {
    if (!password) {
      toast.error("Lütfen yeni bir şifre girin.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }

    try {
      setIsPasswordLoading(true);
      await updateCurrentUser({ password });
      toast.success("Şifre başarıyla güncellendi!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Şifre güncellenemedi: " + error.message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Hesabı Pasifleştirme ve Verileri Silme
  const handleDeactivateAccount = async () => {
    try {
      setIsDeactivateLoading(true);
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
    } finally {
      setIsDeactivateLoading(false);
      setShowDeactivateConfirm(false);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <h1>Hesap Ayarları</h1>
        </PageHeader>
        
        <FormSection>
          <CurrentEmail>
            <span className="email-label">Mevcut E-posta:</span>
            <span className="email-value">{email || "Yükleniyor..."}</span>
          </CurrentEmail>
          
          <SectionTitle>E-posta Güncelle</SectionTitle>
          <FormGroup>
            <Label htmlFor="newEmail">Yeni E-posta Adresi</Label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Yeni e-posta adresinizi girin"
            />
          </FormGroup>
          
          <Button 
            onClick={handleEmailUpdate} 
            disabled={isEmailLoading}
          >
            <IconSave />
            {isEmailLoading ? "Güncelleniyor..." : "E-posta Güncelle"}
          </Button>
          
          <Divider />
          
          <SectionTitle>Şifre Güncelle</SectionTitle>
          <FormGroup>
            <Label htmlFor="password">Yeni Şifre</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yeni şifrenizi girin"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Yeni şifrenizi tekrar girin"
            />
          </FormGroup>
          
          <Button 
            onClick={handlePasswordUpdate} 
            disabled={isPasswordLoading}
          >
            <IconLock />
            {isPasswordLoading ? "Güncelleniyor..." : "Şifre Güncelle"}
          </Button>
          
          <DangerSection>
            <h3>Hesabı Pasifleştir</h3>
            <p>
              Bu işlem geri alınamaz! Hesabınız pasifleştirilecek ve tüm kişisel verileriniz silinecektir.
            </p>
            
            {showDeactivateConfirm ? (
              <ButtonGroup>
                <Button
                  danger 
                  onClick={handleDeactivateAccount}
                  disabled={isDeactivateLoading}
                >
                  <IconTrash />
                  {isDeactivateLoading ? "İşleniyor..." : "Hesabı Pasifleştir ve Verileri Sil"}
                </Button>
                <Button 
                  secondary
                  onClick={() => setShowDeactivateConfirm(false)}
                  disabled={isDeactivateLoading}
                >
                  Vazgeç
                </Button>
              </ButtonGroup>
            ) : (
              <Button 
                danger 
                onClick={() => setShowDeactivateConfirm(true)}
              >
                <IconTrash />
                Hesabı Pasifleştir ve Verileri Sil
              </Button>
            )}
          </DangerSection>
        </FormSection>
      </ContentWrapper>
    </PageContainer>
  );
}

export default AccountPage;
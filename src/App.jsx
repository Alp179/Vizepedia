import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

// Mevcut import'lar
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import BlogLayout from "./ui/BlogLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";
import Wellcome from "./pages/Wellcome";
import Documents from "./pages/Documents";
import ReadyDocumentDetail from "./pages/ReadyDocumentDetail";
import PlannedDocumentDetail from "./pages/PlannedDocumentDetail";
import WithUsDocumentDetail from "./pages/WithUsDocumentDetail";
import MainPage from "./pages/MainPage";
import WellcomeA from "./features/wellcomes/WellcomeA";
import WellcomeD from "./features/wellcomes/WellcomeD";
import WellcomeC from "./features/wellcomes/WellcomeC";
import WellcomeB from "./features/wellcomes/WellcomeB";
import WellcomeE from "./features/wellcomes/WellcomeE";
import { UserSelectionsProvider } from "./context/UserSelectionsContext";
import ControlScreen from "./features/wellcomes/ControlScreen";
import DocumentLayout from "./ui/DocumentLayout";
import { SelectedDocumentProvider } from "./context/SelectedDocumentContext";
import { DocumentsProvider } from "./context/DocumentsContext";
import DocumentSummary from "./pages/DocumentSummary";
import { VisaApplicationProvider } from "./context/VisaApplicationContext";
import QuestionsLayout from "./ui/QuesitonsLayout";
import MainPageLayout from "./ui/MainPageLayout";
import BlogHome from "./pages/BlogHome";
import BlogDetail from "./pages/BlogDetail";
import Kvkk from "./pages/Kvkk";
import { fetchLatestApplication } from "./utils/userSelectionsFetch";
import { getCurrentUser } from "./services/apiAuth";
import WellcomeDa from "./features/wellcomes/WellcomeDa";
import ResetPassword from "./features/authentication/ResetPassword";
import CerezPolitikasi from "./pages/CerezPolitikasi";
import Davetiye from "./pages/Davetiye";
// YENİ: Hakkımızda sayfası import'u

// Çerez sistemi import'ları
import { CookieConsentProvider } from "./hooks/useCookieConsent.jsx";
import { CookieBanner } from "./ui/CookieBanner.jsx";

import { FloatingCookieButton } from "./ui/FloatingCookieButton.jsx";
import { GoogleAnalytics } from "./utils/googleAnalytics.js";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics.jsx";
import { CookiePreferences } from "./ui/CookiePreferences.jsx";
import AboutPage from "./pages/AboutPage.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

// Router içeriğini ayrı component olarak çıkardık
function AppWithGA() {
  useGoogleAnalytics(); // Her sayfa değişiminde tracking

  return (
    <Routes>
      {/* MainPage as Default Landing Page */}
      <Route element={<MainPageLayout />}>
        <Route index element={<MainPage />} />
        <Route path="mainpage" element={<MainPage />} />
        {/* YENİ: Hakkımızda sayfası route'u */}
        <Route path="hakkimizda" element={<AboutPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<RedirectDashboard />} />
        <Route path="dashboard/:id" element={<Dashboard />} />
        <Route path="account" element={<Account />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <QuestionsLayout />
          </ProtectedRoute>
        }
      >
        <Route path="wellcome" element={<Wellcome />} />
        <Route path="wellcome-1" element={<WellcomeA />} />
        <Route path="wellcome-2" element={<WellcomeB />} />
        <Route path="wellcome-3" element={<WellcomeC />} />
        <Route path="wellcome-4" element={<WellcomeD />} />
        <Route path="wellcome-4a" element={<WellcomeDa />} />
        <Route path="wellcome-5" element={<WellcomeE />} />
        <Route path="test" element={<ControlScreen />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DocumentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="documents/:id" element={<Documents />} />
        <Route path="ready-documents/:id" element={<ReadyDocumentDetail />} />
        <Route
          path="planned-documents/:id"
          element={<PlannedDocumentDetail />}
        />
        <Route path="withus-documents/:id" element={<WithUsDocumentDetail />} />
        <Route path="summary" element={<DocumentSummary />} />
        <Route path="summary/:id" element={<DocumentSummary />} />
      </Route>

      {/* Blog Routes */}
      <Route element={<BlogLayout />}>
        <Route path="blog" element={<BlogHome />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
      </Route>

      {/* Login, Sign-Up ve ResetPassword Routes */}
      <Route
        path="login"
        element={
          <RedirectIfLoggedIn>
            <Login />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="sign-up"
        element={
          <RedirectIfLoggedIn>
            <SignUp />
          </RedirectIfLoggedIn>
        }
      />
      <Route path="reset-password" element={<ResetPassword />} />

      <Route path="kisisel-verilerin-korunmasi" element={<Kvkk />} />
      <Route path="cerez-politikasi" element={<CerezPolitikasi />} />
      <Route path="davetiye-olustur" element={<Davetiye />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

// Yeni bileşen: Kullanıcı oturum açmışsa dashboard'a yönlendirir
function RedirectIfLoggedIn({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        navigate("/dashboard");
      }
    }
    checkUser();
  }, [navigate]);

  return children;
}

function RedirectDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleRedirect() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const latestApplication = await fetchLatestApplication(currentUser.id);
        if (latestApplication) {
          localStorage.setItem("latestApplicationId", latestApplication.id);
          navigate(`/dashboard/${latestApplication.id}`);
        } else {
          navigate("/wellcome-2");
        }
      }
    }
    handleRedirect();
  }, [navigate]);

  return null;
}

function App() {
  useEffect(() => {
    // Google Analytics'i başlat (sadece GA ID varsa)
    if (
      GoogleAnalytics.GA_MEASUREMENT_ID &&
      GoogleAnalytics.GA_MEASUREMENT_ID !== "G-XXXXXXXXXX"
    ) {
      GoogleAnalytics.initialize();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CookieConsentProvider>
        {" "}
        {/* Çerez Provider'ını ekledik */}
        <VisaApplicationProvider>
          <DocumentsProvider>
            <SelectedDocumentProvider>
              <UserSelectionsProvider>
                <DarkModeProvider>
                  <ReactQueryDevtools initialIsOpen={false} />
                  <GlobalStyles />
                  <BrowserRouter>
                    <AppWithGA />{" "}
                    {/* Router içeriğini ayrı component'e taşıdık */}
                  </BrowserRouter>
                  {/* Çerez bileşenlerini ekledik */}
                  <CookieBanner />
                  <CookiePreferences />
                  <FloatingCookieButton /> {/* Footer yerine floating button */}
                  <Toaster
                    position="top-center"
                    containerStyle={{
                      position: "fixed",
                      top: "35%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 3000,
                    }}
                    toastOptions={{
                      duration: Infinity,
                      style: {
                        padding: "16px",
                        background: "var(--color-grey-0)",
                        color: "var(--color-grey-600)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        zIndex: 1001,
                      },
                    }}
                  />
                </DarkModeProvider>
              </UserSelectionsProvider>
            </SelectedDocumentProvider>
          </DocumentsProvider>
        </VisaApplicationProvider>
      </CookieConsentProvider>{" "}
      {/* Provider'ı kapattık */}
    </QueryClientProvider>
  );
}

export default App;

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

import ReadyDocumentDetail from "./pages/ReadyDocumentDetail";
import PlannedDocumentDetail from "./pages/PlannedDocumentDetail";
import WithUsDocumentDetail from "./pages/WithUsDocumentDetail";
import MainPage from "./pages/MainPage";
import { UserSelectionsProvider } from "./context/UserSelectionsContext";
import DocumentLayout from "./ui/DocumentLayout";
import { SelectedDocumentProvider } from "./context/SelectedDocumentContext";
import { DocumentsProvider } from "./context/DocumentsContext";
import { VisaApplicationProvider } from "./context/VisaApplicationContext";
import MainPageLayout from "./ui/MainPageLayout";
import BlogHome from "./pages/BlogHome";
import BlogDetail from "./pages/BlogDetail";
import Kvkk from "./pages/Kvkk";
import { fetchLatestApplication } from "./utils/userSelectionsFetch";
import { getCurrentUser } from "./services/apiAuth";
import ResetPassword from "./features/authentication/ResetPassword";
import CerezPolitikasi from "./pages/CerezPolitikasi";
import Davetiye from "./pages/Davetiye";

// Çerez sistemi import'ları
import { CookieConsentProvider } from "./hooks/useCookieConsent.jsx";
import { CookieBanner } from "./ui/CookieBanner.jsx";
import { FloatingCookieButton } from "./ui/FloatingCookieButton.jsx";
import { GoogleAnalytics } from "./utils/googleAnalytics.js";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics.jsx";
import { CookiePreferences } from "./ui/CookiePreferences.jsx";
import AboutPage from "./pages/AboutPage.jsx";

// UPDATED: Import AnonymousDataService for migration
import { AnonymousDataService } from "./utils/anonymousDataService";
import Disclaimer from "./pages/Disclaimer";
import TermsOfService from "./pages/TermsOfService";
import GizlilikPolitikasi from "./pages/GizlilikPolitikasi";
import Iletisim from "./pages/Iletisim";
import SiteHaritasi from "./pages/SiteHaritasi";

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
      </Route>

      {/* Dashboard Routes - Public for bot/new visitor access */}
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/:id" element={<Dashboard />} />
      </Route>

      {/* PUBLIC Document Routes - Accessible by bots/new visitors */}
      <Route element={<DocumentLayout />}>
        {/* Bot/New Visitor Routes (without ID) */}
        <Route path="ready-documents" element={<ReadyDocumentDetail />} />
        <Route path="planned-documents" element={<PlannedDocumentDetail />} />
        <Route path="withus-documents" element={<WithUsDocumentDetail />} />

        {/* Regular Routes (with ID) for authenticated/anonymous users */}
        <Route path="ready-documents/:id" element={<ReadyDocumentDetail />} />
        <Route
          path="planned-documents/:id"
          element={<PlannedDocumentDetail />}
        />
        <Route path="withus-documents/:id" element={<WithUsDocumentDetail />} />
      </Route>

      {/* Protected Routes for authenticated users only */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="account" element={<Account />} />
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

      <Route path="gizlilik-politikasi" element={<GizlilikPolitikasi />} />
      <Route path="kisisel-verilerin-korunmasi" element={<Kvkk />} />
      <Route path="yasal-uyari" element={<Disclaimer />} />
      <Route path="kullanim-sartlari" element={<TermsOfService />} />
      <Route path="cerez-politikasi" element={<CerezPolitikasi />} />
      <Route path="hakkimizda" element={<AboutPage />} />
      <Route path="davetiye-olustur" element={<Davetiye />} />
      <Route path="iletisim" element={<Iletisim />} />
      <Route path="site-haritasi" element={<SiteHaritasi />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

// Yeni bileşen: Kullanıcı oturum açmışsa dashboard'a yönlendirir
// 3. UPDATE: App.jsx - Enhanced RedirectIfLoggedIn component
function RedirectIfLoggedIn({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log("✅ Authenticated user found:", currentUser.email);

          // Check for recent migration first
          const migrationComplete = sessionStorage.getItem("migrationComplete");
          const storedAppId = sessionStorage.getItem("latestApplicationId");

          if (migrationComplete === "true" && storedAppId) {
            console.log(
              "🔄 Migration detected, using stored application ID:",
              storedAppId
            );
            sessionStorage.removeItem("migrationComplete"); // Clean up
            navigate(`/dashboard/${storedAppId}`);
            return;
          }

          // Otherwise, fetch latest application
          const latestApplication = await fetchLatestApplication(
            currentUser.id
          );
          if (latestApplication) {
            console.log("📋 Latest application found:", latestApplication.id);
            sessionStorage.setItem("latestApplicationId", latestApplication.id);
            navigate(`/dashboard/${latestApplication.id}`);
          } else {
            console.log(
              "⚠️ No applications found, staying on login/signup page"
            );
            // Don't redirect if no applications - let user complete onboarding
          }
        }
      } catch (error) {
        console.error("Error checking user in RedirectIfLoggedIn:", error);
      }
    }
    checkUser();
  }, [navigate]);

  return children;
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

    // UPDATED: Migrate localStorage to sessionStorage (run once per session)
    console.log("🔄 Starting localStorage to sessionStorage migration...");
    AnonymousDataService.migrateFromLocalStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CookieConsentProvider>
        <VisaApplicationProvider>
          <DocumentsProvider>
            <SelectedDocumentProvider>
              <UserSelectionsProvider>
                <DarkModeProvider>
                  <ReactQueryDevtools initialIsOpen={false} />
                  <GlobalStyles />
                  <BrowserRouter>
                    <AppWithGA />
                  </BrowserRouter>
                  <CookieBanner />
                  <CookiePreferences />
                  <FloatingCookieButton />
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
      </CookieConsentProvider>
    </QueryClientProvider>
  );
}

export default App;

import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
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
import ReadyDocumentDetail from "./pages/ReadyDocumentDetail"; // Hemen Hazır belgeler için yeni bileşen
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
import { useEffect } from "react";
import { fetchLatestApplication } from "./utils/userSelectionsFetch";
import { getCurrentUser } from "./services/apiAuth";
import WellcomeDa from "./features/wellcomes/WellcomeDa";
import ResetPassword from "./features/authentication/ResetPassword";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VisaApplicationProvider>
        <DocumentsProvider>
          <SelectedDocumentProvider>
            <UserSelectionsProvider>
              <DarkModeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
                <GlobalStyles />
                <BrowserRouter>
                  <Routes>
                    {/* MainPage as Default Landing Page */}
                    <Route element={<MainPageLayout />}>
                      <Route index element={<MainPage />} />
                      <Route path="mainpage" element={<MainPage />} />
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
                      {/* Hemen Hazır belgeler için yeni rota ekliyoruz */}
                      <Route
                        path="ready-documents/:id"
                        element={<ReadyDocumentDetail />}
                      />
                      <Route
                        path="planned-documents/:id"
                        element={<PlannedDocumentDetail />}
                      />
                      <Route
                        path="withus-documents/:id"
                        element={<WithUsDocumentDetail />}
                      />
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
                    {/* Yeni şifre sıfırlama sayfası rotası */}
                    <Route path="reset-password" element={<ResetPassword />} />

                    <Route path="kisisel-verilerin-korunmasi" element={<Kvkk />} />

                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </BrowserRouter>
                <Toaster
                  position="top-center" // Varsayılan olarak üstte tanımlı ama containerStyle ile override ediliyor
                  containerStyle={{
                    position: "fixed",
                    top: "35%", // Ortalamak için
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Ekranın ortasına taşır
                    zIndex: 3000, // Toaster'ın diğer öğelerin üstünde görünmesi için
                  }}
                  toastOptions={{
                    duration: Infinity, // Toast süresiz olarak ekranda kalsın
                    style: {
                      padding: "16px",
                      background: "var(--color-grey-0)",
                      color: "var(--color-grey-600)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Hafif gölge
                      zIndex: 1001, // Toaster'ın overlay üzerinde görünmesi için
                    },
                  }}
                />
              </DarkModeProvider>
            </UserSelectionsProvider>
          </SelectedDocumentProvider>
        </DocumentsProvider>
      </VisaApplicationProvider>
    </QueryClientProvider>
  );
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

export default App;

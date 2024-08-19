import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";
import Wellcome from "./pages/Wellcome";
import Documents from "./pages/Documents";
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
import { useEffect } from "react";
import { fetchLatestApplication } from "./utils/userSelectionsFetch";
import { getCurrentUser } from "./services/apiAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

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
          navigate("/wellcome-2"); // İlk başvuru yoksa welcome sayfasına yönlendirin
        }
      }
    }
    handleRedirect();
  }, [navigate]);

  return null;
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
                    <Route
                      element={
                        <ProtectedRoute>
                          <MainPageLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="mainpage" element={<MainPage />} />
                    </Route>
                    <Route
                      element={
                        <ProtectedRoute>
                          <AppLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<RedirectDashboard />} />
                      <Route path="dashboard" element={<RedirectDashboard />} />
                      <Route path="dashboard/:id" element={<Dashboard />} />
                      <Route path="settings" element={<Settings />} />
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
                      <Route path="summary" element={<DocumentSummary />} />
                      <Route path="summary/:id" element={<DocumentSummary />} />
                    </Route>

                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </BrowserRouter>
                <Toaster
                  position="top-center"
                  gutter={12}
                  containerStyle={{ margin: "8px" }}
                  toastOptions={{
                    success: { duration: 3000 },
                    error: {
                      duration: 5000,
                    },
                    style: {
                      fontSize: "16px",
                      maxWidth: "500px",
                      padding: "16px 24px",
                      backgroundColor: "var(--color-grey-0",
                      color: "var(--color-grey-700)",
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

export default App;

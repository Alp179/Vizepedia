import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import DocumentDetails from "./pages/DocumentDetails";
import QuestionsLayout from "./ui/QuesitonsLayout";

import WellcomeA from "./features/wellcomes/WellcomeA";
import WellcomeD from "./features/wellcomes/WellcomeD";
import WellcomeC from "./features/wellcomes/WellcomeC";
import WellcomeB from "./features/wellcomes/WellcomeB";
import WellcomeE from "./features/wellcomes/WellcomeE";
import { UserSelectionsProvider } from "./context/UserSelectionsContext";
import ControlScreen from "./features/wellcomes/ControlScreen";
import DocumentLayout from "./ui/DocumentLayout";
import { SelectedDocumentProvider } from "./context/SelectedDocumentContext";

// import SignUp from "./pages/Signup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <SelectedDocumentProvider>
      <UserSelectionsProvider>
        <DarkModeProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />

            <GlobalStyles />
            <BrowserRouter>
              <Routes>
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />

                  <Route path="dashboard" element={<Dashboard />} />
                  <Route
                    path="document/:documentId"
                    element={<DocumentDetails />}
                  />

                  {/* <Route path="signup" element={<SignUp />} /> */}
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
                  <Route path="documents" element={<Documents />} />
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
          </QueryClientProvider>
        </DarkModeProvider>
      </UserSelectionsProvider>
    </SelectedDocumentProvider>
  );
}

export default App;

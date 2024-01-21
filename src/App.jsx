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
import Wellcome1 from "./features/wellcome/wellcome1";
import Wellcome2 from "./features/wellcome/wellcome2";
import Wellcome3 from "./features/wellcome/wellcome3";
import Wellcome4 from "./features/wellcome/wellcome4";

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
              <Route path="documents" element={<Documents />} />

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
              <Route path="wellcome" element={<Wellcome1 />} />
              <Route path="wellcome" element={<Wellcome2 />} />
              <Route path="wellcome" element={<Wellcome3 />} />
              <Route path="wellcome" element={<Wellcome4 />} />
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
  );
}

export default App;

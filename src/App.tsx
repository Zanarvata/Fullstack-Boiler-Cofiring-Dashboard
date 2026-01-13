import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './components/LoginPage';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { RekomendasiPage } from './pages/RekomendasiPage';
import { DetailBoilerPage } from './pages/DetailBoilerPage';
import { AICopilotPage } from './pages/AICopilotPage';
import { OperatorPage } from './pages/OperatorPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rekomendasi" element={<RekomendasiPage />} />
        <Route path="/detail-boiler" element={<DetailBoilerPage />} />
        <Route path="/ai-copilot" element={<AICopilotPage />} />
        <Route path="/operator" element={<OperatorPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
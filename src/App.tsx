
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Families } from "./pages/Families";
import { Actions } from "./pages/Actions";
import { Volunteers } from "./pages/Volunteers";
import { Reports } from "./pages/Reports";
import { Donations } from "./pages/Donations";
import { Users } from "./pages/Users";
import { VolunteerPortal } from "./pages/VolunteerPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthFlow />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redireciona raiz por role */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            user?.role === 'volunteer'
              ? <Navigate to="/portal" replace />
              : <Dashboard />
          } />

          {/* Rotas exclusivas de admin */}
          <Route path="dashboard"    element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="familias"     element={<AdminRoute><Families /></AdminRoute>} />
          <Route path="acoes"        element={<AdminRoute><Actions /></AdminRoute>} />
          <Route path="voluntarios"  element={<AdminRoute><Volunteers /></AdminRoute>} />
          <Route path="arrecadacoes" element={<AdminRoute><Donations /></AdminRoute>} />
          <Route path="relatorios"   element={<AdminRoute><Reports /></AdminRoute>} />
          <Route path="usuarios"     element={<AdminRoute><Users /></AdminRoute>} />

          {/* Portal do voluntário */}
          <Route path="portal" element={
            <ProtectedRoute><VolunteerPortal /></ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

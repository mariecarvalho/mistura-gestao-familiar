import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

/** Redireciona voluntários para /portal caso tentem acessar rota de admin */
export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role !== 'admin') {
    return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
}

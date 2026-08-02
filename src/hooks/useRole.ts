import { useAuth } from '@/contexts/AuthContext';

export const useRole = () => {
  const { user } = useAuth();
  return {
    isAdmin:     user?.role === 'admin',
    isVolunteer: user?.role === 'volunteer',
    role:        user?.role ?? null,
  };
};

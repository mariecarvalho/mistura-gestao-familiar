
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { MisturaIcon } from '@/components/ui/MisturaIcon';
// import { Heart } from 'lucide-react'; // Mantendo comentado conforme solicitado
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-hero text-white px-3 sm:px-6 flex items-center justify-between shadow-md pt-safe">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-white hover:bg-white/20 hover:text-white shrink-0 -ml-1 sm:ml-0"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <MisturaIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold leading-tight truncate">Mistura</h1>
            <p className="text-[10px] sm:text-xs text-white/80 truncate hidden xs:block">Gestão de Famílias e Ações</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="text-right max-w-[130px] sm:max-w-[200px]">
          <p className="text-xs sm:text-sm font-medium truncate">{user?.name || 'Admin'}</p>
          <p className="text-[10px] sm:text-xs text-white/80 capitalize truncate">
            {user?.role === 'admin' ? 'Administrador' : user?.role === 'volunteer' ? 'Voluntário' : (user?.role || 'Usuário')}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Sair"
          className="text-white hover:bg-white/20 hover:text-white shrink-0 h-8 w-8 sm:h-9 sm:w-9"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}


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
    <header className="h-16 bg-hero text-white px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-white hover:bg-white/20 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <MisturaIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Mistura</h1>
            <p className="text-xs text-white/80">Gestão de Famílias e Ações</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
          <p className="text-xs text-white/80">{user?.role || 'Administrador'}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Sair"
          className="text-white hover:bg-white/20 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

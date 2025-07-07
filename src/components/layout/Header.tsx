
import { Button } from '@/components/ui/button';
import { Menu, ChefHat, LogOut } from 'lucide-react';
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
    <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-warm-orange rounded-lg flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Mistura Acolhe</h1>
            <p className="text-xs text-muted-foreground">Gestão de Famílias e Ações</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
          <p className="text-xs text-muted-foreground">{user?.role || 'Administrador'}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}


import { Button } from '@/components/ui/button';
import { Menu, Heart } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Header() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

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
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Mistura Acolhe</h1>
            <p className="text-xs text-muted-foreground">Gestão de Famílias e Ações</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">Admin</p>
          <p className="text-xs text-muted-foreground">Administrador</p>
        </div>
      </div>
    </header>
  );
}

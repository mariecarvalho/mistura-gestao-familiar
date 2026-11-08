import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users,
  Calendar,
  UserCheck,
  BarChart3,
  Menu,
  HandCoins,
  UserCog,
  LayoutDashboard,
  Home,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MisturaIcon } from '@/components/ui/MisturaIcon';
import { useAppStore } from '@/store/useAppStore';
import { useRole } from '@/hooks/useRole';
import { cn } from '@/lib/utils';

const adminNav = [
  { name: 'Dashboard',    href: '/',             icon: LayoutDashboard },
  { name: 'Famílias',     href: '/familias',     icon: Users },
  { name: 'Ações',        href: '/acoes',        icon: Calendar },
  { name: 'Voluntários',  href: '/voluntarios',  icon: UserCheck },
  { name: 'Arrecadações', href: '/arrecadacoes', icon: HandCoins },
  { name: 'Relatórios',   href: '/relatorios',   icon: BarChart3 },
  { name: 'Usuários',     href: '/usuarios',     icon: UserCog },
];

const volunteerNav = [
  { name: 'Meu Portal', href: '/portal', icon: Home },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { isAdmin } = useRole();
  const location = useLocation();

  const navigation = isAdmin ? adminNav : volunteerNav;

  // Auto-close on mobile route changes
  useEffect(() => {
    if (window.innerWidth < 1024 && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-border transition-all duration-300 flex flex-col",
          // Mobile: drawer deslizante
          "w-72 max-w-[85vw]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: fixo lateral abaixo do header
          "lg:translate-x-0 lg:top-16 lg:bottom-0 lg:h-[calc(100vh-4rem)] lg:z-20",
          sidebarOpen ? "lg:w-64" : "lg:w-16"
        )}
      >
        {/* Cabeçalho do drawer apenas no mobile */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:hidden bg-hero text-white pt-safe">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <MisturaIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-base">Mistura</p>
              <p className="text-xs text-white/80">Menu de Navegação</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:bg-white/20 hover:text-white"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Botão de colapsar no Desktop */}
        <div className="p-3 hidden lg:flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground"
            title={sidebarOpen ? "Recolher menu" : "Expandir menu"}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Links de navegação */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors select-none",
                  isActive
                    ? "bg-warm-orange text-white shadow-md font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70 active:bg-secondary"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className={cn(
                "truncate transition-opacity",
                !sidebarOpen && "lg:hidden"
              )}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

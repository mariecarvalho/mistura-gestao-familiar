import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, HandCoins, Home, Menu } from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { isAdmin } = useRole();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const adminTabs = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Famílias', href: '/familias', icon: Users },
    { name: 'Ações', href: '/acoes', icon: Calendar },
    { name: 'Arrecadação', href: '/arrecadacoes', icon: HandCoins },
  ];

  const volunteerTabs = [
    { name: 'Meu Portal', href: '/portal', icon: Home },
  ];

  const tabs = isAdmin ? adminTabs : volunteerTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border lg:hidden pb-safe shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.href}
            end={tab.href === '/'}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors select-none",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "p-1 rounded-xl transition-all",
                    isActive && "bg-primary/10"
                  )}
                >
                  <tab.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                </div>
                <span className="truncate max-w-[64px] mt-0.5">{tab.name}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Botão de abrir menu completo */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground",
            sidebarOpen && "text-primary font-semibold"
          )}
        >
          <div
            className={cn(
              "p-1 rounded-xl transition-all",
              sidebarOpen && "bg-primary/10"
            )}
          >
            <Menu className="h-5 w-5" />
          </div>
          <span className="truncate max-w-[64px] mt-0.5">Mais</span>
        </button>
      </div>
    </nav>
  );
}

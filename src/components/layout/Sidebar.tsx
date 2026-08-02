import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, UserCheck, BarChart3, Menu, HandCoins, UserCog, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const navigation = isAdmin ? adminNav : volunteerNav;

  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-border transition-all duration-300 z-40",
      sidebarOpen ? "w-64" : "w-16"
    )}>
      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-4 hidden lg:flex"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-warm-orange text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

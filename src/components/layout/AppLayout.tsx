import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useAppStore } from '@/store/useAppStore';

export function AppLayout() {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main
          className={`flex-1 transition-all duration-300 ml-0 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
          } min-w-0`}
        >
          <div className="p-3 sm:p-4 md:p-6 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

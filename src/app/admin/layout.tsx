'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { customer, isStaff, isLoading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isStaff) {
      router.push('/');
    }
  }, [isLoading, isStaff, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!isStaff) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
        <span className="ml-4 font-bold text-lg">Admin Panel</span>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white border-r z-40 transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SR</span>
            </div>
            <span className="font-bold">Spice Rack Admin</span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-emerald text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <span className="font-medium">
                {customer?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{customer?.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{customer?.role}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

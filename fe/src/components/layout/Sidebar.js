import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Activity, Settings, Users, LogOut, Lightbulb } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/logs', label: 'Sensor Logs', icon: FileText },
    { href: '/statistics', label: 'Statistics', icon: Activity },
  ];

  const adminLinks = [
    { href: '/config', label: 'Configuration', icon: Settings },
    { href: '/users', label: 'User Management', icon: Users },
  ];

  const isActive = (path) => pathname === path;

  // Combine links based on role
  const menuItems = user?.role === 'admin' ? [...links, ...adminLinks] : links;

  return (
    <aside className="glass-sidebar fixed left-0 top-0 z-40 h-screen w-72 flex-col justify-between p-6 transition-transform md:translate-x-0 -translate-x-full">
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
            <Lightbulb className="h-6 w-6" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-800">
            Smart Light
          </span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                )}
              >
                <Icon className={cn("h-5 w-5", isActive(item.href) ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="mb-4 px-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
            <p className="font-semibold text-slate-700 truncate">{user?.username || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role || 'Guest'}</p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

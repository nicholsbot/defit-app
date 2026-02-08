'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Unregister service workers for admin routes (no PWA caching needed here)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('[Admin] Unregistered service worker');
    }
  });
}
import { 
  LayoutDashboard, 
  Zap, 
  ListTodo, 
  Brain, 
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight,
  Command,
  Bell,
  Search,
  Moon,
  Sun,
  GitBranch,
  CheckCircle,
  Clock,
  XCircle,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/swarm', icon: GitBranch, label: 'Swarm' },
  { href: '/admin/queue', icon: ListTodo, label: 'Queue' },
  { href: '/admin/sona', icon: Brain, label: 'SONA' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);

  // Command palette shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn(
      'min-h-screen flex transition-colors duration-300',
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    )}>
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 h-screen flex flex-col border-r transition-all duration-300 z-40',
        darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200',
        collapsed ? 'w-16' : 'w-56'
      )}>
        {/* Logo */}
        <div className={cn(
          'h-16 flex items-center gap-3 border-b px-4',
          darkMode ? 'border-slate-800' : 'border-slate-200'
        )}>
          <div className="relative">
            <Zap className="w-8 h-8 text-orange-500" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">SuperClaw</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Admin</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(({ href, icon: Icon, label, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-orange-500/10 text-orange-500 shadow-lg shadow-orange-500/5'
                    : darkMode
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                  collapsed && 'justify-center px-0'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Status Indicators */}
        {!collapsed && (
          <div className={cn(
            'mx-3 mb-4 p-3 rounded-lg',
            darkMode ? 'bg-slate-800/50' : 'bg-slate-100'
          )}>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">System Status</div>
            <div className="space-y-2">
              <StatusRow icon={Cpu} label="Swarm" status="operational" />
              <StatusRow icon={Brain} label="SONA" status="learning" />
              <StatusRow icon={Activity} label="Pipeline" status="operational" />
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'absolute -right-3 top-20 w-6 h-6 rounded-full border flex items-center justify-center transition-colors',
            darkMode 
              ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-100'
              : 'bg-white border-slate-300 text-slate-400 hover:text-slate-600'
          )}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className={cn(
        'flex-1 transition-all duration-300',
        collapsed ? 'ml-16' : 'ml-56'
      )}>
        {/* Top Bar */}
        <header className={cn(
          'h-16 border-b flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-xl',
          darkMode 
            ? 'bg-slate-950/80 border-slate-800' 
            : 'bg-white/80 border-slate-200'
        )}>
          {/* Search / Command */}
          <button
            onClick={() => setCommandOpen(true)}
            className={cn(
              'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors',
              darkMode
                ? 'bg-slate-800/50 text-slate-400 hover:text-slate-100'
                : 'bg-slate-100 text-slate-500 hover:text-slate-700'
            )}
          >
            <Search className="w-4 h-4" />
            <span>Search or command...</span>
            <kbd className={cn(
              'ml-auto text-xs px-1.5 py-0.5 rounded',
              darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
            )}>⌘K</kbd>
          </button>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className={cn(
              'relative p-2 rounded-lg transition-colors',
              darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            )}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              )}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
              🦊
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Command Palette Overlay */}
      {commandOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
          onClick={() => setCommandOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={cn(
              'w-full max-w-lg rounded-xl border shadow-2xl',
              darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
            )}
          >
            <div className={cn(
              'flex items-center gap-3 px-4 py-3 border-b',
              darkMode ? 'border-slate-800' : 'border-slate-200'
            )}>
              <Command className="w-4 h-4 text-slate-500" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search..."
                className={cn(
                  'flex-1 bg-transparent outline-none text-sm',
                  darkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                )}
              />
            </div>
            <div className="p-2">
              <CommandItem icon={ListTodo} label="Review pending approvals" shortcut="R" />
              <CommandItem icon={GitBranch} label="Spawn new agent" shortcut="N" />
              <CommandItem icon={Brain} label="View SONA insights" shortcut="S" />
              <CommandItem icon={Activity} label="Check swarm health" shortcut="H" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusRow({ icon: Icon, label, status }: { icon: any; label: string; status: 'operational' | 'learning' | 'degraded' }) {
  const colors = {
    operational: 'bg-green-500',
    learning: 'bg-blue-500 animate-pulse',
    degraded: 'bg-yellow-500',
  };
  
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </div>
      <span className={cn('w-2 h-2 rounded-full', colors[status])} />
    </div>
  );
}

function CommandItem({ icon: Icon, label, shortcut }: { icon: any; label: string; shortcut: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-slate-800 transition-colors">
      <Icon className="w-4 h-4 text-slate-500" />
      <span className="flex-1">{label}</span>
      <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">{shortcut}</kbd>
    </button>
  );
}

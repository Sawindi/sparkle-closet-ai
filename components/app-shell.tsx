'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Shirt,
  Sparkles,
  Calendar,
  BarChart3,
  Search,
  Bell,
  Settings,
  ChevronRight,
  Menu,
  X,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export type ViewId = 'closet' | 'stylist' | 'planner' | 'insights';

interface NavItem {
  id: ViewId;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'closet',
    label: 'My Closet',
    icon: Shirt,
    description: 'Your capsule wardrobe',
  },
  {
    id: 'stylist',
    label: 'AI Stylist',
    icon: Sparkles,
    description: 'Daily outfit inspiration',
  },
  {
    id: 'planner',
    label: 'Weekly Planner',
    icon: Calendar,
    description: 'Plan your week of outfits',
  },
  {
    id: 'insights',
    label: 'Closet Insights',
    icon: BarChart3,
    description: 'Your style statistics',
  },
];

interface AppShellProps {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
  children: React.ReactNode;
}

export function AppShell({
  activeView,
  onViewChange,
  children,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = navItems.find((n) => n.id === activeView)!;

  const handleNav = (id: ViewId) => {
    onViewChange(id);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar - desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-pink-100/80 bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg shadow-pink-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold tracking-tight">
                  SparkleCloset
                </p>
                <p className="text-xs text-muted-foreground">AI Fashion Buddy</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-3 py-2">
            <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              My Wardrobe
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeView;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-900 shadow-sm ring-1 ring-pink-200/60'
                      : 'text-muted-foreground hover:bg-pink-50/60 hover:text-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                      isActive
                        ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md shadow-pink-500/30'
                        : 'bg-muted text-muted-foreground group-hover:bg-pink-100 group-hover:text-rose-500'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex flex-1 flex-col items-start text-left">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground/80">
                      {item.description}
                    </span>
                  </span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-rose-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Daily tip card */}
          <div className="px-4 pb-4">
            <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-rose-50/80 to-pink-50/60 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" fill="currentColor" />
                <p className="text-xs font-semibold text-rose-900">
                  Today's sparkle
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                You haven't worn your Silk Blouse in 2 weeks. Pair it with your
                Mom Jeans for an easy elevated-casual look!
              </p>
            </div>
          </div>

          {/* User */}
          <div className="border-t border-pink-100/80 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-pink-100">
                <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-500 text-xs font-medium text-white">
                  Y
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-tight">You</p>
                <p className="text-xs text-muted-foreground">18 items · Free</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-pink-100/80 bg-background/80 px-4 backdrop-blur-xl lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden flex-col sm:flex">
            <h1 className="font-display text-lg font-semibold tracking-tight">
              {active.label}
            </h1>
            <p className="text-xs text-muted-foreground">
              {active.description}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search your closet…"
                className="h-9 w-56 rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-background" />
            </Button>
            <div className="h-8 w-px bg-border" />
            <Avatar className="h-8 w-8 ring-2 ring-pink-100 lg:hidden">
              <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-500 text-xs font-medium text-white">
                Y
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

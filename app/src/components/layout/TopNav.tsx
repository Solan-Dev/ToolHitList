import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

interface TopNavProps {
  appName: string;
  navItems?: NavItem[];
}

export function TopNav({ appName, navItems = [] }: TopNavProps) {
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            {/* SolanIT logo mark – brand colour square with 'S' */}
            <span
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-white text-base font-bold transition-all group-hover:shadow-[0_0_16px_rgba(255,111,0,0.5)]"
              style={{ background: '#ff6f00' }}
            >
              S
            </span>
            <span className="text-sm font-semibold text-adaptive">{appName}</span>
          </Link>

          {/* Desktop nav */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm no-underline transition-all duration-150',
                    location.pathname === item.to
                      ? 'bg-[rgba(255,111,0,0.12)] text-[#ff6f00] font-medium'
                      : 'text-adaptive-muted hover:bg-[var(--glass-bg-subtle)] hover:text-adaptive'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label="Toggle theme"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Mobile menu toggle */}
            {navItems.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && navItems.length > 0 && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm no-underline',
                  location.pathname === item.to
                    ? 'bg-[rgba(255,111,0,0.12)] text-[#ff6f00] font-medium'
                    : 'text-adaptive-muted hover:bg-[var(--glass-bg-subtle)]'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

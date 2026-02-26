import { TopNav, type NavItem } from './TopNav';
import { cn } from '@/lib/utils';

interface AppShellProps {
  appName: string;
  navItems?: NavItem[];
  children: React.ReactNode;
  /** Extra classes on the main content wrapper */
  className?: string;
}

/**
 * Root layout shell for all pages.
 * Provides the fixed gradient background, sticky top nav,
 * and a centered max-width content area.
 *
 * Usage:
 *   <AppShell appName="ToolHitList" navItems={[...]}>
 *     <PageHeader title="Home" />
 *     ...your page content
 *   </AppShell>
 */
export function AppShell({ appName, navItems, children, className }: AppShellProps) {
  return (
    // The gradient bg is set on <body> via CSS, so this div is just a flex column
    <div className="flex min-h-screen flex-col">
      <TopNav appName={appName} navItems={navItems} />

      <main className={cn('flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8', className)}>
        {children}
      </main>

      <footer className="mt-auto py-4 text-center text-xs text-adaptive-faint">
        © {new Date().getFullYear()} SolanIT
      </footer>
    </div>
  );
}

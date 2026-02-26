import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { Button } from '@/components/ui';

export function NotFoundPage() {
  return (
    <AppShell appName="ToolHitList">
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-7xl font-bold text-[#ff6f00] opacity-30 select-none">404</p>
        <h1 className="mt-2 text-xl font-semibold text-adaptive">Page not found</h1>
        <p className="mt-2 text-sm text-adaptive-muted max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-6 no-underline">
          <Button variant="brand">
            <Home className="h-4 w-4" />
            Back to home
          </Button>
        </Link>
      </div>
    </AppShell>
  );
}

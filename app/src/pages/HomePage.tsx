import { Plus, Zap, LayoutGrid, Settings } from 'lucide-react';
import { AppShell, PageHeader } from '@/components/layout';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Input } from '@/components/ui';

const navItems = [
  { label: 'Home', to: '/', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { label: 'Settings', to: '/settings', icon: <Settings className="h-3.5 w-3.5" /> },
];

/**
 * Placeholder home page – demonstrates the design system.
 * Replace with real content once the app purpose is defined.
 */
export function HomePage() {
  return (
    <AppShell appName="ToolHitList" navItems={navItems}>
      <PageHeader
        title="Welcome to ToolHitList"
        description="App framework is ready. Awaiting feature definition."
        actions={
          <Button variant="brand" size="md">
            <Plus className="h-4 w-4" />
            New Item
          </Button>
        }
      />

      {/* Design system preview grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Buttons card */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>All button variants</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="brand" size="sm">Brand</Button>
            <Button variant="glass" size="sm">Glass</Button>
            <Button variant="ghost" size="sm">Ghost</Button>
            <Button variant="danger" size="sm">Danger</Button>
            <Button variant="glass" size="sm" loading>Loading</Button>
          </CardContent>
        </Card>

        {/* Badges card */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status indicators</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="brand">Brand</Badge>
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="danger">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="muted">Muted</Badge>
          </CardContent>
        </Card>

        {/* Input card */}
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Glass form controls</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input placeholder="Search..." leftIcon={<Zap className="h-3.5 w-3.5" />} />
            <Input placeholder="Standard input" />
            <Input placeholder="Disabled" disabled />
          </CardContent>
        </Card>

        {/* Stats placeholder (x3) */}
        {(['Total', 'Active', 'Pending'] as const).map((label, i) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-3xl font-bold text-[#ff6f00]">{(i + 1) * 12}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-adaptive-muted">Placeholder metric</p>
            </CardContent>
            <CardFooter>
              <Badge variant={i === 0 ? 'brand' : i === 1 ? 'success' : 'warning'}>
                {i === 0 ? '↑ 8%' : i === 1 ? '↑ 3%' : '→ Stable'}
              </Badge>
            </CardFooter>
          </Card>
        ))}

      </div>

      {/* Framework ready notice */}
      <div className="mt-8 glass-subtle rounded-[var(--radius-xl)] border border-[rgba(255,111,0,0.2)] p-6 text-center">
        <Zap className="mx-auto h-8 w-8 text-[#ff6f00] mb-2" />
        <p className="text-sm font-medium text-adaptive">Framework ready</p>
        <p className="text-xs text-adaptive-muted mt-1">
          Design system, theming, routing and Dataverse integration pattern are all in place.
          Add your feature definition to start building.
        </p>
      </div>
    </AppShell>
  );
}

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1',
    'rounded-full px-2.5 py-0.5 text-xs font-medium',
    'transition-colors duration-150',
    'border',
  ],
  {
    variants: {
      variant: {
        brand:   'bg-[rgba(255,111,0,0.15)] text-[#ff6f00] border-[rgba(255,111,0,0.3)]',
        success: 'bg-green-500/10 text-green-600 border-green-500/25 dark:text-green-400',
        warning: 'bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-400',
        danger:  'bg-red-500/10 text-red-600 border-red-500/25 dark:text-red-400',
        info:    'bg-blue-500/10 text-blue-600 border-blue-500/25 dark:text-blue-400',
        glass:   'glass text-adaptive border-[var(--glass-border-muted)]',
        muted:   'bg-[var(--glass-bg-subtle)] text-adaptive-muted border-[var(--glass-border-muted)]',
      },
    },
    defaultVariants: {
      variant: 'glass',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

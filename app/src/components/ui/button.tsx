import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-[var(--radius-md)] text-sm font-medium',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6f00] focus-visible:ring-offset-1',
    'disabled:pointer-events-none disabled:opacity-40',
    'select-none',
  ],
  {
    variants: {
      variant: {
        /** Primary action – solid brand colour with glow */
        brand: [
          'bg-[#ff6f00] text-white',
          'hover:bg-[#c43e00]',
          'shadow-[0_0_16px_rgba(255,111,0,0.35)]',
          'hover:shadow-[0_0_24px_rgba(255,111,0,0.55)]',
          'active:scale-[0.97]',
        ],
        /** Secondary – glass panel */
        glass: [
          'glass border-[var(--glass-border)] text-adaptive',
          'hover:bg-[rgba(255,111,0,0.08)]',
          'hover:border-[rgba(255,111,0,0.3)]',
          'active:scale-[0.97]',
        ],
        /** Ghost – no background */
        ghost: [
          'text-adaptive-muted',
          'hover:bg-[var(--glass-bg-subtle)]',
          'hover:text-[#ff6f00]',
        ],
        /** Danger */
        danger: [
          'bg-red-500/90 text-white',
          'hover:bg-red-600',
          'shadow-[0_0_12px_rgba(239,68,68,0.25)]',
        ],
      },
      size: {
        sm:   'h-8 px-3 text-xs rounded-[var(--radius-sm)]',
        md:   'h-10 px-4',
        lg:   'h-11 px-6 text-base',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0 rounded-[var(--radius-sm)]',
      },
    },
    defaultVariants: {
      variant: 'glass',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show a loading spinner and disable interaction */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

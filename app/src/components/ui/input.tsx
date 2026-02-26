import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional icon shown on the left side */
  leftIcon?: React.ReactNode;
  /** Optional element on the right (e.g. clear button) */
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightElement, ...props }, ref) => {
    if (leftIcon || rightElement) {
      return (
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 flex items-center text-adaptive-faint pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              // Base glass input
              'glass w-full rounded-[var(--radius-md)]',
              'px-3 py-2 text-sm text-adaptive',
              'placeholder:text-adaptive-faint',
              'transition-all duration-200',
              'focus:outline-none focus:border-[#ff6f00] focus:shadow-[0_0_0_3px_rgba(255,111,0,0.15)]',
              'disabled:cursor-not-allowed disabled:opacity-40',
              leftIcon && 'pl-9',
              rightElement && 'pr-9',
              className
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 flex items-center">
              {rightElement}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'glass w-full rounded-[var(--radius-md)]',
          'px-3 py-2 text-sm text-adaptive',
          'placeholder:text-adaptive-faint',
          'transition-all duration-200',
          'focus:outline-none focus:border-[#ff6f00] focus:shadow-[0_0_0_3px_rgba(255,111,0,0.15)]',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };

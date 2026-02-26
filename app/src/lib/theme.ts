/**
 * SolanIT Design Tokens – TypeScript constants
 * These mirror the CSS variables in styles/theme.css.
 * Use these when you need the value in JS (e.g. chart colours, canvas, conditional logic).
 * For className usage, always prefer CSS vars or Tailwind utilities.
 */
export const brand = {
  primary:   '#ff6f00',
  light:     '#ffa040',
  dark:      '#c43e00',
  xdark:     '#8a2c00',
  glow:      'rgba(255, 111, 0, 0.35)',
  glowSm:    'rgba(255, 111, 0, 0.20)',
} as const;

export const semantic = {
  success: '#22c55e',
  warning: '#f59e0b',
  danger:  '#ef4444',
  info:    '#3b82f6',
} as const;

export const radius = {
  sm:  '6px',
  md:  '10px',
  lg:  '16px',
  xl:  '24px',
  xxl: '32px',
} as const;

/** Returns the CSS variable reference string for use in inline styles */
export const cssVar = (name: string) => `var(--${name})`;

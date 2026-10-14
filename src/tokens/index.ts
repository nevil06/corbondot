/**
 * Carbonly Design Token Exports
 */

export const BRAND_COLORS = {
  deepGreen: '#16342B',
  forestGreen: '#2D6A4F',
  accentGreen: '#40916C',
  darkBlue: '#1B3A57',
  white: '#FFFFFF',
  lightNeutral: '#EEF2ED',
  lightBlueGrey: '#E9EEF3',
} as const;

export type BrandColor = keyof typeof BRAND_COLORS;

/**
 * Formatters adhering to Carbonly enterprise standards (Indian locale en-IN).
 * Strict formatting for currency (₹), numbers, percentages, and credit metrics.
 */

const inNumberFormatter = new Intl.NumberFormat('en-IN');

export const formatNumber = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0';
  return inNumberFormatter.format(num);
};

export const formatINR = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '₹0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '₹0';
  return `₹${inNumberFormatter.format(num)}`;
};

export const formatPricePerCredit = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '₹0.00 / credit';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '₹0.00 / credit';
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
  return `₹${formatted} / credit`;
};

export const formatCredits = (val: number | string | undefined | null): string => {
  return `${formatNumber(val)} credits`;
};

export const formatPercent = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null) return '0%';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0%';
  return `${Math.round(num)}%`;
};

export const formatCompactNumber = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0';
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};


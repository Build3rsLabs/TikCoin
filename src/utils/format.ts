/**
 * Formats a number amount with commas and fixed decimal places
 */
export const formatAmount = (amount: number, decimals = 2): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Truncates a string in the middle, useful for displaying blockchain addresses
 */
export const truncateMiddle = (str: string, startChars = 6, endChars = 4): string => {
  if (!str) return '';
  if (str.length <= startChars + endChars) return str;
  
  return `${str.slice(0, startChars)}...${str.slice(-endChars)}`;
};


export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('kk-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('kk-KZ', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('kk-KZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}; 
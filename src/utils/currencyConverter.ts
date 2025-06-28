
// Current exchange rate (USD to INR) - in a real app, this would come from an API
const USD_TO_INR_RATE = 83.5;

export const convertUsdToInr = (usdAmount: number): number => {
  return Math.round(usdAmount * USD_TO_INR_RATE);
};

export const formatInrCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

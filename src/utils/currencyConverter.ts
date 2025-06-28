
// Current exchange rate (USD to INR) - in a real app, this would come from an API
const USD_TO_INR_RATE = 83.5;

export const convertUsdToInr = (usdAmount: number): number => {
  const convertedAmount = Math.round(usdAmount * USD_TO_INR_RATE);
  console.log(`Converting USD ${usdAmount} to INR ${convertedAmount} at rate ${USD_TO_INR_RATE}`);
  return convertedAmount;
};

export const formatInrCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

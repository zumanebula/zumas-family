const diamondPassbook = (() => {
  const monthlyDeposit = 160;
  const annualRate = 0.04;
  const years = 10;
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  const principal = monthlyDeposit * months;
  const balance = monthlyDeposit * ((1 + monthlyRate) ** months - 1) / monthlyRate;
  const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  return {
    monthlyDeposit,
    annualRate,
    years,
    principal: currency.format(principal),
    interest: currency.format(balance - principal),
    balance: currency.format(balance),
    budget: currency.format(balance * 2),
  };
})();

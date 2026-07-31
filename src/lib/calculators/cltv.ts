/**
 * Combined LTV & Blended Rate calculator.
 *
 * CLTV = total of all lien balances / home value
 * Blended rate = weighted average of each lien's rate, weighted by its balance share.
 *
 * blendedRate = Σ(balance_i × rate_i) / Σ(balance_i)
 */

export interface LienInput {
  label: string;
  balance: number;
  rate: number;    // annual, percent
  payment: number; // monthly
}

export interface LienBreakdown {
  label: string;
  balance: number;
  rate: number;
  payment: number;
  weightPct: number;        // share of total balance as a percent, e.g. 72.4
  rateContribution: number; // weighted contribution to blended rate (rate × weight)
}

export interface CltvInputs {
  homeValue: number;
  firstMortgage: LienInput;
  secondLien?: LienInput;
  otherLiens?: LienInput[];
}

export interface CltvOutputs {
  totalBalance: number;
  cltvPercent: number;      // e.g. 85.00
  blendedRate: number;      // annual percent, e.g. 6.823
  totalMonthlyPayments: number;
  availableEquity: number;  // homeValue − totalBalance
  equityPercent: number;    // equity / homeValue × 100
  breakdown: LienBreakdown[];
}

export function calculateCltv(inputs: CltvInputs): CltvOutputs {
  const allLiens: LienInput[] = [
    inputs.firstMortgage,
    ...(inputs.secondLien ? [inputs.secondLien] : []),
    ...(inputs.otherLiens ?? []),
  ].filter((l) => l.balance > 0);

  const totalBalance = allLiens.reduce((sum, l) => sum + l.balance, 0);

  const totalMonthlyPayments =
    Math.round(allLiens.reduce((sum, l) => sum + l.payment, 0) * 100) / 100;

  const cltvPercent =
    inputs.homeValue > 0
      ? Math.round((totalBalance / inputs.homeValue) * 10000) / 100
      : 0;

  // Weighted-average blended rate
  const blendedRate =
    totalBalance > 0
      ? Math.round(
          (allLiens.reduce((sum, l) => sum + l.rate * l.balance, 0) / totalBalance) * 1000
        ) / 1000
      : 0;

  const availableEquity = Math.round((inputs.homeValue - totalBalance) * 100) / 100;
  const equityPercent =
    inputs.homeValue > 0
      ? Math.round(((inputs.homeValue - totalBalance) / inputs.homeValue) * 10000) / 100
      : 0;

  const breakdown: LienBreakdown[] = allLiens.map((l) => {
    const weightPct =
      totalBalance > 0 ? Math.round((l.balance / totalBalance) * 10000) / 100 : 0;
    const rateContribution =
      totalBalance > 0 ? Math.round(l.rate * (l.balance / totalBalance) * 1000) / 1000 : 0;
    return { ...l, weightPct, rateContribution };
  });

  return {
    totalBalance: Math.round(totalBalance * 100) / 100,
    cltvPercent,
    blendedRate,
    totalMonthlyPayments,
    availableEquity,
    equityPercent,
    breakdown,
  };
}

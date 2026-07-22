/**
 * Debt Consolidation & Blended Rate Refi calculator.
 *
 * Models a cash-out refinance that rolls existing debts into a new mortgage.
 *
 * Key concepts:
 *   blendedRate  = Σ(balance_i × rate_i) / Σ(balance_i)
 *   newLoanAmt   = currentMortgageBalance + Σ(debtBalance_i)
 *   monthlySavings = currentTotalPayments − newMonthlyPi
 *   breakEven    = closingCosts / monthlySavings
 *
 * WARNING: consolidating short-term high-rate debt into a 30-year mortgage
 * lowers monthly payments but often increases total lifetime interest paid.
 * The calculator surfaces both the monthly savings AND the total interest
 * comparison so borrowers can see the full picture.
 */

import { calculateMonthlyPi } from "./amortization";

export interface DebtItem {
  label: string;
  balance: number;
  /** Annual interest rate as a percent, e.g. 21.5 */
  annualRate: number;
  /** Current minimum or scheduled monthly payment */
  monthlyPayment: number;
  /** Remaining months to payoff at current payment (0 = revolving/unknown) */
  remainingMonths: number;
}

export interface DebtConsolidationInputs {
  /** Current remaining mortgage balance */
  currentMortgageBalance: number;
  /** Current mortgage annual rate */
  currentMortgageRate: number;
  /** Remaining months on current mortgage */
  currentMortgageRemainingMonths: number;
  /** Current monthly P&I payment */
  currentMortgagePayment: number;
  /** Home value for LTV calculation */
  homeValue: number;
  /** Debts to consolidate */
  debts: DebtItem[];
  /** Rate on the new consolidated loan */
  newLoanRate: number;
  /** Term of the new consolidated loan in years */
  newLoanTermYears: number;
  /** Closing costs as a percent of new loan amount */
  closingCostPercent: number;
  /** How long the borrower plans to stay — all savings calcs use this window */
  holdingPeriodYears: number;
}

export interface DebtBreakdown {
  label: string;
  balance: number;
  annualRate: number;
  monthlyPayment: number;
  remainingMonths: number;
  /** Estimated total interest remaining at current schedule */
  totalInterestRemaining: number;
  /** balance / totalBalance — for blended rate weight display */
  weightPercent: number;
}

export interface DebtConsolidationOutputs {
  /* ── Current picture ── */
  currentMortgageMonthlyPayment: number;
  totalCurrentMonthlyPayments: number;
  totalCurrentBalance: number;
  /** Weighted average rate across mortgage + all debts */
  blendedRate: number;
  /** Total interest remaining on all debts at current payment schedules */
  totalCurrentInterestRemaining: number;

  /* ── New consolidated loan ── */
  newLoanAmount: number;
  newMonthlyPayment: number;
  closingCosts: number;
  newLtv: number;
  /** newLoanAmount / homeValue × 100 */
  ltvPercent: number;
  ltvWarning: boolean;

  /* ── Comparison (holding-period basis) ── */
  holdingPeriodMonths: number;
  monthlySavings: number;
  /** Interest paid on all current debts during holding period */
  currentInterestInHoldingPeriod: number;
  /** Interest paid on new loan during holding period */
  newLoanInterestInHoldingPeriod: number;
  /** currentInterestInHoldingPeriod − newLoanInterestInHoldingPeriod − closingCosts */
  totalInterestSaved: number;
  /** closingCosts / monthlySavings — Infinity if no monthly savings */
  breakEvenMonths: number;
  /** breakEvenMonths <= holdingPeriodMonths */
  reachesBreakEven: boolean;
  consolidationMakesFinancialSense: boolean;

  /* ── Per-debt breakdown ── */
  breakdown: DebtBreakdown[];
}

/** Interest paid on a debt over at most maxMonths (or full remaining term if shorter) */
function interestOverPeriod(
  balance: number,
  annualRate: number,
  monthlyPayment: number,
  remainingMonths: number,
  maxMonths: number
): number {
  if (balance <= 0 || maxMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  // Determine natural term
  let naturalMonths: number;
  if (remainingMonths > 0) {
    naturalMonths = remainingMonths;
  } else if (r > 0 && monthlyPayment > balance * r) {
    naturalMonths = Math.ceil(-Math.log(1 - (balance * r) / monthlyPayment) / Math.log(1 + r));
  } else {
    naturalMonths = 36; // revolving fallback
  }
  const simMonths = Math.min(naturalMonths, maxMonths);
  let bal = balance;
  let totalInterest = 0;
  for (let m = 0; m < simMonths && bal > 0; m++) {
    const interest = bal * r;
    totalInterest += interest;
    const payment =
      remainingMonths === 0 && !(r > 0 && monthlyPayment > balance * r)
        ? Math.max(monthlyPayment, bal / naturalMonths + interest)
        : monthlyPayment;
    const principal = Math.min(payment - interest, bal);
    bal = Math.max(0, bal - principal);
  }
  return Math.round(totalInterest * 100) / 100;
}

/** Estimate total remaining interest for a fixed-payment debt */
function estimateRemainingInterest(
  balance: number,
  annualRate: number,
  monthlyPayment: number,
  remainingMonths: number
): number {
  if (balance <= 0) return 0;
  const r = annualRate / 100 / 12;

  // If we have a known remaining term, use that
  if (remainingMonths > 0) {
    // Simulate
    let bal = balance;
    let totalInterest = 0;
    for (let m = 0; m < remainingMonths && bal > 0; m++) {
      const interest = bal * r;
      totalInterest += interest;
      const principal = Math.min(monthlyPayment - interest, bal);
      bal = Math.max(0, bal - principal);
    }
    return Math.round(totalInterest * 100) / 100;
  }

  // Derive remaining months from payment and balance
  if (r > 0 && monthlyPayment > balance * r) {
    const n = -Math.log(1 - (balance * r) / monthlyPayment) / Math.log(1 + r);
    const months = Math.ceil(n);
    let bal = balance;
    let totalInterest = 0;
    for (let m = 0; m < months && bal > 0; m++) {
      const interest = bal * r;
      totalInterest += interest;
      const principal = Math.min(monthlyPayment - interest, bal);
      bal = Math.max(0, bal - principal);
    }
    return Math.round(totalInterest * 100) / 100;
  }

  // Revolving / unknown — estimate 3-year payoff
  const fallbackMonths = 36;
  let bal = balance;
  let totalInterest = 0;
  for (let m = 0; m < fallbackMonths && bal > 0; m++) {
    const interest = bal * r;
    totalInterest += interest;
    const payment = Math.max(monthlyPayment, bal / fallbackMonths + interest);
    bal = Math.max(0, bal - (payment - interest));
  }
  return Math.round(totalInterest * 100) / 100;
}

export function calculateDebtConsolidation(
  inputs: DebtConsolidationInputs
): DebtConsolidationOutputs {
  const {
    currentMortgageBalance,
    currentMortgageRate,
    currentMortgageRemainingMonths,
    currentMortgagePayment,
    homeValue,
    debts,
    newLoanRate,
    newLoanTermYears,
    closingCostPercent,
    holdingPeriodYears,
  } = inputs;

  const holdingPeriodMonths = holdingPeriodYears * 12;

  /* ── Current totals ── */
  const totalDebtBalance = debts.reduce((s, d) => s + d.balance, 0);
  const totalCurrentBalance = Math.round((currentMortgageBalance + totalDebtBalance) * 100) / 100;
  const totalDebtMonthlyPayments = debts.reduce((s, d) => s + d.monthlyPayment, 0);
  const totalCurrentMonthlyPayments = Math.round(
    (currentMortgagePayment + totalDebtMonthlyPayments) * 100
  ) / 100;

  /* ── Blended rate = balance-weighted average ── */
  const weightedRateSum =
    currentMortgageBalance * currentMortgageRate +
    debts.reduce((s, d) => s + d.balance * d.annualRate, 0);
  const blendedRate =
    totalCurrentBalance > 0
      ? Math.round((weightedRateSum / totalCurrentBalance) * 100) / 100
      : 0;

  /* ── Current total interest remaining ── */
  const mortgageInterestRemaining = estimateRemainingInterest(
    currentMortgageBalance,
    currentMortgageRate,
    currentMortgagePayment,
    currentMortgageRemainingMonths
  );
  const debtsInterestRemaining = debts.reduce(
    (s, d) =>
      s + estimateRemainingInterest(d.balance, d.annualRate, d.monthlyPayment, d.remainingMonths),
    0
  );
  const totalCurrentInterestRemaining = Math.round(
    (mortgageInterestRemaining + debtsInterestRemaining) * 100
  ) / 100;

  /* ── New consolidated loan ── */
  const newLoanAmount = Math.round(totalCurrentBalance * 100) / 100;
  const newMonthlyPayment = Math.round(
    calculateMonthlyPi(newLoanAmount, newLoanRate, newLoanTermYears) * 100
  ) / 100;
  const closingCosts = Math.round(newLoanAmount * (closingCostPercent / 100) * 100) / 100;

  const newLtv = homeValue > 0 ? newLoanAmount / homeValue : 0;
  const ltvPercent = Math.round(newLtv * 10000) / 100;
  const ltvWarning = ltvPercent > 80;

  /* ── Comparison (holding-period basis) ── */
  const monthlySavings = Math.round(
    (totalCurrentMonthlyPayments - newMonthlyPayment) * 100
  ) / 100;

  // Interest on current debts over the holding period
  const currentInterestInHoldingPeriod = Math.round((
    interestOverPeriod(currentMortgageBalance, currentMortgageRate, currentMortgagePayment, currentMortgageRemainingMonths, holdingPeriodMonths) +
    debts.reduce((s, d) => s + interestOverPeriod(d.balance, d.annualRate, d.monthlyPayment, d.remainingMonths, holdingPeriodMonths), 0)
  ) * 100) / 100;

  // Interest on new loan over the holding period
  const newLoanInterestInHoldingPeriod = interestOverPeriod(
    newLoanAmount, newLoanRate, newMonthlyPayment, newLoanTermYears * 12, holdingPeriodMonths
  );

  // Net: current interest − new loan interest − closing costs
  const totalInterestSaved = Math.round(
    (currentInterestInHoldingPeriod - newLoanInterestInHoldingPeriod - closingCosts) * 100
  ) / 100;

  const breakEvenMonths =
    monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;

  const reachesBreakEven = isFinite(breakEvenMonths) && breakEvenMonths <= holdingPeriodMonths;

  // Makes sense if monthly savings exist AND interest is lower over holding period
  const consolidationMakesFinancialSense = monthlySavings > 0 && totalInterestSaved > 0;

  /* ── Per-debt breakdown ── */
  const breakdown: DebtBreakdown[] = [
    {
      label: "Current Mortgage",
      balance: currentMortgageBalance,
      annualRate: currentMortgageRate,
      monthlyPayment: currentMortgagePayment,
      remainingMonths: currentMortgageRemainingMonths,
      totalInterestRemaining: mortgageInterestRemaining,
      weightPercent:
        totalCurrentBalance > 0
          ? Math.round((currentMortgageBalance / totalCurrentBalance) * 10000) / 100
          : 0,
    },
    ...debts.map((d) => ({
      label: d.label,
      balance: d.balance,
      annualRate: d.annualRate,
      monthlyPayment: d.monthlyPayment,
      remainingMonths: d.remainingMonths,
      totalInterestRemaining: estimateRemainingInterest(
        d.balance,
        d.annualRate,
        d.monthlyPayment,
        d.remainingMonths
      ),
      weightPercent:
        totalCurrentBalance > 0
          ? Math.round((d.balance / totalCurrentBalance) * 10000) / 100
          : 0,
    })),
  ];

  return {
    currentMortgageMonthlyPayment: currentMortgagePayment,
    totalCurrentMonthlyPayments,
    totalCurrentBalance,
    blendedRate,
    totalCurrentInterestRemaining,
    newLoanAmount,
    newMonthlyPayment,
    closingCosts,
    newLtv,
    ltvPercent,
    ltvWarning,
    holdingPeriodMonths,
    monthlySavings,
    currentInterestInHoldingPeriod,
    newLoanInterestInHoldingPeriod,
    totalInterestSaved,
    breakEvenMonths,
    reachesBreakEven,
    consolidationMakesFinancialSense,
    breakdown,
  };
}

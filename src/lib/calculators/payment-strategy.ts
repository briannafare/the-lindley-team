/**
 * Payment Strategy Optimizer.
 *
 * Runs a month-by-month amortization simulation for each strategy and
 * compares total interest paid, payoff timeline, and total cost.
 *
 * Strategies modeled:
 *   1. Baseline       — standard scheduled payments only
 *   2. Extra Monthly  — add a fixed dollar amount to every payment
 *   3. Bi-Weekly      — 26 half-payments/year ≡ 13 full payments/year
 *                       modeled as adding 1/12 of a monthly payment each month
 *   4. One Extra/Year — one additional full monthly payment applied to
 *                       principal each year (month 12, 24, 36 …)
 *   5. Lump Sum       — a one-time principal payment made at month 1
 *
 * All strategies share the same base monthly P&I; extra amounts reduce
 * principal, shortening the loan term.
 */

export interface PaymentStrategyInputs {
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  /** Added to every monthly payment */
  extraMonthlyPayment: number;
  /** One additional full monthly payment applied to principal every 12 months */
  oneExtraPerYear: boolean;
  /** One-time lump-sum principal payment at month 1 */
  lumpSumPayment: number;
}

export interface StrategyResult {
  label: string;
  description: string;
  payoffMonths: number;
  payoffYears: number;
  totalInterest: number;
  totalPaid: number;
  interestSaved: number;
  monthsSaved: number;
  /** Monthly out-of-pocket (base P&I + extra, if any) */
  effectiveMonthlyPayment: number;
  /** Year-by-year remaining balance for chart (index 0 = start of year 1) */
  yearlyBalances: number[];
}

export interface PaymentStrategyOutputs {
  baseMonthlyPi: number;
  baseline: StrategyResult;
  extraMonthly: StrategyResult;
  biWeekly: StrategyResult;
  oneExtraPerYear: StrategyResult;
  lumpSum: StrategyResult;
}

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

function simulate(
  loanAmount: number,
  annualRatePercent: number,
  termYears: number,
  baseMonthlyPayment: number,
  extraEachMonth: number,
  extraEvery12Months: number,
  upfrontExtra: number,
  label: string,
  description: string,
  baselineInterest: number
): StrategyResult {
  const monthlyRate = annualRatePercent / 100 / 12;
  const maxMonths = termYears * 12;

  let balance = r2(loanAmount - upfrontExtra);
  if (balance < 0) balance = 0;

  let totalInterest = 0;
  let month = 0;
  const yearlyBalances: number[] = [balance];

  while (balance > 0 && month < maxMonths) {
    month++;

    const interest = r2(balance * monthlyRate);
    totalInterest = r2(totalInterest + interest);

    // Base principal portion
    let principalPayment = r2(Math.min(baseMonthlyPayment - interest, balance));

    // Extra monthly
    const extra = Math.min(extraEachMonth, balance - principalPayment);
    principalPayment = r2(principalPayment + Math.max(0, extra));

    // Extra once per year (at months 12, 24, 36 …)
    if (extraEvery12Months > 0 && month % 12 === 0) {
      const yearExtra = Math.min(extraEvery12Months, balance - principalPayment);
      principalPayment = r2(principalPayment + Math.max(0, yearExtra));
    }

    balance = r2(Math.max(0, balance - principalPayment));

    if (month % 12 === 0) {
      yearlyBalances.push(balance);
    }
  }

  // Ensure we have entries for every year up to term for chart alignment
  while (yearlyBalances.length <= termYears) {
    yearlyBalances.push(0);
  }

  const totalPaid = r2(loanAmount + totalInterest);
  const interestSaved = r2(baselineInterest - totalInterest);
  const monthsSaved = maxMonths - month;

  const effectiveMonthlyPayment = r2(baseMonthlyPayment + extraEachMonth);

  return {
    label,
    description,
    payoffMonths: month,
    payoffYears: parseFloat((month / 12).toFixed(1)),
    totalInterest,
    totalPaid,
    interestSaved,
    monthsSaved,
    effectiveMonthlyPayment,
    yearlyBalances,
  };
}

function computeBaseMonthlyPi(
  loanAmount: number,
  annualRatePercent: number,
  termYears: number
): number {
  if (loanAmount <= 0 || termYears <= 0) return 0;
  if (annualRatePercent <= 0) return r2(loanAmount / (termYears * 12));
  const r = annualRatePercent / 100 / 12;
  const n = termYears * 12;
  const factor = Math.pow(1 + r, n);
  return r2((loanAmount * r * factor) / (factor - 1));
}

export function calculatePaymentStrategy(
  inputs: PaymentStrategyInputs
): PaymentStrategyOutputs {
  const {
    loanAmount,
    interestRate,
    loanTermYears,
    extraMonthlyPayment,
    oneExtraPerYear,
    lumpSumPayment,
  } = inputs;

  const baseMonthlyPi = computeBaseMonthlyPi(loanAmount, interestRate, loanTermYears);

  // ── 1. Baseline ──
  const baseline = simulate(
    loanAmount, interestRate, loanTermYears,
    baseMonthlyPi, 0, 0, 0,
    "Standard",
    "Pay the scheduled monthly payment only",
    0
  );
  baseline.interestSaved = 0;
  baseline.monthsSaved = 0;

  const baselineInterest = baseline.totalInterest;

  // ── 2. Extra Monthly ──
  const extraMonthly = simulate(
    loanAmount, interestRate, loanTermYears,
    baseMonthlyPi, extraMonthlyPayment, 0, 0,
    `+${extraMonthlyPayment.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}/mo`,
    `Add $${extraMonthlyPayment.toLocaleString()} to every payment`,
    baselineInterest
  );

  // ── 3. Bi-Weekly ──
  // 26 half-payments/year = 13 full payments/year.
  // The extra 1/12 of a monthly payment applied each month models this exactly.
  const biWeeklyExtra = r2(baseMonthlyPi / 12);
  const biWeekly = simulate(
    loanAmount, interestRate, loanTermYears,
    baseMonthlyPi, biWeeklyExtra, 0, 0,
    "Bi-Weekly",
    "Pay half your monthly payment every 2 weeks (≈ 1 extra payment/year)",
    baselineInterest
  );

  // ── 4. One Extra Payment Per Year ──
  // Honour the flag: with it off, this strategy adds nothing and matches baseline.
  const annualExtra = oneExtraPerYear ? baseMonthlyPi : 0;
  const oneExtra = simulate(
    loanAmount, interestRate, loanTermYears,
    baseMonthlyPi, 0, annualExtra, 0,
    "1 Extra/Year",
    "Make one additional full payment toward principal each year",
    baselineInterest
  );

  // ── 5. Lump Sum ──
  const lumpSum = simulate(
    loanAmount, interestRate, loanTermYears,
    baseMonthlyPi, 0, 0, lumpSumPayment,
    `${lumpSumPayment.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} Lump Sum`,
    `Apply a one-time $${lumpSumPayment.toLocaleString()} principal payment today`,
    baselineInterest
  );

  return {
    baseMonthlyPi,
    baseline,
    extraMonthly,
    biWeekly,
    oneExtraPerYear: oneExtra,
    lumpSum,
  };
}

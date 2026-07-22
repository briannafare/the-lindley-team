import { AmortizationRow } from "./types";

/**
 * Standard amortizing loan monthly P&I payment.
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMonthlyPi(
  loanAmount: number,
  annualRatePercent: number,
  termYears: number
): number {
  if (loanAmount <= 0 || termYears <= 0) return 0;
  if (annualRatePercent <= 0) return loanAmount / (termYears * 12);

  const monthlyRate = annualRatePercent / 100 / 12;
  const numPayments = termYears * 12;
  const factor = Math.pow(1 + monthlyRate, numPayments);

  return loanAmount * (monthlyRate * factor) / (factor - 1);
}

/**
 * Build a full amortization schedule.
 */
export function buildAmortizationSchedule(
  loanAmount: number,
  annualRatePercent: number,
  termYears: number
): AmortizationRow[] {
  const monthlyPayment = calculateMonthlyPi(loanAmount, annualRatePercent, termYears);
  if (monthlyPayment <= 0) return [];

  const monthlyRate = annualRatePercent / 100 / 12;
  const numPayments = termYears * 12;
  const schedule: AmortizationRow[] = [];
  let balance = loanAmount;

  for (let month = 1; month <= numPayments; month++) {
    const interest = balance * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, balance);
    balance = Math.max(balance - principal, 0);

    schedule.push({
      month,
      interest: Math.round(interest * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return schedule;
}

/**
 * Total interest paid over the life of the loan.
 */
export function calculateTotalInterest(
  loanAmount: number,
  annualRatePercent: number,
  termYears: number
): number {
  const schedule = buildAmortizationSchedule(loanAmount, annualRatePercent, termYears);
  return schedule.reduce((sum, row) => sum + row.interest, 0);
}

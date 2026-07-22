/**
 * Total Cash to Close estimator.
 *
 * totalCashToClose = downPayment + closingCosts + prepaids − credits
 *
 * Closing costs are either:
 *   - Derived from estimatedClosingCostPercent × loanAmount (when no itemized fees provided)
 *   - The sum of itemizedFees (when provided)
 *
 * Does not model financed fees (VA funding fee, FHA MIP rolled in) — those reduce
 * loan proceeds but are not part of cash-to-close.
 */

export type LoanProgram = "conventional" | "va" | "fha" | "usda";

export interface FeeItem {
  label: string;
  amount: number;
}

export interface CashToCloseInputs {
  homePrice: number;
  downPaymentPercent: number;
  loanProgram: LoanProgram;
  /** Applied to loan amount when itemizedFees is empty. */
  estimatedClosingCostPercent: number;
  itemizedFees: FeeItem[];
  credits: FeeItem[];
  prepaidItems: FeeItem[];
}

export interface CashToCloseOutputs {
  downPaymentAmount: number;
  loanAmount: number;
  /** LTV as a percent, e.g. 80.00 */
  effectiveLtv: number;
  closingCostsTotal: number;
  /** true when using estimatedClosingCostPercent (no itemized fees) */
  closingCostsAreEstimated: boolean;
  prepaidsTotal: number;
  creditsTotal: number;
  totalCashToClose: number;
  /** Minimum down payment percent for the selected program */
  minDownPaymentPercent: number;
  isBelowMinDown: boolean;
}

export function calculateCashToClose(inputs: CashToCloseInputs): CashToCloseOutputs {
  const downPaymentAmount =
    Math.round(inputs.homePrice * (inputs.downPaymentPercent / 100) * 100) / 100;

  const loanAmount = Math.max(0, Math.round((inputs.homePrice - downPaymentAmount) * 100) / 100);

  const effectiveLtv =
    inputs.homePrice > 0
      ? Math.round((loanAmount / inputs.homePrice) * 10000) / 100
      : 0;

  const closingCostsAreEstimated = inputs.itemizedFees.length === 0;

  const closingCostsTotal = closingCostsAreEstimated
    ? Math.round(loanAmount * (inputs.estimatedClosingCostPercent / 100) * 100) / 100
    : Math.round(inputs.itemizedFees.reduce((s, f) => s + f.amount, 0) * 100) / 100;

  const prepaidsTotal =
    Math.round(inputs.prepaidItems.reduce((s, f) => s + f.amount, 0) * 100) / 100;

  const creditsTotal =
    Math.round(inputs.credits.reduce((s, f) => s + f.amount, 0) * 100) / 100;

  const totalCashToClose =
    Math.round((downPaymentAmount + closingCostsTotal + prepaidsTotal - creditsTotal) * 100) / 100;

  const minDownPaymentPercent =
    inputs.loanProgram === "va" || inputs.loanProgram === "usda"
      ? 0
      : inputs.loanProgram === "fha"
      ? 3.5
      : 3;

  const isBelowMinDown = inputs.downPaymentPercent < minDownPaymentPercent;

  return {
    downPaymentAmount,
    loanAmount,
    effectiveLtv,
    closingCostsTotal,
    closingCostsAreEstimated,
    prepaidsTotal,
    creditsTotal,
    totalCashToClose,
    minDownPaymentPercent,
    isBelowMinDown,
  };
}

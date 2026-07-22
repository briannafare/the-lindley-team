/**
 * Move-Up Buyer Planner.
 *
 * Models the financial transition from selling a current home and purchasing a
 * larger one.
 *
 * Net proceeds = currentHomeValue − currentMortgageBalance − sellingCosts
 *
 * Down payment sources:
 *   "equity" → use net proceeds only
 *   "cash"   → use additionalCash only (proceeds stay invested / held)
 *   "both"   → net proceeds + additionalCash
 *
 * cashAvailableForDownPayment is capped at newHomePrice (can't exceed purchase price).
 */

import { calculateMonthlyPi } from "./amortization";

export type DownPaymentSource = "equity" | "cash" | "both";

export interface MoveUpInputs {
  /* ── Current home ── */
  currentHomeValue: number;
  currentMortgageBalance: number;
  /** Current monthly P&I payment (used for before/after comparison) */
  currentMonthlyPayment: number;
  sellingCostPercent: number;

  /* ── New home ── */
  newHomePrice: number;
  downPaymentSource: DownPaymentSource;
  /** Additional cash brought to closing (used when source is "cash" or "both") */
  additionalCash: number;
  newRate: number;
  newTermYears: number;
  annualPropertyTax: number;
  annualInsurance: number;
  monthlyHoa: number;
}

export interface MoveUpOutputs {
  /* ── Current home sale ── */
  currentEquity: number;
  sellingCosts: number;
  /** currentHomeValue − currentMortgageBalance − sellingCosts */
  netProceedsFromSale: number;
  isUnderwater: boolean;

  /* ── New home ── */
  cashAvailableForDownPayment: number;
  downPayment: number;
  downPaymentPct: number;
  newLoanAmount: number;
  newLtv: number;

  /* ── New payments ── */
  newMonthlyPi: number;
  newMonthlyPropertyTax: number;
  newMonthlyInsurance: number;
  newMonthlyHoa: number;
  newTotalMonthlyPayment: number;

  /* ── Comparison ── */
  /** newTotalMonthlyPayment − currentMonthlyPayment. Positive = payment goes up. */
  paymentDifference: number;
  paymentDifferencePct: number;
}

export function calculateMoveUp(inputs: MoveUpInputs): MoveUpOutputs {
  const {
    currentHomeValue,
    currentMortgageBalance,
    currentMonthlyPayment,
    sellingCostPercent,
    newHomePrice,
    downPaymentSource,
    additionalCash,
    newRate,
    newTermYears,
    annualPropertyTax,
    annualInsurance,
    monthlyHoa,
  } = inputs;

  /* ── Current home ── */
  const currentEquity = Math.round((currentHomeValue - currentMortgageBalance) * 100) / 100;
  const sellingCosts = Math.round(currentHomeValue * (sellingCostPercent / 100) * 100) / 100;
  const netProceedsFromSale = Math.round((currentHomeValue - currentMortgageBalance - sellingCosts) * 100) / 100;
  const isUnderwater = netProceedsFromSale < 0;

  /* ── Down payment ── */
  const equityAvailable = Math.max(0, netProceedsFromSale);

  const cashAvailableForDownPayment = Math.min(
    newHomePrice,
    downPaymentSource === "equity"
      ? equityAvailable
      : downPaymentSource === "cash"
      ? additionalCash
      : equityAvailable + additionalCash
  );

  const downPayment = Math.round(cashAvailableForDownPayment * 100) / 100;
  const downPaymentPct =
    newHomePrice > 0 ? Math.round((downPayment / newHomePrice) * 10000) / 100 : 0;

  const newLoanAmount = Math.round(Math.max(0, newHomePrice - downPayment) * 100) / 100;
  const newLtv = newHomePrice > 0 ? Math.round((newLoanAmount / newHomePrice) * 10000) / 100 : 0;

  /* ── New payments ── */
  const newMonthlyPi = Math.round(calculateMonthlyPi(newLoanAmount, newRate, newTermYears) * 100) / 100;
  const newMonthlyPropertyTax = Math.round((annualPropertyTax / 12) * 100) / 100;
  const newMonthlyInsurance = Math.round((annualInsurance / 12) * 100) / 100;
  const newMonthlyHoaRounded = Math.round(monthlyHoa * 100) / 100;

  const newTotalMonthlyPayment = Math.round(
    (newMonthlyPi + newMonthlyPropertyTax + newMonthlyInsurance + newMonthlyHoaRounded) * 100
  ) / 100;

  /* ── Comparison ── */
  const paymentDifference = Math.round((newTotalMonthlyPayment - currentMonthlyPayment) * 100) / 100;
  const paymentDifferencePct =
    currentMonthlyPayment > 0
      ? Math.round((paymentDifference / currentMonthlyPayment) * 10000) / 100
      : 0;

  return {
    currentEquity,
    sellingCosts,
    netProceedsFromSale,
    isUnderwater,
    cashAvailableForDownPayment: downPayment,
    downPayment,
    downPaymentPct,
    newLoanAmount,
    newLtv,
    newMonthlyPi,
    newMonthlyPropertyTax,
    newMonthlyInsurance,
    newMonthlyHoa: newMonthlyHoaRounded,
    newTotalMonthlyPayment,
    paymentDifference,
    paymentDifferencePct,
  };
}

import { calculateMonthlyPi, buildAmortizationSchedule } from "./amortization";

export type ClosingCostStrategy = "cash" | "rolled_into_loan";

export interface RefinanceInputs {
  currentBalance: number;
  currentRate: number; // annual, percent
  currentRemainingTermMonths: number;
  newRate: number; // annual, percent
  newTermYears: number;
  closingCosts: number;
  closingCostStrategy: ClosingCostStrategy;
  monthsExpectingToStay: number;
}

export interface RefinanceOutputs {
  currentPayment: number;
  newLoanAmount: number;
  newPayment: number;
  /** Positive = new payment is lower (saving money). */
  monthlySavings: number;
  /**
   * Months until cumulative savings offset the upfront closing costs.
   * 0 when costs are rolled into loan and payment still decreases.
   * Infinity when monthlySavings ≤ 0.
   */
  breakEvenMonths: number;
  /** Net savings (or loss) at the expected stay duration. */
  totalSavingsAtStayDuration: number;
  totalInterestCurrent: number;
  totalInterestNew: number;
  interestSavingsOverLife: number;
  isWorthRefinancing: boolean;
}

/**
 * Refinance break-even and lifetime savings engine.
 *
 * Break-even logic:
 *   - "cash" strategy: breakEvenMonths = ceil(closingCosts / monthlySavings)
 *   - "rolled_into_loan": no upfront cash paid; break-even is month 0 when
 *     the new payment (which already includes the rolled-in balance) is still
 *     lower than the current payment.
 *
 * Total savings at stay duration:
 *   - "cash": monthlySavings × stayMonths − closingCosts
 *   - "rolled": monthlySavings × stayMonths  (costs absorbed into loan balance)
 *
 * Total interest is computed on the full scheduled term; it does not model
 * prepayment or early exit.
 */
export function calculateRefinance(inputs: RefinanceInputs): RefinanceOutputs {
  const currentPayment = calculateMonthlyPi(
    inputs.currentBalance,
    inputs.currentRate,
    inputs.currentRemainingTermMonths / 12
  );

  const newLoanAmount =
    inputs.closingCostStrategy === "rolled_into_loan"
      ? inputs.currentBalance + inputs.closingCosts
      : inputs.currentBalance;

  const newPayment = calculateMonthlyPi(
    newLoanAmount,
    inputs.newRate,
    inputs.newTermYears
  );

  const monthlySavings = Math.round((currentPayment - newPayment) * 100) / 100;

  // Break-even
  let breakEvenMonths: number;
  if (monthlySavings <= 0) {
    breakEvenMonths = Infinity;
  } else if (inputs.closingCostStrategy === "rolled_into_loan") {
    breakEvenMonths = 0;
  } else {
    breakEvenMonths = Math.ceil(inputs.closingCosts / monthlySavings);
  }

  // Net savings at stay duration
  const stayMonths = inputs.monthsExpectingToStay;
  const upfrontCost =
    inputs.closingCostStrategy === "cash" ? inputs.closingCosts : 0;
  const totalSavingsAtStayDuration =
    Math.round((monthlySavings * stayMonths - upfrontCost) * 100) / 100;

  // Lifetime interest
  const currentSchedule = buildAmortizationSchedule(
    inputs.currentBalance,
    inputs.currentRate,
    inputs.currentRemainingTermMonths / 12
  );
  const totalInterestCurrent = Math.round(
    currentSchedule.reduce((sum, r) => sum + r.interest, 0) * 100
  ) / 100;

  const newSchedule = buildAmortizationSchedule(
    newLoanAmount,
    inputs.newRate,
    inputs.newTermYears
  );
  const totalInterestNew = Math.round(
    newSchedule.reduce((sum, r) => sum + r.interest, 0) * 100
  ) / 100;

  const interestSavingsOverLife = Math.round(
    (totalInterestCurrent - totalInterestNew) * 100
  ) / 100;

  const isWorthRefinancing =
    monthlySavings > 0 && breakEvenMonths <= stayMonths;

  return {
    currentPayment: Math.round(currentPayment * 100) / 100,
    newLoanAmount,
    newPayment: Math.round(newPayment * 100) / 100,
    monthlySavings,
    breakEvenMonths,
    totalSavingsAtStayDuration,
    totalInterestCurrent,
    totalInterestNew,
    interestSavingsOverLife,
    isWorthRefinancing,
  };
}

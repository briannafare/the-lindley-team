import { calculateMonthlyPi, buildAmortizationSchedule } from "./amortization";
import { calculateFhaMip, FhaMipDuration } from "./mi-fha";

export interface FhaInputs {
  homePrice: number;
  downPayment: number;
  /** Override derived base loan. 0 = auto-calculate from price − down. */
  loanAmount: number;
  interestRate: number; // annual, percent
  loanTermYears: number;
  /** Informational — affects minimum down payment warning, not MIP rate. */
  estimatedCreditScore: number;
  /** When true, upfront MIP is added to loan balance. */
  financeUpfrontMip: boolean;
  annualPropertyTax: number;
  annualHomeownersInsurance: number;
  monthlyHoa: number;
  startDate: Date;
}

export interface FhaOutputs {
  baseLoanAmount: number;
  downPaymentPercent: number;
  upfrontMipPercent: number;
  upfrontMipAmount: number;
  /** Base loan + financed upfront MIP (equals base when paid at closing). */
  effectiveLoanAmount: number;
  annualMipRate: number;
  monthlyMip: number;
  mipDuration: FhaMipDuration;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeownersInsurance: number;
  monthlyHoa: number;
  totalMonthlyPayment: number;
  ltv: number;
  totalInterestPaid: number;
  payoffDate: Date;
  totalCost5yr: number;
  totalCost10yr: number;
  totalCostFullTerm: number;
  /** 3.5% for credit ≥ 580; 10% for credit 500–579. */
  minDownPaymentPercent: number;
}

/**
 * Calculate FHA loan payment and lifetime cost metrics.
 *
 * FHA loans carry both an upfront MIP (1.75% of base loan, typically
 * financed) and a monthly MIP that persists for 11 years when LTV ≤ 90%,
 * or for the life of the loan otherwise. FHA MIP rates are not
 * credit-score-tiered — the credit score is used only to determine the
 * minimum required down payment.
 *
 * PITI + MIP assembly:
 *   Total = P&I(effectiveLoan, rate, term)
 *         + monthlyMip
 *         + annualPropertyTax / 12
 *         + annualHomeownersInsurance / 12
 *         + monthlyHoa
 */
export function calculateFhaPayment(inputs: FhaInputs): FhaOutputs {
  const baseLoanAmount =
    inputs.loanAmount > 0
      ? inputs.loanAmount
      : inputs.homePrice - inputs.downPayment;

  const downPaymentPercent =
    inputs.homePrice > 0 ? (inputs.downPayment / inputs.homePrice) * 100 : 0;

  const ltv = inputs.homePrice > 0 ? baseLoanAmount / inputs.homePrice : 0;

  const mip = calculateFhaMip({ baseLoanAmount, ltv, loanTermYears: inputs.loanTermYears });

  const effectiveLoanAmount = inputs.financeUpfrontMip
    ? baseLoanAmount + mip.upfrontMipAmount
    : baseLoanAmount;

  const monthlyPi = calculateMonthlyPi(
    effectiveLoanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );

  const monthlyPropertyTax = Math.round((inputs.annualPropertyTax / 12) * 100) / 100;
  const monthlyHomeownersInsurance =
    Math.round((inputs.annualHomeownersInsurance / 12) * 100) / 100;

  const totalMonthlyPayment = Math.round(
    (monthlyPi +
      mip.monthlyMip +
      monthlyPropertyTax +
      monthlyHomeownersInsurance +
      inputs.monthlyHoa) *
      100
  ) / 100;

  const schedule = buildAmortizationSchedule(
    effectiveLoanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );
  const totalInterestPaid =
    Math.round(schedule.reduce((sum, row) => sum + row.interest, 0) * 100) / 100;

  const payoffDate = new Date(inputs.startDate);
  payoffDate.setMonth(payoffDate.getMonth() + inputs.loanTermYears * 12);

  // Total cost projections — account for MIP dropping at 11 years when applicable
  const totalTermMonths = inputs.loanTermYears * 12;
  const mipMonths =
    mip.mipDuration === "life_of_loan" ? totalTermMonths : mip.mipDuration * 12;
  const baseMonthlyNoMip =
    monthlyPi + monthlyPropertyTax + monthlyHomeownersInsurance + inputs.monthlyHoa;

  function totalCostForMonths(months: number): number {
    const capped = Math.min(months, totalTermMonths);
    const mipInPeriod = Math.min(capped, mipMonths);
    return Math.round((baseMonthlyNoMip * capped + mip.monthlyMip * mipInPeriod) * 100) / 100;
  }

  const minDownPaymentPercent = inputs.estimatedCreditScore < 580 ? 10 : 3.5;

  return {
    baseLoanAmount,
    downPaymentPercent: Math.round(downPaymentPercent * 100) / 100,
    upfrontMipPercent: mip.upfrontMipPercent,
    upfrontMipAmount: mip.upfrontMipAmount,
    effectiveLoanAmount,
    annualMipRate: mip.annualMipRate,
    monthlyMip: mip.monthlyMip,
    mipDuration: mip.mipDuration,
    monthlyPrincipalAndInterest: Math.round(monthlyPi * 100) / 100,
    monthlyPropertyTax,
    monthlyHomeownersInsurance,
    monthlyHoa: inputs.monthlyHoa,
    totalMonthlyPayment,
    ltv,
    totalInterestPaid,
    payoffDate,
    totalCost5yr: totalCostForMonths(60),
    totalCost10yr: totalCostForMonths(120),
    totalCostFullTerm: totalCostForMonths(totalTermMonths),
    minDownPaymentPercent,
  };
}

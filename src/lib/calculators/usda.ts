import { calculateMonthlyPi, calculateTotalInterest } from "./amortization";
import { calculateUsdaFees } from "./guarantee-fee-usda";

export interface UsdaInputs {
  homePrice: number;
  /** USDA requires no down payment; a positive value is optional. */
  downPayment: number;
  /** Override derived base loan. 0 = auto-calculate from price − down. */
  loanAmount: number;
  interestRate: number; // annual, percent
  loanTermYears: number;
  /** When true, the upfront guarantee fee is added to the loan balance. */
  financeGuaranteeFee: boolean;
  /** Informational only — not used in payment math. */
  householdIncome: number;
  /** Informational only — not used in payment math. */
  householdSize: number;
  annualPropertyTax: number;
  annualHomeownersInsurance: number;
  monthlyHoa: number;
  startDate: Date;
}

export interface UsdaOutputs {
  downPaymentPercent: number;
  baseLoanAmount: number;
  guaranteeFeePercent: number;
  guaranteeFeeAmount: number;
  /** Base loan + financed guarantee fee (equals base when paid at closing). */
  effectiveLoanAmount: number;
  annualFeeRate: number;
  monthlyAnnualFee: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeownersInsurance: number;
  monthlyHoa: number;
  totalMonthlyPayment: number;
  ltv: number;
  totalInterestPaid: number;
  payoffDate: Date;
}

/**
 * Calculate USDA Guaranteed Loan payment and key metrics.
 *
 * USDA loans require no down payment and carry no private mortgage insurance.
 * Instead they have two fees: a one-time upfront guarantee fee (1.0% of base
 * loan, typically financed) and a recurring annual fee (0.35% of outstanding
 * balance) collected monthly. The property must be in an eligible rural area
 * and the borrower must meet income limits for the area.
 *
 * PITI + annual fee assembly:
 *   Total = P&I(effectiveLoan, rate, term)
 *         + monthlyAnnualFee
 *         + annualPropertyTax / 12
 *         + annualHomeownersInsurance / 12
 *         + monthlyHoa
 */
export function calculateUsdaPayment(inputs: UsdaInputs): UsdaOutputs {
  const baseLoanAmount =
    inputs.loanAmount > 0
      ? inputs.loanAmount
      : inputs.homePrice - inputs.downPayment;

  const downPaymentPercent =
    inputs.homePrice > 0 ? (inputs.downPayment / inputs.homePrice) * 100 : 0;

  const fees = calculateUsdaFees({
    baseLoanAmount,
    financeGuaranteeFee: inputs.financeGuaranteeFee,
  });

  const monthlyPi = calculateMonthlyPi(
    fees.effectiveLoanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );

  const monthlyPropertyTax = Math.round((inputs.annualPropertyTax / 12) * 100) / 100;
  const monthlyHomeownersInsurance =
    Math.round((inputs.annualHomeownersInsurance / 12) * 100) / 100;

  const totalMonthlyPayment = Math.round(
    (monthlyPi +
      fees.monthlyAnnualFee +
      monthlyPropertyTax +
      monthlyHomeownersInsurance +
      inputs.monthlyHoa) *
      100
  ) / 100;

  const ltv = inputs.homePrice > 0 ? fees.effectiveLoanAmount / inputs.homePrice : 0;

  const totalInterestPaid = calculateTotalInterest(
    fees.effectiveLoanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );

  const payoffDate = new Date(inputs.startDate);
  payoffDate.setMonth(payoffDate.getMonth() + inputs.loanTermYears * 12);

  return {
    downPaymentPercent: Math.round(downPaymentPercent * 100) / 100,
    baseLoanAmount,
    guaranteeFeePercent: fees.guaranteeFeePercent,
    guaranteeFeeAmount: fees.guaranteeFeeAmount,
    effectiveLoanAmount: fees.effectiveLoanAmount,
    annualFeeRate: fees.annualFeeRate,
    monthlyAnnualFee: fees.monthlyAnnualFee,
    monthlyPrincipalAndInterest: Math.round(monthlyPi * 100) / 100,
    monthlyPropertyTax,
    monthlyHomeownersInsurance,
    monthlyHoa: inputs.monthlyHoa,
    totalMonthlyPayment,
    ltv: Math.round(ltv * 10000) / 10000,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    payoffDate,
  };
}

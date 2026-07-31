import { calculateMonthlyPi, calculateTotalInterest } from "./amortization";
import {
  getVaFundingFeePercent,
  VaServiceStatus,
  VaUseCount,
  VaFundingFeeContext,
} from "./funding-fee-va";

export interface VaInputs {
  homePrice: number;
  downPayment: number;
  /** Override the derived base loan amount. 0 = auto-calculate from price − down. */
  loanAmount: number;
  interestRate: number; // annual, percent
  loanTermYears: number;
  serviceStatus: VaServiceStatus;
  useCount: VaUseCount;
  isDisabilityExempt: boolean;
  /** When true, the funding fee is added to the loan balance. */
  financeFundingFee: boolean;
  annualPropertyTax: number;
  annualHomeownersInsurance: number;
  monthlyHoa: number;
  startDate: Date;
}

export interface VaOutputs {
  downPaymentPercent: number;
  baseLoanAmount: number;
  fundingFeePercent: number;
  fundingFeeDollars: number;
  /** Base loan + financed funding fee (equals base when fee is paid out of pocket). */
  financedLoanAmount: number;
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
 * Calculate a VA loan monthly payment and key metrics.
 *
 * VA loans carry no mortgage insurance but charge a one-time funding fee
 * (0%–3.30% of the base loan amount) that can optionally be rolled into
 * the loan. Veterans with a service-connected disability rating are exempt
 * from the fee. There is no minimum down payment requirement.
 *
 * PITI assembly:
 *   Total = P&I(financedLoan, rate, term)
 *         + annualPropertyTax / 12
 *         + annualHomeownersInsurance / 12
 *         + monthlyHoa
 */
export function calculateVaPayment(inputs: VaInputs): VaOutputs {
  const baseLoanAmount =
    inputs.loanAmount > 0
      ? inputs.loanAmount
      : inputs.homePrice - inputs.downPayment;

  const downPaymentPercent =
    inputs.homePrice > 0 ? (inputs.downPayment / inputs.homePrice) * 100 : 0;

  const feeCtx: VaFundingFeeContext = {
    serviceStatus: inputs.serviceStatus,
    useCount: inputs.useCount,
    downPaymentPercent,
    isDisabilityExempt: inputs.isDisabilityExempt,
  };

  const fundingFeePercent = getVaFundingFeePercent(feeCtx);
  const fundingFeeDollars = Math.round((baseLoanAmount * fundingFeePercent) / 100);

  const financedLoanAmount = inputs.financeFundingFee
    ? baseLoanAmount + fundingFeeDollars
    : baseLoanAmount;

  const monthlyPi = calculateMonthlyPi(
    financedLoanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );

  const monthlyPropertyTax = Math.round((inputs.annualPropertyTax / 12) * 100) / 100;
  const monthlyHomeownersInsurance =
    Math.round((inputs.annualHomeownersInsurance / 12) * 100) / 100;

  const totalMonthlyPayment =
    monthlyPi + monthlyPropertyTax + monthlyHomeownersInsurance + inputs.monthlyHoa;

  const ltv = inputs.homePrice > 0 ? financedLoanAmount / inputs.homePrice : 0;

  const totalInterestPaid = calculateTotalInterest(
    financedLoanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );

  const payoffDate = new Date(inputs.startDate);
  payoffDate.setMonth(payoffDate.getMonth() + inputs.loanTermYears * 12);

  return {
    downPaymentPercent: Math.round(downPaymentPercent * 100) / 100,
    baseLoanAmount,
    fundingFeePercent,
    fundingFeeDollars,
    financedLoanAmount,
    monthlyPrincipalAndInterest: Math.round(monthlyPi * 100) / 100,
    monthlyPropertyTax,
    monthlyHomeownersInsurance,
    monthlyHoa: inputs.monthlyHoa,
    totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
    ltv,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    payoffDate,
  };
}

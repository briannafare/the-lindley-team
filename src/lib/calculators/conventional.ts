import { ConventionalInputs, ConventionalOutputs, MiContext } from "./types";
import { calculateMonthlyPi, calculateTotalInterest } from "./amortization";
import { calculateMonthlyMiPremium, mapCreditScoreToTier } from "./mi-arch";

export function calculateConventionalPayment(
  inputs: ConventionalInputs
): ConventionalOutputs {
  const { homePrice, downPayment, loanAmount, interestRate, loanTermYears } = inputs;

  const effectiveLoanAmount =
    loanAmount && loanAmount > 0 ? loanAmount : homePrice - downPayment;

  const ltv = homePrice > 0 ? effectiveLoanAmount / homePrice : 0;

  const monthlyPi = calculateMonthlyPi(
    effectiveLoanAmount,
    interestRate,
    loanTermYears
  );

  const monthlyPropertyTax = inputs.annualPropertyTax / 12;
  const monthlyHomeownersInsurance = inputs.annualHomeownersInsurance / 12;

  const creditTier = mapCreditScoreToTier(inputs.estimatedCreditScore);

  const miCtx: MiContext = {
    ltv,
    loanTermYears: inputs.loanTermYears,
    isFixed: inputs.isFixed,
    occupancy: inputs.occupancy,
    isCashOutRefi: inputs.isCashOutRefi,
    dtiOver45: false,
    numBorrowers: 1,
    isManufactured: false,
    units: 1,
    creditTier,
  };

  const monthlyMi =
    ltv > 0.80 ? calculateMonthlyMiPremium(effectiveLoanAmount, miCtx) : 0;

  const totalMonthlyPayment =
    monthlyPi +
    monthlyMi +
    monthlyPropertyTax +
    monthlyHomeownersInsurance +
    inputs.monthlyHoa;

  const totalInterestPaid = calculateTotalInterest(
    effectiveLoanAmount,
    interestRate,
    loanTermYears
  );

  const payoffDate = new Date(inputs.startDate);
  payoffDate.setMonth(payoffDate.getMonth() + loanTermYears * 12);

  return {
    monthlyPrincipalAndInterest: monthlyPi,
    monthlyMi,
    monthlyPropertyTax,
    monthlyHomeownersInsurance,
    monthlyHoa: inputs.monthlyHoa,
    totalMonthlyPayment,
    ltv,
    totalInterestPaid,
    payoffDate,
  };
}

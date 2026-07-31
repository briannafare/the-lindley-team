/**
 * Mortgage Interest Tax Deduction Estimator.
 *
 * Estimates the federal income tax benefit of itemizing mortgage interest
 * and property taxes. Uses 2024 tax brackets and standard deduction amounts.
 *
 * Key rules modeled:
 * - Mortgage interest deductible on loan balances up to $750k ($375k for MFS)
 * - SALT (state & local tax) deduction capped at $10k ($5k for MFS)
 * - Tax savings = deductible amount × marginal rate (only if itemizing)
 * - Savings shown assume total itemized deductions exceed the standard deduction
 *
 * This is an educational estimate. Not tax advice.
 */

export type FilingStatus =
  | "single"
  | "married_filing_jointly"
  | "married_filing_separately"
  | "head_of_household";

/** 2024 standard deduction amounts */
export const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 14600,
  married_filing_jointly: 29200,
  married_filing_separately: 14600,
  head_of_household: 21900,
};

/** Mortgage interest deduction balance cap */
const MORTGAGE_CAP: Record<FilingStatus, number> = {
  single: 750000,
  married_filing_jointly: 750000,
  married_filing_separately: 375000,
  head_of_household: 750000,
};

/** SALT cap (property tax + state income tax combined) */
const SALT_CAP: Record<FilingStatus, number> = {
  single: 10000,
  married_filing_jointly: 10000,
  married_filing_separately: 5000,
  head_of_household: 10000,
};

/** 2024 federal income tax brackets: [upperBound, marginalRate] */
const BRACKETS: Record<FilingStatus, [number, number][]> = {
  single: [
    [11600, 0.10], [47150, 0.12], [100525, 0.22],
    [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37],
  ],
  married_filing_jointly: [
    [23200, 0.10], [94300, 0.12], [201050, 0.22],
    [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37],
  ],
  married_filing_separately: [
    [11600, 0.10], [47150, 0.12], [100525, 0.22],
    [191950, 0.24], [243725, 0.32], [365600, 0.35], [Infinity, 0.37],
  ],
  head_of_household: [
    [16550, 0.10], [63100, 0.12], [100500, 0.22],
    [191950, 0.24], [243700, 0.32], [609350, 0.35], [Infinity, 0.37],
  ],
};

function getMarginalRate(income: number, status: FilingStatus): number {
  for (const [max, rate] of BRACKETS[status]) {
    if (income <= max) return rate;
  }
  return 0.37;
}

export interface TaxDeductionInputs {
  filingStatus: FilingStatus;
  /** Estimated annual taxable income before itemized deductions */
  estimatedTaxableIncome: number;
  /** Current outstanding mortgage balance */
  mortgageBalance: number;
  /** Annual mortgage interest rate (percent) */
  interestRate: number;
  annualPropertyTax: number;
  /** Whether the taxpayer expects to itemize deductions */
  expectsToItemize: boolean;
}

export interface TaxDeductionOutputs {
  /** Estimated first-year annual mortgage interest (balance × rate) */
  estimatedAnnualMortgageInterest: number;
  /** Mortgage interest eligible for deduction (capped at balance limit) */
  deductibleMortgageInterest: number;
  /** Property tax eligible for deduction (capped at SALT limit) */
  deductiblePropertyTax: number;
  /** Sum of deductible interest + property tax */
  totalDeductibleFromMortgage: number;
  /** 2024 standard deduction for the filing status */
  standardDeduction: number;
  /** Amount above the standard deduction (marginal itemizing benefit) */
  deductionAboveStandard: number;
  /** Marginal federal income tax rate */
  marginalTaxRate: number;
  /** marginalTaxRate as a percent, e.g. 22.0 */
  marginalTaxRatePct: number;
  /**
   * Estimated annual federal tax savings.
   * = totalDeductibleFromMortgage × marginalTaxRate when expectsToItemize.
   * Assumes total itemized deductions exceed the standard deduction.
   */
  estimatedAnnualTaxSavings: number;
  estimatedMonthlyTaxSavings: number;
  /** Effective monthly interest rate reduction from tax savings */
  effectiveMonthlyDiscount: number;
  mortgageBalanceCapped: boolean;
  propertyTaxCapped: boolean;
  mortgageCap: number;
  saltCap: number;
}

export function calculateTaxDeduction(inputs: TaxDeductionInputs): TaxDeductionOutputs {
  const mortgageCap = MORTGAGE_CAP[inputs.filingStatus];
  const saltCap = SALT_CAP[inputs.filingStatus];
  const stdDeduction = STANDARD_DEDUCTION[inputs.filingStatus];

  const mortgageBalanceCapped = inputs.mortgageBalance > mortgageCap;
  const deductibleBalance = Math.min(inputs.mortgageBalance, mortgageCap);

  // Estimated first-year interest (balance × rate — conservative upper-bound estimate)
  const estimatedAnnualMortgageInterest =
    Math.round(inputs.mortgageBalance * (inputs.interestRate / 100) * 100) / 100;

  // Proportionally scale interest if balance is capped
  const deductibleMortgageInterest = mortgageBalanceCapped
    ? Math.round((deductibleBalance / inputs.mortgageBalance) * estimatedAnnualMortgageInterest * 100) / 100
    : estimatedAnnualMortgageInterest;

  const propertyTaxCapped = inputs.annualPropertyTax > saltCap;
  const deductiblePropertyTax = Math.min(inputs.annualPropertyTax, saltCap);

  const totalDeductibleFromMortgage =
    Math.round((deductibleMortgageInterest + deductiblePropertyTax) * 100) / 100;

  const deductionAboveStandard = Math.max(0, totalDeductibleFromMortgage - stdDeduction);

  const marginalTaxRate = getMarginalRate(inputs.estimatedTaxableIncome, inputs.filingStatus);
  const marginalTaxRatePct = Math.round(marginalTaxRate * 100 * 10) / 10;

  const estimatedAnnualTaxSavings = inputs.expectsToItemize
    ? Math.round(totalDeductibleFromMortgage * marginalTaxRate * 100) / 100
    : 0;

  const estimatedMonthlyTaxSavings = Math.round((estimatedAnnualTaxSavings / 12) * 100) / 100;

  // Effective monthly discount expressed as a dollar figure
  const effectiveMonthlyDiscount = estimatedMonthlyTaxSavings;

  return {
    estimatedAnnualMortgageInterest,
    deductibleMortgageInterest,
    deductiblePropertyTax,
    totalDeductibleFromMortgage,
    standardDeduction: stdDeduction,
    deductionAboveStandard,
    marginalTaxRate,
    marginalTaxRatePct,
    estimatedAnnualTaxSavings,
    estimatedMonthlyTaxSavings,
    effectiveMonthlyDiscount,
    mortgageBalanceCapped,
    propertyTaxCapped,
    mortgageCap,
    saltCap,
  };
}

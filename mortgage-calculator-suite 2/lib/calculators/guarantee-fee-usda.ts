/**
 * USDA Single Family Housing Guaranteed Loan Program fee engine.
 * Rates current as of FY2024.
 * Source: 7 CFR Part 3555; USDA RD Bulletin 1980-E.
 */

/** Upfront guarantee fee: 1.0% of the base loan amount. */
export const USDA_GUARANTEE_FEE_PERCENT = 1.0;

/** Annual fee rate: 0.35% of the outstanding balance, paid monthly. */
export const USDA_ANNUAL_FEE_RATE = 0.35;

export interface UsdaFeeContext {
  baseLoanAmount: number;
  /** When true, the upfront guarantee fee is rolled into the loan balance. */
  financeGuaranteeFee: boolean;
}

export interface UsdaFeeResult {
  guaranteeFeePercent: number;
  guaranteeFeeAmount: number;
  /** Base loan + financed guarantee fee (equals base when paid at closing). */
  effectiveLoanAmount: number;
  annualFeeRate: number;
  /**
   * Monthly annual fee assessed on the effective outstanding balance.
   * USDA recalculates this each October 1 on the remaining balance;
   * this calculator uses the initial effective balance as a conservative
   * constant-payment estimate.
   */
  monthlyAnnualFee: number;
}

/**
 * Calculate USDA upfront guarantee fee and monthly annual fee.
 *
 * The upfront guarantee fee (1.0% of base loan) is typically financed.
 * The annual fee (0.35%) is assessed on the outstanding principal and
 * collected monthly — it functions like MI but at a much lower rate than
 * FHA MIP, and it never cancels on USDA loans.
 */
export function calculateUsdaFees(ctx: UsdaFeeContext): UsdaFeeResult {
  const guaranteeFeeAmount = Math.round(
    (ctx.baseLoanAmount * USDA_GUARANTEE_FEE_PERCENT) / 100
  );

  const effectiveLoanAmount = ctx.financeGuaranteeFee
    ? ctx.baseLoanAmount + guaranteeFeeAmount
    : ctx.baseLoanAmount;

  // Annual fee is on the effective loan amount (initial outstanding balance).
  const monthlyAnnualFee =
    Math.round((effectiveLoanAmount * (USDA_ANNUAL_FEE_RATE / 100)) / 12 * 100) / 100;

  return {
    guaranteeFeePercent: USDA_GUARANTEE_FEE_PERCENT,
    guaranteeFeeAmount,
    effectiveLoanAmount,
    annualFeeRate: USDA_ANNUAL_FEE_RATE,
    monthlyAnnualFee,
  };
}

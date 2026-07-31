/**
 * FHA Mortgage Insurance Premium (MIP) engine.
 * Rates current as of March 2024 per HUD Mortgagee Letter 2023-05.
 */

export type FhaMipDuration = "life_of_loan" | 11;

export interface FhaMipContext {
  baseLoanAmount: number;
  ltv: number;
  loanTermYears: number;
}

export interface FhaMipResult {
  upfrontMipPercent: number;
  upfrontMipAmount: number;
  annualMipRate: number;
  monthlyMip: number;
  mipDuration: FhaMipDuration;
}

const UPFRONT_MIP_RATE = 1.75;

/**
 * Annual MIP rate and duration by term band and LTV.
 * Source: HUD Mortgagee Letter 2023-05 (standard loan amounts ≤ $726,200).
 *
 * Terms > 15 years:
 *   LTV ≤ 90%         → 0.50%, 11 years
 *   90% < LTV ≤ 95%   → 0.50%, life of loan
 *   LTV > 95%         → 0.55%, life of loan
 *
 * Terms ≤ 15 years:
 *   LTV ≤ 90%         → 0.15%, 11 years
 *   LTV > 90%         → 0.40%, life of loan
 */
function getAnnualMipRateAndDuration(
  ltv: number,
  loanTermYears: number
): { rate: number; duration: FhaMipDuration } {
  const longTerm = loanTermYears > 15;

  if (ltv <= 0.90) {
    return { rate: longTerm ? 0.50 : 0.15, duration: 11 };
  }
  if (!longTerm) {
    // Terms ≤ 15 years, LTV > 90%: single tier
    return { rate: 0.40, duration: "life_of_loan" };
  }
  // Terms > 15 years, LTV > 90%: two tiers split at 95%
  return { rate: ltv > 0.95 ? 0.55 : 0.50, duration: "life_of_loan" };
}

/**
 * Calculate FHA upfront and annual MIP.
 *
 * Upfront MIP is 1.75% of the base loan amount — typically financed into
 * the loan. Annual MIP is paid monthly and persists for 11 years (when
 * LTV ≤ 90%) or for the life of the loan.
 *
 * Both the upfront MIP amount and the monthly MIP are calculated on the
 * BASE loan amount (price − down payment), never on the effective loan
 * after the upfront MIP is financed in.
 */
export function calculateFhaMip(ctx: FhaMipContext): FhaMipResult {
  const upfrontMipAmount = Math.round((ctx.baseLoanAmount * UPFRONT_MIP_RATE) / 100);

  const { rate: annualMipRate, duration: mipDuration } = getAnnualMipRateAndDuration(
    ctx.ltv,
    ctx.loanTermYears
  );

  // annualMipRate is stored as a percentage (e.g. 0.55 means 0.55%).
  // Divide by 100 to convert to decimal, then divide by 12 for monthly.
  const monthlyMip = Math.round((ctx.baseLoanAmount * (annualMipRate / 100) / 12) * 100) / 100;

  return {
    upfrontMipPercent: UPFRONT_MIP_RATE,
    upfrontMipAmount,
    annualMipRate,
    monthlyMip,
    mipDuration,
  };
}

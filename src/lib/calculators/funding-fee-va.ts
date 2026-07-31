export type VaServiceStatus = "regular" | "reserves";
export type VaUseCount = "first" | "subsequent";
type VaDownPaymentBand = "lt5" | "5to10" | "gte10";

function getDownPaymentBand(downPaymentPercent: number): VaDownPaymentBand {
  if (downPaymentPercent >= 10) return "gte10";
  if (downPaymentPercent >= 5) return "5to10";
  return "lt5";
}

/**
 * VA Funding Fee table (effective January 1, 2020, per the Blue Water Navy
 * Vietnam Veterans Act). Regular military and Reserves/National Guard rates
 * were equalized. Source: VA Pamphlet 26-7, Chapter 8.
 *
 * Rates are expressed as a percentage of the base loan amount.
 */
const VA_FUNDING_FEE_TABLE: Record<
  VaServiceStatus,
  Record<VaUseCount, Record<VaDownPaymentBand, number>>
> = {
  regular: {
    first:      { lt5: 2.15, "5to10": 1.50, gte10: 1.25 },
    subsequent: { lt5: 3.30, "5to10": 1.50, gte10: 1.25 },
  },
  reserves: {
    first:      { lt5: 2.15, "5to10": 1.50, gte10: 1.25 },
    subsequent: { lt5: 3.30, "5to10": 1.50, gte10: 1.25 },
  },
};

export interface VaFundingFeeContext {
  serviceStatus: VaServiceStatus;
  useCount: VaUseCount;
  downPaymentPercent: number;
  isDisabilityExempt: boolean;
}

/**
 * Returns the VA funding fee as a percentage of the base loan amount.
 * Disability-exempt borrowers (service-connected disability rating) pay 0%.
 */
export function getVaFundingFeePercent(ctx: VaFundingFeeContext): number {
  if (ctx.isDisabilityExempt) return 0;
  const band = getDownPaymentBand(ctx.downPaymentPercent);
  return VA_FUNDING_FEE_TABLE[ctx.serviceStatus][ctx.useCount][band];
}

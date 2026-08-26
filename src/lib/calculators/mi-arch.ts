import { CreditTier, LoanTermBand, MiContext } from "./types";

type LtvBandKey = "97_95_01" | "95_90_01" | "90_85_01" | "85_below";

type MiBaseRateTable = {
  [K in LoanTermBand]: {
    [L in LtvBandKey]: {
      [C in CreditTier]: number;
    };
  };
};

// Arch MI BPMI Monthly rates — MCUS-B0283
// Fully wired for >20yr band; <=20yr to be filled from PDF
export const MI_BASE_RATES: MiBaseRateTable = {
  ">20": {
    "97_95_01": {
      "760_plus": 0.0058,
      "740_759": 0.0070,
      "720_739": 0.0087,
      "700_719": 0.0099,
      "680_699": 0.0121,
      "660_679": 0.0154,
      "640_659": 0.0165,
      "620_639": 0.0186,
    },
    "95_90_01": {
      "760_plus": 0.0029,
      "740_759": 0.0035,
      "720_739": 0.0044,
      "700_719": 0.0053,
      "680_699": 0.0068,
      "660_679": 0.0092,
      "640_659": 0.0104,
      "620_639": 0.0123,
    },
    "90_85_01": {
      "760_plus": 0.0019,
      "740_759": 0.0022,
      "720_739": 0.0028,
      "700_719": 0.0037,
      "680_699": 0.0049,
      "660_679": 0.0069,
      "640_659": 0.0082,
      "620_639": 0.0098,
    },
    "85_below": {
      "760_plus": 0.0014,
      "740_759": 0.0014,
      "720_739": 0.0015,
      "700_719": 0.0019,
      "680_699": 0.0028,
      "660_679": 0.0041,
      "640_659": 0.0051,
      "620_639": 0.0062,
    },
  },
  "<=20": {
    "97_95_01": {
      "760_plus": 0.0040,
      "740_759": 0.0050,
      "720_739": 0.0063,
      "700_719": 0.0073,
      "680_699": 0.0092,
      "660_679": 0.0120,
      "640_659": 0.0132,
      "620_639": 0.0150,
    },
    "95_90_01": {
      "760_plus": 0.0020,
      "740_759": 0.0025,
      "720_739": 0.0032,
      "700_719": 0.0039,
      "680_699": 0.0052,
      "660_679": 0.0072,
      "640_659": 0.0083,
      "620_639": 0.0098,
    },
    "90_85_01": {
      "760_plus": 0.0014,
      "740_759": 0.0015,
      "720_739": 0.0020,
      "700_719": 0.0027,
      "680_699": 0.0037,
      "660_679": 0.0054,
      "640_659": 0.0065,
      "620_639": 0.0078,
    },
    "85_below": {
      "760_plus": 0.0014,
      "740_759": 0.0014,
      "720_739": 0.0014,
      "700_719": 0.0015,
      "680_699": 0.0021,
      "660_679": 0.0032,
      "640_659": 0.0040,
      "620_639": 0.0050,
    },
  },
};

// --- Adjustments ---

interface MiAdjustments {
  cashOutRefi: Record<CreditTier, number>;
  secondHome: Record<CreditTier, number>;
  investment: Record<CreditTier, number>;
  manufactured: Record<CreditTier, number>;
  highDtiByLtv: Record<LtvBandKey, Record<CreditTier, number>>;
  multiBorrower: Record<LtvBandKey, Record<CreditTier, number>>;
}

export const MI_ADJUSTMENTS: MiAdjustments = {
  cashOutRefi: {
    "760_plus": 0.0018,
    "740_759": 0.002,
    "720_739": 0.002,
    "700_719": 0.0025,
    "680_699": 0.0025,
    "660_679": 0.005,
    "640_659": 0.0055,
    "620_639": 0.0,
  },
  secondHome: {
    "760_plus": 0.0012,
    "740_759": 0.0013,
    "720_739": 0.0014,
    "700_719": 0.0017,
    "680_699": 0.002,
    "660_679": 0.0035,
    "640_659": 0.004,
    "620_639": 0.0045,
  },
  investment: {
    "760_plus": 0.0034,
    "740_759": 0.0038,
    "720_739": 0.0038,
    "700_719": 0.0047,
    "680_699": 0.005,
    "660_679": 0.0057,
    "640_659": 0.0,
    "620_639": 0.0,
  },
  manufactured: {
    "760_plus": 0.0018,
    "740_759": 0.002,
    "720_739": 0.002,
    "700_719": 0.0025,
    "680_699": 0.003,
    "660_679": 0.005,
    "640_659": 0.0055,
    "620_639": 0.006,
  },
  highDtiByLtv: {
    "97_95_01": {
      "760_plus": 0.001,  "740_759": 0.0014, "720_739": 0.0017,
      "700_719": 0.0021, "680_699": 0.0026, "660_679": 0.0035,
      "640_659": 0.0037, "620_639": 0.0038,
    },
    "95_90_01": {
      "760_plus": 0.0009, "740_759": 0.0011, "720_739": 0.0014,
      "700_719": 0.0018, "680_699": 0.0023, "660_679": 0.0027,
      "640_659": 0.0029, "620_639": 0.0031,
    },
    "90_85_01": {
      "760_plus": 0.0007, "740_759": 0.001,  "720_739": 0.0012,
      "700_719": 0.0015, "680_699": 0.0019, "660_679": 0.0021,
      "640_659": 0.0023, "620_639": 0.0024,
    },
    "85_below": {
      "760_plus": 0.0003, "740_759": 0.0004, "720_739": 0.0005,
      "700_719": 0.0005, "680_699": 0.0007, "660_679": 0.0009,
      "640_659": 0.0009, "620_639": 0.0009,
    },
  },
  multiBorrower: {
    "97_95_01": {
      "760_plus": -0.0013, "740_759": -0.0013, "720_739": -0.0013,
      "700_719": -0.0013, "680_699": -0.0014, "660_679": -0.0015,
      "640_659": -0.0016, "620_639": -0.0018,
    },
    "95_90_01": {
      "760_plus": -0.0009, "740_759": -0.0009, "720_739": -0.0009,
      "700_719": -0.001,  "680_699": -0.0011, "660_679": -0.0012,
      "640_659": -0.0014, "620_639": -0.0016,
    },
    "90_85_01": {
      "760_plus": -0.0007, "740_759": -0.0007, "720_739": -0.0007,
      "700_719": -0.0007, "680_699": -0.0008, "660_679": -0.0009,
      "640_659": -0.0009, "620_639": -0.001,
    },
    "85_below": {
      "760_plus": -0.0003, "740_759": -0.0003, "720_739": -0.0003,
      "700_719": -0.0003, "680_699": -0.0003, "660_679": -0.0003,
      "640_659": -0.0003, "620_639": -0.0004,
    },
  },
};

const MIN_RATE = 0.0014;

function getLoanTermBand(termYears: number): LoanTermBand {
  return termYears > 20 ? ">20" : "<=20";
}

function getLtvBand(ltv: number): LtvBandKey {
  if (ltv > 0.95 && ltv <= 0.97) return "97_95_01";
  if (ltv > 0.90 && ltv <= 0.95) return "95_90_01";
  if (ltv > 0.85 && ltv <= 0.90) return "90_85_01";
  return "85_below";
}

export function mapCreditScoreToTier(score: number): CreditTier {
  if (score >= 760) return "760_plus";
  if (score >= 740) return "740_759";
  if (score >= 720) return "720_739";
  if (score >= 700) return "700_719";
  if (score >= 680) return "680_699";
  if (score >= 660) return "660_679";
  if (score >= 640) return "640_659";
  return "620_639";
}

export function getArchMiAnnualRate(ctx: MiContext): number {
  const termBand = getLoanTermBand(ctx.loanTermYears);
  const ltvBand = getLtvBand(ctx.ltv);
  const base = MI_BASE_RATES[termBand][ltvBand][ctx.creditTier];

  let rate = base;

  if (ctx.isCashOutRefi) {
    rate += MI_ADJUSTMENTS.cashOutRefi[ctx.creditTier];
  }
  if (ctx.occupancy === "second_home") {
    rate += MI_ADJUSTMENTS.secondHome[ctx.creditTier];
  }
  if (ctx.occupancy === "investment") {
    rate += MI_ADJUSTMENTS.investment[ctx.creditTier];
  }
  if (ctx.isManufactured) {
    rate += MI_ADJUSTMENTS.manufactured[ctx.creditTier];
  }
  if (ctx.dtiOver45) {
    rate += MI_ADJUSTMENTS.highDtiByLtv[ltvBand][ctx.creditTier];
  }
  if (ctx.numBorrowers >= 2) {
    rate += MI_ADJUSTMENTS.multiBorrower[ltvBand][ctx.creditTier];
  }

  return Math.max(rate, MIN_RATE);
}

export function calculateMonthlyMiPremium(
  loanAmount: number,
  ctx: MiContext
): number {
  const annualRate = getArchMiAnnualRate(ctx);
  return (annualRate / 12) * loanAmount;
}

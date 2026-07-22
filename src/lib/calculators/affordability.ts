/**
 * How Much House Can I Afford? calculator.
 *
 * Two independent constraints determine the affordable price:
 *
 *   Income constraint  — back-solve from max housing payment at target DTI
 *   Cash constraint    — available cash after closing costs sets the down payment
 *
 * The affordable price is the lower of the two.
 *
 * Because property tax and insurance are expressed as % of home value, the
 * income constraint has a closed-form solution:
 *
 *   maxHousingPayment = grossMonthlyIncome × dtiPercent/100 − otherMonthlyDebts
 *   P = (maxHousingPayment − monthlyHoa) /
 *       [ ltvRatio × piRate + (annualTaxRate + annualInsRate) / 1200 ]
 *
 * where piRate = r(1+r)^n / ((1+r)^n − 1) and ltvRatio = 1 − downPct/100.
 *
 * Scenarios: conservative (36% DTI), standard (43% DTI), aggressive (50% DTI).
 */

export interface AffordabilityInputs {
  grossAnnualIncome: number;
  /** Other monthly debt obligations (car, student loan, minimum CC payments) */
  otherMonthlyDebts: number;
  /** Total cash available for down payment AND closing costs */
  totalCashAvailable: number;
  /** Down payment as a percent of home price */
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  /** Annual property tax as a percent of home value, e.g. 1.2 */
  annualPropertyTaxRate: number;
  /** Annual homeowner's insurance as a percent of home value, e.g. 0.5 */
  annualInsuranceRate: number;
  monthlyHoa: number;
  /** Closing costs as a percent of purchase price, e.g. 3.0 */
  closingCostPercent: number;
}

export interface AffordabilityScenario {
  dtiPercent: number;
  label: string;
  /** Max home price under the income constraint at this DTI */
  maxPriceByIncome: number;
  /** Monthly PITI at maxPriceByIncome */
  monthlyPiti: number;
  monthlyPi: number;
  monthlyTax: number;
  monthlyInsurance: number;
  loanAmount: number;
  /** Percent of gross monthly income consumed by PITI */
  effectiveDti: number;
}

export interface AffordabilityOutputs {
  grossMonthlyIncome: number;

  /** Max price limited only by available cash (down payment constraint) */
  maxPriceByCash: number;
  downPaymentAmount: number;
  closingCostsAmount: number;
  /** totalCashAvailable − downPayment − closingCosts */
  cashReserve: number;

  conservative: AffordabilityScenario; // 36% DTI
  standard: AffordabilityScenario;     // 43% DTI
  aggressive: AffordabilityScenario;   // 50% DTI

  /** Lower of standard income-based price and cash-based price */
  recommendedPrice: number;
  recommendedScenario: AffordabilityScenario;
  /** Which constraint is binding: "income" | "cash" */
  bindingConstraint: "income" | "cash";
}

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Monthly P&I payment per $1 of loan */
function piRate(annualRatePct: number, termYears: number): number {
  if (termYears <= 0) return 0;
  if (annualRatePct <= 0) return 1 / (termYears * 12);
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  const factor = Math.pow(1 + r, n);
  return (r * factor) / (factor - 1);
}

function buildScenario(
  dtiPercent: number,
  label: string,
  grossMonthlyIncome: number,
  otherMonthlyDebts: number,
  downPaymentPercent: number,
  annualRatePct: number,
  termYears: number,
  annualTaxRate: number,
  annualInsRate: number,
  monthlyHoa: number
): AffordabilityScenario {
  const maxHousingPayment = Math.max(
    0,
    grossMonthlyIncome * (dtiPercent / 100) - otherMonthlyDebts
  );

  const ltvRatio = 1 - downPaymentPercent / 100;
  const pi = piRate(annualRatePct, termYears);
  const taxInsMonthlyPerDollar = (annualTaxRate + annualInsRate) / 100 / 12;
  const denominator = ltvRatio * pi + taxInsMonthlyPerDollar;

  const maxPriceByIncome =
    denominator > 0
      ? r2((maxHousingPayment - monthlyHoa) / denominator)
      : 0;

  const loanAmount = r2(Math.max(0, maxPriceByIncome * ltvRatio));
  const monthlyPi = r2(loanAmount * pi);
  const monthlyTax = r2((maxPriceByIncome * annualTaxRate) / 100 / 12);
  const monthlyInsurance = r2((maxPriceByIncome * annualInsRate) / 100 / 12);
  const monthlyPiti = r2(monthlyPi + monthlyTax + monthlyInsurance + monthlyHoa);

  const effectiveDti =
    grossMonthlyIncome > 0
      ? r2(((monthlyPiti + otherMonthlyDebts) / grossMonthlyIncome) * 100)
      : 0;

  return {
    dtiPercent,
    label,
    maxPriceByIncome: Math.max(0, maxPriceByIncome),
    monthlyPiti,
    monthlyPi,
    monthlyTax,
    monthlyInsurance,
    loanAmount,
    effectiveDti,
  };
}

export function calculateAffordability(
  inputs: AffordabilityInputs
): AffordabilityOutputs {
  const {
    grossAnnualIncome,
    otherMonthlyDebts,
    totalCashAvailable,
    downPaymentPercent,
    interestRate,
    loanTermYears,
    annualPropertyTaxRate,
    annualInsuranceRate,
    monthlyHoa,
    closingCostPercent,
  } = inputs;

  const grossMonthlyIncome = r2(grossAnnualIncome / 12);

  /* ── Cash constraint ── */
  // totalCash = downPayment + closingCosts
  // downPayment = price × downPct/100
  // closingCosts = price × closingCostPct/100
  // → price = totalCash / (downPct/100 + closingCostPct/100)
  const cashDenominator = (downPaymentPercent + closingCostPercent) / 100;
  const maxPriceByCash =
    cashDenominator > 0 ? r2(totalCashAvailable / cashDenominator) : 0;
  const downPaymentAmount = r2(maxPriceByCash * (downPaymentPercent / 100));
  const closingCostsAmount = r2(maxPriceByCash * (closingCostPercent / 100));
  const cashReserve = r2(totalCashAvailable - downPaymentAmount - closingCostsAmount);

  /* ── Income scenarios ── */
  const args = [
    grossMonthlyIncome,
    otherMonthlyDebts,
    downPaymentPercent,
    interestRate,
    loanTermYears,
    annualPropertyTaxRate,
    annualInsuranceRate,
    monthlyHoa,
  ] as const;

  const conservative = buildScenario(36, "Conservative", ...args);
  const standard     = buildScenario(43, "Standard",     ...args);
  const aggressive   = buildScenario(50, "Aggressive",   ...args);

  /* ── Recommended ── */
  const incomePrice = standard.maxPriceByIncome;
  const recommendedPrice = Math.min(incomePrice, maxPriceByCash);
  const bindingConstraint: "income" | "cash" =
    maxPriceByCash <= incomePrice ? "cash" : "income";

  // Rebuild scenario at the recommended price if cash-constrained
  const recommendedScenario =
    bindingConstraint === "income"
      ? standard
      : buildScenario(
          43,
          "Standard",
          grossMonthlyIncome,
          otherMonthlyDebts,
          downPaymentPercent,
          interestRate,
          loanTermYears,
          annualPropertyTaxRate,
          annualInsuranceRate,
          monthlyHoa
        );

  return {
    grossMonthlyIncome,
    maxPriceByCash,
    downPaymentAmount,
    closingCostsAmount,
    cashReserve,
    conservative,
    standard,
    aggressive,
    recommendedPrice,
    recommendedScenario,
    bindingConstraint,
  };
}

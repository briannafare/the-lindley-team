/**
 * Investment Property Cash Flow & Cap Rate engine.
 *
 * Standard income-approach real estate analysis:
 *
 *   PGI  = gross rent + other income (annual)
 *   EGI  = PGI × (1 − vacancyRate)
 *   OpEx = management + repairs + tax + insurance + HOA
 *   NOI  = EGI − OpEx
 *
 *   Cap Rate         = NOI / purchasePrice
 *   Annual Cash Flow = NOI − annualDebtService
 *   Cash-on-Cash     = annualCashFlow / totalCashInvested
 *   DSCR             = NOI / annualDebtService
 *   GRM              = purchasePrice / PGI
 */

import { calculateMonthlyPi } from "./amortization";

export interface InvestmentPropertyInputs {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  /** Used to compute total cash invested (down payment + closing costs) */
  closingCostPercent: number;
  grossMonthlyRent: number;
  otherMonthlyIncome: number;
  vacancyPercent: number;
  /** Applied to EGI */
  propertyManagementPercent: number;
  /** Applied to EGI */
  repairsAndReservesPercent: number;
  annualPropertyTax: number;
  annualInsurance: number;
  monthlyHoa: number;
}

export interface InvestmentPropertyOutputs {
  /* ── Income ── */
  /** Potential Gross Income: (grossMonthlyRent + otherMonthlyIncome) × 12 */
  pgi: number;
  vacancyLoss: number;
  /** Effective Gross Income: PGI − vacancyLoss */
  egi: number;

  /* ── Operating Expenses (annual) ── */
  propertyManagementExpense: number;
  repairsAndReservesExpense: number;
  annualPropertyTaxExpense: number;
  annualInsuranceExpense: number;
  annualHoaExpense: number;
  totalOperatingExpenses: number;

  /* ── NOI & Cap Rate ── */
  noi: number;
  /** As a percent, e.g. 6.25 */
  capRate: number;

  /* ── Debt service ── */
  loanAmount: number;
  monthlyPi: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  /** P&I + tax + insurance + HOA */
  monthlyPiti: number;
  annualDebtService: number;

  /* ── Cash flow ── */
  annualCashFlow: number;
  monthlyCashFlow: number;
  cashFlowPositive: boolean;

  /* ── Returns ── */
  closingCosts: number;
  totalCashInvested: number;
  /** annualCashFlow / totalCashInvested × 100 */
  cashOnCashReturn: number;
  /** purchasePrice / PGI */
  grm: number;
  /** NOI / annualDebtService */
  dscr: number;
  operatingExpenseRatio: number;
}

export function calculateInvestmentProperty(
  inputs: InvestmentPropertyInputs
): InvestmentPropertyOutputs {
  const {
    purchasePrice,
    downPayment,
    interestRate,
    loanTermYears,
    closingCostPercent,
    grossMonthlyRent,
    otherMonthlyIncome,
    vacancyPercent,
    propertyManagementPercent,
    repairsAndReservesPercent,
    annualPropertyTax,
    annualInsurance,
    monthlyHoa,
  } = inputs;

  /* ── Income ── */
  const pgi = Math.round((grossMonthlyRent + otherMonthlyIncome) * 12 * 100) / 100;
  const vacancyLoss = Math.round(pgi * (vacancyPercent / 100) * 100) / 100;
  const egi = Math.round((pgi - vacancyLoss) * 100) / 100;

  /* ── Operating Expenses ── */
  const propertyManagementExpense = Math.round(egi * (propertyManagementPercent / 100) * 100) / 100;
  const repairsAndReservesExpense = Math.round(egi * (repairsAndReservesPercent / 100) * 100) / 100;
  const annualHoaExpense = Math.round(monthlyHoa * 12 * 100) / 100;
  const totalOperatingExpenses = Math.round(
    (propertyManagementExpense + repairsAndReservesExpense + annualPropertyTax + annualInsurance + annualHoaExpense) * 100
  ) / 100;

  /* ── NOI ── */
  const noi = Math.round((egi - totalOperatingExpenses) * 100) / 100;
  const capRate =
    purchasePrice > 0 ? Math.round((noi / purchasePrice) * 10000) / 100 : 0;

  /* ── Debt service ── */
  const loanAmount = Math.max(0, purchasePrice - downPayment);
  const monthlyPiRaw = calculateMonthlyPi(loanAmount, interestRate, loanTermYears);
  const monthlyPi = Math.round(monthlyPiRaw * 100) / 100;
  const monthlyPropertyTax = Math.round((annualPropertyTax / 12) * 100) / 100;
  const monthlyInsuranceAmt = Math.round((annualInsurance / 12) * 100) / 100;
  const monthlyHoaAmt = Math.round(monthlyHoa * 100) / 100;
  const monthlyPiti = Math.round((monthlyPi + monthlyPropertyTax + monthlyInsuranceAmt + monthlyHoaAmt) * 100) / 100;

  // Debt service = P&I only (tax/insurance already in OpEx)
  const annualDebtService = Math.round(monthlyPi * 12 * 100) / 100;

  /* ── Cash flow ── */
  const annualCashFlow = Math.round((noi - annualDebtService) * 100) / 100;
  const monthlyCashFlow = Math.round((annualCashFlow / 12) * 100) / 100;

  /* ── Returns ── */
  const closingCosts = Math.round(purchasePrice * (closingCostPercent / 100) * 100) / 100;
  const totalCashInvested = Math.round((downPayment + closingCosts) * 100) / 100;
  const cashOnCashReturn =
    totalCashInvested > 0
      ? Math.round((annualCashFlow / totalCashInvested) * 10000) / 100
      : 0;

  const grm = pgi > 0 ? Math.round((purchasePrice / pgi) * 100) / 100 : 0;
  const dscr =
    annualDebtService > 0 ? Math.round((noi / annualDebtService) * 100) / 100 : 0;
  const operatingExpenseRatio =
    egi > 0 ? Math.round((totalOperatingExpenses / egi) * 10000) / 100 : 0;

  return {
    pgi,
    vacancyLoss,
    egi,
    propertyManagementExpense,
    repairsAndReservesExpense,
    annualPropertyTaxExpense: annualPropertyTax,
    annualInsuranceExpense: annualInsurance,
    annualHoaExpense,
    totalOperatingExpenses,
    noi,
    capRate,
    loanAmount,
    monthlyPi,
    monthlyPropertyTax,
    monthlyInsurance: monthlyInsuranceAmt,
    monthlyHoa: monthlyHoaAmt,
    monthlyPiti,
    annualDebtService,
    annualCashFlow,
    monthlyCashFlow,
    cashFlowPositive: annualCashFlow >= 0,
    closingCosts,
    totalCashInvested,
    cashOnCashReturn,
    grm,
    dscr,
    operatingExpenseRatio,
  };
}

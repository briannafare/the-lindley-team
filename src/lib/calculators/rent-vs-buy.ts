/**
 * Rent vs Buy Over Time comparison engine.
 *
 * Compares two scenarios over a holding period:
 *
 * RENTING: Pay rent (increasing annually), invest the down payment at
 * investmentReturnPercent.
 *   rentWealth = investmentValueAtEnd − totalRentPaid
 *
 * BUYING: Put down payment into the home, pay PITI + maintenance, sell at end.
 *   Ownership costs are reduced by estimated federal tax savings each year
 *   (mortgage interest deduction + property tax SALT deduction).
 *   buyWealth = homeEquityAtEnd − (totalOwnershipCost − totalTaxSavings)
 *
 * netBenefit = buyWealth − rentWealth
 *   Positive → buying leaves you with more net wealth.
 *   Negative → renting leaves you with more net wealth.
 *
 * Tax savings are an educational estimate only — not tax advice.
 * Uses 2024 federal brackets / deduction limits.
 */

import { calculateMonthlyPi, buildAmortizationSchedule } from "./amortization";
import { AmortizationRow } from "./types";
import { FilingStatus } from "./tax-deduction";

export type { FilingStatus };

/* ── Tax helpers (2024 federal) ── */

const MORTGAGE_CAP: Record<FilingStatus, number> = {
  single: 750000,
  married_filing_jointly: 750000,
  married_filing_separately: 375000,
  head_of_household: 750000,
};

const SALT_CAP: Record<FilingStatus, number> = {
  single: 10000,
  married_filing_jointly: 10000,
  married_filing_separately: 5000,
  head_of_household: 10000,
};

// ponytail: STANDARD_DEDUCTION removed — it was defined but unused, so the
// rent-vs-buy tax-savings math currently assumes itemizing always wins. Revisit
// (standard vs itemized comparison) when porting the rent-vs-buy calculator page.

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

/** Sum interest payments from amortization schedule for a given year (1-indexed). */
function annualInterestForYear(schedule: AmortizationRow[], year: number): number {
  const start = (year - 1) * 12;
  const end = Math.min(year * 12, schedule.length);
  let total = 0;
  for (let i = start; i < end; i++) total += schedule[i].interest;
  return total;
}

/* ── Interfaces ── */

export interface RentVsBuyInputs {
  currentMonthlyRent: number;
  annualRentIncreasePercent: number;
  homePrice: number;
  downPayment: number;
  /** Percent of purchase price paid at closing (fees, title, etc.) */
  closingCostPercent: number;
  interestRate: number;
  loanTermYears: number;
  annualPropertyTax: number;
  annualInsurance: number;
  /** Annual maintenance as a percent of home value */
  maintenancePercent: number;
  holdingPeriodYears: number;
  homeAppreciationPercent: number;
  /** Percent of sale price paid in agent commissions + transaction costs */
  sellingCostPercent: number;
  /** Annual return on invested down payment (renter scenario) */
  investmentReturnPercent: number;
  /* ── Tax inputs ── */
  filingStatus: FilingStatus;
  /** Gross annual income (before deductions) for bracket lookup */
  estimatedTaxableIncome: number;
}

export interface RentVsBuyYearData {
  year: number;
  cumulativeRentPaid: number;
  /** Home value minus remaining mortgage balance (gross equity, before selling costs) */
  homeEquityGross: number;
  homeValueAtYear: number;
  remainingBalance: number;
  /** Estimated federal tax savings from itemizing mortgage interest + property tax */
  annualTaxSavings: number;
  cumulativeTaxSavings: number;
}

export interface RentVsBuyOutputs {
  /* ── Rent side ── */
  totalRentPaid: number;
  investmentValueAtEnd: number;
  investmentGains: number;

  /* ── Buy side (pre-tax) ── */
  loanAmount: number;
  monthlyPi: number;
  closingCostsAmount: number;
  totalPitiPaid: number;
  totalMaintenancePaid: number;
  /** PITI + maintenance + closing costs before any tax benefit */
  totalOwnershipCostPreTax: number;

  /* ── Tax benefit ── */
  marginalTaxRate: number;
  marginalTaxRatePct: number;
  /** Total estimated federal tax savings over the holding period */
  totalTaxSavings: number;
  /** Average annual tax savings */
  averageAnnualTaxSavings: number;
  /** Year-1 tax savings (highest, since interest is front-loaded) */
  firstYearTaxSavings: number;

  /* ── Buy side (after tax) ── */
  /** totalOwnershipCostPreTax − totalTaxSavings */
  totalOwnershipCostAfterTax: number;
  homeValueAtEnd: number;
  remainingLoanBalance: number;
  sellingCostsAmount: number;
  /** Net proceeds after paying off mortgage and selling costs */
  homeEquityAtEnd: number;

  /* ── Wealth comparison ── */
  /** homeEquityAtEnd − totalOwnershipCostAfterTax */
  buyNetWealth: number;
  /** investmentValueAtEnd − totalRentPaid */
  rentNetWealth: number;
  /** buyNetWealth − rentNetWealth. Positive = buying wins. */
  netBenefit: number;
  buyingWins: boolean;

  yearlyData: RentVsBuyYearData[];
}

export function calculateRentVsBuy(inputs: RentVsBuyInputs): RentVsBuyOutputs {
  const {
    holdingPeriodYears: years,
    homePrice,
    downPayment,
    closingCostPercent,
    interestRate,
    loanTermYears,
    annualPropertyTax,
    annualInsurance,
    maintenancePercent,
    homeAppreciationPercent,
    sellingCostPercent,
    investmentReturnPercent,
    currentMonthlyRent,
    annualRentIncreasePercent,
    filingStatus,
    estimatedTaxableIncome,
  } = inputs;

  const loanAmount = Math.max(0, homePrice - downPayment);
  const closingCostsAmount = Math.round(homePrice * (closingCostPercent / 100) * 100) / 100;
  const monthlyPi = calculateMonthlyPi(loanAmount, interestRate, loanTermYears);

  // Full amortization schedule for balance + interest lookups
  const fullSchedule = buildAmortizationSchedule(loanAmount, interestRate, loanTermYears);

  function remainingBalanceAt(monthIdx: number): number {
    if (fullSchedule.length === 0) return 0;
    const idx = Math.min(monthIdx - 1, fullSchedule.length - 1);
    return idx < 0 ? loanAmount : fullSchedule[idx].balance;
  }

  // Tax setup
  const marginalTaxRate = getMarginalRate(estimatedTaxableIncome, filingStatus);
  const mortgageCap = MORTGAGE_CAP[filingStatus];
  const saltCap = SALT_CAP[filingStatus];
  const deductiblePropertyTax = Math.min(annualPropertyTax, saltCap);
  const balanceRatio = loanAmount > mortgageCap ? mortgageCap / loanAmount : 1;

  // Year-by-year accumulation
  const yearlyData: RentVsBuyYearData[] = [];
  let cumulativeRent = 0;
  let totalPitiPaid = 0;
  let totalMaintenancePaid = 0;
  let totalTaxSavings = 0;

  for (let y = 1; y <= years; y++) {
    // Rent increases each year
    const annualRent =
      currentMonthlyRent * 12 * Math.pow(1 + annualRentIncreasePercent / 100, y - 1);
    cumulativeRent += annualRent;

    // PITI for this year
    const annualPiti = monthlyPi * 12 + annualPropertyTax + annualInsurance;
    totalPitiPaid += annualPiti;

    // Maintenance on appreciated home value
    const homeValueAtYear = homePrice * Math.pow(1 + homeAppreciationPercent / 100, y);
    totalMaintenancePaid += homeValueAtYear * (maintenancePercent / 100);

    // Remaining balance at end of year y
    const remainingBalance = remainingBalanceAt(y * 12);
    const homeEquityGross = Math.max(0, homeValueAtYear - remainingBalance);

    // Tax savings for this year: actual interest from amortization schedule
    const grossInterestY = annualInterestForYear(fullSchedule, y);
    const deductibleInterestY = grossInterestY * balanceRatio;
    const totalDeductible = deductibleInterestY + deductiblePropertyTax;
    const annualTaxSavings = Math.round(totalDeductible * marginalTaxRate * 100) / 100;
    totalTaxSavings += annualTaxSavings;

    yearlyData.push({
      year: y,
      cumulativeRentPaid: Math.round(cumulativeRent * 100) / 100,
      homeEquityGross: Math.round(homeEquityGross * 100) / 100,
      homeValueAtYear: Math.round(homeValueAtYear * 100) / 100,
      remainingBalance: Math.round(remainingBalance * 100) / 100,
      annualTaxSavings,
      cumulativeTaxSavings: Math.round(totalTaxSavings * 100) / 100,
    });
  }

  const totalRentPaid = Math.round(cumulativeRent * 100) / 100;
  const roundedTotalPiti = Math.round(totalPitiPaid * 100) / 100;
  const roundedTotalMaintenance = Math.round(totalMaintenancePaid * 100) / 100;
  const roundedTotalTaxSavings = Math.round(totalTaxSavings * 100) / 100;

  const totalOwnershipCostPreTax = Math.round(
    (roundedTotalPiti + roundedTotalMaintenance + closingCostsAmount) * 100
  ) / 100;
  const totalOwnershipCostAfterTax = Math.round(
    (totalOwnershipCostPreTax - roundedTotalTaxSavings) * 100
  ) / 100;

  // Investment value: down payment compounded for holding period
  const investmentValueAtEnd = Math.round(
    downPayment * Math.pow(1 + investmentReturnPercent / 100, years) * 100
  ) / 100;
  const investmentGains = Math.round((investmentValueAtEnd - downPayment) * 100) / 100;

  // Home value and equity at end
  const homeValueAtEnd = Math.round(
    homePrice * Math.pow(1 + homeAppreciationPercent / 100, years) * 100
  ) / 100;
  const remainingLoanBalance = Math.round(remainingBalanceAt(years * 12) * 100) / 100;
  const sellingCostsAmount = Math.round(homeValueAtEnd * (sellingCostPercent / 100) * 100) / 100;
  const homeEquityAtEnd = Math.round(
    (homeValueAtEnd - remainingLoanBalance - sellingCostsAmount) * 100
  ) / 100;

  const buyNetWealth = Math.round((homeEquityAtEnd - totalOwnershipCostAfterTax) * 100) / 100;
  const rentNetWealth = Math.round((investmentValueAtEnd - totalRentPaid) * 100) / 100;
  const netBenefit = Math.round((buyNetWealth - rentNetWealth) * 100) / 100;

  const firstYearTaxSavings = yearlyData[0]?.annualTaxSavings ?? 0;
  const averageAnnualTaxSavings =
    years > 0 ? Math.round((roundedTotalTaxSavings / years) * 100) / 100 : 0;

  return {
    totalRentPaid,
    investmentValueAtEnd,
    investmentGains,
    loanAmount,
    monthlyPi: Math.round(monthlyPi * 100) / 100,
    closingCostsAmount,
    totalPitiPaid: roundedTotalPiti,
    totalMaintenancePaid: roundedTotalMaintenance,
    totalOwnershipCostPreTax,
    marginalTaxRate,
    marginalTaxRatePct: Math.round(marginalTaxRate * 100 * 10) / 10,
    totalTaxSavings: roundedTotalTaxSavings,
    averageAnnualTaxSavings,
    firstYearTaxSavings,
    totalOwnershipCostAfterTax,
    homeValueAtEnd,
    remainingLoanBalance,
    sellingCostsAmount,
    homeEquityAtEnd,
    buyNetWealth,
    rentNetWealth,
    netBenefit,
    buyingWins: netBenefit > 0,
    yearlyData,
  };
}

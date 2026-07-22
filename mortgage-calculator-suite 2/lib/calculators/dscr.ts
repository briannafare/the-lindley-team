/**
 * DSCR Investment Loan calculator.
 *
 * DSCR (Debt Service Coverage Ratio) measures how well rental income
 * covers the mortgage payment. Lenders use it to qualify investment loans
 * without relying on the borrower's personal income.
 *
 *   DSCR = Gross Monthly Income / Monthly PITIA
 *
 * "PITIA" = Principal + Interest + Taxes + Insurance + Association (HOA)
 *
 * Max loan calculation: solves for the loan balance whose monthly P&I,
 * when combined with fixed monthly T+I+A, yields exactly targetDscr.
 *
 *   maxMonthlyPi = grossIncome / targetDscr − (taxes + insurance + hoa)
 *   maxLoan      = maxMonthlyPi × [(1+r)^n − 1] / [r × (1+r)^n]
 */

import { calculateMonthlyPi } from "./amortization";

export interface DscrInputs {
  expectedMonthlyRent: number;
  otherMonthlyIncome: number;
  /** Loan principal for P&I calculation */
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  /** Minimum DSCR the lender requires. Typical: 1.25 */
  targetDscr: number;
}

export interface DscrOutputs {
  grossMonthlyIncome: number;
  monthlyPi: number;
  monthlyTia: number;
  /** P&I + taxes + insurance + HOA */
  monthlyPitia: number;
  /** grossMonthlyIncome / monthlyPitia */
  dscr: number;
  meetsThreshold: boolean;
  /** Shortfall or surplus at targetDscr in monthly income terms */
  monthlyIncomeGap: number;
  /**
   * Maximum loan amount that keeps DSCR ≥ targetDscr at the given rate and term.
   * 0 when gross income can't cover fixed expenses at targetDscr.
   */
  maxLoanAmount: number;
  /** Monthly P&I payment on maxLoanAmount */
  maxAllowedMonthlyPi: number;
  /** Income needed to qualify the given loanAmount at targetDscr */
  requiredGrossIncome: number;
}

export function calculateDscr(inputs: DscrInputs): DscrOutputs {
  const {
    expectedMonthlyRent,
    otherMonthlyIncome,
    loanAmount,
    interestRate,
    loanTermYears,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHoa,
    targetDscr,
  } = inputs;

  const grossMonthlyIncome = Math.round((expectedMonthlyRent + otherMonthlyIncome) * 100) / 100;

  const monthlyPi = Math.round(calculateMonthlyPi(loanAmount, interestRate, loanTermYears) * 100) / 100;
  const monthlyTia = Math.round((monthlyPropertyTax + monthlyInsurance + monthlyHoa) * 100) / 100;
  const monthlyPitia = Math.round((monthlyPi + monthlyTia) * 100) / 100;

  const dscr = monthlyPitia > 0
    ? Math.round((grossMonthlyIncome / monthlyPitia) * 100) / 100
    : 0;

  const meetsThreshold = dscr >= targetDscr;

  // Income needed to hit targetDscr with the current loan
  const requiredGrossIncome = Math.round(monthlyPitia * targetDscr * 100) / 100;
  const monthlyIncomeGap = Math.round((grossMonthlyIncome - requiredGrossIncome) * 100) / 100;

  // Max loan: solve P&I = grossIncome/targetDscr − TIA
  const maxAllowedMonthlyPi = Math.max(
    0,
    Math.round((grossMonthlyIncome / targetDscr - monthlyTia) * 100) / 100
  );

  let maxLoanAmount = 0;
  if (maxAllowedMonthlyPi > 0 && interestRate > 0 && loanTermYears > 0) {
    const r = interestRate / 100 / 12;
    const n = loanTermYears * 12;
    const factor = Math.pow(1 + r, n);
    maxLoanAmount = Math.round((maxAllowedMonthlyPi * (factor - 1)) / (r * factor) * 100) / 100;
  } else if (maxAllowedMonthlyPi > 0 && interestRate === 0 && loanTermYears > 0) {
    maxLoanAmount = Math.round(maxAllowedMonthlyPi * loanTermYears * 12 * 100) / 100;
  }

  return {
    grossMonthlyIncome,
    monthlyPi,
    monthlyTia,
    monthlyPitia,
    dscr,
    meetsThreshold,
    monthlyIncomeGap,
    maxLoanAmount,
    maxAllowedMonthlyPi,
    requiredGrossIncome,
  };
}

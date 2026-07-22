/**
 * House Hacking & Multi-Unit Affordability calculator.
 *
 * House hacking = buying a 2–4 unit property, living in one unit,
 * and renting the others to offset the mortgage payment.
 *
 * Key concepts:
 *   PITI         = monthly P&I + property tax + insurance + HOA
 *   grossRent    = sum of all rental unit rents
 *   qualifyingRent = grossRent × 0.75  (lender haircut for vacancy/repairs)
 *   effectiveCost = PITI − grossRent   (what owner actually pays out-of-pocket)
 *   housingBenefit = PITI − effectiveCost = grossRent (the offset amount)
 *
 * Down payment minimums by program and unit count:
 *   FHA owner-occupied 2–4 unit: 3.5%
 *   Conventional 2-unit: 15%, 3–4 unit: 25%
 *   VA: 0% (if eligible) for 1–4 unit owner-occupied
 *
 * Lender qualifying: 75% of market rent for multi-unit may be added
 * to borrower income (or subtracted from housing expense) per guidelines.
 */

import { calculateMonthlyPi } from "./amortization";

export interface RentalUnit {
  label: string;
  monthlyRent: number;
}

export interface HouseHackingInputs {
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  /** 2, 3, or 4 */
  numberOfUnits: 2 | 3 | 4;
  /** One entry per rental unit (i.e., numberOfUnits − 1 entries) */
  rentalUnits: RentalUnit[];
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  /** Borrower's gross monthly income for DTI analysis */
  grossMonthlyIncome: number;
  /** Other monthly debt obligations (car, student loan, etc.) */
  otherMonthlyDebts: number;
}

export interface HouseHackingOutputs {
  /* ── Loan basics ── */
  loanAmount: number;
  downPayment: number;
  monthlyPi: number;
  /** P&I + tax + insurance + HOA */
  monthlyPiti: number;

  /* ── Rental income ── */
  grossMonthlyRent: number;
  /** grossMonthlyRent × 0.75 — what lenders typically use */
  qualifyingRentalIncome: number;
  annualRentalIncome: number;

  /* ── Effective housing cost ── */
  /** monthlyPiti − grossMonthlyRent (may be negative = net positive cash flow) */
  effectiveMonthlyCost: number;
  /** Percent of PITI offset by rent */
  rentOffsetPercent: number;
  /** True when grossRent ≥ monthlyPiti */
  rentalCoversFullPayment: boolean;

  /* ── DTI analysis ── */
  grossMonthlyIncome: number;
  /** DTI using full PITI, no rental offset (worst-case / traditional) */
  dtiWithoutRent: number;
  /** DTI using PITI − qualifyingRentalIncome as housing expense */
  dtiWithQualifyingRent: number;
  /** Max purchase price at 43% DTI cap with qualifying rent offset */
  maxAffordablePurchasePrice: number;

  /* ── Program down payment requirements ── */
  minDownPaymentFha: number;   // always 3.5%
  minDownPaymentConventional: number; // 15% for 2-unit, 25% for 3–4
  minDownPaymentVa: number;    // 0%

  /* ── Break-even ── */
  /**
   * Number of rental units that must be occupied (at average rent) to
   * cover the full PITI. May exceed numberOfUnits−1 if rent is too low.
   */
  unitsNeededToBreakEven: number;
  averageUnitRent: number;
}

export function calculateHouseHacking(
  inputs: HouseHackingInputs
): HouseHackingOutputs {
  const {
    purchasePrice,
    downPaymentPercent,
    interestRate,
    loanTermYears,
    numberOfUnits,
    rentalUnits,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHoa,
    grossMonthlyIncome,
    otherMonthlyDebts,
  } = inputs;

  /* ── Loan basics ── */
  const downPayment = Math.round(purchasePrice * (downPaymentPercent / 100) * 100) / 100;
  const loanAmount = Math.max(0, purchasePrice - downPayment);
  const monthlyPi = Math.round(calculateMonthlyPi(loanAmount, interestRate, loanTermYears) * 100) / 100;
  const monthlyPiti = Math.round((monthlyPi + monthlyPropertyTax + monthlyInsurance + monthlyHoa) * 100) / 100;

  /* ── Rental income ── */
  const grossMonthlyRent = Math.round(
    rentalUnits.reduce((sum, u) => sum + u.monthlyRent, 0) * 100
  ) / 100;
  const qualifyingRentalIncome = Math.round(grossMonthlyRent * 0.75 * 100) / 100;
  const annualRentalIncome = Math.round(grossMonthlyRent * 12 * 100) / 100;

  /* ── Effective housing cost ── */
  const effectiveMonthlyCost = Math.round((monthlyPiti - grossMonthlyRent) * 100) / 100;
  const rentOffsetPercent =
    monthlyPiti > 0 ? Math.round((grossMonthlyRent / monthlyPiti) * 10000) / 100 : 0;
  const rentalCoversFullPayment = grossMonthlyRent >= monthlyPiti;

  /* ── DTI analysis ── */
  const housingExpenseWithRentOffset = Math.max(0, monthlyPiti - qualifyingRentalIncome);
  const dtiWithoutRent =
    grossMonthlyIncome > 0
      ? Math.round(((monthlyPiti + otherMonthlyDebts) / grossMonthlyIncome) * 100 * 100) / 100
      : 0;
  const dtiWithQualifyingRent =
    grossMonthlyIncome > 0
      ? Math.round(((housingExpenseWithRentOffset + otherMonthlyDebts) / grossMonthlyIncome) * 100 * 100) / 100
      : 0;

  // Max affordable purchase price at 43% back-end DTI with qualifying rent.
  // maxHousingExpense = 0.43 × grossMonthlyIncome − otherDebts
  // effectiveMonthlyPiti = monthlyPiti − qualifyingRentalIncome(newLoan)
  // qualifyingRentalIncome scales with grossMonthlyRent which is fixed,
  // so we solve: (P&I + tax + ins + hoa − qualifyingRent) + otherDebts ≤ 0.43 × GMI
  // maxPiti = 0.43 × GMI − otherDebts + qualifyingRent
  // We back-solve for the loan amount that produces that P&I.
  const maxPiti = Math.max(0, 0.45 * grossMonthlyIncome - otherMonthlyDebts + qualifyingRentalIncome);
  const maxPi = Math.max(0, maxPiti - monthlyPropertyTax - monthlyInsurance - monthlyHoa);
  let maxLoanForAffordability = 0;
  if (maxPi > 0 && interestRate > 0 && loanTermYears > 0) {
    const r = interestRate / 100 / 12;
    const n = loanTermYears * 12;
    const factor = Math.pow(1 + r, n);
    maxLoanForAffordability = Math.round((maxPi * (factor - 1)) / (r * factor) * 100) / 100;
  }
  // Add down payment back to get purchase price
  const maxAffordablePurchasePrice =
    downPaymentPercent > 0 && downPaymentPercent < 100
      ? Math.round((maxLoanForAffordability / (1 - downPaymentPercent / 100)) * 100) / 100
      : maxLoanForAffordability;

  /* ── Program down payment requirements ── */
  const minDownPaymentFha = Math.round(purchasePrice * 0.035 * 100) / 100;
  const conventionalPct = numberOfUnits === 2 ? 0.15 : 0.25;
  const minDownPaymentConventional = Math.round(purchasePrice * conventionalPct * 100) / 100;
  const minDownPaymentVa = 0;

  /* ── Break-even ── */
  const rentalUnitCount = numberOfUnits - 1;
  const averageUnitRent =
    rentalUnitCount > 0
      ? Math.round((grossMonthlyRent / rentalUnitCount) * 100) / 100
      : 0;
  const unitsNeededToBreakEven =
    averageUnitRent > 0
      ? Math.ceil(monthlyPiti / averageUnitRent)
      : Infinity;

  return {
    loanAmount,
    downPayment,
    monthlyPi,
    monthlyPiti,
    grossMonthlyRent,
    qualifyingRentalIncome,
    annualRentalIncome,
    effectiveMonthlyCost,
    rentOffsetPercent,
    rentalCoversFullPayment,
    grossMonthlyIncome,
    dtiWithoutRent,
    dtiWithQualifyingRent,
    maxAffordablePurchasePrice,
    minDownPaymentFha,
    minDownPaymentConventional,
    minDownPaymentVa,
    unitsNeededToBreakEven,
    averageUnitRent,
  };
}

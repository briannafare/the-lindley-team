/**
 * Buy Now vs Wait comparison engine.
 *
 * Compares two paths over a waiting period of yearsToWait (1–5 years):
 *
 * BUY NOW:
 *   - Purchase at currentHomePrice with currentSavings as down payment
 *   - Lock in currentRate for loanTermYears
 *   - Home appreciates at homePriceInflationPercent/yr during the wait window
 *   - Equity built = appreciatedValue − remainingBalance (at end of wait window)
 *
 * WAIT:
 *   - Continue renting (rent increases annualRentIncreasePercent/yr)
 *   - Save monthlySavingsRate/mo; accumulated savings added to down payment
 *   - Purchase at the future home price with the larger down payment
 *   - Get expectedFutureRate on the new loan
 *
 * Comparison is done at the moment the "wait" buyer finally purchases.
 */

import { calculateMonthlyPi, buildAmortizationSchedule } from "./amortization";

export interface BuyNowVsWaitInputs {
  currentSavings: number;
  monthlySavingsRate: number;
  currentMonthlyRent: number;
  annualRentIncreasePercent: number;
  currentHomePrice: number;
  homePriceInflationPercent: number;
  currentRate: number;
  expectedFutureRate: number;
  loanTermYears: number;
  /** 1–5 years */
  yearsToWait: number;
  closingCostPercent: number;
}

export interface BuyNowVsWaitScenario {
  homePrice: number;
  closingCosts: number;
  downPayment: number;
  downPaymentPct: number;
  loanAmount: number;
  interestRate: number;
  monthlyPi: number;
  /**
   * Buy-now: equity accumulated after yearsToWait years (appreciation + paydown).
   * Buy-later: 0 (just purchased).
   */
  equityBuilt: number;
  /**
   * Buy-now: 0 (no rent paid).
   * Buy-later: total rent paid during the waiting period.
   */
  totalRentPaid: number;
}

export interface BuyNowVsWaitOutputs {
  buyNow: BuyNowVsWaitScenario;
  buyLater: BuyNowVsWaitScenario;

  /** Extra savings accumulated during the wait (monthlySavingsRate × yearsToWait × 12) */
  additionalSavingsAccumulated: number;
  /** buyLater.homePrice − buyNow.homePrice */
  homePriceIncrease: number;
  /** buyLater.monthlyPi − buyNow.monthlyPi. Positive = waiting raises your payment. */
  monthlyPaymentDifference: number;
  /**
   * Net cash cost of waiting = totalRentPaid − additionalSavingsAccumulated.
   * Positive = waiting cost you net cash (rent exceeded what you saved extra).
   */
  netCashCostOfWaiting: number;
  /** Equity the buy-now buyer has built when the waiter finally buys (yearsToWait years in). */
  equityAdvantage: number;
  /**
   * True when buying now appears financially better based on:
   *   equityAdvantage + savings from lower monthly payment > netCashCostOfWaiting
   *
   * This is a simplified heuristic — not a comprehensive financial analysis.
   */
  buyNowBetter: boolean;
}

export function calculateBuyNowVsWait(inputs: BuyNowVsWaitInputs): BuyNowVsWaitOutputs {
  const {
    currentSavings,
    monthlySavingsRate,
    currentMonthlyRent,
    annualRentIncreasePercent,
    currentHomePrice,
    homePriceInflationPercent,
    currentRate,
    expectedFutureRate,
    loanTermYears,
    yearsToWait,
    closingCostPercent,
  } = inputs;

  /* ── Buy Now ── */
  const nowClosingCosts = Math.round(currentHomePrice * (closingCostPercent / 100) * 100) / 100;
  const nowDownPayment = Math.max(0, currentSavings - nowClosingCosts);
  const nowLoanAmount = Math.max(0, currentHomePrice - nowDownPayment);
  const nowDownPct = currentHomePrice > 0 ? (nowDownPayment / currentHomePrice) * 100 : 0;
  const nowMonthlyPi = calculateMonthlyPi(nowLoanAmount, currentRate, loanTermYears);

  // Equity after yearsToWait: home appreciation + principal paydown
  const homeValueAtWaitEnd =
    currentHomePrice * Math.pow(1 + homePriceInflationPercent / 100, yearsToWait);

  const nowSchedule = buildAmortizationSchedule(nowLoanAmount, currentRate, loanTermYears);
  const waitMonths = yearsToWait * 12;
  const nowRemainingBalance =
    nowSchedule.length > 0
      ? (waitMonths <= nowSchedule.length
          ? nowSchedule[waitMonths - 1].balance
          : 0)
      : nowLoanAmount;

  const nowEquityBuilt = Math.round(
    Math.max(0, homeValueAtWaitEnd - nowRemainingBalance) * 100
  ) / 100;

  /* ── Buy Later ── */
  const additionalSavingsAccumulated = Math.round(
    monthlySavingsRate * 12 * yearsToWait * 100
  ) / 100;

  // Total rent paid during wait (rent increases each year)
  let totalRentPaid = 0;
  for (let y = 1; y <= yearsToWait; y++) {
    totalRentPaid +=
      currentMonthlyRent * 12 * Math.pow(1 + annualRentIncreasePercent / 100, y - 1);
  }
  totalRentPaid = Math.round(totalRentPaid * 100) / 100;

  const laterHomePrice = Math.round(homeValueAtWaitEnd * 100) / 100; // same appreciation
  const laterClosingCosts = Math.round(laterHomePrice * (closingCostPercent / 100) * 100) / 100;
  const laterTotalSavings = currentSavings + additionalSavingsAccumulated;
  const laterDownPayment = Math.max(0, laterTotalSavings - laterClosingCosts);
  const laterLoanAmount = Math.max(0, laterHomePrice - laterDownPayment);
  const laterDownPct = laterHomePrice > 0 ? (laterDownPayment / laterHomePrice) * 100 : 0;
  const laterMonthlyPi = calculateMonthlyPi(laterLoanAmount, expectedFutureRate, loanTermYears);

  /* ── Comparison ── */
  const homePriceIncrease = Math.round((laterHomePrice - currentHomePrice) * 100) / 100;
  const monthlyPaymentDifference = Math.round((laterMonthlyPi - nowMonthlyPi) * 100) / 100;
  const netCashCostOfWaiting = Math.round(
    (totalRentPaid - additionalSavingsAccumulated) * 100
  ) / 100;
  const equityAdvantage = nowEquityBuilt;

  // Monthly payment savings over the wait period (if buying now has lower payment)
  const paymentSavingsOverWait =
    monthlyPaymentDifference > 0
      ? Math.round(monthlyPaymentDifference * waitMonths * 100) / 100
      : 0;

  const buyNowBetter =
    equityAdvantage + paymentSavingsOverWait > Math.max(0, netCashCostOfWaiting);

  return {
    buyNow: {
      homePrice: currentHomePrice,
      closingCosts: nowClosingCosts,
      downPayment: Math.round(nowDownPayment * 100) / 100,
      downPaymentPct: Math.round(nowDownPct * 100) / 100,
      loanAmount: Math.round(nowLoanAmount * 100) / 100,
      interestRate: currentRate,
      monthlyPi: Math.round(nowMonthlyPi * 100) / 100,
      equityBuilt: nowEquityBuilt,
      totalRentPaid: 0,
    },
    buyLater: {
      homePrice: laterHomePrice,
      closingCosts: laterClosingCosts,
      downPayment: Math.round(laterDownPayment * 100) / 100,
      downPaymentPct: Math.round(laterDownPct * 100) / 100,
      loanAmount: Math.round(laterLoanAmount * 100) / 100,
      interestRate: expectedFutureRate,
      monthlyPi: Math.round(laterMonthlyPi * 100) / 100,
      equityBuilt: 0,
      totalRentPaid,
    },
    additionalSavingsAccumulated,
    homePriceIncrease,
    monthlyPaymentDifference,
    netCashCostOfWaiting,
    equityAdvantage,
    buyNowBetter,
  };
}

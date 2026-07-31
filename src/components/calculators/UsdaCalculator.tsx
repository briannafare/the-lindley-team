// Ported from the nested mortgage-calculator-suite project. Logic is unchanged;
// only the standalone page chrome (full-screen shell + sticky header) was removed
// so this can embed inside ServicePageLayout's calculator slot.
"use client";

import { useState, useMemo, useCallback } from "react";
import {
  calculateUsdaPayment,
  buildAmortizationSchedule,
  UsdaInputs,
  UsdaOutputs,
} from "@/lib/calculators";
import { formatCurrency, formatCurrencyPrecise, formatDate } from "@/lib/format";
import AmortizationChart from "@/components/calculators/AmortizationChart";

const LOAN_TERMS = [15, 30];

const HOUSEHOLD_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];

/* ── Reusable Input Components ── */

function CurrencyInput({
  label, value, onChange, helper,
}: {
  label: string; value: number; onChange: (v: number) => void; helper?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [displayVal, setDisplayVal] = useState("");
  const formatted = value
    ? Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "";

  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          className="input-field pl-8"
          value={focused ? displayVal : formatted}
          onFocus={() => { setFocused(true); setDisplayVal(value ? String(value) : ""); }}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, "");
            setDisplayVal(raw);
            onChange(Number(raw) || 0);
          }}
        />
      </div>
      {helper && <p className="input-helper">{helper}</p>}
    </div>
  );
}

function PercentInput({
  label, value, onChange, helper, step = 0.125,
}: {
  label: string; value: number; onChange: (v: number) => void; helper?: string; step?: number;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <input
          type="number"
          step={step}
          min={0}
          max={100}
          className="input-field pr-8"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">
          %
        </span>
      </div>
      {helper && <p className="input-helper">{helper}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="section-card">
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  );
}

function ToggleRow({
  label, sublabel, value, onChange,
}: {
  label: string; sublabel?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <label className="input-label mb-0">{label}</label>
        {sublabel && <p className="text-xs text-ink-400 mt-0.5">{sublabel}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ml-4 ${
          value ? "bg-accent" : "bg-surface-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function BreakdownRow({
  label, amount, color,
}: {
  label: string; amount: number; color: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-ink-700">{label}</span>
      </div>
      <span className="text-sm font-semibold text-ink-900 tabular-nums whitespace-nowrap">
        {formatCurrencyPrecise(amount)}
      </span>
    </div>
  );
}

/* ── Donut Chart ── */

function PaymentDonut({
  results, colors,
}: {
  results: UsdaOutputs; colors: Record<string, string>;
}) {
  const total = results.totalMonthlyPayment;
  if (total <= 0) return null;

  const segments = [
    { amount: results.monthlyPrincipalAndInterest, color: colors.pi },
    { amount: results.monthlyAnnualFee, color: colors.annualFee },
    { amount: results.monthlyPropertyTax, color: colors.tax },
    { amount: results.monthlyHomeownersInsurance, color: colors.insurance },
    { amount: results.monthlyHoa, color: colors.hoa },
  ].filter((s) => s.amount > 0);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="relative flex-shrink-0">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {segments.map((seg, i) => {
          const pct = seg.amount / total;
          const dashLength = pct * circumference;
          const dashOffset = -accumulated * circumference;
          accumulated += pct;
          return (
            <circle
              key={i}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              transform="rotate(-90 90 90)"
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-ink-500">Monthly</span>
        <span className="text-lg font-bold text-ink-900 font-display tabular-nums whitespace-nowrap">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

function DonutLegendRow({
  label, amount, total, color,
}: {
  label: string; amount: number; total: number; color: string;
}) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-ink-700 flex-1">{label}</span>
      <span className="text-sm text-ink-500 tabular-nums w-12 text-right whitespace-nowrap">
        {pct.toFixed(0)}%
      </span>
      <span className="text-sm font-medium text-ink-900 tabular-nums w-20 text-right whitespace-nowrap">
        {formatCurrencyPrecise(amount)}
      </span>
    </div>
  );
}

/* ── Main Page ── */

export default function UsdaCalculator() {
  const [homePrice, setHomePrice] = useState(280000);
  const [downPayment, setDownPayment] = useState(0);
  const [loanAmountOverride, setLoanAmountOverride] = useState(0);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [financeGuaranteeFee, setFinanceGuaranteeFee] = useState(true);
  const [householdIncome, setHouseholdIncome] = useState(75000);
  const [householdSize, setHouseholdSize] = useState(2);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(3360);
  const [annualInsurance, setAnnualInsurance] = useState(1200);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  const handleHomePriceChange = useCallback((price: number) => {
    setHomePrice(price);
  }, []);

  const baseLoanAmount =
    loanAmountOverride > 0 ? loanAmountOverride : homePrice - downPayment;

  const downPaymentPercent =
    homePrice > 0 ? (downPayment / homePrice) * 100 : 0;

  const inputs: UsdaInputs = useMemo(
    () => ({
      homePrice,
      downPayment,
      loanAmount: loanAmountOverride,
      interestRate,
      loanTermYears: loanTerm,
      financeGuaranteeFee,
      householdIncome,
      householdSize,
      annualPropertyTax,
      annualHomeownersInsurance: annualInsurance,
      monthlyHoa,
      startDate: new Date(),
    }),
    [
      homePrice, downPayment, loanAmountOverride, interestRate, loanTerm,
      financeGuaranteeFee, householdIncome, householdSize,
      annualPropertyTax, annualInsurance, monthlyHoa,
    ]
  );

  const results = useMemo(() => calculateUsdaPayment(inputs), [inputs]);

  const amortizationData = useMemo(
    () => buildAmortizationSchedule(results.effectiveLoanAmount, interestRate, loanTerm),
    [results.effectiveLoanAmount, interestRate, loanTerm]
  );

  const breakdownColors = {
    pi: "#059669",
    annualFee: "#0891B2",
    tax: "#0EA5E9",
    insurance: "#F59E0B",
    hoa: "#8B5CF6",
  };

  return (
    <div className="not-prose">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="Loan Details">
              <div className="space-y-4">
                <CurrencyInput
                  label="Home Price"
                  value={homePrice}
                  onChange={handleHomePriceChange}
                />

                {/* Down payment — optional, defaults to $0 */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <CurrencyInput
                      label="Down Payment"
                      value={downPayment}
                      onChange={setDownPayment}
                    />
                    <div>
                      <label className="input-label">Down Payment %</label>
                      <div className="relative">
                        <input
                          type="number"
                          step={0.5}
                          min={0}
                          max={100}
                          className="input-field pr-8"
                          value={downPaymentPercent > 0 ? downPaymentPercent.toFixed(1) : ""}
                          placeholder="0"
                          onChange={(e) => {
                            const pct = Number(e.target.value) || 0;
                            setDownPayment(Math.round((pct / 100) * homePrice));
                          }}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="input-helper">
                    USDA loans require no down payment. Leave at $0 or enter an optional amount.
                  </p>
                </div>

                <div>
                  <label className="input-label">Loan Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="input-field pl-8 bg-surface-50"
                      value={
                        loanAmountOverride > 0
                          ? loanAmountOverride.toLocaleString()
                          : baseLoanAmount.toLocaleString()
                      }
                      onChange={(e) =>
                        setLoanAmountOverride(
                          Number(e.target.value.replace(/[^0-9]/g, "")) || 0
                        )
                      }
                    />
                  </div>
                  <p className="input-helper">
                    Auto-calculated from price minus down payment. Edit to override.
                  </p>
                </div>

                <PercentInput
                  label="Interest Rate"
                  value={interestRate}
                  onChange={setInterestRate}
                  step={0.125}
                  helper="Annual rate. Use 0.125% increments."
                />

                {/* Loan Term */}
                <div>
                  <label className="input-label">Loan Term</label>
                  <div className="flex gap-2">
                    {LOAN_TERMS.map((term) => (
                      <button
                        key={term}
                        onClick={() => setLoanTerm(term)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${
                          loanTerm === term
                            ? "bg-ink-900 text-white border-ink-900"
                            : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"
                        }`}
                      >
                        {term} yr
                      </button>
                    ))}
                  </div>
                  <p className="input-helper">USDA guaranteed loans are typically 30 years.</p>
                </div>

                <ToggleRow
                  label="Finance Guarantee Fee"
                  sublabel="Roll the 1.0% upfront fee into the loan balance."
                  value={financeGuaranteeFee}
                  onChange={setFinanceGuaranteeFee}
                />
              </div>
            </Section>

            {/* Household Info — informational only */}
            <Section title="Household Info">
              <div className="space-y-4">
                <CurrencyInput
                  label="Annual Household Income"
                  value={householdIncome}
                  onChange={setHouseholdIncome}
                  helper="Used for eligibility reference only — does not affect your payment estimate."
                />
                <div>
                  <label className="input-label">Household Size</label>
                  <div className="grid grid-cols-8 gap-1.5">
                    {HOUSEHOLD_SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setHouseholdSize(size)}
                        className={`py-2 rounded-lg text-sm font-medium transition-all duration-150 border cursor-pointer ${
                          householdSize === size
                            ? "bg-accent text-white border-accent"
                            : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="input-helper mt-2">
                    USDA income limits vary by area and household size. Check the{" "}
                    <span className="text-accent underline cursor-pointer">
                      USDA eligibility map
                    </span>{" "}
                    to confirm your property and income qualify.
                  </p>
                </div>
              </div>
            </Section>

            <Section title="Property Costs">
              <div className="space-y-4">
                <CurrencyInput
                  label="Annual Property Tax"
                  value={annualPropertyTax}
                  onChange={setAnnualPropertyTax}
                  helper="Check your county assessor's website for exact amounts."
                />
                <CurrencyInput
                  label="Annual Homeowners Insurance"
                  value={annualInsurance}
                  onChange={setAnnualInsurance}
                  helper="Typical range: $1,200–$3,600 per year."
                />
                <CurrencyInput
                  label="Monthly HOA Dues"
                  value={monthlyHoa}
                  onChange={setMonthlyHoa}
                  helper="Leave at $0 if not applicable."
                />
              </div>
            </Section>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Hero Payment */}
            <div className="result-card bg-gradient-to-br from-white to-surface-50 border border-surface-200">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-2">
                Your Estimated Monthly Payment
              </p>
              <p className="font-display text-5xl sm:text-6xl font-bold text-ink-900 tracking-tight leading-none">
                {formatCurrency(results.totalMonthlyPayment)}
              </p>
              <p className="text-sm text-ink-500 mt-2">
                {loanTerm}-year fixed at {interestRate}%
              </p>

              <div className="mt-6 pt-6 border-t border-surface-200">
                <BreakdownRow
                  label="Principal & Interest"
                  amount={results.monthlyPrincipalAndInterest}
                  color={breakdownColors.pi}
                />
                <BreakdownRow
                  label="Annual Fee"
                  amount={results.monthlyAnnualFee}
                  color={breakdownColors.annualFee}
                />
                <BreakdownRow
                  label="Property Tax"
                  amount={results.monthlyPropertyTax}
                  color={breakdownColors.tax}
                />
                <BreakdownRow
                  label="Homeowners Insurance"
                  amount={results.monthlyHomeownersInsurance}
                  color={breakdownColors.insurance}
                />
                {results.monthlyHoa > 0 && (
                  <BreakdownRow
                    label="HOA Dues"
                    amount={results.monthlyHoa}
                    color={breakdownColors.hoa}
                  />
                )}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-surface-200">
                  <span className="text-sm font-semibold text-ink-900">Total</span>
                  <span className="text-base font-bold text-ink-900 tabular-nums whitespace-nowrap">
                    {formatCurrencyPrecise(results.totalMonthlyPayment)}
                  </span>
                </div>
              </div>

              {/* No Down Payment badge */}
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <circle cx="8" cy="8" r="7.5" stroke="#10B981" />
                  <path
                    d="M4.5 8.5L6.5 10.5L11 5.5"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-xs text-emerald-700 font-medium">
                  No Down Payment Required — USDA loans allow 100% financing for eligible buyers.
                </p>
              </div>
            </div>

            {/* Guarantee Fee Summary */}
            <div className="result-card border border-surface-200">
              <h3 className="section-title">USDA Fees</h3>
              <div className="space-y-3">
                {/* Upfront guarantee fee */}
                <div className="flex items-center justify-between rounded-xl bg-surface-50 border border-surface-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-700">Upfront Guarantee Fee</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      1.0% of base loan —{" "}
                      {financeGuaranteeFee ? "financed into loan balance" : "paid at closing"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink-900 tabular-nums whitespace-nowrap">
                      {formatCurrency(results.guaranteeFeeAmount)}
                    </p>
                    {financeGuaranteeFee && (
                      <p className="text-xs text-ink-400 mt-0.5">
                        Loan: {formatCurrency(results.effectiveLoanAmount)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Annual fee */}
                <div className="flex items-center justify-between rounded-xl bg-surface-50 border border-surface-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-700">Annual Fee</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      0.35% of outstanding balance, collected monthly
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink-900 tabular-nums whitespace-nowrap">
                      {formatCurrency(results.monthlyAnnualFee)}/mo
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {formatCurrency(results.monthlyAnnualFee * 12)}/yr
                    </p>
                  </div>
                </div>

                <p className="text-xs text-ink-400 leading-relaxed px-1">
                  The USDA annual fee is reassessed each October on the remaining balance — it
                  decreases slightly each year as your principal pays down. This estimate uses
                  your initial loan balance.
                </p>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Down Payment</p>
                <p className="text-2xl font-bold text-ink-900 font-display tabular-nums whitespace-nowrap">
                  {results.downPaymentPercent > 0
                    ? `${results.downPaymentPercent.toFixed(1)}%`
                    : "$0"}
                </p>
                {results.downPaymentPercent > 0 && (
                  <p className="text-xs text-ink-400 mt-1">{formatCurrency(downPayment)}</p>
                )}
                {results.downPaymentPercent === 0 && (
                  <p className="text-xs text-emerald-600 font-medium mt-1">No down payment</p>
                )}
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-ink-900 font-display tabular-nums whitespace-nowrap">
                  {formatCurrency(results.totalInterestPaid)}
                </p>
                <p className="text-xs text-ink-400 mt-1">over {loanTerm} years</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Payoff Date</p>
                <p className="text-xl font-bold text-ink-900 font-display">
                  {formatDate(results.payoffDate)}
                </p>
                <p className="text-xs text-ink-400 mt-1">{loanTerm * 12} payments</p>
              </div>
            </div>

            {/* Payment Composition Donut */}
            <div className="result-card">
              <h3 className="section-title">Payment Composition</h3>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <PaymentDonut results={results} colors={breakdownColors} />
                <div className="flex-1 space-y-2 w-full">
                  <DonutLegendRow
                    label="Principal & Interest"
                    amount={results.monthlyPrincipalAndInterest}
                    total={results.totalMonthlyPayment}
                    color={breakdownColors.pi}
                  />
                  <DonutLegendRow
                    label="Annual Fee"
                    amount={results.monthlyAnnualFee}
                    total={results.totalMonthlyPayment}
                    color={breakdownColors.annualFee}
                  />
                  <DonutLegendRow
                    label="Property Tax"
                    amount={results.monthlyPropertyTax}
                    total={results.totalMonthlyPayment}
                    color={breakdownColors.tax}
                  />
                  <DonutLegendRow
                    label="Insurance"
                    amount={results.monthlyHomeownersInsurance}
                    total={results.totalMonthlyPayment}
                    color={breakdownColors.insurance}
                  />
                  {results.monthlyHoa > 0 && (
                    <DonutLegendRow
                      label="HOA"
                      amount={results.monthlyHoa}
                      total={results.totalMonthlyPayment}
                      color={breakdownColors.hoa}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Amortization Chart */}
            {amortizationData.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">Amortization Schedule</h3>
                <AmortizationChart data={amortizationData} />
              </div>
            )}

            <p className="text-xs text-ink-400 leading-relaxed px-1">
              This calculator provides estimates for informational purposes only. USDA loans
              are available only for eligible rural and suburban properties, and borrowers must
              meet income limits for their area and household size. Guarantee fee and annual fee
              rates are based on current USDA guidelines and may change. Contact a USDA-approved
              lender to verify eligibility and obtain a personalized quote.
            </p>
          </div>
        </div>
    </div>
  );
}

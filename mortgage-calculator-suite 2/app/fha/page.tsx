"use client";

import { useState, useMemo, useCallback } from "react";
import {
  calculateFhaPayment,
  buildAmortizationSchedule,
  FhaInputs,
  FhaOutputs,
} from "@/lib/calculators";
import { formatCurrency, formatCurrencyPrecise, formatDate } from "@/lib/format";
import AmortizationChart from "@/components/AmortizationChart";

const LOAN_TERMS = [15, 20, 25, 30];

const CREDIT_SCORE_OPTIONS = [
  { label: "760+",    midpoint: 780 },
  { label: "740–759", midpoint: 750 },
  { label: "720–739", midpoint: 730 },
  { label: "700–719", midpoint: 710 },
  { label: "680–699", midpoint: 690 },
  { label: "660–679", midpoint: 670 },
  { label: "640–659", midpoint: 650 },
  { label: "620–639", midpoint: 630 },
  { label: "600–619", midpoint: 610 },
  { label: "580–599", midpoint: 590 },
  { label: "500–579", midpoint: 540 },
];

/* ── Reusable Input Components ── */

function CurrencyInput({
  label, value, onChange, helper,
}: {
  label: string; value: number; onChange: (v: number) => void; helper?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [displayVal, setDisplayVal] = useState("");
  const formatted = value ? Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 }) : "";

  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">$</span>
        <input
          type="text" inputMode="numeric" className="input-field pl-8"
          value={focused ? displayVal : formatted}
          onFocus={() => { setFocused(true); setDisplayVal(value ? String(value) : ""); }}
          onBlur={() => setFocused(false)}
          onChange={(e) => { const raw = e.target.value.replace(/[^0-9.]/g, ""); setDisplayVal(raw); onChange(Number(raw) || 0); }}
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
          type="number" step={step} min={0} max={100}
          className="input-field pr-8"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">%</span>
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

function ToggleRow({ label, sublabel, value, onChange }: {
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
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ml-4 ${value ? "bg-accent" : "bg-surface-300"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function BreakdownRow({ label, amount, color, badge }: {
  label: string; amount: number; color: string; badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-sm text-ink-700">{label}</span>
        {badge}
      </div>
      <span className="text-sm font-semibold text-ink-900 tabular-nums ml-4">{formatCurrencyPrecise(amount)}</span>
    </div>
  );
}

/* ── MIP Duration Badge ── */

function MipDurationBadge({ duration }: { duration: FhaOutputs["mipDuration"] }) {
  const text = duration === "life_of_loan" ? "Life of loan" : "11 years";
  const classes = duration === "life_of_loan"
    ? "bg-amber-50 text-amber-700 border border-amber-200"
    : "bg-sky-50 text-sky-700 border border-sky-200";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${classes}`}>{text}</span>
  );
}

/* ── Donut Chart ── */

function PaymentDonut({ results, colors }: { results: FhaOutputs; colors: Record<string, string> }) {
  const total = results.totalMonthlyPayment;
  if (total <= 0) return null;

  const segments = [
    { amount: results.monthlyPrincipalAndInterest, color: colors.pi },
    { amount: results.monthlyMip, color: colors.mip },
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
            <circle key={i} cx="90" cy="90" r={radius} fill="none" stroke={seg.color}
              strokeWidth="16" strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset} strokeLinecap="butt" transform="rotate(-90 90 90)"
              className="transition-all duration-500" />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-ink-500">Monthly</span>
        <span className="text-lg font-bold text-ink-900 font-display tabular-nums">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

function DonutLegendRow({ label, amount, total, color }: {
  label: string; amount: number; total: number; color: string;
}) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-ink-700 flex-1">{label}</span>
      <span className="text-sm text-ink-500 tabular-nums w-12 text-right">{pct.toFixed(0)}%</span>
      <span className="text-sm font-medium text-ink-900 tabular-nums w-20 text-right">{formatCurrencyPrecise(amount)}</span>
    </div>
  );
}

/* ── Main Page ── */

export default function FhaPage() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(3.5);
  const [downPaymentDollars, setDownPaymentDollars] = useState(12250);
  const [loanAmountOverride, setLoanAmountOverride] = useState(0);
  const [interestRate, setInterestRate] = useState(6.75);
  const [loanTerm, setLoanTerm] = useState(30);
  const [creditScore, setCreditScore] = useState(700);
  const [financeUpfrontMip, setFinanceUpfrontMip] = useState(true);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(4200);
  const [annualInsurance, setAnnualInsurance] = useState(1500);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  const handleDownPaymentPercent = useCallback((pct: number) => {
    setDownPaymentPercent(pct);
    setDownPaymentDollars(Math.round((pct / 100) * homePrice));
  }, [homePrice]);

  const handleDownPaymentDollars = useCallback((dollars: number) => {
    setDownPaymentDollars(dollars);
    setDownPaymentPercent(homePrice > 0 ? Math.round((dollars / homePrice) * 10000) / 100 : 0);
  }, [homePrice]);

  const handleHomePriceChange = useCallback((price: number) => {
    setHomePrice(price);
    setDownPaymentDollars(Math.round((downPaymentPercent / 100) * price));
  }, [downPaymentPercent]);

  const baseLoanAmount = loanAmountOverride > 0
    ? loanAmountOverride
    : homePrice - downPaymentDollars;

  const minDownPct = creditScore < 580 ? 10 : 3.5;
  const belowMinDown = downPaymentPercent < minDownPct;

  const inputs: FhaInputs = useMemo(() => ({
    homePrice,
    downPayment: downPaymentDollars,
    loanAmount: loanAmountOverride,
    interestRate,
    loanTermYears: loanTerm,
    estimatedCreditScore: creditScore,
    financeUpfrontMip,
    annualPropertyTax,
    annualHomeownersInsurance: annualInsurance,
    monthlyHoa,
    startDate: new Date(),
  }), [
    homePrice, downPaymentDollars, loanAmountOverride, interestRate, loanTerm,
    creditScore, financeUpfrontMip, annualPropertyTax, annualInsurance, monthlyHoa,
  ]);

  const results = useMemo(() => calculateFhaPayment(inputs), [inputs]);

  const amortizationData = useMemo(
    () => buildAmortizationSchedule(results.effectiveLoanAmount, interestRate, loanTerm),
    [results.effectiveLoanAmount, interestRate, loanTerm]
  );

  const breakdownColors = {
    pi: "#059669",
    mip: "#6366F1",
    tax: "#0EA5E9",
    insurance: "#F59E0B",
    hoa: "#8B5CF6",
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="border-b border-surface-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ink-900 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 14V6L8 2L14 6V14H10V10H6V14H2Z" fill="white" />
              </svg>
            </div>
            <span className="font-display font-semibold text-ink-900 tracking-tight">FHA Mortgage Calculator</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="Loan Details">
              <div className="space-y-4">
                <CurrencyInput label="Home Price" value={homePrice} onChange={handleHomePriceChange} />

                <div className="grid grid-cols-2 gap-3">
                  <CurrencyInput
                    label="Down Payment"
                    value={downPaymentDollars}
                    onChange={handleDownPaymentDollars}
                    helper={`FHA minimum: ${minDownPct}%`}
                  />
                  <PercentInput
                    label="Down Payment %"
                    value={downPaymentPercent}
                    onChange={handleDownPaymentPercent}
                    step={0.5}
                  />
                </div>

                {belowMinDown && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                      <path d="M8 2L14.5 13.5H1.5L8 2Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
                      <path d="M8 6.5V9.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="8" cy="11.5" r="0.75" fill="#D97706" />
                    </svg>
                    <p className="text-xs text-amber-700">
                      {creditScore < 580
                        ? "FHA requires at least 10% down for credit scores below 580."
                        : "FHA requires at least 3.5% down for credit scores 580 and above."}
                    </p>
                  </div>
                )}

                <div>
                  <label className="input-label">Loan Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">$</span>
                    <input
                      type="text" inputMode="numeric" className="input-field pl-8 bg-surface-50"
                      value={loanAmountOverride > 0 ? loanAmountOverride.toLocaleString() : baseLoanAmount.toLocaleString()}
                      onChange={(e) => setLoanAmountOverride(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                    />
                  </div>
                  <p className="input-helper">Auto-calculated from price minus down payment. Edit to override.</p>
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
                      <button key={term} onClick={() => setLoanTerm(term)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${loanTerm === term ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {term} yr
                      </button>
                    ))}
                  </div>
                </div>

                <ToggleRow
                  label="Finance Upfront MIP"
                  sublabel="Roll the 1.75% upfront MIP into the loan balance."
                  value={financeUpfrontMip}
                  onChange={setFinanceUpfrontMip}
                />
              </div>
            </Section>

            <Section title="Credit Profile">
              <div>
                <label className="input-label">Estimated Credit Score</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {CREDIT_SCORE_OPTIONS.map((opt) => (
                    <button key={opt.midpoint} onClick={() => setCreditScore(opt.midpoint)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium transition-all duration-150 border cursor-pointer ${creditScore === opt.midpoint ? "bg-accent text-white border-accent" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="input-helper mt-2">
                  FHA MIP rates are not credit-score-tiered, but your score determines the minimum down payment (3.5% for 580+, 10% for 500–579).
                </p>
              </div>
            </Section>

            <Section title="Property Costs">
              <div className="space-y-4">
                <CurrencyInput label="Annual Property Tax" value={annualPropertyTax} onChange={setAnnualPropertyTax} helper="Check your county assessor's website for exact amounts." />
                <CurrencyInput label="Annual Homeowners Insurance" value={annualInsurance} onChange={setAnnualInsurance} helper="Typical range: $1,200–$3,600 per year." />
                <CurrencyInput label="Monthly HOA Dues" value={monthlyHoa} onChange={setMonthlyHoa} helper="Leave at $0 if not applicable." />
              </div>
            </Section>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Hero Payment */}
            <div className="result-card bg-gradient-to-br from-white to-surface-50 border border-surface-200">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-2">Your Estimated Monthly Payment</p>
              <p className="font-display text-5xl sm:text-6xl font-bold text-ink-900 tracking-tight leading-none">
                {formatCurrency(results.totalMonthlyPayment)}
              </p>
              <p className="text-sm text-ink-500 mt-2">{loanTerm}-year fixed at {interestRate}%</p>

              <div className="mt-6 pt-6 border-t border-surface-200">
                <BreakdownRow
                  label="Principal & Interest"
                  amount={results.monthlyPrincipalAndInterest}
                  color={breakdownColors.pi}
                />
                <BreakdownRow
                  label="Monthly MIP"
                  amount={results.monthlyMip}
                  color={breakdownColors.mip}
                  badge={<MipDurationBadge duration={results.mipDuration} />}
                />
                <BreakdownRow label="Property Tax" amount={results.monthlyPropertyTax} color={breakdownColors.tax} />
                <BreakdownRow label="Homeowners Insurance" amount={results.monthlyHomeownersInsurance} color={breakdownColors.insurance} />
                {results.monthlyHoa > 0 && (
                  <BreakdownRow label="HOA Dues" amount={results.monthlyHoa} color={breakdownColors.hoa} />
                )}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-surface-200">
                  <span className="text-sm font-semibold text-ink-900">Total</span>
                  <span className="text-base font-bold text-ink-900 tabular-nums">{formatCurrencyPrecise(results.totalMonthlyPayment)}</span>
                </div>
              </div>
            </div>

            {/* Upfront MIP + MIP Details */}
            <div className="result-card border border-surface-200">
              <h3 className="section-title">Mortgage Insurance Premiums</h3>
              <div className="space-y-3">
                {/* Upfront MIP */}
                <div className="flex items-center justify-between rounded-xl bg-surface-50 border border-surface-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-700">Upfront MIP</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      1.75% of base loan — {financeUpfrontMip ? "financed into loan balance" : "paid at closing"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink-900 tabular-nums">{formatCurrency(results.upfrontMipAmount)}</p>
                    {financeUpfrontMip && (
                      <p className="text-xs text-ink-400 mt-0.5">Loan: {formatCurrency(results.effectiveLoanAmount)}</p>
                    )}
                  </div>
                </div>

                {/* Annual MIP */}
                <div className="flex items-center justify-between rounded-xl bg-surface-50 border border-surface-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-700">Annual MIP</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {results.annualMipRate.toFixed(2)}% per year, paid monthly
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink-900 tabular-nums">{formatCurrency(results.monthlyMip)}/mo</p>
                    <p className="text-xs mt-0.5">
                      <MipDurationBadge duration={results.mipDuration} />
                    </p>
                  </div>
                </div>

                {results.mipDuration === "life_of_loan" && (
                  <p className="text-xs text-ink-400 leading-relaxed px-1">
                    With less than 10% down, FHA MIP lasts for the life of the loan. Putting 10% or more down reduces MIP to 11 years.
                  </p>
                )}
                {results.mipDuration === 11 && (
                  <p className="text-xs text-ink-400 leading-relaxed px-1">
                    With 10% or more down, FHA MIP cancels after 11 years.
                  </p>
                )}
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">LTV</p>
                <p className="text-2xl font-bold text-ink-900 font-display tabular-nums">
                  {(results.ltv * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-ink-400 mt-1">{formatCurrency(results.baseLoanAmount)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-ink-900 font-display tabular-nums">{formatCurrency(results.totalInterestPaid)}</p>
                <p className="text-xs text-ink-400 mt-1">over {loanTerm} years</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Payoff Date</p>
                <p className="text-xl font-bold text-ink-900 font-display">{formatDate(results.payoffDate)}</p>
                <p className="text-xs text-ink-400 mt-1">{loanTerm * 12} payments</p>
              </div>
            </div>

            {/* Total Cost Comparison */}
            <div className="result-card border border-surface-200">
              <h3 className="section-title">Total Cost Over Time</h3>
              <p className="text-xs text-ink-400 mb-4">Includes all PITI payments and MIP — principal is not spent, it builds equity.</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">5 Years</p>
                  <p className="text-xl font-bold text-ink-900 font-display tabular-nums">{formatCurrency(results.totalCost5yr)}</p>
                </div>
                <div className="bg-surface-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">10 Years</p>
                  <p className="text-xl font-bold text-ink-900 font-display tabular-nums">{formatCurrency(results.totalCost10yr)}</p>
                </div>
                <div className="bg-surface-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">{loanTerm} Years</p>
                  <p className="text-xl font-bold text-ink-900 font-display tabular-nums">{formatCurrency(results.totalCostFullTerm)}</p>
                </div>
              </div>
            </div>

            {/* Payment Composition Donut */}
            <div className="result-card">
              <h3 className="section-title">Payment Composition</h3>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <PaymentDonut results={results} colors={breakdownColors} />
                <div className="flex-1 space-y-2 w-full">
                  <DonutLegendRow label="Principal & Interest" amount={results.monthlyPrincipalAndInterest} total={results.totalMonthlyPayment} color={breakdownColors.pi} />
                  <DonutLegendRow label="Monthly MIP" amount={results.monthlyMip} total={results.totalMonthlyPayment} color={breakdownColors.mip} />
                  <DonutLegendRow label="Property Tax" amount={results.monthlyPropertyTax} total={results.totalMonthlyPayment} color={breakdownColors.tax} />
                  <DonutLegendRow label="Insurance" amount={results.monthlyHomeownersInsurance} total={results.totalMonthlyPayment} color={breakdownColors.insurance} />
                  {results.monthlyHoa > 0 && (
                    <DonutLegendRow label="HOA" amount={results.monthlyHoa} total={results.totalMonthlyPayment} color={breakdownColors.hoa} />
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
              This calculator provides estimates for informational purposes only. FHA MIP rates are based on current HUD guidelines and may change. Actual rates, payments, and terms may vary based on your lender, loan scenario, and eligibility. FHA loans require the property to be a primary residence. Contact a licensed loan officer for a personalized quote.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

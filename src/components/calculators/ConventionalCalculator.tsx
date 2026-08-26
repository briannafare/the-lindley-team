// Ported from the nested mortgage-calculator-suite project. Logic is unchanged;
// only the standalone page chrome (full-screen shell + sticky header) was removed
// so this can embed inside ServicePageLayout's calculator slot.
"use client";

import { useState, useMemo, useCallback } from "react";
import {
  calculateConventionalPayment,
  buildAmortizationSchedule,
  ConventionalInputs,
  ConventionalOutputs,
} from "@/lib/calculators";
import { formatCurrency, formatCurrencyPrecise, formatPercent, formatDate } from "@/lib/format";
import AmortizationChart from "@/components/calculators/AmortizationChart";

const CREDIT_SCORE_OPTIONS = [
  { label: "780–761", midpoint: 770 },
  { label: "760–741", midpoint: 750 },
  { label: "740–721", midpoint: 730 },
  { label: "720–701", midpoint: 710 },
  { label: "700–681", midpoint: 690 },
  { label: "680–661", midpoint: 670 },
  { label: "660–641", midpoint: 650 },
  { label: "640–621", midpoint: 630 },
  { label: "620–601", midpoint: 610 },
  { label: "600–581", midpoint: 590 },
];

const LOAN_TERMS = [15, 20, 25, 30];

type Occupancy = "primary" | "second_home" | "investment";

function parseCurrencyInput(val: string): number {
  return Number(val.replace(/[^0-9.-]/g, "")) || 0;
}

/* ── Reusable Input Components ── */

function CurrencyInput({
  label, value, onChange, helper, prefix = "$",
}: {
  label: string; value: number; onChange: (v: number) => void; helper?: string; prefix?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [displayVal, setDisplayVal] = useState("");
  const formatted = value ? Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 }) : "";

  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">{prefix}</span>
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
        <input type="number" step={step} min={0} max={100} className="input-field pr-8" value={value || ""} onChange={(e) => onChange(Number(e.target.value) || 0)} />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">%</span>
      </div>
      {helper && <p className="input-helper">{helper}</p>}
    </div>
  );
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`section-card ${className}`}>
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  );
}

function BreakdownRow({ label, amount, color }: { label: string; amount: number; color: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-sm text-ink-700">{label}</span>
      </div>
      <span className="text-sm font-semibold text-ink-900 tabular-nums whitespace-nowrap">{formatCurrencyPrecise(amount)}</span>
    </div>
  );
}

/* ── Donut Chart ── */

function PaymentDonut({ results, colors }: { results: ConventionalOutputs; colors: Record<string, string> }) {
  const total = results.totalMonthlyPayment;
  if (total <= 0) return null;

  const segments = [
    { amount: results.monthlyPrincipalAndInterest, color: colors.pi },
    { amount: results.monthlyMi, color: colors.mi },
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
        <span className="text-lg font-bold text-ink-900 font-display tabular-nums whitespace-nowrap">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

function DonutLegendRow({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-ink-700 flex-1">{label}</span>
      <span className="text-sm text-ink-500 tabular-nums w-12 text-right whitespace-nowrap">{pct.toFixed(0)}%</span>
      <span className="text-sm font-medium text-ink-900 tabular-nums w-20 text-right whitespace-nowrap">{formatCurrencyPrecise(amount)}</span>
    </div>
  );
}

/* ── Main Page ── */

export default function ConventionalCalculator() {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [downPaymentDollars, setDownPaymentDollars] = useState(45000);
  const [loanAmountOverride, setLoanAmountOverride] = useState(0);
  const [interestRate, setInterestRate] = useState(6.875);
  const [loanTerm, setLoanTerm] = useState(30);
  const [isFixed, setIsFixed] = useState(true);
  const [occupancy, setOccupancy] = useState<Occupancy>("primary");
  const [isCashOutRefi, setIsCashOutRefi] = useState(false);
  const [creditScore, setCreditScore] = useState(750);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(5400);
  const [annualInsurance, setAnnualInsurance] = useState(1800);
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

  const effectiveLoanAmount = loanAmountOverride > 0 ? loanAmountOverride : homePrice - downPaymentDollars;

  const inputs: ConventionalInputs = useMemo(() => ({
    homePrice, downPayment: downPaymentDollars, loanAmount: effectiveLoanAmount,
    interestRate, loanTermYears: loanTerm, isFixed, occupancy, isCashOutRefi,
    estimatedCreditScore: creditScore, annualPropertyTax, annualHomeownersInsurance: annualInsurance,
    monthlyHoa, startDate: new Date(),
  }), [homePrice, downPaymentDollars, effectiveLoanAmount, interestRate, loanTerm, isFixed, occupancy, isCashOutRefi, creditScore, annualPropertyTax, annualInsurance, monthlyHoa]);

  const results = useMemo(() => calculateConventionalPayment(inputs), [inputs]);

  const amortizationData = useMemo(
    () => buildAmortizationSchedule(effectiveLoanAmount, interestRate, loanTerm),
    [effectiveLoanAmount, interestRate, loanTerm]
  );

  const breakdownColors = { pi: "#059669", mi: "#6366F1", tax: "#0EA5E9", insurance: "#F59E0B", hoa: "#8B5CF6" };

  return (
    <div className="not-prose">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="Loan Details">
              <div className="space-y-4">
                <CurrencyInput label="Home Price" value={homePrice} onChange={handleHomePriceChange} />
                <div className="grid grid-cols-2 gap-3">
                  <CurrencyInput label="Down Payment" value={downPaymentDollars} onChange={handleDownPaymentDollars} />
                  <PercentInput label="Down Payment %" value={downPaymentPercent} onChange={handleDownPaymentPercent} step={1} />
                </div>
                <div>
                  <label className="input-label">Loan Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">$</span>
                    <input type="text" inputMode="numeric" className="input-field pl-8 bg-surface-50"
                      value={loanAmountOverride > 0 ? loanAmountOverride.toLocaleString() : effectiveLoanAmount.toLocaleString()}
                      onChange={(e) => setLoanAmountOverride(parseCurrencyInput(e.target.value))} />
                  </div>
                  <p className="input-helper">Auto-calculated from price minus down payment. Edit to override.</p>
                </div>
                <PercentInput label="Interest Rate" value={interestRate} onChange={setInterestRate} step={0.125} helper="Annual rate. Use 0.125% increments." />

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

                {/* Loan Type */}
                <div>
                  <label className="input-label">Loan Type</label>
                  <div className="flex gap-2">
                    {([{ label: "Fixed", val: true }, { label: "ARM", val: false }] as const).map((opt) => (
                      <button key={opt.label} onClick={() => setIsFixed(opt.val)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${isFixed === opt.val ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occupancy */}
                <div>
                  <label className="input-label">Occupancy</label>
                  <div className="flex gap-2">
                    {([{ label: "Primary", val: "primary" as Occupancy }, { label: "2nd Home", val: "second_home" as Occupancy }, { label: "Investment", val: "investment" as Occupancy }]).map((opt) => (
                      <button key={opt.val} onClick={() => setOccupancy(opt.val)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${occupancy === opt.val ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cash-Out Refi */}
                <div className="flex items-center justify-between py-1">
                  <label className="input-label mb-0">Cash-Out Refinance</label>
                  <button onClick={() => setIsCashOutRefi(!isCashOutRefi)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${isCashOutRefi ? "bg-accent" : "bg-surface-300"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${isCashOutRefi ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            </Section>

            <Section title="Credit Profile">
              <div>
                <label className="input-label">Estimated Credit Score</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {CREDIT_SCORE_OPTIONS.map((opt) => (
                    <button key={opt.midpoint} onClick={() => setCreditScore(opt.midpoint)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium transition-all duration-150 border cursor-pointer ${creditScore === opt.midpoint ? "bg-accent text-white border-accent" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="input-helper mt-2">Your credit score affects mortgage insurance rates. Select the range that best matches your score.</p>
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
              <p className="text-sm text-ink-500 mt-2">{loanTerm}-year {isFixed ? "fixed" : "ARM"} at {interestRate}%</p>

              <div className="mt-6 pt-6 border-t border-surface-200">
                <BreakdownRow label="Principal & Interest" amount={results.monthlyPrincipalAndInterest} color={breakdownColors.pi} />
                {results.monthlyMi > 0 && <BreakdownRow label="Mortgage Insurance" amount={results.monthlyMi} color={breakdownColors.mi} />}
                <BreakdownRow label="Property Tax" amount={results.monthlyPropertyTax} color={breakdownColors.tax} />
                <BreakdownRow label="Homeowners Insurance" amount={results.monthlyHomeownersInsurance} color={breakdownColors.insurance} />
                {results.monthlyHoa > 0 && <BreakdownRow label="HOA Dues" amount={results.monthlyHoa} color={breakdownColors.hoa} />}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-surface-200">
                  <span className="text-sm font-semibold text-ink-900">Total</span>
                  <span className="text-base font-bold text-ink-900 tabular-nums whitespace-nowrap">{formatCurrencyPrecise(results.totalMonthlyPayment)}</span>
                </div>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">LTV</p>
                <p className="text-2xl font-bold text-ink-900 font-display tabular-nums whitespace-nowrap">{formatPercent(results.ltv)}</p>
                {results.ltv > 0.8 && <p className="text-xs text-warning mt-1">MI required</p>}
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-ink-900 font-display tabular-nums whitespace-nowrap">{formatCurrency(results.totalInterestPaid)}</p>
                <p className="text-xs text-ink-400 mt-1">over {loanTerm} years</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Payoff Date</p>
                <p className="text-xl font-bold text-ink-900 font-display">{formatDate(results.payoffDate)}</p>
                <p className="text-xs text-ink-400 mt-1">{loanTerm * 12} payments</p>
              </div>
            </div>

            {/* Payment Composition Donut */}
            <div className="result-card">
              <h3 className="section-title">Payment Composition</h3>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <PaymentDonut results={results} colors={breakdownColors} />
                <div className="flex-1 space-y-2 w-full">
                  <DonutLegendRow label="Principal & Interest" amount={results.monthlyPrincipalAndInterest} total={results.totalMonthlyPayment} color={breakdownColors.pi} />
                  {results.monthlyMi > 0 && <DonutLegendRow label="Mortgage Insurance" amount={results.monthlyMi} total={results.totalMonthlyPayment} color={breakdownColors.mi} />}
                  <DonutLegendRow label="Property Tax" amount={results.monthlyPropertyTax} total={results.totalMonthlyPayment} color={breakdownColors.tax} />
                  <DonutLegendRow label="Insurance" amount={results.monthlyHomeownersInsurance} total={results.totalMonthlyPayment} color={breakdownColors.insurance} />
                  {results.monthlyHoa > 0 && <DonutLegendRow label="HOA" amount={results.monthlyHoa} total={results.totalMonthlyPayment} color={breakdownColors.hoa} />}
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
              This calculator provides estimates for informational purposes only. Actual rates, payments, and terms may vary.
              Mortgage insurance rates are based on Arch MI rate cards and may not reflect your exact scenario.
              Contact a loan officer for a personalized quote.
            </p>
          </div>
        </div>
    </div>
  );
}

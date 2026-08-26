// Ported from the nested mortgage-calculator-suite project. Logic unchanged;
// standalone page chrome removed so it embeds in a page or service layout.
"use client";

import { useState, useMemo, useCallback } from "react";
import {
  calculateVaPayment,
  buildAmortizationSchedule,
  VaInputs,
  VaOutputs,
  VaServiceStatus,
  VaUseCount,
} from "@/lib/calculators";
import { formatCurrency, formatCurrencyPrecise, formatDate } from "@/lib/format";
import AmortizationChart from "@/components/calculators/AmortizationChart";

const LOAN_TERMS = [15, 20, 30];

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

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`section-card ${className}`}>
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  );
}

function ToggleRow({ label, sublabel, value, onChange }: { label: string; sublabel?: string; value: boolean; onChange: (v: boolean) => void }) {
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

function PaymentDonut({ results, colors }: { results: VaOutputs; colors: Record<string, string> }) {
  const total = results.totalMonthlyPayment;
  if (total <= 0) return null;

  const segments = [
    { amount: results.monthlyPrincipalAndInterest, color: colors.pi },
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

export default function VaCalculator() {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(0);
  const [downPaymentDollars, setDownPaymentDollars] = useState(0);
  const [loanAmountOverride, setLoanAmountOverride] = useState(0);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [serviceStatus, setServiceStatus] = useState<VaServiceStatus>("regular");
  const [useCount, setUseCount] = useState<VaUseCount>("first");
  const [isDisabilityExempt, setIsDisabilityExempt] = useState(false);
  const [financeFundingFee, setFinanceFundingFee] = useState(true);
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

  const baseLoanAmount = loanAmountOverride > 0
    ? loanAmountOverride
    : homePrice - downPaymentDollars;

  const inputs: VaInputs = useMemo(() => ({
    homePrice,
    downPayment: downPaymentDollars,
    loanAmount: loanAmountOverride,
    interestRate,
    loanTermYears: loanTerm,
    serviceStatus,
    useCount,
    isDisabilityExempt,
    financeFundingFee,
    annualPropertyTax,
    annualHomeownersInsurance: annualInsurance,
    monthlyHoa,
    startDate: new Date(),
  }), [
    homePrice, downPaymentDollars, loanAmountOverride, interestRate, loanTerm,
    serviceStatus, useCount, isDisabilityExempt, financeFundingFee,
    annualPropertyTax, annualInsurance, monthlyHoa,
  ]);

  const results = useMemo(() => calculateVaPayment(inputs), [inputs]);

  const amortizationData = useMemo(
    () => buildAmortizationSchedule(results.financedLoanAmount, interestRate, loanTerm),
    [results.financedLoanAmount, interestRate, loanTerm]
  );

  const breakdownColors = {
    pi: "#059669",
    tax: "#0EA5E9",
    insurance: "#F59E0B",
    hoa: "#8B5CF6",
    fee: "#10B981",
  };

  return (
    <div className="not-prose">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="Loan Details">
              <div className="space-y-4">
                <CurrencyInput label="Home Price" value={homePrice} onChange={handleHomePriceChange} />
                <div className="grid grid-cols-2 gap-3">
                  <CurrencyInput label="Down Payment" value={downPaymentDollars} onChange={handleDownPaymentDollars} helper="$0 is allowed on VA loans." />
                  <PercentInput label="Down Payment %" value={downPaymentPercent} onChange={handleDownPaymentPercent} step={1} />
                </div>
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
              </div>
            </Section>

            <Section title="VA Eligibility">
              <div className="space-y-4">
                {/* Service Status */}
                <div>
                  <label className="input-label">Service Status</label>
                  <div className="flex gap-2">
                    {([
                      { label: "Active / Veteran", val: "regular" as VaServiceStatus },
                      { label: "Reserves / NG", val: "reserves" as VaServiceStatus },
                    ]).map((opt) => (
                      <button key={opt.val} onClick={() => setServiceStatus(opt.val)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${serviceStatus === opt.val ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Use Count */}
                <div>
                  <label className="input-label">VA Loan Use</label>
                  <div className="flex gap-2">
                    {([
                      { label: "First Use", val: "first" as VaUseCount },
                      { label: "Subsequent Use", val: "subsequent" as VaUseCount },
                    ]).map((opt) => (
                      <button key={opt.val} onClick={() => setUseCount(opt.val)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${useCount === opt.val ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="input-helper mt-2">Select &quot;Subsequent Use&quot; if you have previously used a VA loan.</p>
                </div>

                <ToggleRow
                  label="Disability Exempt"
                  sublabel="Service-connected disability rating waives the funding fee."
                  value={isDisabilityExempt}
                  onChange={setIsDisabilityExempt}
                />

                {!isDisabilityExempt && (
                  <div className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink-700">
                        VA Funding Fee: <span className="text-ink-900 font-semibold">{results.fundingFeePercent.toFixed(2)}%</span>
                        <span className="text-ink-500 ml-2">({formatCurrency(results.fundingFeeDollars)})</span>
                      </p>
                      <p className="text-xs text-ink-400 mt-0.5">One-time fee charged by the VA</p>
                    </div>
                  </div>
                )}

                {!isDisabilityExempt && (
                  <ToggleRow
                    label="Finance Funding Fee"
                    sublabel="Roll the fee into the loan balance instead of paying at closing."
                    value={financeFundingFee}
                    onChange={setFinanceFundingFee}
                  />
                )}
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
                <BreakdownRow label="Principal & Interest" amount={results.monthlyPrincipalAndInterest} color={breakdownColors.pi} />
                <BreakdownRow label="Property Tax" amount={results.monthlyPropertyTax} color={breakdownColors.tax} />
                <BreakdownRow label="Homeowners Insurance" amount={results.monthlyHomeownersInsurance} color={breakdownColors.insurance} />
                {results.monthlyHoa > 0 && <BreakdownRow label="HOA Dues" amount={results.monthlyHoa} color={breakdownColors.hoa} />}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-surface-200">
                  <span className="text-sm font-semibold text-ink-900">Total</span>
                  <span className="text-base font-bold text-ink-900 tabular-nums whitespace-nowrap">{formatCurrencyPrecise(results.totalMonthlyPayment)}</span>
                </div>
              </div>

              {/* No-MI benefit callout */}
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <circle cx="8" cy="8" r="7.5" stroke="#10B981" />
                  <path d="M4.5 8.5L6.5 10.5L11 5.5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-xs text-emerald-700 font-medium">No monthly mortgage insurance — a key VA benefit saving you money every month.</p>
              </div>
            </div>

            {/* Funding Fee Summary */}
            {!isDisabilityExempt && (
              <div className="result-card border border-surface-200">
                <h3 className="section-title">Funding Fee Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-surface-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Fee %</p>
                    <p className="text-xl font-bold text-ink-900 font-display tabular-nums whitespace-nowrap">{results.fundingFeePercent.toFixed(2)}%</p>
                  </div>
                  <div className="bg-surface-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Fee Amount</p>
                    <p className="text-xl font-bold text-ink-900 font-display tabular-nums whitespace-nowrap">{formatCurrency(results.fundingFeeDollars)}</p>
                  </div>
                  <div className="bg-surface-50 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                    <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Total Loan</p>
                    <p className="text-xl font-bold text-ink-900 font-display tabular-nums whitespace-nowrap">{formatCurrency(results.financedLoanAmount)}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{financeFundingFee ? "fee financed" : "fee at closing"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Down Payment</p>
                <p className="text-2xl font-bold text-ink-900 font-display tabular-nums whitespace-nowrap">
                  {results.downPaymentPercent.toFixed(1)}%
                </p>
                <p className="text-xs text-ink-400 mt-1">{formatCurrency(downPaymentDollars)}</p>
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
              This calculator provides estimates for informational purposes only. VA funding fee rates are based on current VA guidelines and may change. Actual rates, payments, and fees may vary based on your eligibility, lender, and loan scenario. Veterans with a service-connected disability rating may be exempt from the funding fee. Contact a VA-approved lender for a personalized quote.
            </p>
          </div>
        </div>
    </div>
  );
}

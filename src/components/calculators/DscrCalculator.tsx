// Ported from the nested mortgage-calculator-suite project. Logic is unchanged;
// only the standalone page chrome (full-screen shell + sticky header) was removed
// so this can embed inside ServicePageLayout's calculator slot.
"use client";

import { useState, useMemo } from "react";
import { calculateDscr, DscrInputs } from "@/lib/calculators";
import { formatCurrency, formatCurrencyPrecise } from "@/lib/format";

/* ── Input helpers ── */

function CurrencyInput({
  label, value, onChange, helper,
}: {
  label: string; value: number; onChange: (v: number) => void; helper?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState("");
  const formatted = value ? value.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "";
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">$</span>
        <input
          type="text" inputMode="numeric" className="input-field pl-8"
          value={focused ? raw : formatted}
          onFocus={() => { setFocused(true); setRaw(value ? String(value) : ""); }}
          onBlur={() => setFocused(false)}
          onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ""); setRaw(v); onChange(Number(v) || 0); }}
        />
      </div>
      {helper && <p className="input-helper">{helper}</p>}
    </div>
  );
}

function PercentInput({
  label, value, onChange, helper, step = 0.125, max = 30,
}: {
  label: string; value: number; onChange: (v: number) => void; helper?: string; step?: number; max?: number;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <input type="number" step={step} min={0} max={max} className="input-field pr-8"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)} />
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

/* ── DSCR Gauge ── */

function DscrGauge({ dscr, target }: { dscr: number; target: number }) {
  // Map 0–2× DSCR onto 0–100% of bar
  const maxDisplay = 2.0;
  const pct = Math.min((dscr / maxDisplay) * 100, 100);
  const targetPct = Math.min((target / maxDisplay) * 100, 100);

  const color =
    dscr >= target ? "bg-emerald-400" :
    dscr >= 1.0 ? "bg-amber-400" : "bg-red-400";

  const label =
    dscr >= target ? "Qualifies" :
    dscr >= 1.0 ? "Above break-even, below threshold" : "Below break-even";

  const labelColor =
    dscr >= target ? "text-emerald-700" :
    dscr >= 1.0 ? "text-amber-700" : "text-red-600";

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-ink-400 mb-1">
        <span>0×</span>
        <span>1.0×</span>
        <span className="font-semibold text-ink-600">{target}× target</span>
        <span>2.0×</span>
      </div>
      <div className="relative h-4 rounded-full bg-surface-200 overflow-hidden">
        {/* Filled bar */}
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
        {/* 1.0× break-even marker */}
        <div className="absolute top-0 h-full w-px bg-ink-300" style={{ left: "50%" }} />
        {/* Target marker */}
        <div className="absolute top-0 h-full w-0.5 bg-ink-700" style={{ left: `${targetPct}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${labelColor}`}>
          {dscr.toFixed(2)}× — {label}
        </span>
        <span className="text-xs text-ink-400">{target}× = lender minimum</span>
      </div>
    </div>
  );
}

const TERM_OPTIONS = [15, 20, 25, 30];

/* ── Main Page ── */

export default function DscrCalculator() {
  // Income
  const [monthlyRent, setMonthlyRent] = useState(2800);
  const [otherIncome, setOtherIncome] = useState(0);

  // Loan
  const [loanAmount, setLoanAmount] = useState(280000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(30);

  // PITIA components
  const [monthlyTax, setMonthlyTax] = useState(375);
  const [monthlyInsurance, setMonthlyInsurance] = useState(150);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  // Target
  const [targetDscr, setTargetDscr] = useState(1.25);

  const inputs: DscrInputs = useMemo(() => ({
    expectedMonthlyRent: monthlyRent,
    otherMonthlyIncome: otherIncome,
    loanAmount,
    interestRate,
    loanTermYears: loanTerm,
    monthlyPropertyTax: monthlyTax,
    monthlyInsurance,
    monthlyHoa,
    targetDscr,
  }), [monthlyRent, otherIncome, loanAmount, interestRate, loanTerm, monthlyTax, monthlyInsurance, monthlyHoa, targetDscr]);

  const r = useMemo(() => calculateDscr(inputs), [inputs]);

  const passes = r.meetsThreshold;
  const incomeShort = r.monthlyIncomeGap < 0;

  return (
    <div className="not-prose">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="Rental Income">
              <div className="space-y-4">
                <CurrencyInput label="Expected Monthly Rent" value={monthlyRent} onChange={setMonthlyRent}
                  helper="Market rent or current lease amount." />
                <CurrencyInput label="Other Monthly Income" value={otherIncome} onChange={setOtherIncome}
                  helper="Laundry, parking, storage fees, etc." />
              </div>
            </Section>

            <Section title="Loan Details">
              <div className="space-y-4">
                <CurrencyInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} />
                <PercentInput label="Interest Rate" value={interestRate} onChange={setInterestRate} step={0.125} max={20} />
                <div>
                  <label className="input-label">Loan Term</label>
                  <div className="flex gap-2">
                    {TERM_OPTIONS.map((t) => (
                      <button key={t} onClick={() => setLoanTerm(t)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${loanTerm === t ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Monthly PITIA Components">
              <div className="space-y-4">
                <CurrencyInput label="Property Tax (monthly)" value={monthlyTax} onChange={setMonthlyTax}
                  helper="Annual tax ÷ 12." />
                <CurrencyInput label="Insurance (monthly)" value={monthlyInsurance} onChange={setMonthlyInsurance}
                  helper="Landlord/dwelling policy ÷ 12." />
                <CurrencyInput label="HOA (monthly)" value={monthlyHoa} onChange={setMonthlyHoa}
                  helper="Leave at $0 if no HOA." />
                <div className="rounded-xl bg-surface-50 border border-surface-200 px-4 py-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-500">P&I payment</span>
                    <span className="font-semibold text-ink-900">{formatCurrencyPrecise(r.monthlyPi)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1.5">
                    <span className="text-ink-500">Tax + ins + HOA</span>
                    <span className="font-semibold text-ink-900">{formatCurrencyPrecise(r.monthlyTia)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1.5 pt-1.5 border-t border-surface-200">
                    <span className="text-ink-700 font-medium">Total PITIA</span>
                    <span className="font-bold text-ink-900">{formatCurrencyPrecise(r.monthlyPitia)}</span>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Lender Target">
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <label className="input-label mb-0">Target DSCR</label>
                  <span className="text-sm font-semibold text-ink-900">{targetDscr.toFixed(2)}×</span>
                </div>
                <input
                  type="range" min={1.0} max={1.5} step={0.05}
                  value={targetDscr}
                  onChange={(e) => setTargetDscr(Number(e.target.value))}
                  className="w-full accent-ink-900 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-ink-400">
                  <span>1.00×</span>
                  <span>1.25× (typical)</span>
                  <span>1.50×</span>
                </div>
                <p className="input-helper">Most DSCR lenders require 1.20–1.25×. Some allow 1.0× for strong borrowers.</p>
              </div>
            </Section>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Hero */}
            <div className={`result-card border ${passes ? "border-emerald-200 bg-gradient-to-br from-white to-emerald-50" : r.dscr >= 1.0 ? "border-amber-200 bg-gradient-to-br from-white to-amber-50" : "border-red-200 bg-gradient-to-br from-white to-red-50"}`}>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-1">
                This Scenario&apos;s DSCR
              </p>
              <div className="flex items-end gap-3 mb-2">
                <p className={`font-display text-6xl font-bold tabular-nums leading-none ${passes ? "text-emerald-700" : r.dscr >= 1.0 ? "text-amber-700" : "text-red-600"}`}>
                  {r.dscr.toFixed(2)}
                </p>
                <span className="text-2xl font-semibold text-ink-400 mb-1">×</span>
              </div>
              {passes ? (
                <p className="text-sm text-ink-600">
                  Rental income covers debt service at <strong>{r.dscr.toFixed(2)}×</strong> — above the {targetDscr}× threshold. This loan would likely qualify with most DSCR lenders.
                </p>
              ) : r.dscr >= 1.0 ? (
                <p className="text-sm text-ink-600">
                  Income covers the payment but falls short of the {targetDscr}× lender minimum. You need <strong>{formatCurrency(Math.abs(r.monthlyIncomeGap))}/mo more rent</strong> or a smaller loan to qualify.
                </p>
              ) : (
                <p className="text-sm text-ink-600">
                  Rent doesn&apos;t cover the full PITIA payment. The property would need to generate <strong>{formatCurrency(Math.abs(r.monthlyIncomeGap) + r.grossMonthlyIncome)}/mo</strong> in rent to break even on debt service.
                </p>
              )}
            </div>

            {/* Gauge */}
            <div className="result-card">
              <h3 className="section-title">DSCR Gauge</h3>
              <DscrGauge dscr={r.dscr} target={targetDscr} />
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5">
                  <p className="text-xs text-red-600 font-semibold">Below 1.0×</p>
                  <p className="text-xs text-red-500 mt-0.5">Doesn&apos;t cover payment</p>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
                  <p className="text-xs text-amber-700 font-semibold">1.0–{targetDscr}×</p>
                  <p className="text-xs text-amber-600 mt-0.5">Covers but below min</p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5">
                  <p className="text-xs text-emerald-700 font-semibold">{targetDscr}×+</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Meets lender threshold</p>
                </div>
              </div>
            </div>

            {/* PITIA breakdown */}
            <div className="result-card">
              <h3 className="section-title">DSCR Calculation</h3>
              <div className="divide-y divide-surface-100">
                {[
                  { label: "Expected monthly rent", value: formatCurrencyPrecise(monthlyRent) },
                  ...(otherIncome > 0 ? [{ label: "Other monthly income", value: formatCurrencyPrecise(otherIncome) }] : []),
                  { label: "Gross monthly income", value: formatCurrencyPrecise(r.grossMonthlyIncome), bold: true },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2.5">
                    <span className={`text-sm ${row.bold ? "font-semibold text-ink-900" : "text-ink-600"}`}>{row.label}</span>
                    <span className={`text-sm tabular-nums ${row.bold ? "font-bold text-emerald-700" : "text-ink-900 font-medium"}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="my-3 flex items-center gap-3">
                <div className="flex-1 h-px bg-surface-200" />
                <span className="text-xs text-ink-400 font-medium">÷ PITIA</span>
                <div className="flex-1 h-px bg-surface-200" />
              </div>

              <div className="divide-y divide-surface-100">
                {[
                  { label: "Principal & Interest", value: formatCurrencyPrecise(r.monthlyPi) },
                  { label: "Property tax", value: formatCurrencyPrecise(monthlyTax) },
                  { label: "Insurance", value: formatCurrencyPrecise(monthlyInsurance) },
                  ...(monthlyHoa > 0 ? [{ label: "HOA", value: formatCurrencyPrecise(monthlyHoa) }] : []),
                  { label: "Total PITIA", value: formatCurrencyPrecise(r.monthlyPitia), bold: true },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2.5">
                    <span className={`text-sm ${row.bold ? "font-semibold text-ink-900" : "text-ink-600"}`}>{row.label}</span>
                    <span className={`text-sm tabular-nums ${row.bold ? "font-bold text-ink-900" : "text-ink-900 font-medium"}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-surface-50 border border-surface-200 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink-700">
                  {formatCurrencyPrecise(r.grossMonthlyIncome)} ÷ {formatCurrencyPrecise(r.monthlyPitia)}
                </span>
                <span className={`text-xl font-bold tabular-nums ${passes ? "text-emerald-700" : r.dscr >= 1 ? "text-amber-700" : "text-red-600"}`}>
                  = {r.dscr.toFixed(2)}×
                </span>
              </div>
            </div>

            {/* Qualification gap / surplus */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`result-card border ${incomeShort ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${incomeShort ? "text-red-600" : "text-emerald-700"}`}>
                  {incomeShort ? "Monthly Income Shortfall" : "Monthly Income Surplus"}
                </p>
                <p className={`font-display text-3xl font-bold tabular-nums ${incomeShort ? "text-red-700" : "text-emerald-700"}`}>
                  {incomeShort ? "-" : "+"}{formatCurrency(Math.abs(r.monthlyIncomeGap))}
                </p>
                <p className={`text-xs mt-1 ${incomeShort ? "text-red-600" : "text-emerald-600"}`}>
                  {incomeShort
                    ? `Need ${formatCurrency(r.requiredGrossIncome)}/mo to qualify`
                    : `${formatCurrency(r.requiredGrossIncome)}/mo required`}
                </p>
              </div>

              <div className="result-card border border-surface-200 bg-surface-50">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-ink-500">Required Gross Income</p>
                <p className="font-display text-3xl font-bold tabular-nums text-ink-900">
                  {formatCurrency(r.requiredGrossIncome)}
                </p>
                <p className="text-xs text-ink-400 mt-1">
                  {formatCurrency(r.monthlyPitia)} × {targetDscr}× target
                </p>
              </div>
            </div>

            {/* Max loan */}
            <div className="result-card border border-indigo-200 bg-indigo-50">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1">Max Loan at {targetDscr}× DSCR</p>
              <p className="font-display text-4xl font-bold tabular-nums text-indigo-900 mb-2">
                {r.maxLoanAmount > 0 ? formatCurrency(r.maxLoanAmount) : "—"}
              </p>
              {r.maxLoanAmount > 0 ? (
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-indigo-600">Max allowable P&I</span>
                    <span className="font-semibold text-indigo-900">{formatCurrencyPrecise(r.maxAllowedMonthlyPi)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-600">At {interestRate}% / {loanTerm}-yr</span>
                    <span className="font-semibold text-indigo-900">{formatCurrency(r.maxLoanAmount)} max loan</span>
                  </div>
                  {r.maxLoanAmount < loanAmount && (
                    <div className="mt-2 rounded-lg bg-indigo-100 border border-indigo-200 px-3 py-2">
                      <p className="text-xs text-indigo-800">
                        Your loan amount is <strong>{formatCurrency(loanAmount - r.maxLoanAmount)}</strong> over the max. Reduce the loan or increase the rent to qualify.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-indigo-700">
                  Rental income is too low to support any loan at {targetDscr}× after fixed T+I+A expenses.
                </p>
              )}
            </div>

            {/* Education */}
            <div className="result-card border border-surface-200">
              <h3 className="section-title">What Is DSCR?</h3>
              <p className="text-sm text-ink-600 leading-relaxed mb-3">
                DSCR (Debt Service Coverage Ratio) is how DSCR lenders qualify investment loans — they look at the property&apos;s rental income instead of your personal income or tax returns.
              </p>
              <div className="space-y-2">
                {[
                  { range: "Below 1.0×", desc: "Rent doesn't cover the mortgage payment. Most lenders won't touch it." },
                  { range: "1.0–1.24×", desc: "Break-even or marginal. Some lenders allow it with strong credit and reserves." },
                  { range: "1.25×+", desc: "Standard qualifying threshold. Covers debt service with room to spare." },
                  { range: "1.5×+", desc: "Strong deal. Better rates and terms may be available." },
                ].map((row) => (
                  <div key={row.range} className="flex gap-3 text-sm">
                    <span className="font-semibold text-ink-700 w-20 flex-shrink-0">{row.range}</span>
                    <span className="text-ink-500">{row.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-ink-400 leading-relaxed px-1">
              DSCR qualification thresholds vary by lender and loan program. This calculator uses standard industry definitions. Actual loan approval depends on credit score, reserves, property type, LTV, and lender overlays.
            </p>
          </div>
        </div>
    </div>
  );
}

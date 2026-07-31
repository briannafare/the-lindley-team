// Ported from the nested mortgage-calculator-suite project. Logic unchanged;
// standalone page chrome removed so it embeds in a page or service layout.
"use client";

import { useState, useMemo } from "react";
import {
  calculateTaxDeduction,
  TaxDeductionInputs,
  FilingStatus,
} from "@/lib/calculators";
import { formatCurrency, formatCurrencyPrecise } from "@/lib/format";

/* ── Input components ── */

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
  label, value, onChange, helper,
}: {
  label: string; value: number; onChange: (v: number) => void; helper?: string;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <input type="number" step={0.125} min={0} max={30} className="input-field pr-8"
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

/* ── Toggle ── */

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className="flex items-center gap-3 w-full text-left cursor-pointer group"
    >
      <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? "bg-ink-900" : "bg-surface-300"}`}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </div>
      <span className="text-sm font-medium text-ink-700 group-hover:text-ink-900">{label}</span>
    </button>
  );
}

/* ── Disclaimer Banner ── */

function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-amber-200 bg-amber-50 ${compact ? "px-4 py-3" : "px-5 py-4"} flex gap-3`}>
      <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1.5L1.5 15H16.5L9 1.5Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 7V10" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="12.5" r="0.75" fill="#D97706" />
      </svg>
      <div>
        <p className="text-sm font-semibold text-amber-900">Educational estimate — not tax advice</p>
        {!compact && (
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            This tool estimates potential federal tax benefits for illustrative purposes only. Tax laws are complex and individual circumstances vary widely. Consult a qualified tax professional or CPA before making financial decisions based on this output.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Breakdown Row ── */

function DetailRow({
  label, value, sub, highlight, dimmed,
}: {
  label: string; value: string; sub?: string; highlight?: boolean; dimmed?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className={`text-sm ${dimmed ? "text-ink-400" : "text-ink-700"}`}>{label}</p>
        {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
      </div>
      <span className={`text-sm tabular-nums ${highlight ? "font-bold text-emerald-700 text-base" : dimmed ? "font-medium text-ink-400" : "font-semibold text-ink-900"}`}>
        {value}
      </span>
    </div>
  );
}

/* ── Filing status options ── */

const FILING_OPTIONS: { label: string; sub: string; value: FilingStatus }[] = [
  { label: "Single", sub: "Unmarried", value: "single" },
  { label: "MFJ", sub: "Married Filing Jointly", value: "married_filing_jointly" },
  { label: "MFS", sub: "Married Filing Separately", value: "married_filing_separately" },
  { label: "HOH", sub: "Head of Household", value: "head_of_household" },
];

/* ── Main Page ── */

export default function TaxDeductionCalculator() {
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("married_filing_jointly");
  const [taxableIncome, setTaxableIncome] = useState(120000);
  const [mortgageBalance, setMortgageBalance] = useState(380000);
  const [interestRate, setInterestRate] = useState(6.875);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(6000);
  const [expectsToItemize, setExpectsToItemize] = useState(true);

  const inputs: TaxDeductionInputs = useMemo(() => ({
    filingStatus,
    estimatedTaxableIncome: taxableIncome,
    mortgageBalance,
    interestRate,
    annualPropertyTax,
    expectsToItemize,
  }), [filingStatus, taxableIncome, mortgageBalance, interestRate, annualPropertyTax, expectsToItemize]);

  const r = useMemo(() => calculateTaxDeduction(inputs), [inputs]);

  const annualInterestApprox = r.estimatedAnnualMortgageInterest;

  return (
    <div className="not-prose">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <DisclaimerBanner />

            <Section title="Your Tax Profile">
              <div className="space-y-5">
                {/* Filing status */}
                <div>
                  <label className="input-label">Filing Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FILING_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => setFilingStatus(opt.value)}
                        className={`py-2.5 px-3 rounded-xl text-left text-sm font-medium transition-all duration-200 border cursor-pointer ${filingStatus === opt.value ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        <span className="block font-semibold">{opt.label}</span>
                        <span className={`block text-xs font-normal mt-0.5 ${filingStatus === opt.value ? "text-white/70" : "text-ink-400"}`}>{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <CurrencyInput
                  label="Estimated Annual Taxable Income"
                  value={taxableIncome}
                  onChange={setTaxableIncome}
                  helper="Gross income before deductions. Used to determine your marginal tax bracket."
                />
              </div>
            </Section>

            <Section title="Mortgage &amp; Property">
              <div className="space-y-4">
                <CurrencyInput
                  label="Current Mortgage Balance"
                  value={mortgageBalance}
                  onChange={setMortgageBalance}
                  helper={`Interest deductible on loan balances up to ${filingStatus === "married_filing_separately" ? "$375,000" : "$750,000"}.`}
                />
                <PercentInput
                  label="Interest Rate"
                  value={interestRate}
                  onChange={setInterestRate}
                  helper="Used to estimate your annual mortgage interest paid."
                />
                <CurrencyInput
                  label="Annual Property Tax"
                  value={annualPropertyTax}
                  onChange={setAnnualPropertyTax}
                  helper={`SALT deduction capped at ${filingStatus === "married_filing_separately" ? "$5,000" : "$10,000"} per year.`}
                />
              </div>
            </Section>

            <Section title="Deduction Method">
              <div className="space-y-4">
                <Toggle
                  checked={expectsToItemize}
                  onChange={setExpectsToItemize}
                  label="I expect to itemize deductions"
                />
                <div className={`rounded-xl border px-4 py-3 transition-colors ${expectsToItemize ? "bg-surface-50 border-surface-200" : "bg-amber-50 border-amber-200"}`}>
                  {expectsToItemize ? (
                    <p className="text-xs text-ink-500 leading-relaxed">
                      To benefit from itemizing, your total deductions must exceed the <strong className="text-ink-700">{formatCurrency(r.standardDeduction)}</strong> standard deduction for your filing status.
                    </p>
                  ) : (
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Taking the standard deduction (<strong>{formatCurrency(r.standardDeduction)}</strong>) — no additional benefit from mortgage interest or property tax.
                    </p>
                  )}
                </div>
              </div>
            </Section>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Hero */}
            <div className={`result-card border ${expectsToItemize && r.estimatedAnnualTaxSavings > 0 ? "border-emerald-200 bg-gradient-to-br from-white to-emerald-50" : "border-surface-200 bg-gradient-to-br from-white to-surface-50"}`}>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-1">Estimated Annual Tax Savings</p>
              {expectsToItemize ? (
                <>
                  <p className="font-display text-5xl sm:text-6xl font-bold text-emerald-700 tabular-nums leading-none mb-2">
                    {formatCurrency(r.estimatedAnnualTaxSavings)}
                  </p>
                  <p className="text-sm text-ink-500">
                    About <strong className="text-ink-700">{formatCurrency(r.estimatedMonthlyTaxSavings)}/month</strong> — your effective mortgage cost is lower by this amount.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-5xl sm:text-6xl font-bold text-ink-400 tabular-nums leading-none mb-2">$0</p>
                  <p className="text-sm text-ink-500">
                    No additional tax savings when taking the standard deduction ({formatCurrency(r.standardDeduction)}).
                  </p>
                </>
              )}
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Marginal Tax Rate</p>
                <p className="text-2xl font-bold font-display tabular-nums text-ink-900">{r.marginalTaxRatePct}%</p>
                <p className="text-xs text-ink-400 mt-0.5">2024 federal bracket</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Deductible Interest</p>
                <p className="text-2xl font-bold font-display tabular-nums text-ink-900">{formatCurrency(r.deductibleMortgageInterest)}</p>
                <p className="text-xs text-ink-400 mt-0.5">per year (est.)</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Monthly Discount</p>
                <p className={`text-2xl font-bold font-display tabular-nums ${expectsToItemize && r.estimatedMonthlyTaxSavings > 0 ? "text-emerald-700" : "text-ink-400"}`}>
                  {formatCurrency(r.effectiveMonthlyDiscount)}
                </p>
                <p className="text-xs text-ink-400 mt-0.5">effective savings</p>
              </div>
            </div>

            {/* Full deduction breakdown */}
            <div className="result-card">
              <h3 className="section-title">Deduction Breakdown</h3>
              <div className="divide-y divide-surface-100">
                <DetailRow
                  label="Estimated annual mortgage interest"
                  sub="Balance × rate — first-year approximation"
                  value={formatCurrencyPrecise(annualInterestApprox)}
                />
                {r.mortgageBalanceCapped && (
                  <DetailRow
                    label="Deductible interest (capped)"
                    sub={`Balance above ${formatCurrency(r.mortgageCap)} is not deductible`}
                    value={formatCurrencyPrecise(r.deductibleMortgageInterest)}
                    highlight
                  />
                )}
                <DetailRow
                  label="Annual property tax paid"
                  value={formatCurrencyPrecise(annualPropertyTax)}
                />
                {r.propertyTaxCapped && (
                  <DetailRow
                    label="Deductible property tax (SALT cap)"
                    sub={`Capped at ${formatCurrency(r.saltCap)}/year`}
                    value={formatCurrencyPrecise(r.deductiblePropertyTax)}
                    highlight
                  />
                )}
                <DetailRow
                  label="Total deductible from mortgage"
                  sub="Mortgage interest + property tax"
                  value={formatCurrencyPrecise(r.totalDeductibleFromMortgage)}
                />
                <DetailRow
                  label="Standard deduction (2024)"
                  sub={`For ${FILING_OPTIONS.find(o => o.value === filingStatus)?.sub ?? filingStatus}`}
                  value={formatCurrencyPrecise(r.standardDeduction)}
                  dimmed
                />
                <DetailRow
                  label="Marginal tax rate"
                  value={`${r.marginalTaxRatePct}%`}
                />
                <DetailRow
                  label="Estimated annual tax savings"
                  sub={expectsToItemize ? `${formatCurrency(r.totalDeductibleFromMortgage)} × ${r.marginalTaxRatePct}%` : "Not itemizing"}
                  value={expectsToItemize ? formatCurrencyPrecise(r.estimatedAnnualTaxSavings) : "$0.00"}
                  highlight={expectsToItemize && r.estimatedAnnualTaxSavings > 0}
                />
                <DetailRow
                  label="Estimated monthly tax savings"
                  sub="Annual ÷ 12"
                  value={expectsToItemize ? formatCurrencyPrecise(r.estimatedMonthlyTaxSavings) : "$0.00"}
                  highlight={expectsToItemize && r.estimatedMonthlyTaxSavings > 0}
                />
              </div>
            </div>

            {/* Effective cost card */}
            {expectsToItemize && r.estimatedMonthlyTaxSavings > 0 && (
              <div className="result-card border border-emerald-200 bg-emerald-50">
                <h3 className="section-title text-emerald-900">What This Means for Your Payment</h3>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  If you itemize and your total deductions exceed{" "}
                  <strong>{formatCurrency(r.standardDeduction)}</strong>, the government effectively
                  subsidizes your mortgage interest. Your monthly tax refund (spread over the year) of{" "}
                  <strong>{formatCurrency(r.estimatedMonthlyTaxSavings)}</strong> reduces the true
                  after-tax cost of your mortgage.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white/70 rounded-xl p-4 border border-emerald-100">
                    <p className="text-xs text-emerald-700 uppercase tracking-wider mb-1">Est. annual interest paid</p>
                    <p className="text-xl font-bold tabular-nums text-emerald-900">{formatCurrency(annualInterestApprox)}</p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4 border border-emerald-100">
                    <p className="text-xs text-emerald-700 uppercase tracking-wider mb-1">After-tax interest cost</p>
                    <p className="text-xl font-bold tabular-nums text-emerald-900">
                      {formatCurrency(Math.max(0, annualInterestApprox - r.estimatedAnnualTaxSavings))}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Assumptions */}
            <div className="result-card border border-surface-200">
              <h3 className="section-title">Assumptions &amp; Limitations</h3>
              <ul className="space-y-2">
                {[
                  "Uses 2024 federal income tax brackets and standard deduction amounts.",
                  "Mortgage interest is estimated as balance × rate (first-year, maximum estimate). Actual interest decreases each year as you pay down principal.",
                  "Assumes you have no other itemized deductions (charity, medical, etc.). If you do, your actual savings may be higher.",
                  "SALT deduction is capped at $10,000/year ($5,000 for Married Filing Separately) per current law.",
                  "Mortgage interest is fully deductible on balances up to $750,000 ($375,000 for MFS).",
                  "State income taxes are not modeled. Some states offer additional deductions.",
                  "Does not account for the Alternative Minimum Tax (AMT), which can reduce or eliminate this benefit.",
                ].map((note, i) => (
                  <li key={i} className="flex gap-2 text-xs text-ink-500 leading-relaxed">
                    <span className="text-ink-300 flex-shrink-0 mt-0.5">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <DisclaimerBanner compact />
          </div>
        </div>
    </div>
  );
}

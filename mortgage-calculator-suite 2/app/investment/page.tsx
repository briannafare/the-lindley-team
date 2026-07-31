"use client";

import { useState, useMemo } from "react";
import { calculateInvestmentProperty, InvestmentPropertyInputs } from "@/lib/calculators";
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
  label, value, onChange, helper, step = 0.5, max = 30,
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

/* ── Pro Forma Row ── */

function ProFormaRow({
  label, annual, monthly, indent, bold, accent, negative,
}: {
  label: string; annual: number; monthly?: number;
  indent?: boolean; bold?: boolean; accent?: "green" | "red"; negative?: boolean;
}) {
  const labelClass = indent ? "text-ink-400 pl-4" : bold ? "font-semibold text-ink-900" : "text-ink-600";
  const valueClass = accent === "green" ? "text-emerald-700 font-bold" : accent === "red" ? "text-red-600 font-bold" : bold ? "font-bold text-ink-900" : "text-ink-900 font-medium";
  const display = (v: number) => (negative ? `(${formatCurrency(Math.abs(v))})` : formatCurrency(v));

  return (
    <div className={`grid grid-cols-3 gap-4 py-2.5 ${bold ? "border-t border-surface-200" : ""}`}>
      <span className={`text-sm col-span-1 ${labelClass}`}>{label}</span>
      <span className={`text-sm tabular-nums text-right ${valueClass}`}>{display(annual)}</span>
      <span className={`text-sm tabular-nums text-right ${valueClass}`}>
        {monthly !== undefined ? display(monthly) : ""}
      </span>
    </div>
  );
}

/* ── Metric Card ── */

function MetricCard({
  label, value, sub, accent, size = "normal",
}: {
  label: string; value: string; sub?: string;
  accent?: "green" | "red" | "amber" | "neutral";
  size?: "normal" | "large";
}) {
  const color =
    accent === "green" ? "text-emerald-700" :
    accent === "red" ? "text-red-600" :
    accent === "amber" ? "text-amber-700" :
    "text-ink-900";
  return (
    <div className="result-card text-center">
      <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`font-bold font-display tabular-nums ${color} ${size === "large" ? "text-3xl" : "text-2xl"}`}>{value}</p>
      {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
    </div>
  );
}

const TERM_OPTIONS = [15, 20, 25, 30];

/* ── Main Page ── */

export default function InvestmentPropertyPage() {
  // Purchase & financing
  const [purchasePrice, setPurchasePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(87500); // 25%
  const [interestRate, setInterestRate] = useState(7.25);
  const [loanTerm, setLoanTerm] = useState(30);
  const [closingCostPct, setClosingCostPct] = useState(2.5);

  // Income
  const [grossMonthlyRent, setGrossMonthlyRent] = useState(2800);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState(0);

  // Expense assumptions
  const [vacancyPct, setVacancyPct] = useState(5);
  const [managementPct, setManagementPct] = useState(8);
  const [repairsPct, setRepairsPct] = useState(8);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(4500);
  const [annualInsurance, setAnnualInsurance] = useState(1800);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  // Advanced toggle
  const [showAdvanced, setShowAdvanced] = useState(false);

  const inputs: InvestmentPropertyInputs = useMemo(() => ({
    purchasePrice,
    downPayment,
    interestRate,
    loanTermYears: loanTerm,
    closingCostPercent: closingCostPct,
    grossMonthlyRent,
    otherMonthlyIncome,
    vacancyPercent: vacancyPct,
    propertyManagementPercent: managementPct,
    repairsAndReservesPercent: repairsPct,
    annualPropertyTax,
    annualInsurance,
    monthlyHoa,
  }), [
    purchasePrice, downPayment, interestRate, loanTerm, closingCostPct,
    grossMonthlyRent, otherMonthlyIncome, vacancyPct, managementPct, repairsPct,
    annualPropertyTax, annualInsurance, monthlyHoa,
  ]);

  const r = useMemo(() => calculateInvestmentProperty(inputs), [inputs]);

  const downPct = purchasePrice > 0 ? ((downPayment / purchasePrice) * 100).toFixed(1) : "0";
  const dscrGood = r.dscr >= 1.25;
  const cashFlowGood = r.monthlyCashFlow > 0;
  const capRateGood = r.capRate >= 5;

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
            <span className="font-display font-semibold text-ink-900 tracking-tight">Investment Property Calculator</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="Purchase &amp; Financing">
              <div className="space-y-4">
                <CurrencyInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} />
                <CurrencyInput label="Down Payment" value={downPayment} onChange={setDownPayment}
                  helper={`${downPct}% down · Loan: ${formatCurrency(Math.max(0, purchasePrice - downPayment))}`} />
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
                <PercentInput label="Closing Costs" value={closingCostPct} onChange={setClosingCostPct} step={0.5}
                  helper="Added to down payment for cash-on-cash calculation." />
              </div>
            </Section>

            <Section title="Rental Income">
              <div className="space-y-4">
                <CurrencyInput label="Gross Monthly Rent" value={grossMonthlyRent} onChange={setGrossMonthlyRent}
                  helper="Total rent from all units before any deductions." />
                <CurrencyInput label="Other Monthly Income" value={otherMonthlyIncome} onChange={setOtherMonthlyIncome}
                  helper="Laundry, parking, storage, etc." />
                <div className="rounded-xl bg-surface-50 border border-surface-200 px-4 py-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-500">Potential Gross Income</span>
                    <span className="font-semibold text-ink-900">{formatCurrency(r.pgi)}/yr</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-ink-500">GRM</span>
                    <span className="font-semibold text-ink-900">{r.grm}×</span>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Operating Expenses">
              <div className="space-y-4">
                <PercentInput label="Vacancy Rate" value={vacancyPct} onChange={setVacancyPct}
                  helper="Typical: 5–8%. Applied to gross income." />
                <PercentInput label="Property Management" value={managementPct} onChange={setManagementPct}
                  helper="Typical: 8–10% of EGI. Set to 0 if self-managing." />
                <PercentInput label="Repairs &amp; Reserves" value={repairsPct} onChange={setRepairsPct}
                  helper="Typical: 5–10% of EGI. Covers maintenance and capital reserves." />
                <CurrencyInput label="Annual Property Tax" value={annualPropertyTax} onChange={setAnnualPropertyTax} />
                <CurrencyInput label="Annual Insurance" value={annualInsurance} onChange={setAnnualInsurance}
                  helper="Landlord/dwelling policy. Usually higher than owner-occupied." />
                <CurrencyInput label="Monthly HOA" value={monthlyHoa} onChange={setMonthlyHoa}
                  helper="Leave at $0 if no HOA." />
              </div>
            </Section>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Monthly cash flow hero */}
            <div className={`result-card border ${cashFlowGood ? "border-emerald-200 bg-gradient-to-br from-white to-emerald-50" : "border-red-200 bg-gradient-to-br from-white to-red-50"}`}>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-1">Monthly Cash Flow</p>
              <p className={`font-display text-5xl sm:text-6xl font-bold tabular-nums leading-none mb-2 ${cashFlowGood ? "text-emerald-700" : "text-red-600"}`}>
                {r.monthlyCashFlow >= 0 ? "+" : ""}{formatCurrency(r.monthlyCashFlow)}
              </p>
              <p className="text-sm text-ink-500">
                {cashFlowGood
                  ? `This property generates ${formatCurrency(r.annualCashFlow)}/yr in cash flow after all expenses and debt service.`
                  : `This property is cash flow negative by ${formatCurrency(Math.abs(r.annualCashFlow))}/yr. Consider a higher rent, lower price, or different financing.`}
              </p>
            </div>

            {/* Key metrics — default view */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricCard
                label="Monthly PITI"
                value={formatCurrency(r.monthlyPiti)}
                sub="P&I + tax + ins + HOA"
              />
              <MetricCard
                label="Annual Cash Flow"
                value={formatCurrency(r.annualCashFlow)}
                accent={cashFlowGood ? "green" : "red"}
              />
              <MetricCard
                label="NOI"
                value={formatCurrency(r.noi)}
                sub="Before debt service"
                accent={r.noi > 0 ? "green" : "red"}
              />
              <MetricCard
                label="Cap Rate"
                value={`${r.capRate}%`}
                sub={capRateGood ? "Solid" : "Below 5%"}
                accent={capRateGood ? "green" : "amber"}
              />
            </div>

            {/* Advanced investor toggle */}
            <div className="result-card">
              <div className="flex items-center justify-between">
                <h3 className="section-title mb-0">Investor Metrics</h3>
                <button
                  onClick={() => setShowAdvanced((v) => !v)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${showAdvanced ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-600 border-surface-300 hover:border-ink-400"}`}
                >
                  {showAdvanced ? "Show less" : "Advanced view"}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-surface-50 border border-surface-200 px-4 py-3">
                  <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Cash-on-Cash Return</p>
                  <p className={`text-2xl font-bold font-display tabular-nums ${r.cashOnCashReturn > 0 ? "text-emerald-700" : "text-red-600"}`}>
                    {r.cashOnCashReturn}%
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">{formatCurrency(r.annualCashFlow)} / {formatCurrency(r.totalCashInvested)}</p>
                </div>
                <div className="rounded-xl bg-surface-50 border border-surface-200 px-4 py-3">
                  <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">DSCR</p>
                  <p className={`text-2xl font-bold font-display tabular-nums ${dscrGood ? "text-emerald-700" : r.dscr >= 1.0 ? "text-amber-700" : "text-red-600"}`}>
                    {r.dscr}×
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">{dscrGood ? "Lender minimum met" : r.dscr >= 1.0 ? "Below 1.25 lender min" : "Below break-even"}</p>
                </div>
              </div>

              {showAdvanced && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-surface-50 border border-surface-200 px-4 py-3 text-center">
                    <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">GRM</p>
                    <p className="text-xl font-bold font-display tabular-nums text-ink-900">{r.grm}×</p>
                    <p className="text-xs text-ink-400 mt-0.5">Price / Gross Rent</p>
                  </div>
                  <div className="rounded-xl bg-surface-50 border border-surface-200 px-4 py-3 text-center">
                    <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Expense Ratio</p>
                    <p className="text-xl font-bold font-display tabular-nums text-ink-900">{r.operatingExpenseRatio}%</p>
                    <p className="text-xs text-ink-400 mt-0.5">OpEx / EGI</p>
                  </div>
                  <div className="rounded-xl bg-surface-50 border border-surface-200 px-4 py-3 text-center">
                    <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Cash Invested</p>
                    <p className="text-xl font-bold font-display tabular-nums text-ink-900">{formatCurrency(r.totalCashInvested)}</p>
                    <p className="text-xs text-ink-400 mt-0.5">Down + closing</p>
                  </div>
                </div>
              )}
            </div>

            {/* Annual Pro Forma */}
            <div className="result-card">
              <h3 className="section-title">Annual Pro Forma</h3>
              <div className="divide-y divide-surface-100">
                {/* Header */}
                <div className="grid grid-cols-3 gap-4 pb-2">
                  <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide"></span>
                  <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide text-right">Annual</span>
                  <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide text-right">Monthly</span>
                </div>

                {/* Income */}
                <ProFormaRow label="Potential Gross Income" annual={r.pgi} monthly={r.pgi / 12} />
                <ProFormaRow label="Vacancy loss" annual={-r.vacancyLoss} monthly={-r.vacancyLoss / 12} indent negative />
                <ProFormaRow label="Effective Gross Income" annual={r.egi} monthly={r.egi / 12} bold />

                {/* Operating expenses */}
                <ProFormaRow label="Property management" annual={-r.propertyManagementExpense} monthly={-r.propertyManagementExpense / 12} indent negative />
                <ProFormaRow label="Repairs &amp; reserves" annual={-r.repairsAndReservesExpense} monthly={-r.repairsAndReservesExpense / 12} indent negative />
                <ProFormaRow label="Property tax" annual={-r.annualPropertyTaxExpense} monthly={-r.annualPropertyTaxExpense / 12} indent negative />
                <ProFormaRow label="Insurance" annual={-r.annualInsuranceExpense} monthly={-r.annualInsuranceExpense / 12} indent negative />
                {r.annualHoaExpense > 0 && (
                  <ProFormaRow label="HOA" annual={-r.annualHoaExpense} monthly={-r.annualHoaExpense / 12} indent negative />
                )}
                <ProFormaRow label="Total Operating Expenses" annual={-r.totalOperatingExpenses} monthly={-r.totalOperatingExpenses / 12} bold negative />
                <ProFormaRow
                  label="Net Operating Income (NOI)"
                  annual={r.noi}
                  monthly={r.noi / 12}
                  bold
                  accent={r.noi >= 0 ? "green" : "red"}
                />

                {/* Debt service */}
                <ProFormaRow label="Debt service (P&I)" annual={-r.annualDebtService} monthly={-r.monthlyPi} indent negative />
                <ProFormaRow
                  label="Annual Cash Flow"
                  annual={r.annualCashFlow}
                  monthly={r.monthlyCashFlow}
                  bold
                  accent={r.cashFlowPositive ? "green" : "red"}
                />
              </div>
            </div>

            {/* DSCR context (advanced) */}
            {showAdvanced && (
              <div className={`result-card border ${dscrGood ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dscrGood ? "text-emerald-700" : "text-amber-700"}`}>
                  DSCR — Debt Service Coverage Ratio
                </p>
                <p className={`font-display text-4xl font-bold tabular-nums mb-2 ${dscrGood ? "text-emerald-900" : r.dscr >= 1.0 ? "text-amber-800" : "text-red-700"}`}>
                  {r.dscr}×
                </p>
                <p className={`text-sm leading-relaxed ${dscrGood ? "text-emerald-800" : "text-amber-800"}`}>
                  {r.dscr >= 1.25
                    ? `A DSCR of ${r.dscr}× means NOI covers debt service ${r.dscr}× over. Most DSCR lenders require 1.25× minimum — this property qualifies.`
                    : r.dscr >= 1.0
                    ? `A DSCR of ${r.dscr}× is above break-even but below the 1.25× lender minimum. NOI covers payments but leaves thin margins. Most DSCR lenders will not approve this as-is.`
                    : `A DSCR of ${r.dscr}× means NOI does not cover debt service. This property cannot qualify for DSCR financing in its current configuration.`}
                </p>
              </div>
            )}

            <p className="text-xs text-ink-400 leading-relaxed px-1">
              This calculator provides estimates for informational purposes only. Actual income, expenses, and returns will vary. Consult a real estate professional and tax advisor before making investment decisions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

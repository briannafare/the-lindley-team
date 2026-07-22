"use client";

import { useState, useMemo } from "react";
import {
  calculateRentVsBuy,
  RentVsBuyInputs,
  RentVsBuyYearData,
  FilingStatus,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

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
  label, value, onChange, helper, step = 0.25,
}: {
  label: string; value: number; onChange: (v: number) => void; helper?: string; step?: number;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <input type="number" step={step} min={0} max={30} className="input-field pr-8"
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

/* ── Chart ── */

const currencyFormatter = (v: number) =>
  v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M`
  : v >= 1000 ? `$${(v / 1000).toFixed(0)}k`
  : `$${v}`;

function RentVsBuyChart({ data }: { data: RentVsBuyYearData[] }) {
  const chartData = data.map((d) => ({
    year: `Yr ${d.year}`,
    "Home Equity": d.homeEquityGross,
    "Cumulative Rent": d.cumulativeRentPaid,
    "Tax Savings": d.cumulativeTaxSavings,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="taxGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={currencyFormatter} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={56} />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 13 }}
        />
        <Legend
          iconType="circle" iconSize={8}
          formatter={(v) => <span style={{ fontSize: 12, color: "#64748B" }}>{v}</span>}
        />
        <Area type="monotone" dataKey="Home Equity" stroke="#059669" strokeWidth={2} fill="url(#equityGrad)" dot={false} />
        <Area type="monotone" dataKey="Cumulative Rent" stroke="#F59E0B" strokeWidth={2} fill="url(#rentGrad)" dot={false} />
        <Area type="monotone" dataKey="Tax Savings" stroke="#6366F1" strokeWidth={1.5} fill="url(#taxGrad)" dot={false} strokeDasharray="4 2" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── Scenario card ── */

function ScenarioCard({ label, accent, children }: { label: string; accent: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex-1 rounded-2xl p-5 border ${accent ? "bg-emerald-50 border-emerald-200" : "bg-surface-50 border-surface-200"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${accent ? "text-emerald-700" : "text-ink-500"}`}>{label}</p>
      {children}
    </div>
  );
}

function DetailRow({ label, value, bold, accent, indent }: { label: string; value: string; bold?: boolean; accent?: boolean; indent?: boolean }) {
  return (
    <div className="flex justify-between text-sm py-0.5">
      <span className={`${indent ? "pl-3 text-ink-400" : bold ? "text-ink-700 font-medium" : "text-ink-500"}`}>{label}</span>
      <span className={`font-medium tabular-nums ${accent ? "text-emerald-700 font-bold" : bold ? "text-ink-900 font-bold" : "text-ink-900"}`}>{value}</span>
    </div>
  );
}

/* ── Filing status options ── */

const FILING_OPTIONS: { label: string; value: FilingStatus }[] = [
  { label: "Single", value: "single" },
  { label: "Married (Joint)", value: "married_filing_jointly" },
  { label: "Married (Sep.)", value: "married_filing_separately" },
  { label: "Head of Household", value: "head_of_household" },
];

const TERM_OPTIONS = [15, 20, 25, 30];

/* ── Main Page ── */

export default function RentVsBuyPage() {
  // Rent
  const [monthlyRent, setMonthlyRent] = useState(2200);
  const [rentIncrease, setRentIncrease] = useState(3);

  // Home
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(40000);
  const [interestRate, setInterestRate] = useState(6.875);
  const [loanTerm, setLoanTerm] = useState(30);
  const [closingCostPct, setClosingCostPct] = useState(2.5);

  // Property costs
  const [annualPropertyTax, setAnnualPropertyTax] = useState(5000);
  const [annualInsurance, setAnnualInsurance] = useState(1500);
  const [maintenancePct, setMaintenancePct] = useState(1);

  // Tax
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("married_filing_jointly");
  const [taxableIncome, setTaxableIncome] = useState(120000);

  // Time horizon
  const [holdingYears, setHoldingYears] = useState(7);

  // Assumptions
  const [appreciationPct, setAppreciationPct] = useState(3);
  const [sellingCostPct, setSellingCostPct] = useState(6);
  const [investReturnPct, setInvestReturnPct] = useState(7);
  const [showAssumptions, setShowAssumptions] = useState(false);

  const inputs: RentVsBuyInputs = useMemo(() => ({
    currentMonthlyRent: monthlyRent,
    annualRentIncreasePercent: rentIncrease,
    homePrice,
    downPayment,
    closingCostPercent: closingCostPct,
    interestRate,
    loanTermYears: loanTerm,
    annualPropertyTax,
    annualInsurance,
    maintenancePercent: maintenancePct,
    holdingPeriodYears: holdingYears,
    homeAppreciationPercent: appreciationPct,
    sellingCostPercent: sellingCostPct,
    investmentReturnPercent: investReturnPct,
    filingStatus,
    estimatedTaxableIncome: taxableIncome,
  }), [
    monthlyRent, rentIncrease, homePrice, downPayment, closingCostPct,
    interestRate, loanTerm, annualPropertyTax, annualInsurance, maintenancePct,
    holdingYears, appreciationPct, sellingCostPct, investReturnPct,
    filingStatus, taxableIncome,
  ]);

  const r = useMemo(() => calculateRentVsBuy(inputs), [inputs]);

  const holdingLabel = holdingYears === 1 ? "1 year" : `${holdingYears} years`;
  const monthlyPiti = r.monthlyPi + annualPropertyTax / 12 + annualInsurance / 12;

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
            <span className="font-display font-semibold text-ink-900 tracking-tight">Rent vs Buy Calculator</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="If You Rent">
              <div className="space-y-4">
                <CurrencyInput label="Current Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} />
                <PercentInput label="Annual Rent Increase" value={rentIncrease} onChange={setRentIncrease}
                  helper="Historical average is 2–4% per year." />
              </div>
            </Section>

            <Section title="If You Buy">
              <div className="space-y-4">
                <CurrencyInput label="Home Purchase Price" value={homePrice} onChange={setHomePrice} />
                <CurrencyInput label="Down Payment" value={downPayment} onChange={setDownPayment}
                  helper={homePrice > 0 ? `${((downPayment / homePrice) * 100).toFixed(1)}% — Loan: ${formatCurrency(Math.max(0, homePrice - downPayment))}` : undefined} />
                <PercentInput label="Interest Rate" value={interestRate} onChange={setInterestRate} step={0.125} />
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
                <CurrencyInput label="Annual Property Tax" value={annualPropertyTax} onChange={setAnnualPropertyTax} />
                <CurrencyInput label="Annual Homeowners Insurance" value={annualInsurance} onChange={setAnnualInsurance} />
                <PercentInput label="Annual Maintenance" value={maintenancePct} onChange={setMaintenancePct}
                  helper="Typical range: 0.5–2% of home value per year." />
              </div>
            </Section>

            {/* Tax profile */}
            <Section title="Tax Profile">
              <div className="space-y-4">
                <div>
                  <label className="input-label">Filing Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FILING_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => setFilingStatus(opt.value)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer text-left ${filingStatus === opt.value ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <CurrencyInput
                  label="Estimated Annual Income"
                  value={taxableIncome}
                  onChange={setTaxableIncome}
                  helper={`Used to find your marginal tax bracket (${r.marginalTaxRatePct}% at this income). Tax savings are an estimate — not tax advice.`}
                />
              </div>
            </Section>

            {/* Time horizon */}
            <Section title="How Long Will You Stay?">
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <label className="input-label mb-0">Holding Period</label>
                  <span className="text-sm font-semibold text-ink-900">{holdingLabel}</span>
                </div>
                <input
                  type="range" min={1} max={30} step={1}
                  value={holdingYears}
                  onChange={(e) => setHoldingYears(Number(e.target.value))}
                  className="w-full accent-ink-900 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-ink-400">
                  <span>1 yr</span><span>10 yrs</span><span>20 yrs</span><span>30 yrs</span>
                </div>
              </div>
            </Section>

            {/* Assumptions */}
            <div className="section-card">
              <button onClick={() => setShowAssumptions((v) => !v)}
                className="flex items-center justify-between w-full cursor-pointer">
                <h3 className="section-title mb-0">Assumptions</h3>
                <svg className={`w-4 h-4 text-ink-400 transition-transform ${showAssumptions ? "rotate-180" : ""}`}
                  viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {showAssumptions && (
                <div className="mt-4 space-y-4">
                  <PercentInput label="Home Appreciation Rate" value={appreciationPct} onChange={setAppreciationPct}
                    helper="Historical US average: ~3–4%/yr." />
                  <PercentInput label="Selling Costs" value={sellingCostPct} onChange={setSellingCostPct}
                    helper="Agent commissions + transaction costs. Typically 5–6%." />
                  <PercentInput label="Investment Return (if renting)" value={investReturnPct} onChange={setInvestReturnPct}
                    helper="Annual return on invested down payment. S&P 500 historical avg ~7%." />
                  <PercentInput label="Closing Costs" value={closingCostPct} onChange={setClosingCostPct}
                    helper="Paid at purchase. Typically 2–3% of price." />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Hero */}
            <div className={`result-card border ${r.buyingWins ? "border-emerald-200 bg-gradient-to-br from-white to-emerald-50" : "border-amber-200 bg-gradient-to-br from-white to-amber-50"}`}>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-2">Over {holdingLabel}</p>
              {r.buyingWins ? (
                <>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-700 leading-tight">
                    Buying could leave you with approximately{" "}
                    <span className="text-4xl sm:text-5xl">{formatCurrency(Math.abs(r.netBenefit))}</span>{" "}
                    more in net worth.
                  </p>
                  <p className="text-sm text-ink-500 mt-3">
                    vs. renting and investing your {formatCurrency(downPayment)} down payment at {investReturnPct}%/yr.
                    Includes ~{formatCurrency(r.totalTaxSavings)} in estimated tax savings.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-amber-700 leading-tight">
                    Renting could leave you with approximately{" "}
                    <span className="text-4xl sm:text-5xl">{formatCurrency(Math.abs(r.netBenefit))}</span>{" "}
                    more in net worth.
                  </p>
                  <p className="text-sm text-ink-500 mt-3">
                    Even after ~{formatCurrency(r.totalTaxSavings)} in estimated tax savings for homeowners, renting and investing comes out ahead over {holdingLabel}.
                  </p>
                </>
              )}
            </div>

            {/* Tax benefit callout */}
            <div className="result-card border border-indigo-200 bg-indigo-50">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1">Estimated Tax Benefit of Ownership</p>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-display text-3xl font-bold text-indigo-900 tabular-nums">
                      {formatCurrency(r.totalTaxSavings)}
                    </span>
                    <span className="text-sm text-indigo-700">over {holdingLabel}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-indigo-600">Year 1</p>
                      <p className="text-sm font-bold text-indigo-900 tabular-nums">{formatCurrency(r.firstYearTaxSavings)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-600">Annual avg</p>
                      <p className="text-sm font-bold text-indigo-900 tabular-nums">{formatCurrency(r.averageAnnualTaxSavings)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-600">Marginal rate</p>
                      <p className="text-sm font-bold text-indigo-900">{r.marginalTaxRatePct}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-indigo-700 leading-relaxed border-t border-indigo-200 pt-3">
                Estimated federal deduction on mortgage interest + property tax (SALT capped at {filingStatus === "married_filing_separately" ? "$5,000" : "$10,000"}/yr) at your {r.marginalTaxRatePct}% marginal rate. Year-1 is highest because interest is front-loaded; savings decrease as the loan pays down. This is an educational estimate — not tax advice. Assumes you itemize and total deductions exceed the standard deduction.
              </p>
            </div>

            {/* Chart */}
            <div className="result-card">
              <h3 className="section-title">Home Equity, Rent &amp; Tax Savings Over Time</h3>
              <RentVsBuyChart data={r.yearlyData} />
              <p className="text-xs text-ink-400 mt-3">
                Home equity is gross (before selling costs). Tax Savings (dashed) shows cumulative estimated federal deduction benefit.
              </p>
            </div>

            {/* Side-by-side scenario */}
            <div className="result-card">
              <h3 className="section-title">After {holdingLabel} — Net Wealth Comparison</h3>
              <div className="flex gap-4">
                <ScenarioCard label="Buying" accent={r.buyingWins}>
                  <div className="space-y-1.5">
                    <DetailRow label="Home value" value={formatCurrency(r.homeValueAtEnd)} />
                    <DetailRow label="Remaining loan" value={`−${formatCurrency(r.remainingLoanBalance)}`} indent />
                    <DetailRow label="Selling costs" value={`−${formatCurrency(r.sellingCostsAmount)}`} indent />
                    <DetailRow label="Net equity" value={formatCurrency(r.homeEquityAtEnd)} bold />
                    <div className="border-t border-surface-200 my-1" />
                    <DetailRow label="PITI paid" value={`−${formatCurrency(r.totalPitiPaid)}`} indent />
                    <DetailRow label="Maintenance" value={`−${formatCurrency(r.totalMaintenancePaid)}`} indent />
                    <DetailRow label="Closing costs" value={`−${formatCurrency(r.closingCostsAmount)}`} indent />
                    <DetailRow label="Tax savings" value={`+${formatCurrency(r.totalTaxSavings)}`} accent />
                    <div className="border-t border-surface-200 my-1" />
                    <DetailRow
                      label="Net wealth change"
                      value={`${r.buyNetWealth >= 0 ? "+" : ""}${formatCurrency(r.buyNetWealth)}`}
                      bold accent={r.buyingWins}
                    />
                  </div>
                </ScenarioCard>

                <ScenarioCard label="Renting" accent={!r.buyingWins}>
                  <div className="space-y-1.5">
                    <DetailRow label="Invested down payment" value={formatCurrency(r.investmentValueAtEnd)} />
                    <DetailRow label="Investment gains" value={`+${formatCurrency(r.investmentGains)}`} indent />
                    <DetailRow label="Portfolio value" value={formatCurrency(r.investmentValueAtEnd)} bold />
                    <div className="border-t border-surface-200 my-1" />
                    <DetailRow label="Total rent paid" value={`−${formatCurrency(r.totalRentPaid)}`} indent />
                    <div className="border-t border-surface-200 my-1" />
                    <DetailRow
                      label="Net wealth change"
                      value={`${r.rentNetWealth >= 0 ? "+" : ""}${formatCurrency(r.rentNetWealth)}`}
                      bold accent={!r.buyingWins}
                    />
                  </div>
                </ScenarioCard>
              </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Total Rent Paid</p>
                <p className="text-2xl font-bold font-display tabular-nums text-ink-900">{formatCurrency(r.totalRentPaid)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Home Equity</p>
                <p className="text-2xl font-bold font-display tabular-nums text-emerald-700">{formatCurrency(r.homeEquityAtEnd)}</p>
                <p className="text-xs text-ink-400 mt-0.5">after selling costs</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">PITI vs Rent</p>
                <p className="text-2xl font-bold font-display tabular-nums text-ink-900">{formatCurrency(monthlyPiti)}</p>
                <p className="text-xs text-ink-400 mt-0.5">vs {formatCurrency(monthlyRent)} rent/mo</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex gap-3">
              <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5L1.5 15H16.5L9 1.5Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 7V10" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="12.5" r="0.75" fill="#D97706" />
              </svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong className="text-amber-900">This is a projection, not a prediction.</strong>{" "}
                Home values, investment returns, rent growth, and tax outcomes are uncertain. Tax savings assume itemized deductions exceed the standard deduction — consult a tax professional. Actual results will vary. Speak with a financial advisor before making a rent-vs-buy decision.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

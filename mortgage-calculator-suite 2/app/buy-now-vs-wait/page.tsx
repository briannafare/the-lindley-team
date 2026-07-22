"use client";

import { useState, useMemo } from "react";
import { calculateBuyNowVsWait, BuyNowVsWaitInputs, BuyNowVsWaitScenario } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";

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
  label, value, onChange, helper, step = 0.125,
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

/* ── Scenario Card ── */

function ScenarioCard({
  scenario, label, blurb, accent, badge,
}: {
  scenario: BuyNowVsWaitScenario;
  label: string;
  blurb: string;
  accent: boolean;
  badge?: string;
}) {
  return (
    <div className={`flex-1 rounded-2xl p-5 border transition-all ${accent ? "bg-emerald-50 border-emerald-200 shadow-sm" : "bg-surface-50 border-surface-200"}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-emerald-700" : "text-ink-500"}`}>{label}</p>
        {badge && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0">{badge}</span>
        )}
      </div>

      {/* Monthly payment hero */}
      <p className={`font-display text-4xl font-bold tabular-nums mt-2 ${accent ? "text-emerald-900" : "text-ink-900"}`}>
        {formatCurrency(scenario.monthlyPi)}
        <span className={`text-base font-normal ml-1 ${accent ? "text-emerald-600" : "text-ink-400"}`}>/mo</span>
      </p>

      <p className={`text-xs mt-2 mb-4 leading-relaxed ${accent ? "text-emerald-700" : "text-ink-500"}`}>{blurb}</p>

      {/* Details */}
      <div className="space-y-2 border-t pt-4" style={{ borderColor: accent ? "#A7F3D0" : "#E2E8F0" }}>
        {[
          { label: "Home price", value: formatCurrency(scenario.homePrice) },
          { label: "Down payment", value: `${formatCurrency(scenario.downPayment)} (${scenario.downPaymentPct.toFixed(1)}%)` },
          { label: "Loan amount", value: formatCurrency(scenario.loanAmount) },
          { label: "Rate", value: `${scenario.interestRate}%` },
        ].map((row) => (
          <div key={row.label} className="flex justify-between text-sm">
            <span className={accent ? "text-emerald-600" : "text-ink-500"}>{row.label}</span>
            <span className={`font-medium tabular-nums ${accent ? "text-emerald-900" : "text-ink-900"}`}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Equity / rent */}
      <div className={`mt-4 rounded-xl px-4 py-3 ${accent ? "bg-emerald-100/60" : "bg-surface-100"}`}>
        {scenario.equityBuilt > 0 ? (
          <div className="flex justify-between text-sm">
            <span className={accent ? "text-emerald-700" : "text-ink-500"}>Equity built by then</span>
            <span className={`font-bold tabular-nums ${accent ? "text-emerald-900" : "text-ink-900"}`}>+{formatCurrency(scenario.equityBuilt)}</span>
          </div>
        ) : scenario.totalRentPaid > 0 ? (
          <div className="flex justify-between text-sm">
            <span className={accent ? "text-emerald-700" : "text-ink-500"}>Rent paid while waiting</span>
            <span className={`font-bold tabular-nums text-red-600`}>{formatCurrency(scenario.totalRentPaid)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ── Metric Card ── */

function MetricCard({
  label, value, sub, accent,
}: {
  label: string; value: string; sub?: string; accent?: "green" | "red" | "neutral";
}) {
  const color =
    accent === "green" ? "text-emerald-700" :
    accent === "red" ? "text-red-600" :
    "text-ink-900";
  return (
    <div className="result-card text-center">
      <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold font-display tabular-nums ${color}`}>{value}</p>
      {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
    </div>
  );
}

const TERM_OPTIONS = [15, 20, 25, 30];

/* ── Main Page ── */

export default function BuyNowVsWaitPage() {
  // Current situation
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlySavingsRate, setMonthlySavingsRate] = useState(1500);
  const [currentRent, setCurrentRent] = useState(2000);
  const [rentIncrease, setRentIncrease] = useState(3);

  // Home & mortgage
  const [homePrice, setHomePrice] = useState(400000);
  const [currentRate, setCurrentRate] = useState(7.0);
  const [expectedFutureRate, setExpectedFutureRate] = useState(6.0);
  const [loanTerm, setLoanTerm] = useState(30);

  // Wait settings
  const [yearsToWait, setYearsToWait] = useState(2);
  const [homePriceInflation, setHomePriceInflation] = useState(4);
  const [closingCostPct, setClosingCostPct] = useState(2.5);

  const inputs: BuyNowVsWaitInputs = useMemo(() => ({
    currentSavings,
    monthlySavingsRate,
    currentMonthlyRent: currentRent,
    annualRentIncreasePercent: rentIncrease,
    currentHomePrice: homePrice,
    homePriceInflationPercent: homePriceInflation,
    currentRate,
    expectedFutureRate,
    loanTermYears: loanTerm,
    yearsToWait,
    closingCostPercent: closingCostPct,
  }), [
    currentSavings, monthlySavingsRate, currentRent, rentIncrease,
    homePrice, homePriceInflation, currentRate, expectedFutureRate,
    loanTerm, yearsToWait, closingCostPct,
  ]);

  const r = useMemo(() => calculateBuyNowVsWait(inputs), [inputs]);

  const waitLabel = yearsToWait === 1 ? "1 year" : `${yearsToWait} years`;

  const paymentUp = r.monthlyPaymentDifference > 0;
  const paymentSame = Math.abs(r.monthlyPaymentDifference) < 1;

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
            <span className="font-display font-semibold text-ink-900 tracking-tight">Buy Now vs Wait Calculator</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="Your Situation">
              <div className="space-y-4">
                <CurrencyInput label="Current Savings (Down Payment)" value={currentSavings} onChange={setCurrentSavings}
                  helper="What you have available for a down payment right now." />
                <CurrencyInput label="Monthly Savings Rate" value={monthlySavingsRate} onChange={setMonthlySavingsRate}
                  helper="How much you can save per month while waiting." />
                <CurrencyInput label="Current Monthly Rent" value={currentRent} onChange={setCurrentRent} />
                <PercentInput label="Annual Rent Increase" value={rentIncrease} onChange={setRentIncrease} step={0.5}
                  helper="How much your rent typically increases per year." />
              </div>
            </Section>

            <Section title="Home &amp; Mortgage">
              <div className="space-y-4">
                <CurrencyInput label="Home Price Today" value={homePrice} onChange={setHomePrice} />
                <PercentInput label="Today&apos;s Rate" value={currentRate} onChange={setCurrentRate} step={0.125} />
                <PercentInput label="Expected Future Rate" value={expectedFutureRate} onChange={setExpectedFutureRate} step={0.125}
                  helper="The mortgage rate you expect if you wait." />
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
                  helper="Estimated at closing. Deducted from savings before down payment." />
              </div>
            </Section>

            <Section title="How Long Would You Wait?">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <label className="input-label mb-0">Wait Period</label>
                    <span className="text-sm font-semibold text-ink-900">{waitLabel}</span>
                  </div>
                  <input
                    type="range" min={1} max={5} step={1}
                    value={yearsToWait}
                    onChange={(e) => setYearsToWait(Number(e.target.value))}
                    className="w-full accent-ink-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-ink-400">
                    {[1, 2, 3, 4, 5].map((y) => (
                      <span key={y}>{y} yr{y > 1 ? "s" : ""}</span>
                    ))}
                  </div>
                </div>
                <PercentInput label="Annual Home Price Inflation" value={homePriceInflation} onChange={setHomePriceInflation} step={0.5}
                  helper="How much home prices rise per year while you wait." />
              </div>
            </Section>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Hero */}
            <div className={`result-card border ${r.buyNowBetter ? "border-emerald-200 bg-gradient-to-br from-white to-emerald-50" : "border-amber-200 bg-gradient-to-br from-white to-amber-50"}`}>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-2">
                Based on these assumptions
              </p>
              {r.buyNowBetter ? (
                <>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-700 leading-tight">
                    Buying now looks like the stronger move.
                  </p>
                  <p className="text-sm text-ink-500 mt-3">
                    Locking in today&apos;s price and starting to build equity outweighs the {formatCurrency(r.netCashCostOfWaiting)} net cash cost of waiting {waitLabel}.
                    {paymentUp && ` Waiting would also raise your monthly payment by ${formatCurrency(r.monthlyPaymentDifference)}.`}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-amber-700 leading-tight">
                    Waiting {waitLabel} may be worth considering.
                  </p>
                  <p className="text-sm text-ink-500 mt-3">
                    You&apos;d accumulate {formatCurrency(r.additionalSavingsAccumulated)} more for your down payment.
                    {!paymentSame && ` Your future payment would be ${paymentUp ? "higher" : "lower"} by ${formatCurrency(Math.abs(r.monthlyPaymentDifference))}/mo.`}
                  </p>
                </>
              )}
            </div>

            {/* Side-by-side scenario cards */}
            <div className="flex gap-4">
              <ScenarioCard
                scenario={r.buyNow}
                label="Buy Now"
                accent={r.buyNowBetter}
                badge={r.buyNowBetter ? "Looks better" : undefined}
                blurb={`Lock in ${r.buyNow.interestRate}% today on a ${formatCurrency(r.buyNow.homePrice)} home. Start building equity immediately — you'd have ${formatCurrency(r.buyNow.equityBuilt)} in ${waitLabel}.`}
              />
              <ScenarioCard
                scenario={r.buyLater}
                label={`Wait ${waitLabel}`}
                accent={!r.buyNowBetter}
                badge={!r.buyNowBetter ? "Looks better" : undefined}
                blurb={`After ${waitLabel} the home could cost ${formatCurrency(r.buyLater.homePrice)}. You'd have ${formatCurrency(r.buyLater.downPayment)} to put down — but you'd pay ${formatCurrency(r.buyLater.totalRentPaid)} in rent while waiting.`}
              />
            </div>

            {/* Key comparison metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricCard
                label="Monthly Payment Δ"
                value={paymentSame ? "—" : `${paymentUp ? "+" : "−"}${formatCurrency(Math.abs(r.monthlyPaymentDifference))}`}
                sub={paymentSame ? "identical" : paymentUp ? "more if you wait" : "less if you wait"}
                accent={paymentUp ? "red" : paymentSame ? "neutral" : "green"}
              />
              <MetricCard
                label="Home Price Increase"
                value={formatCurrency(r.homePriceIncrease)}
                sub={`+${homePriceInflation}%/yr × ${waitLabel}`}
                accent="red"
              />
              <MetricCard
                label="Extra Savings Built"
                value={formatCurrency(r.additionalSavingsAccumulated)}
                sub={`${formatCurrency(monthlySavingsRate)}/mo × ${yearsToWait * 12} mo`}
                accent="green"
              />
              <MetricCard
                label="Rent Paid Waiting"
                value={formatCurrency(r.buyLater.totalRentPaid)}
                sub={`${waitLabel} of rent`}
                accent="red"
              />
            </div>

            {/* Detailed comparison table */}
            <div className="result-card">
              <h3 className="section-title">Full Comparison at Decision Point</h3>
              <div className="divide-y divide-surface-100">
                {[
                  {
                    label: "Home price",
                    now: formatCurrency(r.buyNow.homePrice),
                    later: formatCurrency(r.buyLater.homePrice),
                    laterAccent: r.homePriceIncrease > 0 ? "red" : undefined,
                  },
                  {
                    label: "Down payment",
                    now: `${formatCurrency(r.buyNow.downPayment)} (${r.buyNow.downPaymentPct.toFixed(1)}%)`,
                    later: `${formatCurrency(r.buyLater.downPayment)} (${r.buyLater.downPaymentPct.toFixed(1)}%)`,
                    laterAccent: r.buyLater.downPayment > r.buyNow.downPayment ? "green" : undefined,
                  },
                  {
                    label: "Loan amount",
                    now: formatCurrency(r.buyNow.loanAmount),
                    later: formatCurrency(r.buyLater.loanAmount),
                  },
                  {
                    label: "Interest rate",
                    now: `${r.buyNow.interestRate}%`,
                    later: `${r.buyLater.interestRate}%`,
                    laterAccent: r.buyLater.interestRate < r.buyNow.interestRate ? "green" : r.buyLater.interestRate > r.buyNow.interestRate ? "red" : undefined,
                  },
                  {
                    label: "Monthly P&I",
                    now: formatCurrency(r.buyNow.monthlyPi),
                    later: formatCurrency(r.buyLater.monthlyPi),
                    laterAccent: r.monthlyPaymentDifference > 0 ? "red" : r.monthlyPaymentDifference < 0 ? "green" : undefined,
                  },
                  {
                    label: "Equity built by then",
                    now: formatCurrency(r.buyNow.equityBuilt),
                    later: "$0",
                    nowAccent: "green" as const,
                  },
                  {
                    label: "Rent paid while waiting",
                    now: "$0",
                    later: formatCurrency(r.buyLater.totalRentPaid),
                    laterAccent: "red" as const,
                  },
                ].map((row) => (
                  <div key={row.label} className="grid grid-cols-3 gap-4 py-3 items-center">
                    <span className="text-sm text-ink-500">{row.label}</span>
                    <span className={`text-sm font-semibold tabular-nums ${row.nowAccent === "green" ? "text-emerald-700" : "text-ink-900"}`}>
                      {row.now}
                    </span>
                    <span className={`text-sm font-semibold tabular-nums ${row.laterAccent === "green" ? "text-emerald-700" : row.laterAccent === "red" ? "text-red-600" : "text-ink-900"}`}>
                      {row.later}
                    </span>
                  </div>
                ))}
                {/* Header labels */}
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-surface-200 mt-1">
                <span className="text-xs text-ink-400"></span>
                <span className="text-xs font-semibold text-ink-600 uppercase tracking-wide">Buy Now</span>
                <span className="text-xs font-semibold text-ink-600 uppercase tracking-wide">Wait {waitLabel}</span>
              </div>
            </div>

            {/* Net cost of waiting summary */}
            <div className={`result-card border ${r.netCashCostOfWaiting > 0 ? "border-orange-200 bg-orange-50" : "border-emerald-200 bg-emerald-50"}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${r.netCashCostOfWaiting > 0 ? "text-orange-700" : "text-emerald-700"}`}>
                Net Cash Cost of Waiting {waitLabel}
              </p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className={`font-display text-4xl font-bold tabular-nums ${r.netCashCostOfWaiting > 0 ? "text-orange-700" : "text-emerald-700"}`}>
                  {r.netCashCostOfWaiting >= 0 ? formatCurrency(r.netCashCostOfWaiting) : `−${formatCurrency(Math.abs(r.netCashCostOfWaiting))}`}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-500">Rent paid while waiting</span>
                  <span className="font-medium text-red-600">−{formatCurrency(r.buyLater.totalRentPaid)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-500">Extra savings accumulated</span>
                  <span className="font-medium text-emerald-700">+{formatCurrency(r.additionalSavingsAccumulated)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-surface-200 pt-1.5 mt-0.5">
                  <span className="text-ink-700 font-medium">Net cash</span>
                  <span className="font-bold text-ink-900">
                    {r.netCashCostOfWaiting > 0 ? `−${formatCurrency(r.netCashCostOfWaiting)} (cost)` : `+${formatCurrency(Math.abs(r.netCashCostOfWaiting))} (saved)`}
                  </span>
                </div>
              </div>
              <p className={`mt-3 text-xs leading-relaxed border-t pt-3 ${r.netCashCostOfWaiting > 0 ? "border-orange-200 text-orange-700" : "border-emerald-200 text-emerald-700"}`}>
                {r.netCashCostOfWaiting > 0
                  ? `Rent cost more than you saved. Plus, the buy-now buyer already built ${formatCurrency(r.equityAdvantage)} in equity.`
                  : `Your extra savings more than offset rent costs. The question is whether rates and prices move in your favor.`}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex gap-3">
              <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5L1.5 15H16.5L9 1.5Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 7V10" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="12.5" r="0.75" fill="#D97706" />
              </svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong className="text-amber-900">No one can predict future home prices or mortgage rates.</strong>{" "}
                This calculator uses your assumptions to illustrate possible outcomes — actual results will differ. Market conditions, local factors, and personal finances all matter. Talk with a loan officer and financial advisor before making a decision.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

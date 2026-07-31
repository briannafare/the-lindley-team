// Ported from the nested mortgage-calculator-suite project. Logic unchanged;
// standalone page chrome removed so it embeds in a page or service layout.
"use client";

import { useState, useMemo, useEffect } from "react";
import { calculateRefinance, RefinanceInputs, ClosingCostStrategy } from "@/lib/calculators";
import { formatCurrency, formatCurrencyPrecise, formatDate } from "@/lib/format";

const NEW_TERM_OPTIONS = [10, 15, 20, 25, 30];

/* ── Input Components ── */

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
          value={value || ""} onChange={(e) => onChange(Number(e.target.value) || 0)} />
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

/* ── Break-Even Timeline Bar ── */

function BreakEvenTimeline({
  breakEvenMonths, stayMonths,
}: {
  breakEvenMonths: number; stayMonths: number;
}) {
  const never = breakEvenMonths === Infinity;
  const immediate = breakEvenMonths === 0;
  const pct = never ? 100 : immediate ? 0 : Math.min((breakEvenMonths / stayMonths) * 100, 100);
  const pastBreakEven = !never && breakEvenMonths <= stayMonths;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-ink-500 mb-1">
        <span>Now</span>
        <span>{stayMonths >= 12 ? `${Math.floor(stayMonths / 12)}yr${stayMonths % 12 > 0 ? ` ${stayMonths % 12}mo` : ""}` : `${stayMonths}mo`}</span>
      </div>
      <div className="relative h-3 rounded-full bg-surface-200 overflow-hidden">
        {/* Green filled portion after break-even */}
        {pastBreakEven && (
          <div
            className="absolute top-0 right-0 h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${100 - pct}%` }}
          />
        )}
        {/* Red/amber filled portion before break-even */}
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${never ? "bg-red-300 w-full" : "bg-amber-300"}`}
          style={never ? {} : { width: `${pct}%` }}
        />
        {/* Break-even marker */}
        {!never && !immediate && (
          <div
            className="absolute top-0 h-full w-0.5 bg-ink-900 transition-all duration-500"
            style={{ left: `${pct}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-xs">
        <span className={`font-medium ${never ? "text-red-600" : immediate ? "text-emerald-600" : "text-amber-700"}`}>
          {never ? "Never recoups" : immediate ? "Immediate savings" : `Break-even: mo. ${breakEvenMonths}`}
        </span>
        {pastBreakEven && (
          <span className="text-emerald-600 font-medium">Savings zone</span>
        )}
      </div>
    </div>
  );
}

/* ── Before / After Comparison ── */

function ComparisonCard({
  label, payment, term, totalInterest, accent,
}: {
  label: string; payment: number; term: string; totalInterest: number; accent: boolean;
}) {
  return (
    <div className={`flex-1 rounded-2xl p-5 border ${accent ? "bg-emerald-50 border-emerald-200" : "bg-surface-50 border-surface-200"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${accent ? "text-emerald-700" : "text-ink-500"}`}>{label}</p>
      <p className={`font-display text-3xl font-bold tabular-nums ${accent ? "text-emerald-800" : "text-ink-900"} whitespace-nowrap`}>
        {formatCurrency(payment)}<span className="text-base font-normal">/mo</span>
      </p>
      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">Term</span>
          <span className="font-medium text-ink-900">{term}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">Total interest</span>
          <span className="font-medium text-ink-900">{formatCurrency(totalInterest)}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Metric Card ── */

function MetricCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: "green" | "red" }) {
  const valueColor = accent === "green" ? "text-emerald-700" : accent === "red" ? "text-red-600" : "text-ink-900";
  return (
    <div className="result-card text-center">
      <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold font-display tabular-nums ${valueColor} whitespace-nowrap`}>{value}</p>
      {sub && <p className="text-xs text-ink-400 mt-1">{sub}</p>}
    </div>
  );
}

/* ── Main Page ── */

export default function RefinanceCalculator() {
  // Current loan
  const [currentBalance, setCurrentBalance] = useState(320000);
  const [currentRate, setCurrentRate] = useState(7.5);
  const [remainingYears, setRemainingYears] = useState(25);
  const [remainingMonths, setRemainingMonths] = useState(0);

  // New loan
  const [newRate, setNewRate] = useState(6.5);
  const [newTerm, setNewTerm] = useState(30);
  const [closingCosts, setClosingCosts] = useState(6000);
  const [closingCostStrategy, setClosingCostStrategy] = useState<ClosingCostStrategy>("cash");

  // Stay duration (months)
  const [stayMonths, setStayMonths] = useState(84); // 7 years default

  const currentRemainingTermMonths = remainingYears * 12 + remainingMonths;

  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => { setToday(new Date()); }, []);

  const inputs: RefinanceInputs = useMemo(() => ({
    currentBalance,
    currentRate,
    currentRemainingTermMonths,
    newRate,
    newTermYears: newTerm,
    closingCosts,
    closingCostStrategy,
    monthsExpectingToStay: stayMonths,
  }), [currentBalance, currentRate, currentRemainingTermMonths, newRate, newTerm, closingCosts, closingCostStrategy, stayMonths]);

  const results = useMemo(() => calculateRefinance(inputs), [inputs]);

  const breakEvenDate = useMemo(() => {
    if (!today || results.breakEvenMonths === Infinity || results.breakEvenMonths === 0) return null;
    const d = new Date(today);
    d.setMonth(d.getMonth() + results.breakEvenMonths);
    return d;
  }, [today, results.breakEvenMonths]);

  const saving = results.monthlySavings > 0;
  const breakEvenNever = results.breakEvenMonths === Infinity;
  const breakEvenPassed = !breakEvenNever && results.breakEvenMonths <= stayMonths;

  const stayLabel = stayMonths >= 12
    ? `${Math.floor(stayMonths / 12)} yr${Math.floor(stayMonths / 12) !== 1 ? "s" : ""}${stayMonths % 12 > 0 ? ` ${stayMonths % 12} mo` : ""}`
    : `${stayMonths} mo`;

  const remainingLabel = `${remainingYears > 0 ? `${remainingYears}yr ` : ""}${remainingMonths > 0 ? `${remainingMonths}mo` : ""}`.trim() || "0";

  return (
    <div className="not-prose">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="Current Loan">
              <div className="space-y-4">
                <CurrencyInput label="Current Balance" value={currentBalance} onChange={setCurrentBalance} helper="Your outstanding principal balance today." />
                <PercentInput label="Current Interest Rate" value={currentRate} onChange={setCurrentRate} step={0.125} />
                <div>
                  <label className="input-label">Remaining Term</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input type="number" min={0} max={30} className="input-field pr-10"
                        value={remainingYears || ""}
                        onChange={(e) => setRemainingYears(Math.max(0, Math.min(30, Number(e.target.value) || 0)))} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">yr</span>
                    </div>
                    <div className="relative">
                      <input type="number" min={0} max={11} className="input-field pr-10"
                        value={remainingMonths || ""}
                        onChange={(e) => setRemainingMonths(Math.max(0, Math.min(11, Number(e.target.value) || 0)))} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">mo</span>
                    </div>
                  </div>
                  <p className="input-helper">Remaining: {remainingLabel} ({currentRemainingTermMonths} months)</p>
                </div>
              </div>
            </Section>

            <Section title="New Loan">
              <div className="space-y-4">
                <PercentInput label="New Interest Rate" value={newRate} onChange={setNewRate} step={0.125} />

                <div>
                  <label className="input-label">New Loan Term</label>
                  <div className="flex gap-2">
                    {NEW_TERM_OPTIONS.map((t) => (
                      <button key={t} onClick={() => setNewTerm(t)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${newTerm === t ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <CurrencyInput label="Closing Costs" value={closingCosts} onChange={setClosingCosts} helper="Typical range: $3,000–$10,000. Includes lender fees, title, appraisal." />

                <div>
                  <label className="input-label">Closing Cost Strategy</label>
                  <div className="flex gap-2">
                    {([
                      { label: "Pay at Closing", val: "cash" as ClosingCostStrategy },
                      { label: "Roll into Loan", val: "rolled_into_loan" as ClosingCostStrategy },
                    ]).map((opt) => (
                      <button key={opt.val} onClick={() => setClosingCostStrategy(opt.val)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${closingCostStrategy === opt.val ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="input-helper mt-2">
                    {closingCostStrategy === "rolled_into_loan"
                      ? `New loan: ${formatCurrency(results.newLoanAmount)} (balance + costs)`
                      : "Costs paid upfront; break-even is when savings offset them."}
                  </p>
                </div>
              </div>
            </Section>

            <Section title="How Long Will You Stay?">
              <div className="space-y-4">
                <div className="flex items-end justify-between mb-1">
                  <label className="input-label mb-0">Stay Duration</label>
                  <span className="text-sm font-semibold text-ink-900">{stayLabel}</span>
                </div>
                <input
                  type="range" min={6} max={360} step={6}
                  value={stayMonths}
                  onChange={(e) => setStayMonths(Number(e.target.value))}
                  className="w-full accent-ink-900 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-ink-400">
                  <span>6 mo</span>
                  <span>15 yrs</span>
                  <span>30 yrs</span>
                </div>
                <p className="input-helper">Drag to see how long you need to stay to come out ahead.</p>
              </div>
            </Section>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Hero Break-Even Card */}
            <div className={`result-card border ${results.isWorthRefinancing ? "border-emerald-200 bg-gradient-to-br from-white to-emerald-50" : "border-surface-200 bg-gradient-to-br from-white to-surface-50"}`}>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-2">Break-Even Analysis</p>

              {!saving ? (
                <>
                  <p className="font-display text-2xl font-bold text-red-600 leading-tight">This refinance increases your payment.</p>
                  <p className="text-sm text-ink-500 mt-2">
                    New payment is {formatCurrency(Math.abs(results.monthlySavings))} more per month. Consider a lower rate or longer term.
                  </p>
                </>
              ) : breakEvenNever ? (
                <>
                  <p className="font-display text-2xl font-bold text-amber-700 leading-tight">Closing costs never recouped.</p>
                  <p className="text-sm text-ink-500 mt-2">
                    You save {formatCurrency(results.monthlySavings)}/mo but your stay period is shorter than break-even.
                  </p>
                </>
              ) : results.breakEvenMonths === 0 ? (
                <>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-emerald-700 leading-tight">Savings start immediately.</p>
                  <p className="text-sm text-ink-500 mt-2">Closing costs rolled in — lower payment from day one.</p>
                </>
              ) : (
                <>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-ink-900 leading-tight">
                    Break even in{" "}
                    <span className={breakEvenPassed ? "text-emerald-700" : "text-amber-700"}>
                      {results.breakEvenMonths < 12
                        ? `${results.breakEvenMonths} months`
                        : results.breakEvenMonths % 12 === 0
                          ? `${results.breakEvenMonths / 12} years`
                          : `${Math.floor(results.breakEvenMonths / 12)}yr ${results.breakEvenMonths % 12}mo`}
                    </span>
                  </p>
                  {breakEvenDate && (
                    <p className="text-sm text-ink-500 mt-2">
                      Around {formatDate(breakEvenDate)}.{" "}
                      {breakEvenPassed
                        ? `You plan to stay ${stayLabel} — you're in the savings zone.`
                        : `You plan to stay ${stayLabel} — you'll leave before breaking even.`}
                    </p>
                  )}
                </>
              )}

              {/* Timeline */}
              {saving && (
                <div className="mt-6 pt-6 border-t border-surface-200">
                  <BreakEvenTimeline breakEvenMonths={results.breakEvenMonths} stayMonths={stayMonths} />
                </div>
              )}
            </div>

            {/* Monthly & Cumulative Savings */}
            <div className="grid grid-cols-3 gap-4">
              <MetricCard
                label="Monthly Savings"
                value={saving ? formatCurrency(results.monthlySavings) : `-${formatCurrency(Math.abs(results.monthlySavings))}`}
                sub={saving ? "lower payment" : "higher payment"}
                accent={saving ? "green" : "red"}
              />
              <MetricCard
                label={`Savings in ${stayLabel}`}
                value={results.totalSavingsAtStayDuration >= 0
                  ? formatCurrency(results.totalSavingsAtStayDuration)
                  : `-${formatCurrency(Math.abs(results.totalSavingsAtStayDuration))}`}
                sub={closingCostStrategy === "cash" ? "after closing costs" : "net savings"}
                accent={results.totalSavingsAtStayDuration >= 0 ? "green" : "red"}
              />
              <MetricCard
                label="Interest Savings"
                value={results.interestSavingsOverLife >= 0
                  ? formatCurrency(results.interestSavingsOverLife)
                  : `-${formatCurrency(Math.abs(results.interestSavingsOverLife))}`}
                sub="over full loan life"
                accent={results.interestSavingsOverLife >= 0 ? "green" : "red"}
              />
            </div>

            {/* Before / After Comparison */}
            <div className="result-card">
              <h3 className="section-title">Current vs. New Loan</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <ComparisonCard
                  label="Current Loan"
                  payment={results.currentPayment}
                  term={`${remainingLabel} remaining`}
                  totalInterest={results.totalInterestCurrent}
                  accent={false}
                />
                <div className="flex flex-col items-center justify-center flex-shrink-0 gap-1">
                  <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7H11M8 4L11 7L8 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {saving && (
                    <span className="text-xs font-semibold text-emerald-600 tabular-nums whitespace-nowrap">
                      -{formatCurrency(results.monthlySavings)}/mo
                    </span>
                  )}
                </div>
                <ComparisonCard
                  label="New Loan"
                  payment={results.newPayment}
                  term={`${newTerm} years`}
                  totalInterest={results.totalInterestNew}
                  accent={saving}
                />
              </div>

              {closingCostStrategy === "cash" && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-50 border border-surface-200 px-4 py-3">
                  <p className="text-xs text-ink-500">
                    <span className="font-medium text-ink-700">Closing costs: </span>
                    {formatCurrencyPrecise(closingCosts)} paid at closing.
                    {saving && results.breakEvenMonths !== Infinity && (
                      <> You recoup this in <span className="font-medium text-ink-900">{results.breakEvenMonths} months</span>.</>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Rate & Payment Details */}
            <div className="result-card">
              <h3 className="section-title">Rate & Payment Summary</h3>
              <div className="space-y-0 divide-y divide-surface-100">
                {[
                  { label: "Rate change", value: `${currentRate}% → ${newRate}%`, sub: `${currentRate > newRate ? "−" : "+"}${Math.abs(currentRate - newRate).toFixed(3)}%` },
                  { label: "New loan amount", value: formatCurrency(results.newLoanAmount), sub: closingCostStrategy === "rolled_into_loan" ? "includes rolled-in costs" : "balance only" },
                  { label: "Payment change", value: saving ? `-${formatCurrency(results.monthlySavings)}/mo` : `+${formatCurrency(Math.abs(results.monthlySavings))}/mo`, sub: saving ? "monthly savings" : "monthly increase" },
                  { label: "Total interest — current", value: formatCurrency(results.totalInterestCurrent), sub: `over ${remainingLabel}` },
                  { label: "Total interest — new", value: formatCurrency(results.totalInterestNew), sub: `over ${newTerm} years` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3">
                    <span className="text-sm text-ink-500">{row.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-ink-900">{row.value}</span>
                      {row.sub && <p className="text-xs text-ink-400">{row.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-ink-400 leading-relaxed px-1">
              This calculator provides estimates for informational purposes only. Break-even calculations assume your monthly savings remain constant and do not account for changes in taxes, insurance, or opportunity cost of the closing cost cash. Actual savings may vary. Contact a licensed loan officer for a personalized refinance analysis.
            </p>
          </div>
        </div>
    </div>
  );
}

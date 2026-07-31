// Ported from the nested mortgage-calculator-suite project. Logic unchanged;
// standalone page chrome removed so it embeds in a page or service layout.
"use client";

import { useState, useMemo } from "react";
import { calculateMoveUp, MoveUpInputs, DownPaymentSource } from "@/lib/calculators";
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

/* ── Today → After You Move transition ── */

function TransitionPanel({
  label, children, accent,
}: {
  label: string; children: React.ReactNode; accent?: boolean;
}) {
  return (
    <div className={`flex-1 rounded-2xl p-5 border ${accent ? "bg-emerald-50 border-emerald-200" : "bg-surface-50 border-surface-200"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${accent ? "text-emerald-700" : "text-ink-500"}`}>{label}</p>
      {children}
    </div>
  );
}

function PanelRow({ label, value, accent, muted }: { label: string; value: string; accent?: boolean; muted?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className={`text-sm ${muted ? "text-ink-400" : "text-ink-500"}`}>{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${accent ? "text-emerald-700" : muted ? "text-ink-400" : "text-ink-900"} whitespace-nowrap`}>{value}</span>
    </div>
  );
}

const TERM_OPTIONS = [15, 20, 25, 30];

const DOWN_SOURCE_OPTIONS: { label: string; sub: string; value: DownPaymentSource }[] = [
  { label: "Equity Only", sub: "Net proceeds from sale", value: "equity" },
  { label: "Cash Only", sub: "Bring your own cash", value: "cash" },
  { label: "Equity + Cash", sub: "Combine both", value: "both" },
];

/* ── Main Page ── */

export default function MoveUpCalculator() {
  // Current home
  const [currentHomeValue, setCurrentHomeValue] = useState(450000);
  const [currentMortgageBalance, setCurrentMortgageBalance] = useState(280000);
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = useState(2100);
  const [sellingCostPct, setSellingCostPct] = useState(6);

  // New home
  const [newHomePrice, setNewHomePrice] = useState(650000);
  const [newRate, setNewRate] = useState(6.875);
  const [newTerm, setNewTerm] = useState(30);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(8000);
  const [annualInsurance, setAnnualInsurance] = useState(2000);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  // Down payment source
  const [dpSource, setDpSource] = useState<DownPaymentSource>("equity");
  const [additionalCash, setAdditionalCash] = useState(0);

  const inputs: MoveUpInputs = useMemo(() => ({
    currentHomeValue,
    currentMortgageBalance,
    currentMonthlyPayment,
    sellingCostPercent: sellingCostPct,
    newHomePrice,
    downPaymentSource: dpSource,
    additionalCash,
    newRate,
    newTermYears: newTerm,
    annualPropertyTax,
    annualInsurance,
    monthlyHoa,
  }), [
    currentHomeValue, currentMortgageBalance, currentMonthlyPayment, sellingCostPct,
    newHomePrice, dpSource, additionalCash, newRate, newTerm,
    annualPropertyTax, annualInsurance, monthlyHoa,
  ]);

  const r = useMemo(() => calculateMoveUp(inputs), [inputs]);

  const paymentUp = r.paymentDifference > 0;
  const ltvHigh = r.newLtv > 80;

  return (
    <div className="not-prose">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="Current Home">
              <div className="space-y-4">
                <CurrencyInput label="Current Home Value" value={currentHomeValue} onChange={setCurrentHomeValue}
                  helper="Estimated current market value." />
                <CurrencyInput label="Remaining Mortgage Balance" value={currentMortgageBalance} onChange={setCurrentMortgageBalance} />
                <CurrencyInput label="Current Monthly Payment" value={currentMonthlyPayment} onChange={setCurrentMonthlyPayment}
                  helper="Your current PITI or P&amp;I payment — used for the before/after comparison." />
                <PercentInput label="Selling Costs" value={sellingCostPct} onChange={setSellingCostPct} step={0.5}
                  helper="Agent commissions + closing costs. Typically 5–6%." />
              </div>
            </Section>

            <Section title="New Home">
              <div className="space-y-4">
                <CurrencyInput label="New Home Price" value={newHomePrice} onChange={setNewHomePrice} />
                <PercentInput label="New Mortgage Rate" value={newRate} onChange={setNewRate} step={0.125} />
                <div>
                  <label className="input-label">Loan Term</label>
                  <div className="flex gap-2">
                    {TERM_OPTIONS.map((t) => (
                      <button key={t} onClick={() => setNewTerm(t)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${newTerm === t ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <CurrencyInput label="Annual Property Tax" value={annualPropertyTax} onChange={setAnnualPropertyTax} />
                <CurrencyInput label="Annual Homeowners Insurance" value={annualInsurance} onChange={setAnnualInsurance} />
                <CurrencyInput label="Monthly HOA" value={monthlyHoa} onChange={setMonthlyHoa}
                  helper="Leave at $0 if no HOA." />
              </div>
            </Section>

            <Section title="Down Payment Source">
              <div className="space-y-4">
                <div className="space-y-2">
                  {DOWN_SOURCE_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setDpSource(opt.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${dpSource === opt.value ? "bg-ink-900 border-ink-900" : "bg-white border-surface-300 hover:border-ink-400"}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${dpSource === opt.value ? "border-white" : "border-surface-400"}`}>
                        {dpSource === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${dpSource === opt.value ? "text-white" : "text-ink-900"}`}>{opt.label}</p>
                        <p className={`text-xs ${dpSource === opt.value ? "text-white/70" : "text-ink-400"}`}>{opt.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {(dpSource === "cash" || dpSource === "both") && (
                  <CurrencyInput
                    label={dpSource === "both" ? "Additional Cash to Add" : "Cash for Down Payment"}
                    value={additionalCash}
                    onChange={setAdditionalCash}
                    helper={dpSource === "both" ? "Combined with your sale proceeds." : "Cash you'll bring to the new purchase."}
                  />
                )}
              </div>
            </Section>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Net proceeds hero */}
            {r.isUnderwater ? (
              <div className="result-card border border-red-200 bg-red-50">
                <p className="text-xs font-medium uppercase tracking-widest text-red-600 mb-1">Warning — Underwater</p>
                <p className="font-display text-4xl font-bold text-red-700 tabular-nums leading-none mb-2 whitespace-nowrap">
                  {formatCurrency(r.netProceedsFromSale)}
                </p>
                <p className="text-sm text-red-700">
                  After your {formatCurrencyPrecise(r.sellingCosts)} selling costs, your sale proceeds don&apos;t cover your remaining balance. You&apos;d need to bring cash to closing to sell.
                </p>
              </div>
            ) : (
              <div className="result-card border border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
                <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-1">Net Proceeds from Sale</p>
                <p className="font-display text-5xl sm:text-6xl font-bold text-emerald-700 tabular-nums leading-none mb-2 whitespace-nowrap">
                  {formatCurrency(r.netProceedsFromSale)}
                </p>
                <div className="flex flex-wrap gap-4 mt-1 text-sm text-ink-500">
                  <span>Home value: <strong className="text-ink-900">{formatCurrency(currentHomeValue)}</strong></span>
                  <span>Payoff: <strong className="text-ink-900">−{formatCurrency(currentMortgageBalance)}</strong></span>
                  <span>Selling costs: <strong className="text-ink-900">−{formatCurrency(r.sellingCosts)}</strong></span>
                </div>
              </div>
            )}

            {/* Today → After You Move */}
            <div className="result-card">
              <h3 className="section-title">Today → After You Move</h3>
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <TransitionPanel label="Today">
                  <p className="font-display text-3xl font-bold text-ink-900 tabular-nums mb-1 whitespace-nowrap">
                    {formatCurrency(currentMonthlyPayment)}
                    <span className="text-sm font-normal text-ink-400 ml-1">/mo</span>
                  </p>
                  <p className="text-xs text-ink-400 mb-4">Current payment</p>
                  <div className="space-y-0 divide-y divide-surface-200">
                    <PanelRow label="Home value" value={formatCurrency(currentHomeValue)} />
                    <PanelRow label="Mortgage balance" value={formatCurrency(currentMortgageBalance)} />
                    <PanelRow label="Equity" value={formatCurrency(r.currentEquity)} accent={r.currentEquity > 0} />
                  </div>
                </TransitionPanel>

                {/* Arrow */}
                <div className="flex flex-col items-center justify-center flex-shrink-0 gap-1 py-4">
                  <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7H11M8 4L11 7L8 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className={`text-xs font-semibold text-center leading-tight ${paymentUp ? "text-red-600" : "text-emerald-600"}`}>
                    {paymentUp ? `+${formatCurrency(r.paymentDifference)}` : `−${formatCurrency(Math.abs(r.paymentDifference))}`}
                    <br />/mo
                  </div>
                </div>

                <TransitionPanel label="After You Move" accent>
                  <p className="font-display text-3xl font-bold text-emerald-900 tabular-nums mb-1 whitespace-nowrap">
                    {formatCurrency(r.newTotalMonthlyPayment)}
                    <span className="text-sm font-normal text-emerald-600 ml-1">/mo</span>
                  </p>
                  <p className="text-xs text-emerald-600 mb-4">New total payment</p>
                  <div className="space-y-0 divide-y divide-emerald-100">
                    <PanelRow label="New home price" value={formatCurrency(newHomePrice)} />
                    <PanelRow label="Down payment" value={`${formatCurrency(r.downPayment)} (${r.downPaymentPct.toFixed(1)}%)`} />
                    <PanelRow label="New loan" value={formatCurrency(r.newLoanAmount)} />
                    <PanelRow label="LTV" value={`${r.newLtv.toFixed(1)}%`} muted={!ltvHigh} />
                  </div>
                </TransitionPanel>
              </div>
            </div>

            {/* New payment breakdown */}
            <div className="result-card">
              <h3 className="section-title">New Monthly Payment Breakdown</h3>
              <div className="space-y-0 divide-y divide-surface-100">
                {[
                  { label: "Principal & Interest", value: r.newMonthlyPi, dot: "#059669" },
                  { label: "Property Tax", value: r.newMonthlyPropertyTax, dot: "#0EA5E9" },
                  { label: "Homeowners Insurance", value: r.newMonthlyInsurance, dot: "#F59E0B" },
                  ...(r.newMonthlyHoa > 0 ? [{ label: "HOA", value: r.newMonthlyHoa, dot: "#8B5CF6" }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: row.dot }} />
                      <span className="text-sm text-ink-700">{row.label}</span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-ink-900 whitespace-nowrap">{formatCurrencyPrecise(row.value)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-bold text-ink-900">Total Monthly Payment</span>
                  <span className="text-lg font-bold tabular-nums text-ink-900 whitespace-nowrap">{formatCurrencyPrecise(r.newTotalMonthlyPayment)}</span>
                </div>
              </div>

              {ltvHigh && (
                <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                  <p className="text-xs text-amber-800">
                    <strong>LTV is {r.newLtv.toFixed(1)}%</strong> — above 80%, so PMI may apply on a conventional loan. Consider bringing additional cash to reach 20% down.
                  </p>
                </div>
              )}
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Payment Change</p>
                <p className={`text-2xl font-bold font-display tabular-nums ${paymentUp ? "text-red-600" : "text-emerald-700"} whitespace-nowrap`}>
                  {paymentUp ? "+" : "−"}{formatCurrency(Math.abs(r.paymentDifference))}
                </p>
                <p className="text-xs text-ink-400 mt-0.5">
                  {r.paymentDifferencePct > 0 ? "+" : ""}{r.paymentDifferencePct.toFixed(1)}% {paymentUp ? "higher" : "lower"}
                </p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">New LTV</p>
                <p className={`text-2xl font-bold font-display tabular-nums ${ltvHigh ? "text-amber-700" : "text-emerald-700"} whitespace-nowrap`}>
                  {r.newLtv.toFixed(1)}%
                </p>
                {ltvHigh && <p className="text-xs text-amber-600 mt-0.5">PMI may apply</p>}
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Down Payment</p>
                <p className="text-2xl font-bold font-display tabular-nums text-ink-900 whitespace-nowrap">{formatCurrency(r.downPayment)}</p>
                <p className="text-xs text-ink-400 mt-0.5">{r.downPaymentPct.toFixed(1)}% of price</p>
              </div>
            </div>

            {/* Sale summary */}
            <div className="result-card">
              <h3 className="section-title">Sale Proceeds Summary</h3>
              <div className="space-y-0 divide-y divide-surface-100">
                {[
                  { label: "Sale price", value: formatCurrency(currentHomeValue) },
                  { label: "Remaining mortgage payoff", value: `−${formatCurrency(currentMortgageBalance)}` },
                  { label: `Selling costs (${sellingCostPct}%)`, value: `−${formatCurrency(r.sellingCosts)}` },
                  { label: "Net proceeds", value: formatCurrency(r.netProceedsFromSale), bold: true, accent: !r.isUnderwater },
                  ...(dpSource !== "cash" && !r.isUnderwater ? [{ label: "Used for down payment", value: `−${formatCurrency(dpSource === "equity" ? r.netProceedsFromSale : r.netProceedsFromSale)}` }] : []),
                  ...(additionalCash > 0 && (dpSource === "cash" || dpSource === "both") ? [{ label: "Additional cash contributed", value: formatCurrency(additionalCash) }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-3">
                    <span className={`text-sm ${row.bold ? "font-bold text-ink-900" : "text-ink-600"}`}>{row.label}</span>
                    <span className={`text-sm tabular-nums ${row.bold ? "font-bold text-lg" : "font-medium"} ${row.accent ? "text-emerald-700" : r.isUnderwater && row.bold ? "text-red-600" : "text-ink-900"} whitespace-nowrap`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-ink-400 leading-relaxed px-1">
              This calculator provides estimates for planning purposes only. Actual sale proceeds, closing costs, and mortgage terms will vary. Work with a real estate agent and licensed loan officer for accurate figures.
            </p>
          </div>
        </div>
    </div>
  );
}

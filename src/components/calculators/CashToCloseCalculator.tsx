// Ported from the nested mortgage-calculator-suite project. Logic unchanged;
// standalone page chrome removed so it embeds in a page or service layout.
"use client";

import { useState, useMemo } from "react";
import {
  calculateCashToClose,
  CashToCloseInputs,
  FeeItem,
  LoanProgram,
} from "@/lib/calculators";
import { formatCurrency, formatCurrencyPrecise } from "@/lib/format";

/* ── Shared Input Components ── */

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="section-card">
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  );
}

/* ── Fee Row Manager ── */

function FeeRows({
  items,
  onChange,
  addLabel,
  defaultLabel,
}: {
  items: FeeItem[];
  onChange: (items: FeeItem[]) => void;
  addLabel: string;
  defaultLabel: string;
}) {
  function add() {
    onChange([...items, { label: defaultLabel, amount: 0 }]);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function update(idx: number, field: keyof FeeItem, value: string | number) {
    onChange(items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-wrap gap-2 items-start">
          <input
            type="text"
            className="input-field w-full sm:w-auto sm:flex-1 text-sm"
            value={item.label}
            placeholder="Description"
            onChange={(e) => update(idx, "label", e.target.value)}
          />
          <div className="relative flex-1 sm:flex-none sm:w-36">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">$</span>
            <input
              type="number" min={0} step={1} className="input-field pl-7 text-sm"
              value={item.amount || ""}
              onChange={(e) => update(idx, "amount", Number(e.target.value) || 0)}
            />
          </div>
          <button
            onClick={() => remove(idx)}
            className="mt-0.5 p-2.5 rounded-xl border border-surface-200 text-ink-400 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-2.5 rounded-xl border border-dashed border-surface-300 text-sm text-ink-400 hover:border-ink-400 hover:text-ink-600 transition-all cursor-pointer"
      >
        + {addLabel}
      </button>
    </div>
  );
}

/* ── Waterfall Row ── */

function WaterfallRow({
  label, amount, sub, operator, accent, muted,
}: {
  label: string;
  amount: number;
  sub?: string;
  operator?: "+" | "−" | "=";
  accent?: boolean;
  muted?: boolean;
}) {
  const opColor = operator === "−" ? "text-emerald-600" : operator === "=" ? "text-ink-900" : "text-ink-400";
  const amtColor = accent ? "text-ink-900 font-bold text-xl" : muted ? "text-ink-400" : "text-ink-900 font-semibold";

  return (
    <div className={`flex items-center justify-between py-3 ${accent ? "border-t-2 border-ink-900 mt-1" : ""}`}>
      <div className="flex items-center gap-3 min-w-0">
        {operator && (
          <span className={`text-base font-bold w-4 text-center ${opColor}`}>{operator}</span>
        )}
        {!operator && <span className="w-4" />}
        <div>
          <p className={`text-sm ${muted ? "text-ink-400" : "text-ink-700"}`}>{label}</p>
          {sub && <p className="text-xs text-ink-400">{sub}</p>}
        </div>
      </div>
      <span className={`tabular-nums ${amtColor} whitespace-nowrap`}>
        {operator === "−" ? `-${formatCurrencyPrecise(amount)}` : formatCurrencyPrecise(amount)}
      </span>
    </div>
  );
}

/* ── Comparison Card ── */

function ScenarioCard({
  label, downPct, homePrice, accent,
}: {
  label: string; downPct: number; homePrice: number; accent: boolean;
}) {
  const dp = Math.round(homePrice * (downPct / 100) * 100) / 100;
  const loan = homePrice - dp;
  const ltv = homePrice > 0 ? (loan / homePrice) * 100 : 0;
  // estimate closing costs at 2.5%
  const cc = Math.round(loan * 0.025 * 100) / 100;
  const total = dp + cc;

  return (
    <div className={`flex-1 rounded-2xl p-5 border ${accent ? "bg-emerald-50 border-emerald-200" : "bg-surface-50 border-surface-200"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${accent ? "text-emerald-700" : "text-ink-500"}`}>{label}</p>
      <p className={`font-display text-3xl font-bold tabular-nums ${accent ? "text-emerald-800" : "text-ink-900"} whitespace-nowrap`}>
        {downPct}% down
      </p>
      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">Down payment</span>
          <span className="font-medium text-ink-900">{formatCurrency(dp)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">Est. closing costs</span>
          <span className="font-medium text-ink-900">{formatCurrency(cc)}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-surface-200 pt-1.5 mt-1.5">
          <span className="text-ink-700 font-medium">Est. total cash</span>
          <span className="font-bold text-ink-900">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">Loan amount</span>
          <span className="font-medium text-ink-900">{formatCurrency(loan)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">LTV</span>
          <span className="font-medium text-ink-900">{ltv.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

/* ── Program defaults ── */

const PROGRAM_MIN_DOWN: Record<LoanProgram, number> = {
  conventional: 3,
  fha: 3.5,
  va: 0,
  usda: 0,
};

const PROGRAM_LABELS: Record<LoanProgram, string> = {
  conventional: "Conventional",
  fha: "FHA",
  va: "VA",
  usda: "USDA",
};

const DEFAULT_PREPAIDS: FeeItem[] = [
  { label: "Homeowners insurance (2 mo.)", amount: 300 },
  { label: "Property tax escrow (2 mo.)", amount: 600 },
  { label: "Prepaid interest (15 days)", amount: 450 },
];

/* ── Main Page ── */

export default function CashToCloseCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPct, setDownPaymentPct] = useState(10);
  const [loanProgram, setLoanProgram] = useState<LoanProgram>("conventional");
  const [closingCostPct, setClosingCostPct] = useState(2.5);

  // Itemized mode
  const [useItemized, setUseItemized] = useState(false);
  const [itemizedFees, setItemizedFees] = useState<FeeItem[]>([]);

  // Prepaids & Credits
  const [prepaidItems, setPrepaidItems] = useState<FeeItem[]>(DEFAULT_PREPAIDS);
  const [credits, setCredits] = useState<FeeItem[]>([]);

  // Clamp down payment to min when program changes
  function selectProgram(p: LoanProgram) {
    setLoanProgram(p);
    const min = PROGRAM_MIN_DOWN[p];
    if (downPaymentPct < min) setDownPaymentPct(min);
  }

  const minDown = PROGRAM_MIN_DOWN[loanProgram];
  const noDownProgram = minDown === 0;

  const inputs: CashToCloseInputs = useMemo(() => ({
    homePrice,
    downPaymentPercent: downPaymentPct,
    loanProgram,
    estimatedClosingCostPercent: closingCostPct,
    itemizedFees: useItemized ? itemizedFees : [],
    credits,
    prepaidItems,
  }), [homePrice, downPaymentPct, loanProgram, closingCostPct, useItemized, itemizedFees, credits, prepaidItems]);

  const results = useMemo(() => calculateCashToClose(inputs), [inputs]);

  const dpDollar = results.downPaymentAmount;
  const hasPrepaids = results.prepaidsTotal > 0;
  const hasCredits = results.creditsTotal > 0;

  // Comparison down payment options
  const comparisonOptions: number[] = useMemo(() => {
    const opts = new Set<number>();
    if (!noDownProgram) {
      [5, 10, 15, 20].forEach((v) => { if (Math.abs(v - downPaymentPct) >= 2) opts.add(v); });
    } else {
      [5, 10].forEach((v) => opts.add(v));
    }
    return Array.from(opts).slice(0, 1);
  }, [downPaymentPct, noDownProgram]);

  return (
    <div className="not-prose">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <Section title="Loan Details">
              <div className="space-y-5">
                {/* Loan program */}
                <div>
                  <label className="input-label">Loan Program</label>
                  <div className="flex gap-2">
                    {(["conventional", "fha", "va", "usda"] as LoanProgram[]).map((p) => (
                      <button key={p} onClick={() => selectProgram(p)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${loanProgram === p ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-700 border-surface-300 hover:border-ink-400"}`}>
                        {PROGRAM_LABELS[p]}
                      </button>
                    ))}
                  </div>
                  {noDownProgram && (
                    <p className="mt-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                      {loanProgram === "va" ? "VA loans allow 0% down for eligible veterans." : "USDA loans allow 0% down for eligible rural properties."}
                    </p>
                  )}
                </div>

                <CurrencyInput
                  label="Home Purchase Price"
                  value={homePrice}
                  onChange={setHomePrice}
                />

                {/* Down payment slider + input */}
                <div>
                  <div className="flex items-end justify-between mb-2">
                    <label className="input-label mb-0">Down Payment</label>
                    <div className="flex items-center gap-2">
                      <div className="relative w-20">
                        <input
                          type="number" step={0.5} min={minDown} max={80}
                          className="input-field pr-6 text-sm py-1.5"
                          value={downPaymentPct || ""}
                          onChange={(e) => setDownPaymentPct(Math.max(minDown, Number(e.target.value) || 0))}
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 text-xs pointer-events-none">%</span>
                      </div>
                      <span className="text-sm text-ink-500 tabular-nums w-24 text-right whitespace-nowrap">{formatCurrency(dpDollar)}</span>
                    </div>
                  </div>
                  <input
                    type="range" min={minDown} max={50} step={0.5}
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-ink-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-ink-400 mt-1">
                    <span>{minDown === 0 ? "0%" : `${minDown}% min`}</span>
                    <span>20%</span>
                    <span>50%</span>
                  </div>
                  {results.isBelowMinDown && (
                    <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      {loanProgram.toUpperCase()} minimum is {minDown}% down.
                    </p>
                  )}
                </div>
              </div>
            </Section>

            {/* Closing Costs */}
            <Section title="Closing Costs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-ink-600">
                    {useItemized ? "Itemized fees" : "Estimated percentage"}
                  </p>
                  <button
                    onClick={() => setUseItemized((v) => !v)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-surface-300 text-ink-600 hover:border-ink-400 transition-all cursor-pointer bg-white"
                  >
                    {useItemized ? "Switch to estimate" : "Itemize fees"}
                  </button>
                </div>

                {useItemized ? (
                  <FeeRows
                    items={itemizedFees}
                    onChange={setItemizedFees}
                    addLabel="Add fee"
                    defaultLabel="Lender fee"
                  />
                ) : (
                  <div>
                    <label className="input-label">Estimated Closing Cost %</label>
                    <div className="relative">
                      <input
                        type="number" step={0.1} min={0} max={10} className="input-field pr-8"
                        value={closingCostPct || ""}
                        onChange={(e) => setClosingCostPct(Number(e.target.value) || 0)}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">%</span>
                    </div>
                    <p className="input-helper">Applied to loan amount. Typical range: 2–3%.</p>
                  </div>
                )}
              </div>
            </Section>

            {/* Prepaids */}
            <Section title="Prepaids &amp; Escrow">
              <p className="text-sm text-ink-500 mb-3">Items collected at closing: prepaid interest, initial escrow deposits for taxes and insurance.</p>
              <FeeRows
                items={prepaidItems}
                onChange={setPrepaidItems}
                addLabel="Add prepaid item"
                defaultLabel="Prepaid item"
              />
            </Section>

            {/* Credits */}
            <Section title="Credits">
              <p className="text-sm text-ink-500 mb-3">Seller concessions, lender credits, or other amounts that reduce your cash due at closing.</p>
              <FeeRows
                items={credits}
                onChange={setCredits}
                addLabel="Add credit"
                defaultLabel="Seller concession"
              />
            </Section>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Hero */}
            <div className="result-card border border-surface-200 bg-gradient-to-br from-white to-surface-50">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-1">Estimated Cash to Close</p>
              <p className="font-display text-5xl sm:text-6xl font-bold text-ink-900 tabular-nums leading-none mb-2 whitespace-nowrap">
                {formatCurrency(results.totalCashToClose)}
              </p>
              <p className="text-sm text-ink-500">
                {downPaymentPct}% down on a {formatCurrency(homePrice)} home
                &nbsp;·&nbsp; {PROGRAM_LABELS[loanProgram]} loan
                &nbsp;·&nbsp; {results.effectiveLtv.toFixed(1)}% LTV
              </p>
            </div>

            {/* Breakdown waterfall */}
            <div className="result-card">
              <h3 className="section-title">How It Breaks Down</h3>
              <div className="divide-y divide-surface-100">
                <WaterfallRow
                  label="Down Payment"
                  sub={`${downPaymentPct}% of ${formatCurrency(homePrice)}`}
                  amount={dpDollar}
                />
                <WaterfallRow
                  label={results.closingCostsAreEstimated ? `Closing Costs (est. ${closingCostPct}%)` : "Closing Costs (itemized)"}
                  sub={results.closingCostsAreEstimated ? `${closingCostPct}% of ${formatCurrency(results.loanAmount)} loan` : `${(useItemized ? itemizedFees : []).length} line items`}
                  amount={results.closingCostsTotal}
                  operator="+"
                />
                {hasPrepaids && (
                  <WaterfallRow
                    label="Prepaids &amp; Escrow"
                    sub={`${prepaidItems.length} item${prepaidItems.length !== 1 ? "s" : ""}`}
                    amount={results.prepaidsTotal}
                    operator="+"
                  />
                )}
                {hasCredits && (
                  <WaterfallRow
                    label="Credits"
                    sub={`${credits.length} credit${credits.length !== 1 ? "s" : ""}`}
                    amount={results.creditsTotal}
                    operator="−"
                  />
                )}
                <WaterfallRow
                  label="Total Cash to Close"
                  amount={results.totalCashToClose}
                  operator="="
                  accent
                />
              </div>

              {results.closingCostsAreEstimated && (
                <p className="mt-3 text-xs text-ink-400 leading-relaxed border-t border-surface-100 pt-3">
                  Closing costs are an estimate based on {closingCostPct}% of the loan amount. Switch to &ldquo;Itemize fees&rdquo; to enter your Loan Estimate figures exactly.
                </p>
              )}
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Loan Amount</p>
                <p className="text-2xl font-bold font-display tabular-nums text-ink-900 whitespace-nowrap">{formatCurrency(results.loanAmount)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">LTV</p>
                <p className={`text-2xl font-bold font-display tabular-nums ${results.effectiveLtv > 80 ? "text-amber-700" : "text-emerald-700"} whitespace-nowrap`}>
                  {results.effectiveLtv.toFixed(1)}%
                </p>
                {results.effectiveLtv > 80 && <p className="text-xs text-ink-400 mt-0.5">PMI may apply</p>}
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Down Payment</p>
                <p className="text-2xl font-bold font-display tabular-nums text-ink-900 whitespace-nowrap">{formatCurrency(dpDollar)}</p>
                <p className="text-xs text-ink-400 mt-0.5">{downPaymentPct}% of price</p>
              </div>
            </div>

            {/* Down payment comparison */}
            {homePrice > 0 && comparisonOptions.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">Down Payment Comparison</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <ScenarioCard
                    label="Your scenario"
                    downPct={downPaymentPct}
                    homePrice={homePrice}
                    accent={true}
                  />
                  <ScenarioCard
                    label={`${comparisonOptions[0]}% down`}
                    downPct={comparisonOptions[0]}
                    homePrice={homePrice}
                    accent={false}
                  />
                </div>
                <p className="text-xs text-ink-400 mt-3 leading-relaxed">
                  Comparison uses an estimated 2.5% for closing costs. Prepaids and credits not included.
                </p>
              </div>
            )}

            {/* Prepaids detail (if any) */}
            {hasPrepaids && (
              <div className="result-card">
                <h3 className="section-title">Prepaids &amp; Escrow Detail</h3>
                <div className="space-y-0 divide-y divide-surface-100">
                  {prepaidItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5">
                      <span className="text-sm text-ink-600">{item.label}</span>
                      <span className="text-sm font-semibold text-ink-900 tabular-nums whitespace-nowrap">{formatCurrencyPrecise(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm font-bold text-ink-900">Total Prepaids</span>
                    <span className="text-sm font-bold text-ink-900 tabular-nums whitespace-nowrap">{formatCurrencyPrecise(results.prepaidsTotal)}</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-ink-400 leading-relaxed px-1">
              This is an estimate for informational purposes only. Your actual cash to close will be shown on your official Closing Disclosure, which you will receive at least 3 business days before closing. Contact a licensed loan officer for a precise figure.
            </p>
          </div>
        </div>
    </div>
  );
}

// Ported from the nested mortgage-calculator-suite project. Logic unchanged;
// standalone page chrome removed so it embeds in a page or service layout.
"use client";

import { useState, useMemo } from "react";
import { calculateCltv, LienInput, CltvInputs } from "@/lib/calculators";
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
  label, value, onChange, helper,
}: {
  label: string; value: number; onChange: (v: number) => void; helper?: string;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <input
          type="number" step={0.125} min={0} max={30} className="input-field pr-8"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm pointer-events-none">%</span>
      </div>
      {helper && <p className="input-helper">{helper}</p>}
    </div>
  );
}

/* ── Lien input group ── */

function LienFields({
  lien, onChange,
}: {
  lien: LienInput;
  onChange: (updated: LienInput) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <CurrencyInput label="Balance" value={lien.balance} onChange={(v) => onChange({ ...lien, balance: v })} />
      <PercentInput label="Rate" value={lien.rate} onChange={(v) => onChange({ ...lien, rate: v })} />
      <CurrencyInput label="Mo. Payment" value={lien.payment} onChange={(v) => onChange({ ...lien, payment: v })} />
    </div>
  );
}

/* ── CLTV Gauge Bar ── */

function CltvBar({ cltvPercent }: { cltvPercent: number }) {
  const capped = Math.min(cltvPercent, 125);
  const pct = (capped / 125) * 100;

  const color =
    cltvPercent <= 80 ? "bg-emerald-400" :
    cltvPercent <= 90 ? "bg-amber-400" :
    cltvPercent <= 100 ? "bg-orange-400" : "bg-red-500";

  const label =
    cltvPercent <= 80 ? "Excellent" :
    cltvPercent <= 90 ? "Acceptable" :
    cltvPercent <= 100 ? "High" : "Over 100%";

  const labelColor =
    cltvPercent <= 80 ? "text-emerald-700" :
    cltvPercent <= 90 ? "text-amber-700" :
    cltvPercent <= 100 ? "text-orange-700" : "text-red-700";

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-ink-400 mb-1">
        <span>0%</span>
        <span>80%</span>
        <span>100%</span>
        <span>125%+</span>
      </div>
      <div className="relative h-3 rounded-full bg-surface-200 overflow-hidden">
        <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
        {/* 80% marker */}
        <div className="absolute top-0 h-full w-px bg-ink-300" style={{ left: "64%" }} />
        {/* 100% marker */}
        <div className="absolute top-0 h-full w-px bg-ink-300" style={{ left: "80%" }} />
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${labelColor}`}>{cltvPercent.toFixed(2)}% CLTV — {label}</span>
        {cltvPercent > 80 && (
          <span className="text-xs text-ink-400">Most lenders cap at 80–90%</span>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ── */

const DEFAULT_FIRST: LienInput = { label: "1st Mortgage", balance: 320000, rate: 6.875, payment: 2100 };
const DEFAULT_SECOND: LienInput = { label: "2nd Mortgage / HELOC", balance: 50000, rate: 8.5, payment: 425 };
const DEFAULT_OTHER: LienInput = { label: "Other Lien", balance: 0, rate: 0, payment: 0 };

export default function CltvCalculator() {
  const [homeValue, setHomeValue] = useState(480000);
  const [first, setFirst] = useState<LienInput>(DEFAULT_FIRST);
  const [showSecond, setShowSecond] = useState(false);
  const [second, setSecond] = useState<LienInput>(DEFAULT_SECOND);
  const [otherLiens, setOtherLiens] = useState<LienInput[]>([]);

  function addOtherLien() {
    if (otherLiens.length >= 3) return;
    setOtherLiens((prev) => [
      ...prev,
      { ...DEFAULT_OTHER, label: `Other Lien ${prev.length + 1}` },
    ]);
  }

  function removeOtherLien(idx: number) {
    setOtherLiens((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateOtherLien(idx: number, updated: LienInput) {
    setOtherLiens((prev) => prev.map((l, i) => (i === idx ? updated : l)));
  }

  const inputs: CltvInputs = useMemo(() => ({
    homeValue,
    firstMortgage: first,
    secondLien: showSecond ? second : undefined,
    otherLiens: otherLiens.length > 0 ? otherLiens : undefined,
  }), [homeValue, first, showSecond, second, otherLiens]);

  const results = useMemo(() => calculateCltv(inputs), [inputs]);

  const hasMultipleLiens = results.breakdown.length > 1;

  return (
    <div className="not-prose">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT — Inputs */}
          <div className="lg:col-span-5 space-y-5">

            <div className="section-card">
              <h3 className="section-title">Property Value</h3>
              <CurrencyInput
                label="Estimated Home Value"
                value={homeValue}
                onChange={setHomeValue}
                helper="Current market value or appraised value."
              />
            </div>

            <div className="section-card">
              <h3 className="section-title">1st Mortgage</h3>
              <LienFields lien={first} onChange={setFirst} />
            </div>

            <div className="section-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">2nd Mortgage / HELOC</h3>
                <button
                  onClick={() => setShowSecond((v) => !v)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                    showSecond
                      ? "bg-ink-900 text-white border-ink-900"
                      : "bg-white text-ink-600 border-surface-300 hover:border-ink-400"
                  }`}
                >
                  {showSecond ? "Remove" : "Add"}
                </button>
              </div>
              {showSecond ? (
                <LienFields lien={second} onChange={setSecond} />
              ) : (
                <p className="text-sm text-ink-400">No second lien. Click Add to include one.</p>
              )}
            </div>

            {/* Other liens */}
            {otherLiens.map((lien, idx) => (
              <div key={idx} className="section-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title mb-0">Other Lien {idx + 1}</h3>
                  <button
                    onClick={() => removeOtherLien(idx)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-surface-300 text-ink-600 hover:border-red-300 hover:text-red-600 transition-all duration-200 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <LienFields lien={lien} onChange={(updated) => updateOtherLien(idx, updated)} />
              </div>
            ))}

            {otherLiens.length < 3 && (
              <button
                onClick={addOtherLien}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-surface-300 text-sm text-ink-400 hover:border-ink-400 hover:text-ink-600 transition-all duration-200 cursor-pointer"
              >
                + Add Another Lien
              </button>
            )}
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-7 space-y-5">

            {/* Hero — Blended Rate */}
            <div className="result-card border border-surface-200 bg-gradient-to-br from-white to-surface-50">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-1">Blended Interest Rate</p>
              <div className="flex items-end gap-3 mb-1">
                <p className="font-display text-5xl sm:text-6xl font-bold text-ink-900 tabular-nums leading-none">
                  {results.blendedRate.toFixed(3)}
                </p>
                <span className="text-2xl font-semibold text-ink-400 mb-1">%</span>
              </div>
              {hasMultipleLiens && (
                <p className="text-sm text-ink-500">
                  Weighted average across {results.breakdown.length} liens
                  totaling {formatCurrency(results.totalBalance)}.
                </p>
              )}
              {!hasMultipleLiens && (
                <p className="text-sm text-ink-500">
                  Based on your 1st mortgage. Add a second lien to see a blended rate.
                </p>
              )}
            </div>

            {/* CLTV Gauge */}
            <div className="result-card">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-500 mb-4">Combined Loan-to-Value (CLTV)</p>
              <CltvBar cltvPercent={results.cltvPercent} />
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Total Balances</p>
                <p className="text-2xl font-bold font-display tabular-nums text-ink-900">{formatCurrency(results.totalBalance)}</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Available Equity</p>
                <p className={`text-2xl font-bold font-display tabular-nums ${results.availableEquity >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                  {results.availableEquity >= 0 ? formatCurrency(results.availableEquity) : `-${formatCurrency(Math.abs(results.availableEquity))}`}
                </p>
                <p className="text-xs text-ink-400 mt-0.5">{results.equityPercent.toFixed(1)}% of value</p>
              </div>
              <div className="result-card text-center">
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Combined Payment</p>
                <p className="text-2xl font-bold font-display tabular-nums text-ink-900">{formatCurrency(results.totalMonthlyPayments)}</p>
                <p className="text-xs text-ink-400 mt-0.5">per month</p>
              </div>
            </div>

            {/* Lien Breakdown */}
            <div className="result-card">
              <h3 className="section-title">Lien Breakdown</h3>
              <div className="space-y-0 divide-y divide-surface-100">
                {/* Header row */}
                <div className="grid grid-cols-4 gap-2 pb-2">
                  <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Lien</span>
                  <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide text-right">Balance</span>
                  <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide text-right">Rate</span>
                  <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide text-right">Weight</span>
                </div>

                {results.breakdown.map((lien, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 py-3 items-center">
                    <div>
                      <p className="text-sm font-medium text-ink-900">{lien.label}</p>
                      <p className="text-xs text-ink-400">{formatCurrencyPrecise(lien.payment)}/mo</p>
                    </div>
                    <p className="text-sm font-semibold text-ink-900 text-right tabular-nums">{formatCurrency(lien.balance)}</p>
                    <p className="text-sm font-semibold text-ink-900 text-right tabular-nums">{lien.rate.toFixed(3)}%</p>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-ink-900 tabular-nums">{lien.weightPct.toFixed(1)}%</p>
                      <p className="text-xs text-ink-400">+{lien.rateContribution.toFixed(3)}%</p>
                    </div>
                  </div>
                ))}

                {/* Total row */}
                <div className="grid grid-cols-4 gap-2 pt-3 items-center">
                  <p className="text-sm font-bold text-ink-900">Total</p>
                  <p className="text-sm font-bold text-ink-900 text-right tabular-nums">{formatCurrency(results.totalBalance)}</p>
                  <p className="text-sm font-bold text-ink-900 text-right tabular-nums">{results.blendedRate.toFixed(3)}%</p>
                  <p className="text-sm font-bold text-ink-900 text-right tabular-nums">100%</p>
                </div>
              </div>

              {hasMultipleLiens && (
                <div className="mt-4 rounded-xl bg-surface-50 border border-surface-200 px-4 py-3">
                  <p className="text-xs text-ink-500 leading-relaxed">
                    <span className="font-medium text-ink-700">Blended rate: </span>
                    {results.blendedRate.toFixed(3)}% is the weighted average of all lien rates.
                    &ldquo;Weight&rdquo; shows each lien&apos;s share of total debt; &ldquo;+X.XXX%&rdquo; is its rate contribution to the blended rate.
                  </p>
                </div>
              )}
            </div>

            {/* 80% LTV context */}
            {results.availableEquity > 0 && (
              <div className="result-card">
                <h3 className="section-title">Equity Access Snapshot</h3>
                <div className="space-y-0 divide-y divide-surface-100">
                  {[80, 85, 90].map((cap) => {
                    const maxTotal = homeValue * (cap / 100);
                    const available = Math.max(0, maxTotal - results.totalBalance);
                    return (
                      <div key={cap} className="flex items-center justify-between py-3">
                        <div>
                          <span className="text-sm font-medium text-ink-900">{cap}% CLTV cap</span>
                          <p className="text-xs text-ink-400">Max total liens: {formatCurrency(maxTotal)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-bold tabular-nums ${available > 0 ? "text-emerald-700" : "text-ink-400"}`}>
                            {available > 0 ? `${formatCurrency(available)} available` : "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-ink-400 mt-3 leading-relaxed">
                  Amounts a lender could allow you to borrow (e.g. HELOC, cash-out refi) at each CLTV cap, based on current balances.
                </p>
              </div>
            )}

            <p className="text-xs text-ink-400 leading-relaxed px-1">
              This calculator provides estimates for informational purposes only. Lender CLTV limits, appraisals, and underwriting guidelines vary. Contact a licensed loan officer to determine actual borrowing capacity.
            </p>
          </div>
        </div>
    </div>
  );
}

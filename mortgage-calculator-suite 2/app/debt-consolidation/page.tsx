"use client";

import { useState, useMemo } from "react";
import {
  calculateDebtConsolidation,
  DebtItem,
  DebtConsolidationInputs,
} from "@/lib/calculators";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtFull = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (n: number) => `${n.toFixed(2)}%`;

const DEBT_COLORS = ["#2563eb", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

const DEFAULT_DEBTS: DebtItem[] = [
  { label: "Credit Card 1", balance: 12000, annualRate: 22.99, monthlyPayment: 300, remainingMonths: 0 },
  { label: "Auto Loan",     balance: 18000, annualRate: 7.5,   monthlyPayment: 420, remainingMonths: 48 },
];

function DebtRow({
  debt,
  index,
  color,
  onChange,
  onRemove,
}: {
  debt: DebtItem;
  index: number;
  color: string;
  onChange: (updated: DebtItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border rounded-xl p-4 space-y-3" style={{ borderColor: color + "50" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <input
            type="text"
            value={debt.label}
            onChange={(e) => onChange({ ...debt, label: e.target.value })}
            className="font-medium text-gray-800 text-sm bg-transparent border-b border-transparent hover:border-gray-300 focus:border-emerald-500 focus:outline-none w-40"
          />
        </div>
        <button
          onClick={onRemove}
          className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors"
          aria-label="Remove debt"
        >
          ×
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label">Balance</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              value={debt.balance || ""}
              onChange={(e) => onChange({ ...debt, balance: Number(e.target.value) })}
              className="input-field pl-7"
            />
          </div>
        </div>
        <div>
          <label className="input-label">Interest Rate</label>
          <div className="relative">
            <input
              type="number"
              value={debt.annualRate || ""}
              step="0.1"
              onChange={(e) => onChange({ ...debt, annualRate: Number(e.target.value) })}
              className="input-field pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
        </div>
        <div>
          <label className="input-label">Monthly Payment</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              value={debt.monthlyPayment || ""}
              onChange={(e) => onChange({ ...debt, monthlyPayment: Number(e.target.value) })}
              className="input-field pl-7"
            />
          </div>
        </div>
        <div>
          <label className="input-label">Months Remaining</label>
          <input
            type="number"
            value={debt.remainingMonths || ""}
            placeholder="0 = revolving"
            onChange={(e) => onChange({ ...debt, remainingMonths: Number(e.target.value) })}
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
}

function BlendedRateBar({
  items,
  totalBalance,
}: {
  items: { label: string; balance: number; annualRate: number; color: string }[];
  totalBalance: number;
}) {
  if (totalBalance <= 0) return null;
  return (
    <div className="space-y-2">
      <div className="h-5 rounded-full overflow-hidden flex">
        {items.map((item, i) => {
          const pct = (item.balance / totalBalance) * 100;
          return (
            <div
              key={i}
              style={{ width: `${pct}%`, backgroundColor: item.color }}
              title={`${item.label}: ${pct.toFixed(1)}%`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className="text-xs font-medium text-gray-700">{fmtPct(item.annualRate)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DebtConsolidationPage() {
  // Current mortgage
  const [mortgageBalance, setMortgageBalance] = useState(320000);
  const [mortgageRate, setMortgageRate] = useState(6.5);
  const [mortgageMonths, setMortgageMonths] = useState(324); // 27 years remaining
  const [mortgagePayment, setMortgagePayment] = useState(2023);
  const [homeValue, setHomeValue] = useState(480000);

  // Debts
  const [debts, setDebts] = useState<DebtItem[]>(DEFAULT_DEBTS);

  // New loan
  const [newRate, setNewRate] = useState(7.25);
  const [newTerm, setNewTerm] = useState(30);
  const [closingCostPct, setClosingCostPct] = useState(2.0);
  const [holdingYears, setHoldingYears] = useState(7);

  function addDebt() {
    setDebts((prev) => [
      ...prev,
      { label: `Debt ${prev.length + 1}`, balance: 5000, annualRate: 18.0, monthlyPayment: 150, remainingMonths: 0 },
    ]);
  }

  function updateDebt(idx: number, updated: DebtItem) {
    setDebts((prev) => prev.map((d, i) => (i === idx ? updated : d)));
  }

  function removeDebt(idx: number) {
    setDebts((prev) => prev.filter((_, i) => i !== idx));
  }

  const inputs: DebtConsolidationInputs = useMemo(
    () => ({
      currentMortgageBalance: mortgageBalance,
      currentMortgageRate: mortgageRate,
      currentMortgageRemainingMonths: mortgageMonths,
      currentMortgagePayment: mortgagePayment,
      homeValue,
      debts,
      newLoanRate: newRate,
      newLoanTermYears: newTerm,
      closingCostPercent: closingCostPct,
      holdingPeriodYears: holdingYears,
    }),
    [mortgageBalance, mortgageRate, mortgageMonths, mortgagePayment, homeValue, debts, newRate, newTerm, closingCostPct, holdingYears]
  );

  const r = useMemo(() => calculateDebtConsolidation(inputs), [inputs]);

  const savingsPositive = r.monthlySavings > 0;
  const lifetimeSavingsPositive = r.totalInterestSaved > 0;

  // Bar chart items
  const barItems = [
    { label: "Mortgage", balance: mortgageBalance, annualRate: mortgageRate, color: "#059669" },
    ...debts.map((d, i) => ({ label: d.label, balance: d.balance, annualRate: d.annualRate, color: DEBT_COLORS[i % DEBT_COLORS.length] })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debt Consolidation &amp; Blended Rate Refi</h1>
          <p className="text-gray-500 mt-1">
            Roll high-rate debts into a cash-out refinance and see the true cost comparison.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Inputs ── */}
          <div className="space-y-6">
            {/* Current Mortgage */}
            <div className="section-card space-y-4">
              <h2 className="font-semibold text-gray-800">Current Mortgage</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Remaining Balance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input type="number" value={mortgageBalance || ""} onChange={(e) => setMortgageBalance(Number(e.target.value))} className="input-field pl-7" />
                  </div>
                </div>
                <div>
                  <label className="input-label">Interest Rate</label>
                  <div className="relative">
                    <input type="number" value={mortgageRate || ""} step="0.125" onChange={(e) => setMortgageRate(Number(e.target.value))} className="input-field pr-7" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
                <div>
                  <label className="input-label">Monthly P&amp;I Payment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input type="number" value={mortgagePayment || ""} onChange={(e) => setMortgagePayment(Number(e.target.value))} className="input-field pl-7" />
                  </div>
                </div>
                <div>
                  <label className="input-label">Months Remaining</label>
                  <input type="number" value={mortgageMonths || ""} onChange={(e) => setMortgageMonths(Number(e.target.value))} className="input-field" />
                </div>
              </div>
              <div>
                <label className="input-label">Home Value</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input type="number" value={homeValue || ""} onChange={(e) => setHomeValue(Number(e.target.value))} className="input-field pl-7" />
                </div>
              </div>
            </div>

            {/* Debts to Consolidate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Debts to Consolidate</h2>
                {debts.length < 5 && (
                  <button
                    onClick={addDebt}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    + Add debt
                  </button>
                )}
              </div>
              {debts.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No debts added. Click "+ Add debt" to begin.</p>
              )}
              {debts.map((d, i) => (
                <DebtRow
                  key={i}
                  debt={d}
                  index={i}
                  color={DEBT_COLORS[i % DEBT_COLORS.length]}
                  onChange={(updated) => updateDebt(i, updated)}
                  onRemove={() => removeDebt(i)}
                />
              ))}
            </div>

            {/* New Loan */}
            <div className="section-card space-y-4">
              <h2 className="font-semibold text-gray-800">New Mortgage Loan</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="input-label">New Rate</label>
                  <div className="relative">
                    <input type="number" value={newRate || ""} step="0.125" onChange={(e) => setNewRate(Number(e.target.value))} className="input-field pr-7" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
                <div>
                  <label className="input-label">Term</label>
                  <select value={newTerm} onChange={(e) => setNewTerm(Number(e.target.value))} className="input-field">
                    <option value={30}>30 yr</option>
                    <option value={20}>20 yr</option>
                    <option value={15}>15 yr</option>
                    <option value={10}>10 yr</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Closing Costs</label>
                  <div className="relative">
                    <input type="number" value={closingCostPct || ""} step="0.25" onChange={(e) => setClosingCostPct(Number(e.target.value))} className="input-field pr-7" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                New loan amount: {fmt(r.newLoanAmount)} · Closing costs: {fmt(r.closingCosts)}
              </div>
              {/* Holding Period Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="input-label">How long do you plan to stay in this home?</label>
                  <span className="font-semibold text-gray-800 text-sm">{holdingYears} yr</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={holdingYears}
                  onChange={(e) => setHoldingYears(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>1 yr</span>
                  <span>30 yr</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Most homeowners move or refinance within 7–10 years. All savings calculations use this window.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Results ── */}
          <div className="space-y-6">
            {/* Blended Rate Section */}
            <div className="section-card space-y-4">
              <h2 className="font-semibold text-gray-800">Current Blended Rate</h2>
              <div className="text-center py-4">
                <p className="text-5xl font-bold text-gray-900 tabular-nums">
                  {fmtPct(r.blendedRate)}
                </p>
                <p className="text-gray-400 text-sm mt-1">weighted average across all debts</p>
                {r.blendedRate > newRate && (
                  <span className="inline-block mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    New rate {fmtPct(newRate)} is {(r.blendedRate - newRate).toFixed(2)}% lower
                  </span>
                )}
                {r.blendedRate <= newRate && (
                  <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    New rate {fmtPct(newRate)} is higher than blended rate
                  </span>
                )}
              </div>
              <BlendedRateBar items={barItems} totalBalance={r.totalCurrentBalance} />
            </div>

            {/* LTV Warning */}
            {r.ltvWarning && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-700">LTV Warning: {r.ltvPercent.toFixed(1)}%</p>
                <p className="text-xs text-amber-600 mt-1">
                  The consolidated loan ({fmt(r.newLoanAmount)}) is {r.ltvPercent.toFixed(1)}% of your
                  home value ({fmt(homeValue)}). Lenders typically require LTV ≤ 80% for a cash-out refi.
                  PMI or a higher rate may apply above 80%.
                </p>
              </div>
            )}

            {/* Monthly Comparison Hero */}
            <div className="section-card">
              <h2 className="font-semibold text-gray-800 mb-4">Monthly Payment Comparison</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Current (all payments)</p>
                  <p className="text-2xl font-bold text-gray-700">{fmtFull(r.totalCurrentMonthlyPayments)}</p>
                  <p className="text-xs text-gray-400 mt-1">{debts.length + 1} separate payments</p>
                </div>
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: savingsPositive ? "#f0fdf4" : "#fff7ed" }}
                >
                  <p className="text-xs text-gray-500 mb-1">New consolidated</p>
                  <p
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: savingsPositive ? "#059669" : "#d97706" }}
                  >
                    {fmtFull(r.newMonthlyPayment)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">1 payment</p>
                </div>
              </div>
              <div
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: savingsPositive ? "#ecfdf5" : "#fef3c7" }}
              >
                <p
                  className="text-lg font-bold"
                  style={{ color: savingsPositive ? "#059669" : "#d97706" }}
                >
                  {savingsPositive ? "−" : "+"}{fmtFull(Math.abs(r.monthlySavings))}/mo
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {savingsPositive ? "monthly savings" : "monthly increase"}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="result-card">
                <p className="text-xs text-gray-500">Break-Even</p>
                <p
                  className="text-xl font-bold"
                  style={{ color: r.reachesBreakEven ? "#059669" : "#d97706" }}
                >
                  {isFinite(r.breakEvenMonths) ? `${r.breakEvenMonths} mo` : "N/A"}
                </p>
                <p className="text-xs text-gray-400">
                  {r.reachesBreakEven
                    ? `within your ${holdingYears}-yr window`
                    : `beyond your ${holdingYears}-yr window`}
                </p>
              </div>
              <div className="result-card">
                <p className="text-xs text-gray-500">New LTV</p>
                <p
                  className="text-xl font-bold"
                  style={{ color: r.ltvWarning ? "#d97706" : "#059669" }}
                >
                  {r.ltvPercent.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">{fmt(r.newLoanAmount)} / {fmt(homeValue)}</p>
              </div>
              <div className="result-card">
                <p className="text-xs text-gray-500">Total Debt Consolidated</p>
                <p className="text-xl font-bold text-gray-800">{fmt(r.totalCurrentBalance)}</p>
                <p className="text-xs text-gray-400">{debts.length + 1} obligations</p>
              </div>
              <div className="result-card">
                <p className="text-xs text-gray-500">Closing Costs</p>
                <p className="text-xl font-bold text-gray-800">{fmt(r.closingCosts)}</p>
                <p className="text-xs text-gray-400">{closingCostPct}% of new loan</p>
              </div>
            </div>

            {/* Total Interest Comparison */}
            <div className="section-card space-y-3">
              <div className="flex items-baseline justify-between">
                <h2 className="font-semibold text-gray-800">Interest Comparison</h2>
                <span className="text-xs text-gray-400">over {holdingYears}-year window</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Interest at current pace ({holdingYears} yr)</span>
                  <span className="font-semibold text-gray-800">{fmt(r.currentInterestInHoldingPeriod)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Interest on new loan ({holdingYears} yr)</span>
                  <span className="font-semibold text-gray-800">{fmt(r.newLoanInterestInHoldingPeriod)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Closing costs</span>
                  <span className="font-semibold text-gray-800">{fmt(r.closingCosts)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-semibold text-gray-800">Net over {holdingYears} years</span>
                  <span
                    className="font-bold text-base"
                    style={{ color: lifetimeSavingsPositive ? "#059669" : "#dc2626" }}
                  >
                    {lifetimeSavingsPositive ? "Save " : "Cost "}
                    {fmt(Math.abs(r.totalInterestSaved))}
                  </span>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div
              className="rounded-xl border p-5 space-y-2"
              style={{
                backgroundColor: r.consolidationMakesFinancialSense ? "#f0fdf4" : "#fef2f2",
                borderColor: r.consolidationMakesFinancialSense ? "#bbf7d0" : "#fecaca",
              }}
            >
              <p
                className="font-semibold"
                style={{ color: r.consolidationMakesFinancialSense ? "#166534" : "#991b1b" }}
              >
                {r.consolidationMakesFinancialSense
                  ? "Consolidation looks financially favorable"
                  : "Consolidation may cost more over time"}
              </p>
              <p
                className="text-sm"
                style={{ color: r.consolidationMakesFinancialSense ? "#15803d" : "#b91c1c" }}
              >
                {r.consolidationMakesFinancialSense
                  ? `Lower monthly payment and lower interest over your ${holdingYears}-year window. Break-even on closing costs in ${r.breakEvenMonths} months.`
                  : !savingsPositive
                  ? "The new rate doesn't reduce your monthly payment. Consider a shorter term or lower rate."
                  : !r.reachesBreakEven
                  ? `You save ${fmt(r.monthlySavings)}/mo but won't recoup ${fmt(r.closingCosts)} in closing costs within ${holdingYears} years (break-even is ${r.breakEvenMonths} months). Stay longer or negotiate lower closing costs.`
                  : `Monthly payments drop but interest over ${holdingYears} years is higher by ${fmt(Math.abs(r.totalInterestSaved))}. You're stretching short-term debt into a ${newTerm}-year window.`}
              </p>
            </div>

            {/* Debt Breakdown Table */}
            <div className="section-card overflow-x-auto">
              <h2 className="font-semibold text-gray-800 mb-3">Debt Breakdown</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {["Debt", "Balance", "Rate", "Payment", "Est. Interest"].map((h) => (
                      <th key={h} className="text-left py-1.5 pr-3 text-gray-500 font-medium text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.breakdown.map((item, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: i === 0 ? "#059669" : DEBT_COLORS[(i - 1) % DEBT_COLORS.length] }}
                          />
                          <span className="text-gray-700">{item.label}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-3 tabular-nums text-gray-700">{fmt(item.balance)}</td>
                      <td className="py-2 pr-3 tabular-nums text-gray-700">{fmtPct(item.annualRate)}</td>
                      <td className="py-2 pr-3 tabular-nums text-gray-700">{fmtFull(item.monthlyPayment)}</td>
                      <td className="py-2 tabular-nums text-gray-700">{fmt(item.totalInterestRemaining)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-2 pr-3 text-gray-800">Total</td>
                    <td className="py-2 pr-3 tabular-nums text-gray-800">{fmt(r.totalCurrentBalance)}</td>
                    <td className="py-2 pr-3 tabular-nums text-gray-800">{fmtPct(r.blendedRate)}</td>
                    <td className="py-2 pr-3 tabular-nums text-gray-800">{fmtFull(r.totalCurrentMonthlyPayments)}</td>
                    <td className="py-2 tabular-nums text-gray-800">{fmt(r.totalCurrentInterestRemaining)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Important caveat */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 space-y-2">
              <p className="font-semibold text-amber-800">Important: Lower payment ≠ lower cost</p>
              <p>
                Rolling short-term debt (credit cards, auto loans) into a 30-year mortgage extends
                their repayment window dramatically. Even at a lower rate, you may pay significantly
                more in total interest. Review the lifetime comparison above before deciding.
              </p>
            </div>

            <p className="text-xs text-gray-400">
              Estimates only. Actual rates, fees, and qualification depend on your credit profile,
              home equity, and lender. Consult a licensed loan officer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { calculatePaymentStrategy, StrategyResult } from "@/lib/calculators";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtFull = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

function monthsToLabel(months: number) {
  const yrs = Math.floor(months / 12);
  const mo = months % 12;
  if (mo === 0) return `${yrs} yr`;
  return `${yrs} yr ${mo} mo`;
}

const STRATEGIES = [
  { key: "baseline",       color: "#94a3b8", dash: ""        },
  { key: "extraMonthly",   color: "#059669", dash: ""        },
  { key: "biWeekly",       color: "#2563eb", dash: "5 5"    },
  { key: "oneExtraPerYear",color: "#d97706", dash: "8 4"    },
  { key: "lumpSum",        color: "#7c3aed", dash: "3 3"    },
] as const;

type StrategyKey = typeof STRATEGIES[number]["key"];

function SavingsBadge({ months, interest }: { months: number; interest: number }) {
  if (months <= 0 && interest <= 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {months > 0 && (
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
          {monthsToLabel(months)} faster
        </span>
      )}
      {interest > 0 && (
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
          {fmt(interest)} saved
        </span>
      )}
    </div>
  );
}

function StrategyCard({
  result,
  color,
  isBaseline,
  isSelected,
  onClick,
}: {
  result: StrategyResult;
  color: string;
  isBaseline: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full rounded-xl border p-4 transition-all ${
        isSelected
          ? "ring-2 shadow-sm"
          : "bg-white hover:shadow-sm"
      }`}
      style={isSelected ? { borderColor: color, ringColor: color } as React.CSSProperties : {}}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="font-semibold text-gray-800 text-sm">{result.label}</span>
        {isBaseline && (
          <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-auto">baseline</span>
        )}
      </div>
      <p className="text-xs text-gray-400 ml-5 mb-2">{result.description}</p>
      <div className="ml-5 space-y-0.5">
        <p className="text-xs text-gray-600">
          Payoff: <strong>{monthsToLabel(result.payoffMonths)}</strong>
        </p>
        <p className="text-xs text-gray-600">
          Total interest: <strong>{fmt(result.totalInterest)}</strong>
        </p>
        {!isBaseline && (
          <SavingsBadge months={result.monthsSaved} interest={result.interestSaved} />
        )}
      </div>
    </button>
  );
}

export default function PaymentStrategyPage() {
  const [loanAmount, setLoanAmount] = useState(400000);
  const [rate, setRate] = useState(7.0);
  const [termYears, setTermYears] = useState(30);
  const [extraMonthly, setExtraMonthly] = useState(200);
  const [lumpSum, setLumpSum] = useState(10000);
  const [selectedKeys, setSelectedKeys] = useState<Set<StrategyKey>>(
    new Set<StrategyKey>(["baseline", "extraMonthly", "biWeekly"])
  );

  function toggleStrategy(key: StrategyKey) {
    if (key === "baseline") return; // baseline always shown
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const results = useMemo(
    () =>
      calculatePaymentStrategy({
        loanAmount,
        interestRate: rate,
        loanTermYears: termYears,
        extraMonthlyPayment: extraMonthly,
        oneExtraPerYear: true,
        lumpSumPayment: lumpSum,
      }),
    [loanAmount, rate, termYears, extraMonthly, lumpSum]
  );

  const strategyMap: Record<StrategyKey, StrategyResult> = {
    baseline: results.baseline,
    extraMonthly: results.extraMonthly,
    biWeekly: results.biWeekly,
    oneExtraPerYear: results.oneExtraPerYear,
    lumpSum: results.lumpSum,
  };

  // Build chart data: one point per year
  const chartData = useMemo(() => {
    const maxLen = Math.max(
      ...STRATEGIES.map((s) => strategyMap[s.key].yearlyBalances.length)
    );
    return Array.from({ length: maxLen }, (_, i) => {
      const obj: Record<string, number | string> = { year: i };
      STRATEGIES.forEach((s) => {
        const bal = strategyMap[s.key].yearlyBalances[i];
        obj[s.key] = bal !== undefined ? bal : 0;
      });
      return obj;
    });
  }, [results]);

  // Best strategy (most interest saved, excluding baseline)
  const best = STRATEGIES.filter((s) => s.key !== "baseline").reduce((a, b) =>
    strategyMap[a.key].interestSaved >= strategyMap[b.key].interestSaved ? a : b
  );

  const tableRows = [
    { label: "Payoff Timeline", fmt: (r: StrategyResult) => monthsToLabel(r.payoffMonths) },
    { label: "Monthly Payment", fmt: (r: StrategyResult) => fmtFull(r.effectiveMonthlyPayment) },
    { label: "Total Interest", fmt: (r: StrategyResult) => fmt(r.totalInterest) },
    { label: "Total Cost", fmt: (r: StrategyResult) => fmt(r.totalPaid) },
    { label: "Interest Saved", fmt: (r: StrategyResult) => r.interestSaved > 0 ? fmt(r.interestSaved) : "—" },
    { label: "Time Saved", fmt: (r: StrategyResult) => r.monthsSaved > 0 ? monthsToLabel(r.monthsSaved) : "—" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Strategy Optimizer</h1>
          <p className="text-gray-500 mt-1">
            Compare payoff strategies side-by-side to see how much interest you can save.
          </p>
        </div>

        {/* Loan Inputs */}
        <div className="section-card">
          <h2 className="font-semibold text-gray-800 mb-4">Loan Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="input-label">Loan Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={loanAmount || ""}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="input-field pl-7"
                />
              </div>
            </div>
            <div>
              <label className="input-label">Interest Rate</label>
              <div className="relative">
                <input
                  type="number"
                  value={rate || ""}
                  step="0.125"
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="input-field pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label className="input-label">Loan Term</label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="input-field"
              >
                <option value={30}>30 years</option>
                <option value={20}>20 years</option>
                <option value={15}>15 years</option>
                <option value={10}>10 years</option>
              </select>
            </div>
            <div>
              <label className="input-label">Base P&amp;I Payment</label>
              <div className="input-field bg-gray-50 text-gray-700 font-medium">
                {fmtFull(results.baseMonthlyPi)}
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Inputs + Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strategy config */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">Configure Strategies</h2>

            {/* Extra Monthly */}
            <div className="section-card space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="font-medium text-gray-800 text-sm">Extra Monthly Payment</span>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="input-label">Amount added to each payment</label>
                  <span className="font-semibold text-gray-800 text-sm">{fmt(extraMonthly)}/mo</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={50}
                  value={extraMonthly}
                  onChange={(e) => setExtraMonthly(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>$0</span>
                  <span>$2,000</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Effective payment: {fmtFull(results.baseMonthlyPi + extraMonthly)}/mo
              </p>
            </div>

            {/* Bi-weekly — no config needed */}
            <div className="section-card">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="font-medium text-gray-800 text-sm">Bi-Weekly Payments</span>
              </div>
              <p className="text-xs text-gray-500">
                Pay {fmtFull(results.baseMonthlyPi / 2)} every two weeks — 26 half-payments/year
                equals 13 full payments instead of 12. No extra monthly cash required.
              </p>
            </div>

            {/* One Extra Per Year — no config */}
            <div className="section-card">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-medium text-gray-800 text-sm">One Extra Payment/Year</span>
              </div>
              <p className="text-xs text-gray-500">
                Make one additional full payment ({fmtFull(results.baseMonthlyPi)}) applied
                entirely to principal once per year. Equivalent to ~{fmtFull(results.baseMonthlyPi / 12)}/mo extra.
              </p>
            </div>

            {/* Lump Sum */}
            <div className="section-card space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-600" />
                <span className="font-medium text-gray-800 text-sm">One-Time Lump Sum</span>
              </div>
              <div>
                <label className="input-label">Principal payment made today</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={lumpSum || ""}
                    onChange={(e) => setLumpSum(Number(e.target.value))}
                    className="input-field pl-7"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                New balance after lump sum: {fmt(Math.max(0, loanAmount - lumpSum))}
              </p>
            </div>
          </div>

          {/* Strategy Cards */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">Results</h2>
            {STRATEGIES.map(({ key, color }) => (
              <StrategyCard
                key={key}
                result={strategyMap[key]}
                color={color}
                isBaseline={key === "baseline"}
                isSelected={selectedKeys.has(key)}
                onClick={() => toggleStrategy(key)}
              />
            ))}
          </div>
        </div>

        {/* Best Strategy Callout */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: best.color }} />
          </div>
          <div>
            <p className="font-semibold text-emerald-800">
              Best strategy: {strategyMap[best.key].label}
            </p>
            <p className="text-sm text-emerald-700 mt-0.5">
              Saves {fmt(strategyMap[best.key].interestSaved)} in interest and pays off{" "}
              {monthsToLabel(strategyMap[best.key].monthsSaved)} earlier than the standard schedule.
            </p>
          </div>
        </div>

        {/* Balance Over Time Chart */}
        <div className="section-card">
          <h2 className="font-semibold text-gray-800 mb-5">Loan Balance Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <defs>
                {STRATEGIES.map(({ key, color }) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(v) => `Yr ${v}`}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={55}
              />
              <Tooltip
                formatter={(value) => fmt(value as number)}
                labelFormatter={(l) => `Year ${l}`}
              />
              <Legend />
              {STRATEGIES.map(({ key, color, dash }) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={strategyMap[key].label}
                  stroke={color}
                  strokeWidth={key === "baseline" ? 1.5 : 2}
                  strokeDasharray={dash}
                  fill={`url(#grad-${key})`}
                  dot={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison Table */}
        <div className="section-card overflow-x-auto">
          <h2 className="font-semibold text-gray-800 mb-4">Full Comparison</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-gray-500 font-medium w-36">Metric</th>
                {STRATEGIES.map(({ key, color }) => (
                  <th key={key} className="text-right py-2 px-3 font-medium">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-gray-700">{strategyMap[key].label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map(({ label, fmt: fmtFn }) => (
                <tr key={label} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-2.5 pr-4 text-gray-500">{label}</td>
                  {STRATEGIES.map(({ key }) => {
                    const val = fmtFn(strategyMap[key]);
                    const isBaseline = key === "baseline";
                    const isBest =
                      !isBaseline &&
                      (label === "Interest Saved" || label === "Time Saved") &&
                      key === best.key &&
                      val !== "—";
                    return (
                      <td
                        key={key}
                        className={`py-2.5 px-3 text-right tabular-nums ${
                          isBaseline ? "text-gray-400" : "text-gray-800"
                        } ${isBest ? "font-bold text-emerald-600" : ""}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How-to note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-2 text-sm text-blue-700">
          <p className="font-semibold text-blue-800">Tips for using this calculator</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Extra payments go directly to principal — confirm with your lender that no prepayment penalty applies.</li>
            <li>Bi-weekly programs offered by lenders sometimes charge a setup fee; you can replicate the strategy yourself for free by adding {fmtFull(results.baseMonthlyPi / 12)}/mo.</li>
            <li>A lump sum works best early in the loan when the interest-to-principal ratio is highest.</li>
            <li>Combining strategies (e.g., bi-weekly + extra monthly) compounds the savings.</li>
          </ul>
        </div>

        <p className="text-xs text-gray-400">
          Estimates assume a fixed interest rate and that extra payments are applied to principal immediately. Actual results vary by lender.
        </p>
      </div>
    </div>
  );
}

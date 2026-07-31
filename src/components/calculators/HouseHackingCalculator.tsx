// Ported from the nested mortgage-calculator-suite project. Logic unchanged;
// standalone page chrome removed so it embeds in a page or service layout.
"use client";

import { useState, useMemo } from "react";
import {
  calculateHouseHacking,
  HouseHackingInputs,
  RentalUnit,
} from "@/lib/calculators";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtFull = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (n: number) => `${n.toFixed(1)}%`;

const UNIT_COLORS = ["#059669", "#2563eb", "#d97706", "#dc2626"];
const UNIT_LABELS_BY_COUNT: Record<number, string[]> = {
  2: ["Unit 2 (Rental)"],
  3: ["Unit 2 (Rental)", "Unit 3 (Rental)"],
  4: ["Unit 2 (Rental)", "Unit 3 (Rental)", "Unit 4 (Rental)"],
};

const DEFAULT_RENTS: Record<number, number[]> = {
  2: [1800],
  3: [1600, 1600],
  4: [1400, 1400, 1400],
};

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="input-label">{label}</label>
        <span className="font-semibold text-gray-800 text-sm">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function UnitCard({
  unit,
  color,
  onChange,
}: {
  unit: RentalUnit;
  index: number;
  color: string;
  onChange: (rent: number) => void;
}) {
  return (
    <div className="border rounded-xl p-4" style={{ borderColor: color + "60" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-medium text-gray-700 text-sm">{unit.label}</span>
      </div>
      <div>
        <label className="input-label">Monthly Rent</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <input
            type="number"
            value={unit.monthlyRent || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className="input-field pl-7"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}

function DtiBar({ label, value, threshold = 45 }: { label: string; value: number; threshold?: number }) {
  const capped = Math.min(value, 60);
  const color = value <= 36 ? "#059669" : value <= 43 ? "#d97706" : "#dc2626";
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-semibold" style={{ color }}>{fmtPct(value)} DTI</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${(capped / 60) * 100}%`, backgroundColor: color }}
        />
        <div
          className="absolute top-0 bottom-0 w-px bg-amber-400 opacity-60"
          style={{ left: `${(threshold / 60) * 100}%` }}
        />
      </div>
      <div className="flex justify-end mt-0.5">
        <span className="text-xs text-gray-400">{threshold}% guideline</span>
      </div>
    </div>
  );
}

export default function HouseHackingCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(450000);
  const [downPct, setDownPct] = useState(5);
  const [rate, setRate] = useState(7.0);
  const [termYears, setTermYears] = useState(30);
  const [numberOfUnits, setNumberOfUnits] = useState<2 | 3 | 4>(2);
  const [rentalUnits, setRentalUnits] = useState<RentalUnit[]>([
    { label: "Unit 2 (Rental)", monthlyRent: 1800 },
  ]);
  const [monthlyTax, setMonthlyTax] = useState(400);
  const [monthlyInsurance, setMonthlyInsurance] = useState(150);
  const [monthlyHoa, setMonthlyHoa] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(7000);
  const [otherDebts, setOtherDebts] = useState(400);

  // Sync rental units when unit count changes
  function handleUnitCountChange(n: 2 | 3 | 4) {
    setNumberOfUnits(n);
    const labels = UNIT_LABELS_BY_COUNT[n];
    const defaults = DEFAULT_RENTS[n];
    setRentalUnits(labels.map((label, i) => ({
      label,
      monthlyRent: defaults[i],
    })));
  }

  function updateRent(idx: number, rent: number) {
    setRentalUnits((prev) => prev.map((u, i) => i === idx ? { ...u, monthlyRent: rent } : u));
  }

  const inputs: HouseHackingInputs = useMemo(() => ({
    purchasePrice,
    downPaymentPercent: downPct,
    interestRate: rate,
    loanTermYears: termYears,
    numberOfUnits,
    rentalUnits,
    monthlyPropertyTax: monthlyTax,
    monthlyInsurance,
    monthlyHoa,
    grossMonthlyIncome: monthlyIncome,
    otherMonthlyDebts: otherDebts,
  }), [purchasePrice, downPct, rate, termYears, numberOfUnits, rentalUnits, monthlyTax, monthlyInsurance, monthlyHoa, monthlyIncome, otherDebts]);

  const r = useMemo(() => calculateHouseHacking(inputs), [inputs]);

  const effectiveIsNegative = r.effectiveMonthlyCost < 0;
  const effectiveColor = effectiveIsNegative
    ? "#059669"
    : r.effectiveMonthlyCost < r.monthlyPiti * 0.5
    ? "#2563eb"
    : r.effectiveMonthlyCost < r.monthlyPiti
    ? "#d97706"
    : "#dc2626";

  return (
    <div className="not-prose space-y-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Inputs ── */}
          <div className="space-y-6">
            {/* Property */}
            <div className="section-card space-y-4">
              <h2 className="font-semibold text-gray-800">Property</h2>

              {/* Unit Count Selector */}
              <div>
                <label className="input-label mb-2 block">Number of Units</label>
                <div className="grid grid-cols-3 gap-2">
                  {([2, 3, 4] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => handleUnitCountChange(n)}
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                        numberOfUnits === n
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-emerald-400"
                      }`}
                    >
                      {n}-Unit
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  You occupy Unit 1 · {numberOfUnits - 1} rental unit{numberOfUnits > 2 ? "s" : ""}
                </p>
              </div>

              <div>
                <label className="input-label">Purchase Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={purchasePrice || ""}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="input-field pl-7"
                  />
                </div>
              </div>

              <Slider
                label="Down Payment"
                value={downPct}
                min={0}
                max={40}
                step={0.5}
                format={(v) => `${v}% — ${fmt(purchasePrice * v / 100)}`}
                onChange={setDownPct}
              />

              <div className="grid grid-cols-2 gap-4">
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
                  </select>
                </div>
              </div>
            </div>

            {/* Monthly Costs */}
            <div className="section-card space-y-4">
              <h2 className="font-semibold text-gray-800">Monthly Costs</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="input-label">Property Tax</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={monthlyTax || ""}
                      onChange={(e) => setMonthlyTax(Number(e.target.value))}
                      className="input-field pl-7"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">Insurance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={monthlyInsurance || ""}
                      onChange={(e) => setMonthlyInsurance(Number(e.target.value))}
                      className="input-field pl-7"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">HOA</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={monthlyHoa || ""}
                      onChange={(e) => setMonthlyHoa(Number(e.target.value))}
                      className="input-field pl-7"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Income & Debts */}
            <div className="section-card space-y-4">
              <h2 className="font-semibold text-gray-800">Your Finances</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Gross Monthly Income</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={monthlyIncome || ""}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="input-field pl-7"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">Other Monthly Debts</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={otherDebts || ""}
                      onChange={(e) => setOtherDebts(Number(e.target.value))}
                      className="input-field pl-7"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Results ── */}
          <div className="space-y-6">
            {/* Rental Units */}
            <div className="section-card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Rental Units</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  {numberOfUnits - 1} unit{numberOfUnits > 2 ? "s" : ""} rented
                </span>
              </div>

              {/* Owner unit */}
              <div className="border rounded-xl p-4 bg-emerald-50 border-emerald-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span className="font-medium text-emerald-800 text-sm">Unit 1 — You Live Here</span>
                </div>
                <p className="text-xs text-emerald-600 mt-1 ml-5">Owner-occupied unit</p>
              </div>

              {rentalUnits.map((unit, idx) => (
                <UnitCard
                  key={idx}
                  unit={unit}
                  index={idx}
                  color={UNIT_COLORS[idx + 1]}
                  onChange={(rent) => updateRent(idx, rent)}
                />
              ))}
            </div>

            {/* Hero: Effective Monthly Cost */}
            <div className="section-card text-center py-8">
              <p className="text-sm text-gray-500 mb-1">Your Effective Monthly Housing Cost</p>
              <div
                className="text-5xl font-bold tabular-nums mb-2"
                style={{ color: effectiveColor }}
              >
                {effectiveIsNegative ? "+" : ""}{fmt(Math.abs(r.effectiveMonthlyCost))}
              </div>
              <p className="text-gray-400 text-sm">
                {effectiveIsNegative
                  ? `tenants cover PITI + ${fmt(Math.abs(r.effectiveMonthlyCost))}/mo surplus`
                  : `after ${fmtPct(r.rentOffsetPercent)} offset from rent (${fmt(r.grossMonthlyRent)}/mo)`}
              </p>

              {/* Offset bar */}
              <div className="mt-5 mx-4">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(r.rentOffsetPercent, 100)}%`,
                      backgroundColor: effectiveColor,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Rent covers {fmtPct(Math.min(r.rentOffsetPercent, 100))} of PITI</span>
                  <span>Full PITI {fmtFull(r.monthlyPiti)}</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="result-card">
                <p className="text-xs text-gray-500">Total PITI Payment</p>
                <p className="text-xl font-bold text-gray-800">{fmtFull(r.monthlyPiti)}</p>
                <p className="text-xs text-gray-400">P&I {fmtFull(r.monthlyPi)}</p>
              </div>
              <div className="result-card">
                <p className="text-xs text-gray-500">Gross Monthly Rent</p>
                <p className="text-xl font-bold text-emerald-600">{fmtFull(r.grossMonthlyRent)}</p>
                <p className="text-xs text-gray-400">{fmt(r.annualRentalIncome)}/yr</p>
              </div>
              <div className="result-card">
                <p className="text-xs text-gray-500">Qualifying Rent (75%)</p>
                <p className="text-xl font-bold text-blue-600">{fmtFull(r.qualifyingRentalIncome)}</p>
                <p className="text-xs text-gray-400">lender uses this figure</p>
              </div>
              <div className="result-card">
                <p className="text-xs text-gray-500">Units to Break Even</p>
                <p className="text-xl font-bold text-gray-800">
                  {isFinite(r.unitsNeededToBreakEven)
                    ? `${r.unitsNeededToBreakEven} of ${numberOfUnits - 1}`
                    : "N/A"}
                </p>
                <p className="text-xs text-gray-400">avg {fmtFull(r.averageUnitRent)}/unit</p>
              </div>
            </div>

            {/* DTI Section */}
            <div className="section-card space-y-5">
              <h2 className="font-semibold text-gray-800">Debt-to-Income Analysis</h2>
              <DtiBar label="Without rental income (traditional DTI)" value={r.dtiWithoutRent} />
              <DtiBar label="With qualifying rent offset (lender DTI)" value={r.dtiWithQualifyingRent} />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                Qualifying rent ({fmtFull(r.qualifyingRentalIncome)}/mo) reduces your effective
                housing expense, lowering DTI from{" "}
                <strong>{fmtPct(r.dtiWithoutRent)}</strong> to{" "}
                <strong>{fmtPct(r.dtiWithQualifyingRent)}</strong>.
              </div>
              <div className="pt-1">
                <p className="text-xs text-gray-500 mb-1">Estimated Affordable Purchase Price</p>
                <p className="text-2xl font-bold text-gray-800">{fmt(r.maxAffordablePurchasePrice)}</p>
                <p className="text-xs text-gray-400">at 45% DTI guideline, {downPct}% down, with qualifying rent</p>
              </div>
            </div>

            {/* Down Payment Requirements */}
            <div className="section-card space-y-3">
              <h2 className="font-semibold text-gray-800">Minimum Down Payment by Program</h2>
              <p className="text-xs text-gray-400">
                For owner-occupied {numberOfUnits}-unit properties
              </p>
              {[
                {
                  label: "FHA",
                  pct: "3.5%",
                  amount: r.minDownPaymentFha,
                  note: "Owner-occupied 1–4 units",
                  color: "#2563eb",
                  highlight: downPct >= 3.5,
                },
                {
                  label: "Conventional",
                  pct: numberOfUnits === 2 ? "15%" : "25%",
                  amount: r.minDownPaymentConventional,
                  note: numberOfUnits === 2 ? "2-unit: 15% min" : "3–4 unit: 25% min",
                  color: "#059669",
                  highlight: downPct >= (numberOfUnits === 2 ? 15 : 25),
                },
                {
                  label: "VA",
                  pct: "0%",
                  amount: r.minDownPaymentVa,
                  note: "Eligible veterans only",
                  color: "#7c3aed",
                  highlight: true,
                },
              ].map(({ label, pct, amount, note, color, highlight }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between rounded-lg p-3 border ${
                    highlight ? "bg-gray-50 border-gray-200" : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: color }} />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{label}</p>
                      <p className="text-xs text-gray-400">{note}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{pct}</p>
                    <p className="text-xs text-gray-500">{fmt(amount)}</p>
                  </div>
                </div>
              ))}
              {downPct < (numberOfUnits === 2 ? 15 : 25) && downPct >= 3.5 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                  At {downPct}% down on a {numberOfUnits}-unit, FHA is likely your best
                  conventional path. Conventional requires{" "}
                  {numberOfUnits === 2 ? "15%" : "25%"} for this unit count.
                </div>
              )}
            </div>

            {/* Payment Waterfall */}
            <div className="section-card space-y-2">
              <h2 className="font-semibold text-gray-800 mb-3">Monthly Payment Waterfall</h2>
              {[
                { label: "Principal & Interest", value: r.monthlyPi, color: "#059669" },
                { label: "Property Tax", value: monthlyTax, color: "#2563eb" },
                { label: "Insurance", value: monthlyInsurance, color: "#7c3aed" },
                ...(monthlyHoa > 0 ? [{ label: "HOA", value: monthlyHoa, color: "#d97706" }] : []),
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-sm text-gray-600 flex-1">{label}</span>
                  <span className="text-sm font-medium text-gray-800">{fmtFull(value)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gray-700" />
                  <span className="text-sm font-semibold text-gray-800 flex-1">Total PITI</span>
                  <span className="text-sm font-bold text-gray-900">{fmtFull(r.monthlyPiti)}</span>
                </div>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-emerald-500" />
                  <span className="text-sm text-emerald-700 flex-1">Rental Income Offset</span>
                  <span className="text-sm font-medium text-emerald-600">− {fmtFull(r.grossMonthlyRent)}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: effectiveColor }} />
                  <span className="text-sm font-bold flex-1" style={{ color: effectiveColor }}>
                    Effective Monthly Cost
                  </span>
                  <span className="text-sm font-bold" style={{ color: effectiveColor }}>
                    {effectiveIsNegative ? "surplus " : ""}{fmtFull(Math.abs(r.effectiveMonthlyCost))}
                  </span>
                </div>
              </div>
            </div>

            {/* Education Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-emerald-800">How House Hacking Works</h3>
              <div className="space-y-2 text-sm text-emerald-700">
                <div className="flex gap-2">
                  <span className="font-bold text-emerald-600">1.</span>
                  <span>Buy a 2–4 unit property with owner-occupied financing (lower rates &amp; down payments).</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-emerald-600">2.</span>
                  <span>Live in one unit. Rent the others at market rates.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-emerald-600">3.</span>
                  <span>Tenants pay a portion (or all) of your mortgage — your effective housing cost drops.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-emerald-600">4.</span>
                  <span>Lenders use 75% of market rent to qualify you, reducing DTI and raising buying power.</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 leading-relaxed">
              Estimates only. Down payment minimums, qualifying rent guidelines, and loan programs vary by lender and change frequently. Consult a licensed loan officer for actual qualification.
            </p>
          </div>
        </div>
      </div>
  );
}

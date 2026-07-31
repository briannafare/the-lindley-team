"use client";

import { useState, useMemo } from "react";
import { calculateAffordability, AffordabilityScenario } from "@/lib/calculators";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtFull = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (n: number, d = 1) => `${n.toFixed(d)}%`;

const SCENARIO_META = {
  conservative: { color: "#059669", bg: "#f0fdf4", border: "#bbf7d0", label: "Conservative", sub: "36% DTI" },
  standard:     { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", label: "Standard",     sub: "43% DTI" },
  aggressive:   { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Aggressive",   sub: "50% DTI" },
} as const;

function ScenarioCard({
  scenario,
  meta,
  isRecommended,
  isCashCapped,
  cashCap,
}: {
  scenario: AffordabilityScenario;
  meta: typeof SCENARIO_META[keyof typeof SCENARIO_META];
  isRecommended: boolean;
  isCashCapped: boolean;
  cashCap: number;
}) {
  const displayPrice = isCashCapped && isRecommended ? cashCap : scenario.maxPriceByIncome;
  return (
    <div
      className={`rounded-xl border p-5 space-y-3 transition-all ${isRecommended ? "ring-2 shadow-md" : ""}`}
      style={{
        backgroundColor: meta.bg,
        borderColor: meta.border,
        ...(isRecommended ? { outlineColor: meta.color } as React.CSSProperties : {}),
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: meta.color }} />
            <span className="font-semibold text-gray-800">{meta.label}</span>
            {isRecommended && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                style={{ backgroundColor: meta.color }}
              >
                recommended
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 ml-5">{meta.sub} back-end DTI</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums" style={{ color: meta.color }}>
            {fmt(displayPrice)}
          </p>
          {isCashCapped && isRecommended && (
            <p className="text-xs text-gray-400">cash-limited (income allows {fmt(scenario.maxPriceByIncome)})</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm ml-5">
        <span className="text-gray-500">Monthly PITI</span>
        <span className="font-medium text-gray-800 text-right">{fmtFull(scenario.monthlyPiti)}</span>
        <span className="text-gray-500">Loan amount</span>
        <span className="font-medium text-gray-800 text-right">{fmt(scenario.loanAmount)}</span>
        <span className="text-gray-500">Effective DTI</span>
        <span className="font-medium text-gray-800 text-right">{fmtPct(scenario.effectiveDti)}</span>
      </div>
    </div>
  );
}

function InputDollar({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  helper?: string;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input-field pl-7"
        />
      </div>
      {helper && <p className="text-xs text-gray-400 mt-0.5">{helper}</p>}
    </div>
  );
}

function InputPct({
  label,
  value,
  onChange,
  step = "0.1",
  helper,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: string;
  helper?: string;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value || ""}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input-field pr-7"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
      </div>
      {helper && <p className="text-xs text-gray-400 mt-0.5">{helper}</p>}
    </div>
  );
}

export default function AffordabilityPage() {
  // Income & debts
  const [annualIncome, setAnnualIncome] = useState(95000);
  const [otherDebts, setOtherDebts] = useState(500);

  // Cash
  const [totalCash, setTotalCash] = useState(60000);
  const [downPct, setDownPct] = useState(10);
  const [closingCostPct, setClosingCostPct] = useState(3.0);

  // Loan
  const [rate, setRate] = useState(7.0);
  const [termYears, setTermYears] = useState(30);

  // Ongoing costs
  const [taxRate, setTaxRate] = useState(1.2);
  const [insRate, setInsRate] = useState(0.5);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  const results = useMemo(
    () =>
      calculateAffordability({
        grossAnnualIncome: annualIncome,
        otherMonthlyDebts: otherDebts,
        totalCashAvailable: totalCash,
        downPaymentPercent: downPct,
        interestRate: rate,
        loanTermYears: termYears,
        annualPropertyTaxRate: taxRate,
        annualInsuranceRate: insRate,
        monthlyHoa,
        closingCostPercent: closingCostPct,
      }),
    [annualIncome, otherDebts, totalCash, downPct, rate, termYears, taxRate, insRate, monthlyHoa, closingCostPct]
  );

  const r = results;
  const isCashBound = r.bindingConstraint === "cash";

  // Price bar: show recommended vs conservative vs aggressive span
  const barMax = r.aggressive.maxPriceByIncome * 1.05;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">How Much House Can I Afford?</h1>
          <p className="text-gray-500 mt-1">
            Based on your income, debts, and available cash — three scenarios, one recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Inputs ── */}
          <div className="space-y-6">
            {/* Income & Debts */}
            <div className="section-card space-y-4">
              <h2 className="font-semibold text-gray-800">Income &amp; Debts</h2>
              <InputDollar
                label="Gross Annual Income"
                value={annualIncome}
                onChange={setAnnualIncome}
                helper={`${fmt(annualIncome / 12)}/mo gross`}
              />
              <InputDollar
                label="Other Monthly Debts"
                value={otherDebts}
                onChange={setOtherDebts}
                helper="Car payments, student loans, minimum credit card payments"
              />
            </div>

            {/* Cash */}
            <div className="section-card space-y-4">
              <h2 className="font-semibold text-gray-800">Available Cash</h2>
              <InputDollar
                label="Total Cash for Down Payment &amp; Closing"
                value={totalCash}
                onChange={setTotalCash}
                helper="Everything you plan to put toward the purchase"
              />
              <div className="grid grid-cols-2 gap-4">
                <InputPct
                  label="Down Payment"
                  value={downPct}
                  onChange={setDownPct}
                  helper={`${fmt(r.downPaymentAmount)} at max cash price`}
                />
                <InputPct
                  label="Closing Costs"
                  value={closingCostPct}
                  onChange={setClosingCostPct}
                  helper={`${fmt(r.closingCostsAmount)} estimated`}
                />
              </div>
              {r.cashReserve < 2000 && r.maxPriceByCash > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                  Less than {fmt(2000)} remaining after down payment and closing costs. Consider keeping 1–3 months of payments as an emergency reserve.
                </div>
              )}
            </div>

            {/* Loan Details */}
            <div className="section-card space-y-4">
              <h2 className="font-semibold text-gray-800">Loan Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <InputPct label="Interest Rate" value={rate} onChange={setRate} step="0.125" />
                <div>
                  <label className="input-label">Loan Term</label>
                  <select value={termYears} onChange={(e) => setTermYears(Number(e.target.value))} className="input-field">
                    <option value={30}>30 years</option>
                    <option value={20}>20 years</option>
                    <option value={15}>15 years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ongoing Costs */}
            <div className="section-card space-y-4">
              <h2 className="font-semibold text-gray-800">Estimated Ongoing Costs</h2>
              <p className="text-xs text-gray-400 -mt-2">
                Expressed as % of home value so calculations scale with price.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <InputPct
                  label="Annual Property Tax Rate"
                  value={taxRate}
                  onChange={setTaxRate}
                  helper="Varies widely by state/county"
                />
                <InputPct
                  label="Annual Insurance Rate"
                  value={insRate}
                  onChange={setInsRate}
                  helper="Typically 0.25–1%"
                />
              </div>
              <InputDollar label="Monthly HOA" value={monthlyHoa} onChange={setMonthlyHoa} />
            </div>
          </div>

          {/* ── Right: Results ── */}
          <div className="space-y-6">
            {/* Recommended Hero */}
            <div className="section-card text-center py-8 space-y-2">
              <p className="text-sm text-gray-500">Recommended Purchase Price</p>
              <p className="text-5xl font-bold text-blue-600 tabular-nums">
                {fmt(r.recommendedPrice)}
              </p>
              <p className="text-gray-400 text-sm">
                {isCashBound
                  ? "Limited by available cash — income would support more"
                  : "Based on 43% back-end DTI with your income and debts"}
              </p>
              {isCashBound && (
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-xs text-amber-700 mt-1">
                  Cash is the binding constraint — save more to buy more
                </div>
              )}
            </div>

            {/* Monthly at Recommended */}
            <div className="section-card space-y-3">
              <h2 className="font-semibold text-gray-800">Monthly Payment Breakdown</h2>
              <p className="text-xs text-gray-400">At recommended price of {fmt(r.recommendedPrice)}</p>
              {[
                { label: "Principal & Interest", value: r.recommendedScenario.monthlyPi, color: "#059669" },
                { label: "Property Tax", value: r.recommendedScenario.monthlyTax, color: "#2563eb" },
                { label: "Insurance", value: r.recommendedScenario.monthlyInsurance, color: "#7c3aed" },
                ...(monthlyHoa > 0 ? [{ label: "HOA", value: monthlyHoa, color: "#d97706" }] : []),
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-sm text-gray-600 flex-1">{label}</span>
                  <span className="text-sm font-medium text-gray-800">{fmtFull(value)}</span>
                </div>
              ))}
              <div className="border-t pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-700 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 flex-1">Total PITI</span>
                  <span className="text-sm font-bold text-gray-900">{fmtFull(r.recommendedScenario.monthlyPiti)}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total monthly obligations</span>
                  <span className="font-medium text-gray-800">
                    {fmtFull(r.recommendedScenario.monthlyPiti + otherDebts)}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500">Gross monthly income</span>
                  <span className="font-medium text-gray-800">{fmtFull(r.grossMonthlyIncome)}</span>
                </div>
                <div className="flex justify-between mt-1 font-semibold">
                  <span className="text-gray-700">Back-end DTI</span>
                  <span className="text-blue-600">{fmtPct(r.recommendedScenario.effectiveDti)}</span>
                </div>
              </div>
            </div>

            {/* Cash Summary */}
            <div className="section-card space-y-2">
              <h2 className="font-semibold text-gray-800 mb-1">Cash Needed to Close</h2>
              {[
                { label: "Down payment", value: r.downPaymentAmount, color: "#059669" },
                { label: `Closing costs (~${closingCostPct}%)`, value: r.closingCostsAmount, color: "#2563eb" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-sm text-gray-600 flex-1">{label}</span>
                  <span className="text-sm font-medium text-gray-800">{fmt(value)}</span>
                </div>
              ))}
              <div className="border-t pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-600 flex-1">Total cash available</span>
                  <span className="text-sm font-medium text-gray-800">{fmt(totalCash)}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: r.cashReserve >= 2000 ? "#059669" : "#d97706" }}
                  />
                  <span className="text-sm text-gray-600 flex-1">Remaining reserve</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: r.cashReserve >= 2000 ? "#059669" : "#d97706" }}
                  >
                    {fmt(r.cashReserve)}
                  </span>
                </div>
              </div>
            </div>

            {/* Three Scenarios */}
            <div className="space-y-3">
              <h2 className="font-semibold text-gray-800">Price Range by DTI</h2>
              <p className="text-xs text-gray-400">
                Income-based prices assume sufficient cash for down payment &amp; closing costs.
              </p>

              {/* Price range bar */}
              <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                {(["conservative", "standard", "aggressive"] as const).map((key) => {
                  const s = r[key];
                  const meta = SCENARIO_META[key];
                  const w = barMax > 0 ? (s.maxPriceByIncome / barMax) * 100 : 0;
                  return (
                    <div
                      key={key}
                      className="absolute inset-y-0 left-0 rounded-full opacity-80"
                      style={{ width: `${w}%`, backgroundColor: meta.color }}
                    />
                  );
                })}
                {/* Cash cap marker */}
                {isCashBound && barMax > 0 && (
                  <div
                    className="absolute inset-y-0 w-0.5 bg-amber-500 opacity-80"
                    style={{ left: `${(r.maxPriceByCash / barMax) * 100}%` }}
                    title={`Cash limit: ${fmt(r.maxPriceByCash)}`}
                  />
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>$0</span>
                <span>{fmt(Math.round(barMax / 1000) * 1000)}</span>
              </div>

              {(["conservative", "standard", "aggressive"] as const).map((key) => (
                <ScenarioCard
                  key={key}
                  scenario={r[key]}
                  meta={SCENARIO_META[key]}
                  isRecommended={key === "standard"}
                  isCashCapped={isCashBound}
                  cashCap={r.maxPriceByCash}
                />
              ))}
            </div>

            {/* Down Payment Impact */}
            <div className="section-card space-y-2">
              <h2 className="font-semibold text-gray-800">Down Payment Breakdown</h2>
              <p className="text-xs text-gray-400">At recommended price — different down payment options</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {["Down %", "Down Amt", "Loan", "Monthly P&I"].map((h) => (
                      <th key={h} className="text-left py-1.5 pr-2 text-gray-500 font-medium text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[3, 5, 10, 20].map((pct) => {
                    const price = r.recommendedPrice;
                    const down = price * pct / 100;
                    const loan = price - down;
                    const rateM = rate / 100 / 12;
                    const n = termYears * 12;
                    const factor = Math.pow(1 + rateM, n);
                    const pi = rateM > 0 ? loan * (rateM * factor) / (factor - 1) : loan / n;
                    const isCurrent = pct === downPct;
                    return (
                      <tr key={pct} className={`border-b last:border-0 ${isCurrent ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                        <td className={`py-2 pr-2 font-medium ${isCurrent ? "text-blue-700" : "text-gray-700"}`}>{pct}%</td>
                        <td className="py-2 pr-2 tabular-nums text-gray-700">{fmt(down)}</td>
                        <td className="py-2 pr-2 tabular-nums text-gray-700">{fmt(loan)}</td>
                        <td className="py-2 tabular-nums text-gray-700">{fmtFull(pi)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-2 text-sm text-blue-700">
              <p className="font-semibold text-blue-800">What these numbers don't include</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>Private Mortgage Insurance (PMI) — required below 20% down on conventional loans</li>
                <li>Maintenance and repairs — budget 1–2% of home value per year</li>
                <li>Utilities, moving costs, and furnishings for a new home</li>
                <li>FHA mortgage insurance premium (MIP) if using an FHA loan</li>
                <li>Rate adjustments based on your credit score — a higher score lowers your rate</li>
              </ul>
            </div>

            <p className="text-xs text-gray-400">
              Estimates only. Actual qualifying amounts depend on credit score, loan program, lender overlays, and local tax rates. Consult a licensed loan officer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

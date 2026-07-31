"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  calculateConventionalPayment,
  buildAmortizationSchedule,
  ConventionalInputs,
  ConventionalOutputs,
} from "@/lib/calculators";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatPercent,
  formatDate,
} from "@/lib/format";

// Lazy-load the chart so recharts is code-split out of every page that only
// uses the compact variant (the service pages). Only /calculator pays for it.
const AmortizationChart = dynamic(
  () => import("@/components/calculators/AmortizationChart"),
  { ssr: false, loading: () => <div className="h-[280px]" /> },
);

type Variant = "full" | "compact";
type Occupancy = "primary" | "second_home" | "investment";

const LOAN_TERMS = [15, 20, 25, 30];
const CREDIT_SCORE_OPTIONS = [
  { label: "780–761", midpoint: 770 },
  { label: "760–741", midpoint: 750 },
  { label: "740–721", midpoint: 730 },
  { label: "720–701", midpoint: 710 },
  { label: "700–681", midpoint: 690 },
  { label: "680–661", midpoint: 670 },
  { label: "660–641", midpoint: 650 },
  { label: "640–621", midpoint: 630 },
  { label: "620–601", midpoint: 610 },
  { label: "600–581", midpoint: 590 },
];

// Payment-composition data-viz palette (distinct, accessible hues).
const BREAKDOWN_COLORS = {
  pi: "#059669",
  mi: "#6366F1",
  tax: "#0EA5E9",
  insurance: "#F59E0B",
  hoa: "#8B5CF6",
};

function parseCurrencyInput(val: string): number {
  return Number(val.replace(/[^0-9.-]/g, "")) || 0;
}

/* ── Reusable inputs ── */

function CurrencyInput({
  label,
  value,
  onChange,
  helper,
  prefix = "$",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  helper?: string;
  prefix?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [displayVal, setDisplayVal] = useState("");
  const formatted = value
    ? Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "";

  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-400">
          {prefix}
        </span>
        <input
          type="text"
          inputMode="numeric"
          className="input-field pl-8"
          value={focused ? displayVal : formatted}
          onFocus={() => {
            setFocused(true);
            setDisplayVal(value ? String(value) : "");
          }}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, "");
            setDisplayVal(raw);
            onChange(Number(raw) || 0);
          }}
        />
      </div>
      {helper && <p className="input-helper">{helper}</p>}
    </div>
  );
}

function PercentInput({
  label,
  value,
  onChange,
  helper,
  step = 0.125,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  helper?: string;
  step?: number;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        <input
          type="number"
          step={step}
          min={0}
          max={100}
          className="input-field pr-8"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-400">
          %
        </span>
      </div>
      {helper && <p className="input-helper">{helper}</p>}
    </div>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`section-card ${className}`}>
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  );
}

function BreakdownRow({
  label,
  amount,
  color,
}: {
  label: string;
  amount: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5">
        <span
          className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-ink-700">{label}</span>
      </div>
      <span className="text-sm font-semibold text-ink-900 tabular-nums whitespace-nowrap">
        {formatCurrencyPrecise(amount)}
      </span>
    </div>
  );
}

function PaymentDonut({
  results,
  colors,
}: {
  results: ConventionalOutputs;
  colors: Record<string, string>;
}) {
  const total = results.totalMonthlyPayment;
  if (total <= 0) return null;

  const segments = [
    { amount: results.monthlyPrincipalAndInterest, color: colors.pi },
    { amount: results.monthlyMi, color: colors.mi },
    { amount: results.monthlyPropertyTax, color: colors.tax },
    { amount: results.monthlyHomeownersInsurance, color: colors.insurance },
    { amount: results.monthlyHoa, color: colors.hoa },
  ].filter((s) => s.amount > 0);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="relative flex-shrink-0">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {segments.map((seg, i) => {
          const pct = seg.amount / total;
          const dashLength = pct * circumference;
          const dashOffset = -accumulated * circumference;
          accumulated += pct;
          return (
            <circle
              key={i}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              transform="rotate(-90 90 90)"
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-ink-500">Monthly</span>
        <span className="font-display text-lg font-bold text-ink-900 tabular-nums whitespace-nowrap">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

function DonutLegendRow({
  label,
  amount,
  total,
  color,
}: {
  label: string;
  amount: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-3 w-3 flex-shrink-0 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <span className="flex-1 text-sm text-ink-700">{label}</span>
      <span className="w-12 text-right text-sm text-ink-500 tabular-nums whitespace-nowrap">
        {pct.toFixed(0)}%
      </span>
      <span className="w-20 text-right text-sm font-medium text-ink-900 tabular-nums whitespace-nowrap">
        {formatCurrencyPrecise(amount)}
      </span>
    </div>
  );
}

/* ── Toggle buttons ── */

function OptionRow<T extends string | number | boolean>({
  label,
  options,
  value,
  onChange,
  active = "ink",
}: {
  label: string;
  options: { label: string; val: T }[];
  value: T;
  onChange: (v: T) => void;
  active?: "ink" | "accent";
}) {
  const activeClass =
    active === "accent"
      ? "bg-accent text-white border-accent"
      : "bg-ink-900 text-white border-ink-900";
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={String(opt.val)}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`flex-1 cursor-pointer rounded-xl border py-2.5 text-sm font-medium transition-all duration-200 ${
              value === opt.val
                ? activeClass
                : "border-surface-300 bg-white text-ink-700 hover:border-ink-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Shared calculator state ── */

function useCalculator() {
  const [homePrice, setHomePrice] = useState(550000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [downPaymentDollars, setDownPaymentDollars] = useState(110000);
  const [loanAmountOverride, setLoanAmountOverride] = useState(0);
  const [interestRate, setInterestRate] = useState(6.875);
  const [loanTerm, setLoanTerm] = useState(30);
  const [isFixed, setIsFixed] = useState(true);
  const [occupancy, setOccupancy] = useState<Occupancy>("primary");
  const [isCashOutRefi, setIsCashOutRefi] = useState(false);
  const [creditScore, setCreditScore] = useState(750);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(5400);
  const [annualInsurance, setAnnualInsurance] = useState(1800);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  const handleDownPaymentPercent = useCallback(
    (pct: number) => {
      setDownPaymentPercent(pct);
      setDownPaymentDollars(Math.round((pct / 100) * homePrice));
    },
    [homePrice],
  );

  const handleDownPaymentDollars = useCallback(
    (dollars: number) => {
      setDownPaymentDollars(dollars);
      setDownPaymentPercent(
        homePrice > 0 ? Math.round((dollars / homePrice) * 10000) / 100 : 0,
      );
    },
    [homePrice],
  );

  const handleHomePriceChange = useCallback(
    (price: number) => {
      setHomePrice(price);
      setDownPaymentDollars(Math.round((downPaymentPercent / 100) * price));
    },
    [downPaymentPercent],
  );

  const effectiveLoanAmount =
    loanAmountOverride > 0 ? loanAmountOverride : homePrice - downPaymentDollars;

  const inputs: ConventionalInputs = useMemo(
    () => ({
      homePrice,
      downPayment: downPaymentDollars,
      loanAmount: effectiveLoanAmount,
      interestRate,
      loanTermYears: loanTerm,
      isFixed,
      occupancy,
      isCashOutRefi,
      estimatedCreditScore: creditScore,
      annualPropertyTax,
      annualHomeownersInsurance: annualInsurance,
      monthlyHoa,
      startDate: new Date(),
    }),
    [
      homePrice,
      downPaymentDollars,
      effectiveLoanAmount,
      interestRate,
      loanTerm,
      isFixed,
      occupancy,
      isCashOutRefi,
      creditScore,
      annualPropertyTax,
      annualInsurance,
      monthlyHoa,
    ],
  );

  const results = useMemo(() => calculateConventionalPayment(inputs), [inputs]);
  const amortizationData = useMemo(
    () => buildAmortizationSchedule(effectiveLoanAmount, interestRate, loanTerm),
    [effectiveLoanAmount, interestRate, loanTerm],
  );

  return {
    homePrice,
    downPaymentPercent,
    downPaymentDollars,
    loanAmountOverride,
    setLoanAmountOverride,
    interestRate,
    setInterestRate,
    loanTerm,
    setLoanTerm,
    isFixed,
    setIsFixed,
    occupancy,
    setOccupancy,
    isCashOutRefi,
    setIsCashOutRefi,
    creditScore,
    setCreditScore,
    annualPropertyTax,
    setAnnualPropertyTax,
    annualInsurance,
    setAnnualInsurance,
    monthlyHoa,
    setMonthlyHoa,
    handleDownPaymentPercent,
    handleDownPaymentDollars,
    handleHomePriceChange,
    effectiveLoanAmount,
    results,
    amortizationData,
  };
}

/* ── Compact variant — simplified estimate that links to the full tool ── */

function CompactCalculator(c: ReturnType<typeof useCalculator>) {
  const { results } = c;
  return (
    <div className="rounded-[2rem] border border-border bg-paper p-6 shadow-[0_24px_70px_rgba(0,0,0,0.06)] sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-light">
              Quick estimate
            </p>
            <h3 className="font-display text-2xl font-bold text-ink">
              Estimate your monthly payment
            </h3>
          </div>
          <div className="space-y-4">
            <CurrencyInput
              label="Home price"
              value={c.homePrice}
              onChange={c.handleHomePriceChange}
            />
            <div className="grid grid-cols-2 gap-3">
              <CurrencyInput
                label="Down payment"
                value={c.downPaymentDollars}
                onChange={c.handleDownPaymentDollars}
              />
              <PercentInput
                label="Down %"
                value={c.downPaymentPercent}
                onChange={c.handleDownPaymentPercent}
                step={1}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PercentInput
                label="Interest rate"
                value={c.interestRate}
                onChange={c.setInterestRate}
                step={0.125}
              />
              <OptionRow
                label="Term"
                options={[
                  { label: "15", val: 15 },
                  { label: "30", val: 30 },
                ]}
                value={c.loanTerm}
                onChange={c.setLoanTerm}
              />
            </div>
          </div>
        </div>

        <div className="result-card flex flex-col">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-ink-500">
            Estimated monthly payment
          </p>
          <p className="font-display text-4xl font-bold leading-none text-ink-900">
            {formatCurrency(results.totalMonthlyPayment)}
          </p>
          <p className="mt-2 text-sm text-ink-500">
            {c.loanTerm}-year fixed at {c.interestRate}%
          </p>
          <div className="mt-5 space-y-1 border-t border-surface-200 pt-4">
            <BreakdownRow
              label="Principal & interest"
              amount={results.monthlyPrincipalAndInterest}
              color={BREAKDOWN_COLORS.pi}
            />
            {results.monthlyMi > 0 && (
              <BreakdownRow
                label="Mortgage insurance"
                amount={results.monthlyMi}
                color={BREAKDOWN_COLORS.mi}
              />
            )}
            <BreakdownRow
              label="Taxes & insurance"
              amount={
                results.monthlyPropertyTax + results.monthlyHomeownersInsurance
              }
              color={BREAKDOWN_COLORS.tax}
            />
          </div>
          <Link
            href="/calculator"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[0.75rem] font-bold uppercase tracking-[0.04em] text-white transition-all hover:scale-[1.03]"
          >
            Open the full calculator <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Full variant — comprehensive conventional calculator ── */

function FullCalculator(c: ReturnType<typeof useCalculator>) {
  const { results, effectiveLoanAmount, amortizationData } = c;
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      {/* LEFT — Inputs */}
      <div className="space-y-5 lg:col-span-5">
        <Section title="Loan details">
          <div className="space-y-4">
            <CurrencyInput
              label="Home price"
              value={c.homePrice}
              onChange={c.handleHomePriceChange}
            />
            <div className="grid grid-cols-2 gap-3">
              <CurrencyInput
                label="Down payment"
                value={c.downPaymentDollars}
                onChange={c.handleDownPaymentDollars}
              />
              <PercentInput
                label="Down payment %"
                value={c.downPaymentPercent}
                onChange={c.handleDownPaymentPercent}
                step={1}
              />
            </div>
            <div>
              <label className="input-label">Loan amount</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-400">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="input-field bg-surface-50 pl-8"
                  value={
                    c.loanAmountOverride > 0
                      ? c.loanAmountOverride.toLocaleString()
                      : effectiveLoanAmount.toLocaleString()
                  }
                  onChange={(e) =>
                    c.setLoanAmountOverride(parseCurrencyInput(e.target.value))
                  }
                />
              </div>
              <p className="input-helper">
                Auto-calculated from price minus down payment. Edit to override.
              </p>
            </div>
            <PercentInput
              label="Interest rate"
              value={c.interestRate}
              onChange={c.setInterestRate}
              step={0.125}
              helper="Annual rate. Use 0.125% increments."
            />
            <OptionRow
              label="Loan term"
              options={LOAN_TERMS.map((t) => ({ label: `${t} yr`, val: t }))}
              value={c.loanTerm}
              onChange={c.setLoanTerm}
            />
            <OptionRow
              label="Loan type"
              options={[
                { label: "Fixed", val: true },
                { label: "ARM", val: false },
              ]}
              value={c.isFixed}
              onChange={c.setIsFixed}
            />
            <OptionRow
              label="Occupancy"
              options={[
                { label: "Primary", val: "primary" as Occupancy },
                { label: "2nd Home", val: "second_home" as Occupancy },
                { label: "Investment", val: "investment" as Occupancy },
              ]}
              value={c.occupancy}
              onChange={c.setOccupancy}
            />
            <div className="flex items-center justify-between py-1">
              <label className="input-label mb-0">Cash-out refinance</label>
              <button
                type="button"
                aria-pressed={c.isCashOutRefi}
                onClick={() => c.setIsCashOutRefi(!c.isCashOutRefi)}
                className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ${
                  c.isCashOutRefi ? "bg-accent" : "bg-surface-300"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    c.isCashOutRefi ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </Section>

        <Section title="Credit profile">
          <label className="input-label">Estimated credit score</label>
          <div className="grid grid-cols-5 gap-1.5">
            {CREDIT_SCORE_OPTIONS.map((opt) => (
              <button
                key={opt.midpoint}
                type="button"
                onClick={() => c.setCreditScore(opt.midpoint)}
                className={`cursor-pointer rounded-lg border px-1 py-2 text-xs font-medium transition-all duration-150 ${
                  c.creditScore === opt.midpoint
                    ? "border-accent bg-accent text-white"
                    : "border-surface-300 bg-white text-ink-700 hover:border-ink-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="input-helper mt-2">
            Your credit score affects mortgage insurance rates. Select the range
            that best matches your score.
          </p>
        </Section>

        <Section title="Property costs">
          <div className="space-y-4">
            <CurrencyInput
              label="Annual property tax"
              value={c.annualPropertyTax}
              onChange={c.setAnnualPropertyTax}
              helper="Check your county assessor's website for exact amounts."
            />
            <CurrencyInput
              label="Annual homeowners insurance"
              value={c.annualInsurance}
              onChange={c.setAnnualInsurance}
              helper="Typical range: $1,200–$3,600 per year."
            />
            <CurrencyInput
              label="Monthly HOA dues"
              value={c.monthlyHoa}
              onChange={c.setMonthlyHoa}
              helper="Leave at $0 if not applicable."
            />
          </div>
        </Section>
      </div>

      {/* RIGHT — Results */}
      <div className="space-y-5 lg:col-span-7">
        <div className="result-card border border-surface-200 bg-gradient-to-br from-white to-surface-50">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-ink-500">
            Your estimated monthly payment
          </p>
          <p className="font-display text-5xl font-bold leading-none tracking-tight text-ink-900 sm:text-6xl">
            {formatCurrency(results.totalMonthlyPayment)}
          </p>
          <p className="mt-2 text-sm text-ink-500">
            {c.loanTerm}-year {c.isFixed ? "fixed" : "ARM"} at {c.interestRate}%
          </p>

          <div className="mt-6 border-t border-surface-200 pt-6">
            <BreakdownRow
              label="Principal & interest"
              amount={results.monthlyPrincipalAndInterest}
              color={BREAKDOWN_COLORS.pi}
            />
            {results.monthlyMi > 0 && (
              <BreakdownRow
                label="Mortgage insurance"
                amount={results.monthlyMi}
                color={BREAKDOWN_COLORS.mi}
              />
            )}
            <BreakdownRow
              label="Property tax"
              amount={results.monthlyPropertyTax}
              color={BREAKDOWN_COLORS.tax}
            />
            <BreakdownRow
              label="Homeowners insurance"
              amount={results.monthlyHomeownersInsurance}
              color={BREAKDOWN_COLORS.insurance}
            />
            {results.monthlyHoa > 0 && (
              <BreakdownRow
                label="HOA dues"
                amount={results.monthlyHoa}
                color={BREAKDOWN_COLORS.hoa}
              />
            )}
            <div className="mt-1 flex items-center justify-between border-t border-surface-200 pt-3">
              <span className="text-sm font-semibold text-ink-900">Total</span>
              <span className="text-base font-bold text-ink-900 tabular-nums whitespace-nowrap">
                {formatCurrencyPrecise(results.totalMonthlyPayment)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="result-card text-center">
            <p className="mb-1 text-xs uppercase tracking-wider text-ink-500">
              LTV
            </p>
            <p className="font-display text-2xl font-bold text-ink-900 tabular-nums whitespace-nowrap">
              {formatPercent(results.ltv, 0)}
            </p>
            {results.ltv > 0.8 && (
              <p className="mt-1 text-xs text-warning">MI required</p>
            )}
          </div>
          <div className="result-card text-center">
            <p className="mb-1 text-xs uppercase tracking-wider text-ink-500">
              Total interest
            </p>
            <p className="font-display text-2xl font-bold text-ink-900 tabular-nums whitespace-nowrap">
              {formatCurrency(results.totalInterestPaid)}
            </p>
            <p className="mt-1 text-xs text-ink-400">over {c.loanTerm} years</p>
          </div>
          <div className="result-card text-center">
            <p className="mb-1 text-xs uppercase tracking-wider text-ink-500">
              Payoff date
            </p>
            <p
              className="font-display text-xl font-bold text-ink-900"
              suppressHydrationWarning
            >
              {formatDate(results.payoffDate)}
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {c.loanTerm * 12} payments
            </p>
          </div>
        </div>

        <div className="result-card">
          <h3 className="section-title">Payment composition</h3>
          <div className="flex flex-col items-center gap-8 sm:flex-row">
            <PaymentDonut results={results} colors={BREAKDOWN_COLORS} />
            <div className="w-full flex-1 space-y-2">
              <DonutLegendRow
                label="Principal & interest"
                amount={results.monthlyPrincipalAndInterest}
                total={results.totalMonthlyPayment}
                color={BREAKDOWN_COLORS.pi}
              />
              {results.monthlyMi > 0 && (
                <DonutLegendRow
                  label="Mortgage insurance"
                  amount={results.monthlyMi}
                  total={results.totalMonthlyPayment}
                  color={BREAKDOWN_COLORS.mi}
                />
              )}
              <DonutLegendRow
                label="Property tax"
                amount={results.monthlyPropertyTax}
                total={results.totalMonthlyPayment}
                color={BREAKDOWN_COLORS.tax}
              />
              <DonutLegendRow
                label="Insurance"
                amount={results.monthlyHomeownersInsurance}
                total={results.totalMonthlyPayment}
                color={BREAKDOWN_COLORS.insurance}
              />
              {results.monthlyHoa > 0 && (
                <DonutLegendRow
                  label="HOA"
                  amount={results.monthlyHoa}
                  total={results.totalMonthlyPayment}
                  color={BREAKDOWN_COLORS.hoa}
                />
              )}
            </div>
          </div>
        </div>

        {amortizationData.length > 0 && (
          <div className="result-card">
            <h3 className="section-title">Amortization schedule</h3>
            <AmortizationChart data={amortizationData} />
          </div>
        )}

        <p className="px-1 text-xs leading-relaxed text-ink-400">
          This calculator provides estimates for informational purposes only.
          Actual rates, payments, and terms may vary. Mortgage insurance rates
          are based on Arch MI rate cards and may not reflect your exact
          scenario. Contact The Lindley Team for a personalized quote.
        </p>
      </div>
    </div>
  );
}

export default function MortgageCalculator({
  variant = "full",
}: {
  variant?: Variant;
}) {
  const calc = useCalculator();
  return variant === "compact" ? (
    <CompactCalculator {...calc} />
  ) : (
    <FullCalculator {...calc} />
  );
}

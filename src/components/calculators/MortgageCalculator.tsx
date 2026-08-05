"use client";

import { useMemo, useState } from "react";

interface CalcResults {
  monthlyPayment: number;
  principal: number;
  interest: number;
  taxes: number;
  insurance: number;
  pmi: number;
  totalPayment: number;
  totalInterest: number;
}

const formatCurrency = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);

export default function MortgageCalculator({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const [homePrice, setHomePrice] = useState(500000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [taxes, setTaxes] = useState(5000);
  const [insurance, setInsurance] = useState(1500);
  const [showForm, setShowForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const results = useMemo<CalcResults>(() => {
    const downPayment = homePrice * (downPaymentPct / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;

    const monthlyPI =
      monthlyRate === 0
        ? loanAmount / numPayments
        : (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const monthlyTaxes = taxes / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyPMI = downPaymentPct < 20 ? (loanAmount * 0.005) / 12 : 0;
    const totalMonthly = monthlyPI + monthlyTaxes + monthlyInsurance + monthlyPMI;
    const totalInterest = monthlyPI * numPayments - loanAmount;

    return {
      monthlyPayment: totalMonthly,
      principal: monthlyPI - loanAmount * monthlyRate,
      interest: loanAmount * monthlyRate,
      taxes: monthlyTaxes,
      insurance: monthlyInsurance,
      pmi: monthlyPMI,
      totalPayment: totalMonthly,
      totalInterest,
    };
  }, [homePrice, downPaymentPct, rate, term, taxes, insurance]);

  const loanAmount = useMemo(
    () => homePrice - homePrice * (downPaymentPct / 100),
    [homePrice, downPaymentPct]
  );

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const webhookUrl = process.env.NEXT_PUBLIC_GHL_CALC_WEBHOOK || "";
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "calculator",
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          home_price: homePrice,
          loan_amount: loanAmount,
          rate,
          term,
          down_payment_pct: downPaymentPct,
          monthly_payment: results.monthlyPayment,
        }),
      }).catch(() => {});
    }

    setLeadCaptured(true);
    setShowForm(false);
    setSubmitting(false);
  };

  const calcPmiPayoffMonth = () => {
    if (downPaymentPct >= 20) return null;

    const targetBalance = homePrice * 0.8;
    const monthlyRate = rate / 100 / 12;
    let balance = homePrice - homePrice * (downPaymentPct / 100);
    const monthlyPI = results.principal + results.interest;

    for (let month = 1; month <= term * 12; month++) {
      const interestPart = balance * monthlyRate;
      const principalPart = monthlyPI - interestPart;
      balance -= principalPart;
      if (balance <= targetBalance) return month;
    }
    return null;
  };

  const calcAmortizationAt = (yearTarget: number) => {
    const monthlyRate = rate / 100 / 12;
    let balance = homePrice - homePrice * (downPaymentPct / 100);
    const monthlyPI = results.principal + results.interest;
    const months = Math.min(term * 12, yearTarget * 12);

    for (let m = 0; m < months; m++) {
      const interestPart = balance * monthlyRate;
      const principalPart = monthlyPI - interestPart;
      balance = Math.max(0, balance - principalPart);
    }

    return { balance, equity: homePrice - balance };
  };

  const pmiPayoffMonth = leadCaptured ? calcPmiPayoffMonth() : null;
  const amort1 = leadCaptured ? calcAmortizationAt(1) : null;
  const amort5 = leadCaptured && term >= 5 ? calcAmortizationAt(5) : null;
  const amort10 = leadCaptured && term >= 10 ? calcAmortizationAt(10) : null;

  const showFullInputs = variant === "full";

  return (
    <div className="bg-white rounded-[2rem] border border-border p-8 shadow-[0_28px_80px_rgba(34,34,34,0.08)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[560px]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-light mb-2">
            Mortgage calculator
          </p>
          <h3 className="font-display text-2xl font-extrabold text-ink mb-3">
            Estimate your monthly payment.
          </h3>
          <p className="text-sm text-ink-mid leading-relaxed">
            Run Portland mortgage numbers with loan amount, down payment, interest rate, and loan term. The calculator includes taxes, insurance, and PMI so you can compare real payment scenarios.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[1.5rem] bg-bg-alt border border-border px-4 py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-ink-light mb-1">
              Loan amount
            </p>
            <p className="font-display text-lg font-bold text-ink">
              {formatCurrency(loanAmount)}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-bg-alt border border-border px-4 py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-ink-light mb-1">
              Estimated payment
            </p>
            <p className="font-display text-lg font-bold text-ink">
              {formatCurrency(results.monthlyPayment)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="space-y-6 rounded-[1.75rem] border border-border bg-bg-alt p-6">
          <div>
            <div className="flex justify-between items-baseline gap-4 mb-3">
              <div>
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink">
                  Home Price
                </p>
                <p className="font-display text-xl font-bold text-ink">
                  {formatCurrency(homePrice)}
                </p>
              </div>
              <p className="text-sm text-ink-light">
                {formatCurrency(100000)} – {formatCurrency(2000000)}
              </p>
            </div>
            <input
              type="range"
              min={100000}
              max={2000000}
              step={10000}
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full accent-orange"
              aria-label="Home price"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline gap-4 mb-3">
              <div>
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink">
                  Down Payment
                </p>
                <p className="font-display text-xl font-bold text-ink">
                  {downPaymentPct}% ({formatCurrency(homePrice * (downPaymentPct / 100))})
                </p>
              </div>
              <p className="text-sm text-ink-light">
                0% – 40%
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="w-full accent-orange"
              aria-label="Down payment percentage"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-2">
                Interest Rate
              </label>
              <div className="flex items-center border border-border rounded-xl px-3 py-2 bg-white">
                <input
                  type="number"
                  value={rate}
                  step={0.125}
                  min={0}
                  max={15}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full text-sm font-semibold bg-transparent outline-none"
                  aria-label="Interest rate"
                />
                <span className="text-ink-light text-sm ml-2">%</span>
              </div>
            </div>

            <div>
              <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-2">
                Loan Term
              </label>
              <div className="flex gap-2">
                {[15, 20, 30].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTerm(t)}
                    className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                      term === t
                        ? "bg-ink text-white"
                        : "border-border text-ink hover:border-ink"
                    }`}
                    aria-pressed={term === t}
                  >
                    {t}yr
                  </button>
                ))}
              </div>
            </div>
          </div>

          {showFullInputs && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-2">
                  Annual Taxes
                </label>
                <div className="flex items-center border border-border rounded-xl px-3 py-2 bg-white">
                  <span className="text-ink-light text-sm mr-2">$</span>
                  <input
                    type="number"
                    value={taxes}
                    step={100}
                    min={0}
                    onChange={(e) => setTaxes(Number(e.target.value))}
                    className="w-full text-sm font-semibold bg-transparent outline-none"
                    aria-label="Annual property taxes"
                  />
                </div>
              </div>
              <div>
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-2">
                  Annual Insurance
                </label>
                <div className="flex items-center border border-border rounded-xl px-3 py-2 bg-white">
                  <span className="text-ink-light text-sm mr-2">$</span>
                  <input
                    type="number"
                    value={insurance}
                    step={100}
                    min={0}
                    onChange={(e) => setInsurance(Number(e.target.value))}
                    className="w-full text-sm font-semibold bg-transparent outline-none"
                    aria-label="Annual homeowners insurance"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[1.75rem] border border-border bg-white p-6">
          <div className="text-center mb-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-light mb-3">
              Estimated monthly payment
            </p>
            <p className="font-display text-[3rem] font-extrabold text-ink leading-none">
              {formatCurrency(results.monthlyPayment)}
            </p>
            <p className="text-sm text-ink-light mt-2">
              on a {formatCurrency(loanAmount)} loan
            </p>
          </div>

          {!leadCaptured ? (
            <div className="space-y-4">
              <div className="rounded-[1.5rem] bg-bg-alt p-4 text-center">
                <p className="text-sm text-ink-mid">
                  Unlock the full amortization, PMI, and interest breakdown when you request your detailed summary.
                </p>
              </div>
              <div className="space-y-3">
                {!showForm ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="w-full inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0.04em] text-white transition-all hover:scale-[1.02]"
                    >
                      Get your full breakdown
                    </button>
                    <p className="text-center text-[0.72rem] text-ink-light">
                      We&apos;ll email a personalized mortgage summary, including taxes, insurance, and PMI.
                    </p>
                  </>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full rounded-xl border border-border bg-bg-alt px-4 py-2 text-sm outline-none focus:border-ink focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="jane@email.com"
                        className="w-full rounded-xl border border-border bg-bg-alt px-4 py-2 text-sm outline-none focus:border-ink focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-1">
                        Phone
                        <span className="ml-1 text-[0.75rem] font-normal text-ink-light">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="(503) 555-1234"
                        className="w-full rounded-xl border border-border bg-bg-alt px-4 py-2 text-sm outline-none focus:border-ink focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0.04em] text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02]"
                      >
                        {submitting ? "Sending..." : "Show my full breakdown"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-[0.72rem] text-ink-light hover:text-ink transition-colors"
                      >
                        ← Back
                      </button>
                    </div>
                    <p className="text-center text-[0.68rem] text-ink-light">
                      No spam. Just your mortgage numbers.
                    </p>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-bg-alt p-4">
                  <p className="text-[0.72rem] uppercase tracking-[0.18em] text-ink-light mb-1">
                    Principal & Interest
                  </p>
                  <p className="font-semibold text-ink">
                    {formatCurrency(results.principal + results.interest)}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-bg-alt p-4">
                  <p className="text-[0.72rem] uppercase tracking-[0.18em] text-ink-light mb-1">
                    Total interest
                  </p>
                  <p className="font-semibold text-ink">
                    {formatCurrency(results.totalInterest)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-ink-mid">
                <div className="flex justify-between">
                  <span>Property Taxes</span>
                  <span>{formatCurrency(results.taxes)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance</span>
                  <span>{formatCurrency(results.insurance)}</span>
                </div>
                {results.pmi > 0 && (
                  <div className="flex justify-between">
                    <span>PMI</span>
                    <span className="font-semibold text-orange">
                      {formatCurrency(results.pmi)}
                    </span>
                  </div>
                )}
              </div>

              {results.pmi > 0 && pmiPayoffMonth !== null && (
                <div className="rounded-[1.5rem] bg-yellow/30 p-4 text-sm text-ink-mid">
                  <strong className="text-ink">PMI drops off at month {pmiPayoffMonth}</strong> — around{' '}
                  {(pmiPayoffMonth / 12) % 1 === 0
                    ? pmiPayoffMonth / 12
                    : (pmiPayoffMonth / 12).toFixed(1)}{' '}
                  years.
                </div>
              )}

              {(amort1 || amort5 || amort10) && (
                <div className="rounded-[1.5rem] border border-border p-4">
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink mb-3">
                    Amortization highlights
                  </p>
                  <div className="grid gap-3 text-sm">
                    {amort1 && (
                      <div className="flex justify-between text-ink-mid">
                        <span>After year 1</span>
                        <span className="font-semibold text-right">
                          {formatCurrency(amort1.balance)}
                        </span>
                      </div>
                    )}
                    {amort5 && (
                      <div className="flex justify-between text-ink-mid">
                        <span>After year 5</span>
                        <span className="font-semibold text-right">
                          {formatCurrency(amort5.balance)}
                        </span>
                      </div>
                    )}
                    {amort10 && (
                      <div className="flex justify-between text-ink-mid">
                        <span>After year 10</span>
                        <span className="font-semibold text-right">
                          {formatCurrency(amort10.balance)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {downPaymentPct < 20 && pmiPayoffMonth === null && (
                <div className="rounded-[1.5rem] bg-yellow/30 p-4 text-sm text-ink-mid">
                  <strong>Tip:</strong> Putting 20% down eliminates PMI and saves you {formatCurrency(results.pmi)} / month.
                </div>
              )}

              <div className="rounded-[1.5rem] border border-border bg-bg-alt p-4 text-center">
                <p className="text-sm text-ink-mid mb-3">
                  Want exact numbers based on today&apos;s rates?
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0.04em] text-white transition-all hover:scale-[1.02]"
                >
                  Schedule a call →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

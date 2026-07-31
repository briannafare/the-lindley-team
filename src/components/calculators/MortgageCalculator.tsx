"use client";

import { useState, useCallback } from "react";

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
  const [results, setResults] = useState<CalcResults | null>(null);

  // Lead capture state
  const [showForm, setShowForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const calculate = useCallback(() => {
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

    setResults({
      monthlyPayment: totalMonthly,
      principal: monthlyPI - loanAmount * monthlyRate,
      interest: loanAmount * monthlyRate,
      taxes: monthlyTaxes,
      insurance: monthlyInsurance,
      pmi: monthlyPMI,
      totalPayment: totalMonthly,
      totalInterest,
    });
  }, [homePrice, downPaymentPct, rate, term, taxes, insurance]);

  // Calculate on first render
  useState(() => {
    calculate();
  });

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const downPayment = homePrice * (downPaymentPct / 100);
  const loanAmount = homePrice - downPayment;

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Route through /api/lead (formType "calculator") like every other form,
    // so the GHL wh-calculator workflow tags + creates the opportunity.
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "calculator",
        source: "thelindleyteam.com/calculator",
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        message: `Calculator lead — ${formatCurrency(homePrice)} home, ${downPaymentPct}% down, ${rate}% / ${term}yr → est. ${formatCurrency(results?.monthlyPayment ?? 0)}/mo`,
        home_price: homePrice,
        loan_amount: loanAmount,
        rate,
        term,
        down_payment_pct: downPaymentPct,
        monthly_payment: results?.monthlyPayment,
      }),
    }).catch(() => {});
    setLeadCaptured(true);
    setShowForm(false);
    setSubmitting(false);
  };

  const calcPmiPayoffMonth = () => {
    if (downPaymentPct >= 20 || !results) return null;
    const targetBalance = homePrice * 0.8;
    const monthlyRate = rate / 100 / 12;
    const loanAmt = homePrice - homePrice * (downPaymentPct / 100);
    let balance = loanAmt;
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
    if (!results) return null;
    const monthlyRate = rate / 100 / 12;
    const loanAmt = homePrice - homePrice * (downPaymentPct / 100);
    const monthlyPI = results.principal + results.interest;
    let balance = loanAmt;
    const months = yearTarget * 12;
    for (let m = 0; m < months && m < term * 12; m++) {
      const interestPart = balance * monthlyRate;
      const principalPart = monthlyPI - interestPart;
      balance = Math.max(0, balance - principalPart);
    }
    const equity = homePrice - balance;
    return { balance, equity };
  };

  const pmiPayoffMonth = leadCaptured ? calcPmiPayoffMonth() : null;
  const amort1 = leadCaptured ? calcAmortizationAt(1) : null;
  const amort5 = leadCaptured ? calcAmortizationAt(5) : null;
  const amort10 = leadCaptured ? calcAmortizationAt(10) : null;

  return (
    <div className="bg-white rounded-[2rem] border border-border p-8">
      <h3 className="font-display text-xl font-bold mb-1">
        Portland Mortgage Calculator
      </h3>
      <p className="text-sm text-ink-light mb-6">
        Estimate your monthly payment for a home in Portland, Oregon.
      </p>

      <div className="space-y-6">
        {/* Home Price */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink">
              Home Price
            </label>
            <span className="font-display text-lg font-bold">
              {formatCurrency(homePrice)}
            </span>
          </div>
          <input
            type="range"
            min={100000}
            max={2000000}
            step={10000}
            value={homePrice}
            onChange={(e) => {
              setHomePrice(Number(e.target.value));
              calculate();
            }}
            className="w-full accent-orange"
          />
          <div className="flex justify-between text-[0.65rem] text-ink-light mt-1">
            <span>$100k</span>
            <span>$2M</span>
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink">
              Down Payment
            </label>
            <span className="font-display text-lg font-bold">
              {downPaymentPct}% ({formatCurrency(downPayment)})
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            step={1}
            value={downPaymentPct}
            onChange={(e) => {
              setDownPaymentPct(Number(e.target.value));
              calculate();
            }}
            className="w-full accent-orange"
          />
          <div className="flex justify-between text-[0.65rem] text-ink-light mt-1">
            <span>0%</span>
            <span>40%</span>
          </div>
        </div>

        {/* Rate & Term */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-2">
              Interest Rate
            </label>
            <div className="flex items-center border border-border rounded-xl px-3 py-2 focus-within:border-ink transition-colors">
              <input
                type="number"
                value={rate}
                step={0.125}
                min={0}
                max={15}
                onChange={(e) => {
                  setRate(Number(e.target.value));
                  calculate();
                }}
                className="w-full text-sm font-semibold bg-transparent outline-none"
              />
              <span className="text-ink-light text-sm ml-1">%</span>
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
                  onClick={() => {
                    setTerm(t);
                    calculate();
                  }}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    term === t
                      ? "bg-ink text-white"
                      : "border border-border text-ink-mid hover:border-ink"
                  }`}
                >
                  {t}yr
                </button>
              ))}
            </div>
          </div>
        </div>

        {variant === "full" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-2">
                Annual Taxes
              </label>
              <div className="flex items-center border border-border rounded-xl px-3 py-2 focus-within:border-ink transition-colors">
                <span className="text-ink-light text-sm mr-1">$</span>
                <input
                  type="number"
                  value={taxes}
                  step={100}
                  onChange={(e) => {
                    setTaxes(Number(e.target.value));
                    calculate();
                  }}
                  className="w-full text-sm font-semibold bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-2">
                Annual Insurance
              </label>
              <div className="flex items-center border border-border rounded-xl px-3 py-2 focus-within:border-ink transition-colors">
                <span className="text-ink-light text-sm mr-1">$</span>
                <input
                  type="number"
                  value={insurance}
                  step={100}
                  onChange={(e) => {
                    setInsurance(Number(e.target.value));
                    calculate();
                  }}
                  className="w-full text-sm font-semibold bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 pt-8 border-t border-border">
          {/* Always visible: big payment number */}
          <div className="text-center mb-6">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-1">
              Estimated Monthly Payment
            </p>
            <p className="font-display text-[3rem] font-extrabold text-ink leading-none">
              {formatCurrency(results.monthlyPayment)}
            </p>
            <p className="text-sm text-ink-light mt-1">
              on a {formatCurrency(loanAmount)} loan
            </p>
          </div>

          {/* Lead gate — show teaser or form or full breakdown */}
          {!leadCaptured ? (
            <div className="mt-6">
              <div className="border-t border-border pt-6 text-center space-y-3">
                {!showForm ? (
                  <>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] transition-all"
                    >
                      Get your full breakdown →
                    </button>
                    <p className="text-[0.72rem] text-ink-light">
                      We&apos;ll email you a personalized mortgage summary.
                    </p>
                  </>
                ) : (
                  <form
                    onSubmit={handleLeadSubmit}
                    className="text-left space-y-3"
                  >
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
                        className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-transparent outline-none focus:border-ink transition-colors"
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
                        className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-transparent outline-none focus:border-ink transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink block mb-1">
                        Phone{" "}
                        <span className="normal-case font-normal text-ink-light">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="tel"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="(503) 555-1234"
                        className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-transparent outline-none focus:border-ink transition-colors"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] transition-all disabled:opacity-60 disabled:scale-100"
                      >
                        {submitting ? "Sending..." : "Show My Full Breakdown →"}
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
            /* Full breakdown after lead capture */
            <div className="space-y-2">
              {/* Payment breakdown rows */}
              <div className="flex justify-between text-sm">
                <span className="text-ink-mid">Principal & Interest</span>
                <span className="font-semibold">
                  {formatCurrency(results.principal + results.interest)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-mid">Property Taxes</span>
                <span className="font-semibold">
                  {formatCurrency(results.taxes)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-mid">Insurance</span>
                <span className="font-semibold">
                  {formatCurrency(results.insurance)}
                </span>
              </div>
              {results.pmi > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-ink-mid">PMI</span>
                  <span className="font-semibold text-orange">
                    {formatCurrency(results.pmi)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-ink-mid">
                  Total Interest ({term} years)
                </span>
                <span className="font-semibold">
                  {formatCurrency(results.totalInterest)}
                </span>
              </div>

              {/* PMI payoff */}
              {pmiPayoffMonth !== null && (
                <div className="mt-4 p-3 bg-yellow/30 rounded-xl">
                  <p className="text-[0.78rem] text-ink-mid">
                    <strong>PMI drops off at month {pmiPayoffMonth}</strong> —
                    approximately{" "}
                    {(pmiPayoffMonth / 12) % 1 === 0
                      ? pmiPayoffMonth / 12
                      : (pmiPayoffMonth / 12).toFixed(1)}{" "}
                    years.
                  </p>
                </div>
              )}

              {/* Amortization highlights */}
              {(amort1 || amort5 || amort10) && (
                <div className="mt-4">
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink mb-2">
                    Amortization Highlights
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-ink-light pb-1">
                          Year
                        </th>
                        <th className="text-right text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-ink-light pb-1">
                          Balance
                        </th>
                        <th className="text-right text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-ink-light pb-1">
                          Equity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {amort1 && (
                        <tr className="border-b border-border">
                          <td className="py-1.5 text-ink-mid">After Year 1</td>
                          <td className="py-1.5 text-right font-semibold">
                            {formatCurrency(amort1.balance)}
                          </td>
                          <td className="py-1.5 text-right font-semibold text-green-700">
                            {formatCurrency(amort1.equity)}
                          </td>
                        </tr>
                      )}
                      {amort5 && term >= 5 && (
                        <tr className="border-b border-border">
                          <td className="py-1.5 text-ink-mid">After Year 5</td>
                          <td className="py-1.5 text-right font-semibold">
                            {formatCurrency(amort5.balance)}
                          </td>
                          <td className="py-1.5 text-right font-semibold text-green-700">
                            {formatCurrency(amort5.equity)}
                          </td>
                        </tr>
                      )}
                      {amort10 && term >= 10 && (
                        <tr>
                          <td className="py-1.5 text-ink-mid">After Year 10</td>
                          <td className="py-1.5 text-right font-semibold">
                            {formatCurrency(amort10.balance)}
                          </td>
                          <td className="py-1.5 text-right font-semibold text-green-700">
                            {formatCurrency(amort10.equity)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {downPaymentPct < 20 && pmiPayoffMonth === null && (
                <div className="mt-4 p-3 bg-yellow/30 rounded-xl">
                  <p className="text-[0.78rem] text-ink-mid">
                    <strong>Tip:</strong> Putting 20% down eliminates PMI and
                    saves you {formatCurrency(results.pmi)}/mo.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Second CTA — always shown after lead capture */}
          {leadCaptured && (
            <div className="mt-8 border border-border rounded-xl p-5">
              <p className="font-semibold text-ink text-sm mb-0.5">
                Want exact numbers based on today&apos;s rates?
              </p>
              <p className="text-sm text-ink-mid mb-4">
                Schedule a complimentary call with Bri.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] transition-all"
              >
                Schedule a Call →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

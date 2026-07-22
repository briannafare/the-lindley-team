"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AmortizationRow } from "@/lib/calculators/types";

interface Props {
  data: AmortizationRow[];
}

export default function AmortizationChart({ data }: Props) {
  const yearlyData = useMemo(() => {
    const years: { year: number; interest: number; principal: number; balance: number }[] = [];
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (const row of data) {
      yearInterest += row.interest;
      yearPrincipal += row.principal;

      if (row.month % 12 === 0) {
        years.push({
          year: row.month / 12,
          interest: Math.round(yearInterest),
          principal: Math.round(yearPrincipal),
          balance: Math.round(row.balance),
        });
        yearInterest = 0;
        yearPrincipal = 0;
      }
    }
    if (yearInterest > 0 || yearPrincipal > 0) {
      const last = data[data.length - 1];
      years.push({
        year: Math.ceil(last.month / 12),
        interest: Math.round(yearInterest),
        principal: Math.round(yearPrincipal),
        balance: Math.round(last.balance),
      });
    }
    return years;
  }, [data]);

  const formatK = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  return (
    <div className="w-full">
      <div className="flex gap-5 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#059669" }} />
          <span className="text-xs text-ink-500">Principal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#0EA5E9" }} />
          <span className="text-xs text-ink-500">Interest</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={yearlyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} tickFormatter={(v: number) => `Yr ${v}`} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={formatK} />
          <Tooltip
            contentStyle={{ backgroundColor: "white", border: "1px solid #E5E7EB", borderRadius: "12px", fontSize: "13px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", padding: "12px 16px" }}
            formatter={(value: unknown, name: unknown) => [`$${Number(value).toLocaleString()}`, String(name) === "principal" ? "Principal" : "Interest"]}
            labelFormatter={(label: string | number) => `Year ${label}`}
          />
          <Area type="monotone" dataKey="principal" stroke="#059669" strokeWidth={2} fill="url(#gradPrincipal)" />
          <Area type="monotone" dataKey="interest" stroke="#0EA5E9" strokeWidth={2} fill="url(#gradInterest)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

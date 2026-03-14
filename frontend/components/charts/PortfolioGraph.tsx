"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SnapshotPoint } from "@/hooks/usePortfolio";

interface Props {
  data: SnapshotPoint[];
  currency: "USD" | "INR";
  loading: boolean;
}

function formatValue(value: number, currency: "USD" | "INR") {
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatLabel(point: SnapshotPoint) {
  const raw = point.date || point.timestamp;
  if (!raw) return "";
  const d = new Date(raw);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PortfolioGraph({ data, currency, loading }: Props) {
  if (loading) {
    return (
      <div className="h-64 bg-bg-raised rounded-xl animate-pulse" />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 bg-bg-raised rounded-xl flex items-center justify-center">
        <p className="text-text-secondary text-sm">No historical data yet. Check back tomorrow.</p>
      </div>
    );
  }

  const valueKey = currency === "USD" ? "value_usd" : "value_inr";
  const chartData = data.map((point) => ({
    label: formatLabel(point),
    value: point[valueKey],
  }));

  const isPositive = chartData[chartData.length - 1]?.value >= chartData[0]?.value;
  const lineColor = isPositive ? "#00C805" : "#FF3B30";

  return (
    <ResponsiveContainer width="100%" height={256}>
      <AreaChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
            <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#7070A0", fontFamily: "JetBrains Mono" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1C1C26",
            border: "1px solid #2D2D3D",
            borderRadius: "8px",
            fontFamily: "JetBrains Mono",
            fontSize: "12px",
            color: "#F0F0FF",
          }}
          formatter={(value) => [formatValue(Number(value ?? 0), currency), "Value"]}
          labelStyle={{ color: "#7070A0" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={lineColor}
          strokeWidth={2}
          fill="url(#graphGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

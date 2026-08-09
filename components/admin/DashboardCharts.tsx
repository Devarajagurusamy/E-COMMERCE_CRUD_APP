"use client";

import { useState } from "react";
import { TrendingUp, BarChart2, PieChart as PieChartIcon } from "lucide-react";

interface TimeSeriesItem {
  label: string;
  revenue: number;
  profit: number;
  sales: number;
}

// 1. REVENUE & PROFIT SVG LINE CHART
export function RevenueProfitChart({
  data,
  period,
  onPeriodChange,
}: {
  data: TimeSeriesItem[];
  period: string;
  onPeriodChange: (p: string) => void;
}) {
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 h-80 flex items-center justify-center text-muted-foreground text-sm">
        No revenue data available for this period.
      </div>
    );
  }

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.revenue, d.profit)),
    100
  );

  const width = 600;
  const height = 240;
  const padding = 30;

  const pointsRev = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - (d.revenue / maxVal) * (height - 2 * padding);
    return { x, y, value: d.revenue, label: d.label };
  });

  const pointsProf = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - (d.profit / maxVal) * (height - 2 * padding);
    return { x, y, value: d.profit, label: d.label };
  });

  const pathRev = pointsRev.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const pathProf = pointsProf.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const areaRev = `${pathRev} L ${pointsRev[pointsRev.length - 1].x} ${
    height - padding
  } L ${pointsRev[0].x} ${height - padding} Z`;

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Revenue & Profit Analytics</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Business earnings and profit trajectory over time
          </p>
        </div>

        {/* Time Period Filter Pills */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl text-xs font-medium self-start sm:self-auto">
          {[
            { id: "today", label: "Today" },
            { id: "7d", label: "7D" },
            { id: "30d", label: "30D" },
            { id: "3m", label: "3M" },
            { id: "6m", label: "6M" },
            { id: "12m", label: "1Y" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onPeriodChange(item.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === item.id
                  ? "bg-background text-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="font-semibold text-foreground">Gross Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
          <span className="font-semibold text-foreground">Estimated Profit</span>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - padding - ratio * (height - 2 * padding);
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                className="text-border/40"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area fill for Revenue */}
          <path d={areaRev} fill="url(#revGradient)" />

          {/* Revenue Line */}
          <path
            d={pathRev}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Profit Line */}
          <path
            d={pathProf}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            strokeLinecap="round"
          />

          {/* Points & Interactive Hover */}
          {pointsRev.map((p, idx) => (
            <g key={idx}>
              {/* Vertical hover guide */}
              {activeHoverIndex === idx && (
                <line
                  x1={p.x}
                  y1={padding}
                  x2={p.x}
                  y2={height - padding}
                  stroke="currentColor"
                  className="text-primary/40"
                  strokeWidth="1.5"
                />
              )}

              {/* Revenue Dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={activeHoverIndex === idx ? "6" : "4"}
                className="fill-emerald-500 stroke-background stroke-2 transition-all cursor-pointer"
                onMouseEnter={() => setActiveHoverIndex(idx)}
                onMouseLeave={() => setActiveHoverIndex(null)}
              />

              {/* Profit Dot */}
              <circle
                cx={pointsProf[idx].x}
                cy={pointsProf[idx].y}
                r={activeHoverIndex === idx ? "5" : "3"}
                className="fill-indigo-500 stroke-background stroke-2 cursor-pointer"
              />

              {/* X Axis Label */}
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-muted-foreground font-medium"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeHoverIndex !== null && (
          <div className="absolute top-2 right-2 bg-zinc-950 text-zinc-100 p-3 rounded-2xl text-xs shadow-xl border border-zinc-800 space-y-1 animate-in fade-in zoom-in-95">
            <p className="font-bold text-zinc-400">
              {data[activeHoverIndex].label}
            </p>
            <p className="text-emerald-400 font-semibold">
              Revenue: ₹{data[activeHoverIndex].revenue.toLocaleString()}
            </p>
            <p className="text-indigo-400 font-semibold">
              Profit: ₹{data[activeHoverIndex].profit.toLocaleString()}
            </p>
            <p className="text-zinc-300 text-[11px]">
              Sales: {data[activeHoverIndex].sales} item(s)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. SALES VOLUME BAR CHART
export function SalesBarChart({ data }: { data: TimeSeriesItem[] }) {
  if (!data || data.length === 0) return null;

  const maxSales = Math.max(...data.map((d) => d.sales), 10);

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <span>Sales Volume Performance</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total product units sold per time period
          </p>
        </div>
      </div>

      <div className="h-48 flex items-end gap-3 sm:gap-6 pt-6 px-2 border-b border-border/50">
        {data.map((d, idx) => {
          const heightPercent = Math.max((d.sales / maxSales) * 100, 8);
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
            >
              <span className="text-[11px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {d.sales}
              </span>
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full max-w-[36px] bg-primary/80 group-hover:bg-primary rounded-t-xl transition-all duration-300 relative"
              />
              <span className="text-[10px] font-medium text-muted-foreground truncate w-full text-center">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. ORDER STATUS DONUT CHART
export function OrderStatusDonutChart({
  distribution,
}: {
  distribution: Record<string, number>;
}) {
  const statusColors: Record<string, string> = {
    Pending: "#f59e0b",
    Confirmed: "#3b82f6",
    Processing: "#a855f7",
    Shipped: "#6366f1",
    Delivered: "#10b981",
    Cancelled: "#ef4444",
    Refunded: "#64748b",
  };

  const total = Object.values(distribution).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm text-center text-xs text-muted-foreground">
        No order status data recorded yet.
      </div>
    );
  }

  let cumulativePercent = 0;
  const slices = Object.keys(distribution).map((status) => {
    const value = distribution[status];
    const percent = value / total;
    const startAngle = cumulativePercent * 360;
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 360;

    return {
      status,
      value,
      percent: Math.round(percent * 100),
      color: statusColors[status] || "#94a3b8",
      startAngle,
      endAngle,
    };
  });

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-purple-500" />
            <span>Order Pipeline Distribution</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Breakdown of orders by fulfillment status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center pt-2">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
            {slices.map((slice, idx) => {
              if (slice.value === 0) return null;
              const strokeDasharray = `${slice.percent * 2.82} 282`;
              let offset = 0;
              for (let i = 0; i < idx; i++) {
                offset += slices[i].percent * 2.82;
              }

              return (
                <circle
                  key={slice.status}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="10"
                  strokeDasharray={`${slice.percent * 2.82} ${282 - slice.percent * 2.82}`}
                  strokeDashoffset={`-${offset}`}
                  className="transition-all duration-500 hover:opacity-80"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-foreground">{total}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Total Orders
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs">
          {slices.map((s) => (
            <div
              key={s.status}
              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="font-medium text-foreground">{s.status}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-foreground">{s.value}</span>
                <span className="text-[11px] text-muted-foreground w-8 text-right">
                  {s.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

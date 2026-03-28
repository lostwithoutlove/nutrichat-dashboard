"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface WeightDataPoint {
  day: string;
  value: number;
}

interface WeightChartProps {
  data: WeightDataPoint[];
  targetWeight?: number | null;
}

export default function WeightChart({ data, targetWeight }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-sky-400">
        No weight data yet
      </div>
    );
  }

  const chartData = [...data]
    .sort((a, b) => a.day.localeCompare(b.day))
    .map((d) => ({
      date: new Date(d.day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      weight: d.value,
    }));

  const weights = chartData.map((d) => d.weight);
  const minWeight = Math.min(...weights, targetWeight ?? Infinity);
  const maxWeight = Math.max(...weights, targetWeight ?? -Infinity);
  const padding = (maxWeight - minWeight) * 0.1 || 2;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E6EFFF" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#6B7280" }}
          tickLine={false}
        />
        <YAxis
          domain={[minWeight - padding, maxWeight + padding]}
          tick={{ fontSize: 11, fill: "#6B7280" }}
          tickLine={false}
          axisLine={false}
          unit=" kg"
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #E6EFFF",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: "#10B981", strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5 }}
        />
        {targetWeight && (
          <ReferenceLine
            y={targetWeight}
            stroke="#DB2777"
            strokeDasharray="5 5"
            label={{
              value: `Target: ${targetWeight} kg`,
              position: "right",
              fill: "#DB2777",
              fontSize: 11,
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetWeeklyNutritionTrendsQuery, TimePeriod } from "@/generated/graphql";

const periods = [
  { label: "1W", value: TimePeriod.OneWeek },
  { label: "1M", value: TimePeriod.OneMonth },
  { label: "3M", value: TimePeriod.ThreeMonths },
  { label: "1Y", value: TimePeriod.OneYear },
];

export default function NutritionTrends() {
  const [period, setPeriod] = useState<TimePeriod>(TimePeriod.OneWeek);

  const { data, loading } = useGetWeeklyNutritionTrendsQuery({
    variables: { timePeriod: period },
    fetchPolicy: "cache-and-network",
  });

  const trends = data?.nutritionTrends?.trends ?? [];
  const averages = data?.nutritionTrends?.averages;

  const chartData = useMemo(
    () =>
      trends.map((t) => ({
        date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        Calories: Math.round(t.calories),
        Protein: Math.round(t.protein),
        Carbs: Math.round(t.carbs),
        Fat: Math.round(t.fat),
      })),
    [trends]
  );

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-sky-900">Nutrition Trends</h3>
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p.label}
              onClick={() => setPeriod(p.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                period === p.value
                  ? "bg-emerald-500 text-white"
                  : "text-sky-600 hover:bg-sky-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Averages */}
      {averages && (
        <div className="mb-4 grid grid-cols-4 gap-2">
          <div className="rounded-lg bg-sky-50 p-2 text-center">
            <p className="text-lg font-bold text-sky-900">{Math.round(averages.calories)}</p>
            <p className="text-[10px] text-sky-500">avg kcal</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-2 text-center">
            <p className="text-lg font-bold text-emerald-700">{Math.round(averages.protein)}g</p>
            <p className="text-[10px] text-sky-500">protein</p>
          </div>
          <div className="rounded-lg bg-sky-50 p-2 text-center">
            <p className="text-lg font-bold text-sky-700">{Math.round(averages.carbs)}g</p>
            <p className="text-[10px] text-sky-500">carbs</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-2 text-center">
            <p className="text-lg font-bold text-amber-700">{Math.round(averages.fat)}g</p>
            <p className="text-[10px] text-sky-500">fat</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {loading && trends.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : trends.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-sky-400">
          No trend data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6EFFF" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6B7280" }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #E6EFFF", borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="Calories" fill="#10B981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

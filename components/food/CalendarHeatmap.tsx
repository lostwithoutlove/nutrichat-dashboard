"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetDailyAggregatesQuery } from "@/generated/graphql";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDayColor(calories: number, goal: number | null): string {
  if (calories === 0) return "bg-sky-100";
  if (!goal) return "bg-emerald-300";
  const ratio = calories / goal;
  if (ratio < 0.5) return "bg-amber-200";
  if (ratio < 0.8) return "bg-amber-400";
  if (ratio <= 1.15) return "bg-emerald-400";
  return "bg-red-400";
}

interface CalendarHeatmapProps {
  onDateSelect: (date: Date) => void;
}

export default function CalendarHeatmap({ onDateSelect }: CalendarHeatmapProps) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const { startDay, endDay } = useMemo(() => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    return {
      startDay: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-01`,
      endDay: `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`,
    };
  }, [month, year]);

  const { data } = useGetDailyAggregatesQuery({
    variables: { startDay, endDay, limit: 31 },
    fetchPolicy: "cache-and-network",
  });

  const caloriesByDay = useMemo(() => {
    const map = new Map<string, { cal: number; goal: number | null }>();
    for (const node of data?.dailyAggregates?.nodes ?? []) {
      map.set(node.day, { cal: node.totalCalKcal, goal: node.goalCalKcal ?? null });
    }
    return map;
  }, [data]);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goBack = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const goForward = () => {
    const now = new Date();
    if (year === now.getFullYear() && month >= now.getMonth()) return;
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-sky-900">History</h3>
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="rounded p-1 text-sky-600 hover:bg-sky-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[120px] text-center text-xs font-medium text-sky-700">{monthLabel}</span>
          <button onClick={goForward} disabled={isCurrentMonth} className="rounded p-1 text-sky-600 hover:bg-sky-50 disabled:opacity-30">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-sky-400">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const pad = (n: number) => String(n).padStart(2, "0");
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
          const entry = caloriesByDay.get(dateStr);
          const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
          const color = entry ? getDayColor(entry.cal, entry.goal) : "bg-sky-50";

          return (
            <button
              key={day}
              onClick={() => onDateSelect(new Date(year, month, day))}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] transition hover:ring-1 hover:ring-emerald-400 ${color} ${
                isToday ? "ring-2 ring-emerald-500" : ""
              }`}
              title={entry ? `${Math.round(entry.cal)} kcal` : "No data"}
            >
              <span className={`font-medium ${
                !entry || entry.cal === 0 ? "text-sky-400"
                : color === "bg-amber-200" ? "text-amber-800"
                : "text-white"
              }`}>
                {day}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-sky-500">
        <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-sky-100" /> No data</div>
        <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-amber-300" /> Under</div>
        <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> On target</div>
        <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-red-400" /> Over</div>
      </div>
    </div>
  );
}

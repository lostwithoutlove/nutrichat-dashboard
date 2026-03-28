"use client";

interface DailySummaryProps {
  summary: { totalCal: number; protein: number; carbs: number; fat: number; fiber: number };
  goals: { calorieTarget: number; proteinMax: number; carbsMax: number; fatMax: number; fiberMax: number };
}

function CalorieRing({ consumed, target }: { consumed: number; target: number }) {
  const pct = Math.min((consumed / target) * 100, 100);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const remaining = Math.max(target - consumed, 0);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#E6EFFF" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={consumed > target ? "#EF4444" : "#10B981"}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-sky-900">{Math.round(consumed)}</span>
          <span className="text-[10px] text-sky-500">kcal</span>
        </div>
      </div>
      <p className="mt-1 text-xs text-sky-500">{Math.round(remaining)} remaining</p>
    </div>
  );
}

function MacroBar({ label, value, max, unit, color }: {
  label: string; value: number; max: number; unit: string; color: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-sky-700">{label}</span>
        <span className="text-xs text-sky-500">{Math.round(value)}{unit} / {max}{unit}</span>
      </div>
      <div className="h-2 rounded-full bg-sky-100">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DailySummaryCard({ summary, goals }: DailySummaryProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-sky-900">Daily Summary</h3>
      <div className="flex gap-6">
        <CalorieRing consumed={summary.totalCal} target={goals.calorieTarget} />
        <div className="flex-1 space-y-3">
          <MacroBar label="Protein" value={summary.protein} max={goals.proteinMax} unit="g" color="bg-emerald-500" />
          <MacroBar label="Carbs" value={summary.carbs} max={goals.carbsMax} unit="g" color="bg-sky-500" />
          <MacroBar label="Fat" value={summary.fat} max={goals.fatMax} unit="g" color="bg-amber-500" />
          <MacroBar label="Fiber" value={summary.fiber} max={goals.fiberMax} unit="g" color="bg-pink-500" />
        </div>
      </div>
    </div>
  );
}

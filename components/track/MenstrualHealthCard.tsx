"use client";

interface MenstrualHealthCardProps {
  cycleDay: number;
  phase: string;
  lastPeriodDate: string;
  periodsLogged: number;
}

const phaseColors: Record<string, string> = {
  Menstrual: "text-pink-600",
  Follicular: "text-emerald-600",
  Ovulation: "text-sky-600",
  Luteal: "text-amber-600",
};

export default function MenstrualHealthCard({
  cycleDay,
  phase,
  lastPeriodDate,
  periodsLogged,
}: MenstrualHealthCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-sky-900">Menstrual Health</h3>
      <div className="flex items-center gap-6">
        {/* Cycle ring */}
        <div className="relative">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#FCE7F3" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="32" fill="none" stroke="#DB2777"
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${(cycleDay / 28) * 201} 201`}
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-sky-900">{cycleDay}</span>
            <span className="text-[9px] text-sky-400">day</span>
          </div>
        </div>

        <div>
          <p className={`text-sm font-bold ${phaseColors[phase] ?? "text-sky-900"}`}>
            {phase} Phase
          </p>
          <p className="mt-1 text-xs text-sky-500">Last period: {lastPeriodDate}</p>
          <p className="text-xs text-sky-400">
            {periodsLogged} period{periodsLogged !== 1 ? "s" : ""} logged
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface MenstrualHealthCardProps {
  cycleDay: number;
  phase: string;
  lastPeriodDate: string;
  periodsLogged: number;
  onLogSymptom?: (symptom: string, severity: number, notes: string) => Promise<void>;
}

const phaseColors: Record<string, string> = {
  Menstrual: "text-red-400",
  Follicular: "text-yellow-500",
  Ovulation: "text-emerald-400",
  Luteal: "text-purple-400",
};

const symptomOptions = [
  "period", "cramps", "headache", "bloating", "fatigue",
  "mood swings", "back pain", "breast tenderness", "nausea", "acne",
];

export default function MenstrualHealthCard({
  cycleDay,
  phase,
  lastPeriodDate,
  periodsLogged,
  onLogSymptom,
}: MenstrualHealthCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState("period");
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState("");
  const [logging, setLogging] = useState(false);
  const [logError, setLogError] = useState("");

  const handleLog = async () => {
    if (!onLogSymptom) return;
    setLogging(true);
    setLogError("");
    try {
      await onLogSymptom(selectedSymptom, severity, notes);
      setShowModal(false);
      setSelectedSymptom("period");
      setSeverity(5);
      setNotes("");
    } catch (err) {
      setLogError(err instanceof Error ? err.message : "Failed to log symptom");
    } finally {
      setLogging(false);
    }
  };

  return (
    <>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-sky-900">Menstrual Health</h3>
          {onLogSymptom && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-pink-600"
            >
              <Plus className="h-3 w-3" /> Log Symptom
            </button>
          )}
        </div>
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

      {/* Log Symptom Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-bold text-sky-900">Log Symptom</h3>

            {logError && (
              <div className="mb-3 rounded-md bg-red-50 p-2 text-xs text-red-600">{logError}</div>
            )}

            {/* Symptom selector */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-sky-600">Symptom</label>
              <div className="flex flex-wrap gap-2">
                {symptomOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSymptom(s)}
                    className={`rounded-full px-3 py-1 text-xs transition ${
                      selectedSymptom === s
                        ? "bg-pink-500 text-white"
                        : "bg-sky-50 text-sky-600 hover:bg-sky-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity slider */}
            <div className="mb-4">
              <label className="mb-1 block text-sm text-sky-600">
                Severity: <span className="font-medium text-sky-900">{severity}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full accent-pink-500"
              />
              <div className="flex justify-between text-[10px] text-sky-400">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="mb-1 block text-sm text-sky-600">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional details..."
                className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900 outline-none focus:border-pink-500"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-md border border-sky-100 px-4 py-2 text-sm text-sky-600 transition hover:bg-sky-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLog}
                disabled={logging}
                className="flex-1 rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600 disabled:opacity-50"
              >
                {logging ? "Logging..." : "Log Symptom"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

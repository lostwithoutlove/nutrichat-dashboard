"use client";

import { useState, useMemo } from "react";
import { Scale, TrendingDown, Target } from "lucide-react";
import WeightChart from "@/components/track/WeightChart";
import StatusBadge from "@/components/track/StatusBadge";
import MenstrualHealthCard from "@/components/track/MenstrualHealthCard";
import {
  useMeQuery,
  useGetWeightHistoryQuery,
  useGetMenstrualHistoryQuery,
  useChatMutation,
} from "@/generated/graphql";

export default function TrackPage() {
  const [showLogModal, setShowLogModal] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const { data: meData } = useMeQuery();
  const profile = meData?.me;

  const today = new Date().toISOString().split("T")[0];
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    .toISOString().split("T")[0];

  const { data: weightData, loading: weightLoading, refetch: refetchWeight } =
    useGetWeightHistoryQuery({
      variables: { kind: "weight", startDay: ninetyDaysAgo, endDay: today, limit: 90 },
      fetchPolicy: "cache-and-network",
    });

  const { data: menstrualData } = useGetMenstrualHistoryQuery({
    variables: {
      name: "period",
      startDay: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      endDay: today,
      limit: 100,
    },
    skip: profile?.sex !== "female",
  });

  const [chatMutation] = useChatMutation();

  const vitals = weightData?.vitals ?? [];

  // Use profile weight as fallback when no vitals exist
  const chartData = useMemo(() => {
    if (vitals.length > 0) {
      return vitals.map((v) => ({ day: v.day, value: v.value }));
    }
    // No vitals — show profile weight as a starting data point
    if (profile?.weightKg) {
      const profileDate = profile.updatedAt
        ? new Date(profile.updatedAt).toISOString().split("T")[0]
        : today;
      return [{ day: profileDate, value: profile.weightKg }];
    }
    return [];
  }, [vitals, profile?.weightKg, profile?.updatedAt, today]);

  // Weight metrics — match mobile app logic
  const weightEntries = useMemo(() => {
    return vitals
      .filter((v) => v.value != null)
      .map((v) => ({ day: v.day, weight: v.value }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }, [vitals]);

  const currentWeight = weightEntries.length > 0
    ? weightEntries[weightEntries.length - 1].weight
    : profile?.weightKg ?? null;
  const previousWeight = weightEntries.length > 1
    ? weightEntries[weightEntries.length - 2].weight
    : null;
  const weightChange = currentWeight && previousWeight
    ? currentWeight - previousWeight
    : null;

  // BMI
  const heightM = profile?.heightCm ? profile.heightCm / 100 : null;
  const bmi = currentWeight && heightM
    ? currentWeight / (heightM * heightM)
    : null;
  const bmiStatus = bmi === null ? "N/A" : bmi < 18.5 ? "Low" : bmi < 25 ? "Normal" : bmi < 30 ? "High" : "High";

  // Weight status derived from BMI (like mobile app)
  const weightStatus = bmi === null ? "N/A" : bmi < 18.5 ? "Low" : bmi < 25 ? "Normal" : "High";

  // Normal weight range for height
  const weightRange = heightM
    ? `${Math.round(18.5 * heightM * heightM)}-${Math.round(24.9 * heightM * heightM)} kg`
    : null;

  // Auto-calculated target weight (if BMI > 25, suggest BMI 24)
  const suggestedTarget = useMemo(() => {
    if (!heightM || !currentWeight) return null;
    const currentBmi = currentWeight / (heightM * heightM);
    if (currentBmi >= 25) return Math.round(24 * heightM * heightM);
    if (currentBmi < 18.5) return Math.round(20 * heightM * heightM);
    return null;
  }, [heightM, currentWeight]);

  const targetWeight = profile?.targetWeightKg ?? suggestedTarget;

  const [logError, setLogError] = useState("");

  const handleLogWeight = async () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight < 10 || weight > 500) {
      setLogError("Enter a valid weight between 10-500 kg");
      return;
    }
    setLogError("");
    setIsLogging(true);
    try {
      const result = await chatMutation({
        variables: { input: { message: `I weigh ${weight} kg` } },
      });
      if (result.errors?.length) {
        setLogError(result.errors[0].message);
        return;
      }
      // Weight logged successfully via chat — close modal and refetch
      setShowLogModal(false);
      setWeightInput("");
      // Delay refetch to give backend time to process the logged data
      setTimeout(() => refetchWeight(), 2000);
    } catch (err) {
      setLogError(err instanceof Error ? err.message : "Failed to log weight");
    } finally {
      setIsLogging(false);
    }
  };

  // Menstrual data processing
  const symptoms = menstrualData?.symptoms ?? [];
  const sortedSymptoms = [...symptoms].sort(
    (a, b) => new Date(b.day).getTime() - new Date(a.day).getTime()
  );
  const lastPeriod = sortedSymptoms[0];
  const daysSinceLast = lastPeriod
    ? Math.floor((Date.now() - new Date(lastPeriod.day).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const cycleDay = lastPeriod ? (daysSinceLast % 28) + 1 : 0;
  const phase = cycleDay <= 5 ? "Menstrual" : cycleDay <= 13 ? "Follicular" : cycleDay <= 16 ? "Ovulation" : "Luteal";

  return (
    <div className="h-full overflow-y-auto bg-sky-50 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-sky-900">Track</h1>
          <button
            onClick={() => setShowLogModal(true)}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            Log Weight
          </button>
        </div>

        {/* Metric cards */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-sky-600">Weight</span>
            </div>
            <p className="text-xl font-bold text-sky-900">
              {currentWeight ? `${currentWeight} kg` : "—"}
            </p>
            <div className="flex items-center gap-2">
              <StatusBadge label={weightStatus} />
              {weightChange !== null && (
                <span className={`text-xs font-medium ${weightChange > 0 ? "text-red-500" : weightChange < 0 ? "text-emerald-500" : "text-sky-400"}`}>
                  {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg
                </span>
              )}
            </div>
            {weightRange && (
              <p className="mt-1 text-[10px] text-sky-400">Normal: {weightRange}</p>
            )}
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-sky-500" />
              <span className="text-xs font-medium text-sky-600">BMI</span>
            </div>
            <p className="text-xl font-bold text-sky-900">{bmi !== null ? bmi.toFixed(1) : "—"}</p>
            <StatusBadge label={bmiStatus} />
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-pink-500" />
              <span className="text-xs font-medium text-sky-600">Target</span>
            </div>
            <p className="text-xl font-bold text-sky-900">
              {targetWeight ? `${targetWeight} kg` : "—"}
            </p>
            {targetWeight && currentWeight && (
              <p className="mt-1 text-[10px] text-sky-400">
                {currentWeight > targetWeight
                  ? `${(currentWeight - targetWeight).toFixed(1)} kg to go`
                  : currentWeight < targetWeight
                    ? `${(targetWeight - currentWeight).toFixed(1)} kg to gain`
                    : "At target!"}
              </p>
            )}
          </div>
        </div>

        {/* Weight Chart */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-sky-900">Weight History (90 days)</h3>
          {weightLoading && chartData.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
          ) : (
            <WeightChart
              data={chartData}
              targetWeight={targetWeight}
            />
          )}
        </div>

        {/* Menstrual Health */}
        {profile?.sex === "female" && lastPeriod && (
          <MenstrualHealthCard
            cycleDay={cycleDay}
            phase={phase}
            lastPeriodDate={new Date(lastPeriod.day).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            periodsLogged={sortedSymptoms.length}
            onLogSymptom={async (symptom, severity, notes) => {
              const msg = `Log ${symptom} symptom, severity ${severity}/10${notes ? `, notes: ${notes}` : ""}`;
              const { data, errors } = await chatMutation({
                variables: { input: { message: msg } },
              });
              if (errors?.length) throw new Error(errors[0].message);
              if (!data?.chat?.dataLogged) throw new Error("Symptom was not logged. Try again.");
            }}
          />
        )}

        {/* Weight Log Modal */}
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-base font-bold text-sky-900">Log Weight</h3>
              {logError && (
                <div className="mb-3 rounded-md bg-red-50 p-2 text-xs text-red-600">{logError}</div>
              )}
              <div className="mb-4">
                <label className="mb-1 block text-sm text-sky-600">Weight (kg)</label>
                <input
                  type="number"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="e.g. 65"
                  className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm text-sky-900 outline-none focus:border-emerald-500"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleLogWeight()}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowLogModal(false); setWeightInput(""); }}
                  className="flex-1 rounded-md border border-sky-100 px-4 py-2 text-sm text-sky-600 transition hover:bg-sky-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogWeight}
                  disabled={isLogging || !weightInput}
                  className="flex-1 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
                >
                  {isLogging ? "Logging..." : "Log"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

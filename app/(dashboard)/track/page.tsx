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
  const latestWeight = vitals.length > 0 ? vitals[vitals.length - 1] : null;

  const bmi = useMemo(() => {
    if (!profile?.heightCm || !latestWeight?.value) return null;
    const heightM = profile.heightCm / 100;
    return latestWeight.value / (heightM * heightM);
  }, [profile?.heightCm, latestWeight?.value]);

  const bmiStatus = bmi === null ? "N/A" : bmi < 18.5 ? "Low" : bmi < 25 ? "Normal" : "High";

  const handleLogWeight = async () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight < 20 || weight > 300) return;
    setIsLogging(true);
    try {
      await chatMutation({ variables: { input: { message: `Log my weight as ${weight} kg` } } });
      setShowLogModal(false);
      setWeightInput("");
      refetchWeight();
    } catch (err) {
      console.error("Failed to log weight:", err);
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
              {latestWeight ? `${latestWeight.value} ${latestWeight.unit || "kg"}` : "—"}
            </p>
            <StatusBadge label={latestWeight ? "Normal" : "N/A"} />
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
              {profile?.targetWeightKg ? `${profile.targetWeightKg} kg` : "—"}
            </p>
            <StatusBadge label="Normal" />
          </div>
        </div>

        {/* Weight Chart */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-sky-900">Weight History (90 days)</h3>
          {weightLoading && vitals.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
          ) : (
            <WeightChart
              data={vitals.map((v) => ({ day: v.day, value: v.value }))}
              targetWeight={profile?.targetWeightKg}
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
          />
        )}

        {/* Weight Log Modal */}
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-base font-bold text-sky-900">Log Weight</h3>
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

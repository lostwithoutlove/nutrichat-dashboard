"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProfileMutation, BiologicalSex } from "@/generated/graphql";

const countries = [
  "India", "United States", "United Kingdom", "Canada",
  "Australia", "Germany", "Singapore", "UAE", "Other",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [createProfile] = useCreateProfileMutation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    sex: "",
    heightCm: "",
    weightKg: "",
    targetWeightKg: "",
    country: "India",
  });

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await createProfile({
        variables: {
          input: {
            fullName: form.fullName,
            dob: form.dob,
            sex: form.sex as BiologicalSex,
            heightCm: parseFloat(form.heightCm),
            weightKg: parseFloat(form.weightKg),
            targetWeightKg: form.targetWeightKg ? parseFloat(form.targetWeightKg) : undefined,
            country: form.country,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
      });
      router.push("/chat");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const canProceed =
    step === 1
      ? form.fullName && form.dob && form.sex
      : form.heightCm && form.weightKg && form.country;

  return (
    <div className="flex h-full items-center justify-center bg-sky-50 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-sky-900">
            Welcome to <span className="text-emerald-500">Nutri</span>Chat
          </h1>
          <p className="mt-1 text-sm text-sky-600">
            {step === 1 ? "Let's get to know you" : "Almost done! A few more details"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 flex gap-2">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-emerald-500" : "bg-sky-100"}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-emerald-500" : "bg-sky-100"}`} />
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-900">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm text-sky-900 outline-none focus:border-emerald-500"
                placeholder="Your name"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-900">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm text-sky-900 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-900">Sex</label>
              <div className="flex gap-2">
                {["Male", "Female", "Other"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setForm({ ...form, sex: opt.toLowerCase() })}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm transition ${
                      form.sex === opt.toLowerCase()
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-sky-100 text-sky-600 hover:bg-sky-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!canProceed}
              className="w-full rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-900">Height (cm)</label>
                <input
                  type="number"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                  className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm text-sky-900 outline-none focus:border-emerald-500"
                  placeholder="170"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-sky-900">Weight (kg)</label>
                <input
                  type="number"
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                  className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm text-sky-900 outline-none focus:border-emerald-500"
                  placeholder="65"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-900">Target Weight (kg, optional)</label>
              <input
                type="number"
                value={form.targetWeightKg}
                onChange={(e) => setForm({ ...form, targetWeightKg: e.target.value })}
                className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm text-sky-900 outline-none focus:border-emerald-500"
                placeholder="60"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sky-900">Country</label>
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm text-sky-900 outline-none focus:border-emerald-500"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-md border border-sky-100 px-4 py-2.5 text-sm text-sky-600 transition hover:bg-sky-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !canProceed}
                className="flex-1 rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Get Started"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

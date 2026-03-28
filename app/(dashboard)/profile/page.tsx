"use client";

import { useState } from "react";
import { User, Edit3, Save, X } from "lucide-react";
import { useMeQuery, useEditProfileMutation, BiologicalSex } from "@/generated/graphql";
import { useAuth } from "@/providers/AuthProvider";

const fields = [
  { label: "Full Name", key: "fullName", type: "text" },
  { label: "Date of Birth", key: "dob", type: "date" },
  { label: "Sex", key: "sex", type: "select", options: ["male", "female", "other"] },
  { label: "Height (cm)", key: "heightCm", type: "number" },
  { label: "Weight (kg)", key: "weightKg", type: "number" },
  { label: "Target Weight (kg)", key: "targetWeightKg", type: "number" },
  { label: "Country", key: "country", type: "text" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { data, loading, refetch } = useMeQuery();
  const [editProfile] = useEditProfileMutation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState("");

  const profile = data?.me;

  const startEditing = () => {
    setForm({
      fullName: profile?.fullName ?? "",
      dob: profile?.dob ?? "",
      sex: profile?.sex ?? "",
      heightCm: profile?.heightCm?.toString() ?? "",
      weightKg: profile?.weightKg?.toString() ?? "",
      targetWeightKg: profile?.targetWeightKg?.toString() ?? "",
      country: profile?.country ?? "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaveError("");
    try {
      await editProfile({
        variables: {
          input: {
            fullName: form.fullName || undefined,
            dob: form.dob || undefined,
            sex: (form.sex as BiologicalSex) || undefined,
            heightCm: form.heightCm ? parseFloat(form.heightCm) : undefined,
            weightKg: form.weightKg ? parseFloat(form.weightKg) : undefined,
            targetWeightKg: form.targetWeightKg ? parseFloat(form.targetWeightKg) : undefined,
            country: form.country || undefined,
          },
        },
      });
      setEditing(false);
      refetch();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save profile");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const displayValue = (key: string) => {
    if (!profile) return "—";
    const val = (profile as Record<string, unknown>)[key];
    if (val === null || val === undefined) return "—";
    return String(val);
  };

  return (
    <div className="h-full overflow-y-auto bg-sky-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-sky-900">Profile</h1>
          {!editing ? (
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              <Edit3 className="h-4 w-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 rounded-lg border border-sky-100 px-4 py-2 text-sm text-sky-600 transition hover:bg-sky-50"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          )}
        </div>

        {saveError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{saveError}</div>
        )}

        {/* Avatar + Email */}
        <div className="mb-6 flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <User className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-base font-bold text-sky-900">{profile?.fullName || "User"}</p>
            <p className="text-sm text-sky-500">{user?.email}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-sky-900">Personal Details</h3>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-xs font-medium text-sky-600">{field.label}</label>
                {editing ? (
                  field.type === "select" ? (
                    <select
                      value={form[field.key] || ""}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900 outline-none focus:border-emerald-500"
                    >
                      <option value="">Select</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={form[field.key] || ""}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900 outline-none focus:border-emerald-500"
                    />
                  )
                ) : (
                  <p className="text-sm text-sky-900">{displayValue(field.key)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

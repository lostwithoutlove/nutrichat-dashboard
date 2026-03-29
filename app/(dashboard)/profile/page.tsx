"use client";

import { useState, useMemo, useCallback } from "react";
import { User, Edit3, Save, X, Upload, FileText, Download, UtensilsCrossed, CalendarDays } from "lucide-react";
import {
  useMeQuery,
  useEditProfileMutation,
  useGetReportsQuery,
  useUploadReportMutation,
  useGetReportDownloadUrlLazyQuery,
  useGetMealsQuery,
  BiologicalSex,
  ReportType,
} from "@/generated/graphql";
import { useAuth } from "@/providers/AuthProvider";
import CountryPicker from "@/components/CountryPicker";

const fields = [
  { label: "Full Name", key: "fullName", type: "text" },
  { label: "Date of Birth", key: "dob", type: "date" },
  { label: "Sex", key: "sex", type: "select", options: ["male", "female", "other"] },
  { label: "Height (cm)", key: "heightCm", type: "number" },
  { label: "Weight (kg)", key: "weightKg", type: "number" },
  { label: "Target Weight (kg)", key: "targetWeightKg", type: "number" },
  { label: "Country", key: "country", type: "country" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { data, loading, refetch } = useMeQuery();
  const [editProfile] = useEditProfileMutation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState("");

  // Reports
  const { data: reportsData, refetch: refetchReports } = useGetReportsQuery({
    variables: { limit: 50 },
  });
  const [uploadReport] = useUploadReportMutation();
  const [getDownloadUrl] = useGetReportDownloadUrlLazyQuery();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Meals for stats
  const { data: mealsData } = useGetMealsQuery({ variables: { limit: 200 } });

  const profile = data?.me;
  const reports = reportsData?.reports?.nodes ?? [];
  const totalMeals = mealsData?.meals?.total ?? 0;

  // Profile stats
  const stats = useMemo(() => {
    if (!profile) return null;
    const createdAt = profile.createdAt ? new Date(profile.createdAt) : new Date();
    const monthsActive = Math.max(1, Math.ceil((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    return { totalMeals, monthsActive, reportsUploaded: reports.length };
  }, [profile, totalMeals, reports.length]);

  // Target weight auto-calculation
  const suggestedTargetWeight = useMemo(() => {
    if (!profile?.heightCm || !profile?.weightKg) return null;
    const heightM = profile.heightCm / 100;
    const currentBmi = profile.weightKg / (heightM * heightM);
    if (currentBmi >= 25) return Math.round(24 * heightM * heightM);
    if (currentBmi < 18.5) return Math.round(20 * heightM * heightM);
    return null; // BMI is normal, no suggestion
  }, [profile?.heightCm, profile?.weightKg]);

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

  const handleUploadReport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File must be under 10MB");
      return;
    }

    setUploading(true);
    setUploadError("");
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const name = file.name.toLowerCase();
      const reportType = name.includes("prescription") || name.includes("clinical")
        ? ReportType.ClinicalNote
        : name.includes("imaging") || name.includes("scan") || name.includes("xray")
        ? ReportType.Imaging
        : ReportType.Lab;

      await uploadReport({
        variables: {
          input: {
            fileBase64: base64,
            fileName: file.name,
            title: file.name.replace(/\.[^.]+$/, ""),
            reportType,
          },
        },
      });
      refetchReports();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }, [uploadReport, refetchReports]);

  const handleDownload = async (reportId: string) => {
    try {
      const { data } = await getDownloadUrl({ variables: { reportId } });
      if (data?.reportDownloadUrl) {
        window.open(data.reportDownloadUrl, "_blank");
      }
    } catch {
      // silent fail
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

  const reportTypeLabel: Record<string, string> = {
    lab: "Lab Report",
    clinical_note: "Clinical Note",
    imaging: "Imaging",
    other: "Other",
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
            <span className="text-2xl font-bold text-emerald-600">
              {profile?.fullName?.charAt(0)?.toUpperCase() || <User className="h-8 w-8" />}
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-sky-900">{profile?.fullName || "User"}</p>
            <p className="text-sm text-sky-500">{user?.email}</p>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50">
                <UtensilsCrossed className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-sky-900">{stats.totalMeals}</p>
                <p className="text-[10px] text-sky-400">Meals Tracked</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                <CalendarDays className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-sky-900">{stats.monthsActive}</p>
                <p className="text-[10px] text-sky-400">Months Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50">
                <FileText className="h-4 w-4 text-sky-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-sky-900">{stats.reportsUploaded}</p>
                <p className="text-[10px] text-sky-400">Reports</p>
              </div>
            </div>
          </div>
        )}

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
                  ) : field.type === "country" ? (
                    <CountryPicker
                      value={form[field.key] || ""}
                      onChange={(val) => setForm({ ...form, [field.key]: val })}
                    />
                  ) : (
                    <>
                      <input
                        type={field.type}
                        value={form[field.key] || ""}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900 outline-none focus:border-emerald-500"
                      />
                      {field.key === "targetWeightKg" && !form.targetWeightKg && suggestedTargetWeight && (
                        <button
                          onClick={() => setForm({ ...form, targetWeightKg: suggestedTargetWeight.toString() })}
                          className="mt-1 text-xs text-emerald-500 hover:text-emerald-600"
                        >
                          Suggested: {suggestedTargetWeight} kg (based on healthy BMI)
                        </button>
                      )}
                    </>
                  )
                ) : (
                  <div>
                    {field.key === "targetWeightKg" && displayValue(field.key) === "—" && suggestedTargetWeight ? (
                      <>
                        <p className="text-sm text-sky-900">{suggestedTargetWeight} kg</p>
                        <p className="mt-0.5 text-xs text-sky-400">Auto-calculated from healthy BMI</p>
                      </>
                    ) : (
                      <p className="text-sm text-sky-900">{displayValue(field.key)}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Medical Records */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-sky-900">Medical Records</h3>
            <label className={`flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-600 ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              <Upload className="h-3 w-3" />
              {uploading ? "Uploading..." : "Upload PDF"}
              <input
                type="file"
                accept=".pdf"
                onChange={handleUploadReport}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {uploadError && (
            <div className="mb-3 rounded-md bg-red-50 p-2 text-xs text-red-600">{uploadError}</div>
          )}

          {reports.length === 0 ? (
            <p className="text-sm text-sky-400">No reports uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-sky-500" />
                    <div>
                      <p className="text-sm font-medium text-sky-900">{report.title}</p>
                      <p className="text-[10px] text-sky-400">
                        {reportTypeLabel[report.reportType] || report.reportType} &middot;{" "}
                        {new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(report.id)}
                    className="rounded p-1.5 text-sky-400 transition hover:bg-sky-100 hover:text-sky-600"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/utils/cn";

const styles: Record<string, { bg: string; text: string }> = {
  Normal: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Excellent: { bg: "bg-emerald-100", text: "text-emerald-700" },
  High: { bg: "bg-amber-100", text: "text-amber-700" },
  Low: { bg: "bg-red-100", text: "text-red-700" },
};

export default function StatusBadge({ label }: { label: string }) {
  const style = styles[label] ?? { bg: "bg-sky-100", text: "text-sky-600" };
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        style.bg,
        style.text
      )}
    >
      {label}
    </span>
  );
}

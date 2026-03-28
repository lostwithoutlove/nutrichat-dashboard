"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sel = new Date(selectedDate);
  sel.setHours(0, 0, 0, 0);

  const isToday = sel.getTime() === today.getTime();

  const goBack = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d);
  };

  const goForward = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    if (d <= today) onDateChange(d);
  };

  const label = isToday
    ? "Today"
    : selectedDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={goBack}
        className="rounded-md p-1.5 text-sky-600 transition hover:bg-sky-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="min-w-[140px] text-center text-sm font-medium text-sky-900">
        {label}
      </span>
      <button
        onClick={goForward}
        disabled={isToday}
        className="rounded-md p-1.5 text-sky-600 transition hover:bg-sky-100 disabled:opacity-30"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

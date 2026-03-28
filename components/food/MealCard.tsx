"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealCardProps {
  name: string;
  time: string;
  items: MealItem[];
  totals: { calories: number; protein: number; carbs: number; fat: number };
  onDelete?: () => void;
}

export default function MealCard({ name, time, items, totals, onDelete }: MealCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-white shadow-sm transition hover:shadow-md">
      {/* Header — click to toggle */}
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-between p-4">
        <div className="text-left">
          <h4 className="text-sm font-bold text-sky-900">{name}</h4>
          <p className="text-xs text-sky-500">{time}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-sky-900">{Math.round(totals.calories)} kcal</p>
            <p className="text-[10px] text-sky-400">
              P {Math.round(totals.protein)}g &middot; C {Math.round(totals.carbs)}g &middot; F {Math.round(totals.fat)}g
            </p>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-sky-400" /> : <ChevronDown className="h-4 w-4 text-sky-400" />}
        </div>
      </button>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-sky-50 px-4 pb-3 pt-2">
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2">
                <div>
                  <p className="text-sm text-sky-900">{item.name}</p>
                  <p className="text-[10px] text-sky-400">{item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-sky-700">{Math.round(item.calories)} kcal</p>
                  <p className="text-[10px] text-sky-400">
                    P {Math.round(item.protein)}g &middot; C {Math.round(item.carbs)}g &middot; F {Math.round(item.fat)}g
                  </p>
                </div>
              </div>
            ))}
          </div>
          {onDelete && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-500 transition hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
                Delete meal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

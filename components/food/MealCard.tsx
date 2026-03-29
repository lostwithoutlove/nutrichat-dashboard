"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Pencil, X, Check } from "lucide-react";

interface MealItem {
  id?: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

interface MealCardProps {
  name: string;
  time: string;
  items: MealItem[];
  totals: { calories: number; protein: number; carbs: number; fat: number };
  notes?: string;
  onDelete?: () => void;
  onEditMeal?: (name: string) => void;
  onDeleteItem?: (itemId: string) => void;
}

export default function MealCard({
  name,
  time,
  items,
  totals,
  notes,
  onDelete,
  onEditMeal,
  onDeleteItem,
}: MealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(name);

  const handleSaveName = () => {
    if (nameInput.trim() && nameInput.trim() !== name) {
      onEditMeal?.(nameInput.trim());
    }
    setEditingName(false);
  };

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Header — click to toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2 text-left">
          {editingName ? (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setEditingName(false);
                }}
                className="w-32 rounded border border-sky-200 px-2 py-0.5 text-sm text-sky-900 outline-none focus:border-emerald-500"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="rounded p-0.5 text-emerald-500 hover:bg-emerald-50"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  setEditingName(false);
                  setNameInput(name);
                }}
                className="rounded p-0.5 text-sky-400 hover:bg-sky-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <h4 className="text-base font-bold text-sky-900">{name}</h4>
              {onEditMeal && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingName(true);
                    setNameInput(name);
                  }}
                  className="rounded p-0.5 text-sky-300 transition hover:text-sky-500"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              <span className="text-sm text-sky-400">{time}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-base font-bold text-sky-900">
              {Math.round(totals.calories)} cal
            </p>
            <p className="text-xs text-sky-400">
              P: {Math.round(totals.protein)}g | C: {Math.round(totals.carbs)}g
              | F: {Math.round(totals.fat)}g
            </p>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-sky-300" />
          ) : (
            <ChevronDown className="h-5 w-5 text-sky-300" />
          )}
        </div>
      </button>

      {/* Expanded — table layout like mobile app */}
      {expanded && (
        <div className="border-t border-sky-50 px-5 pb-4 pt-3">
          {/* Table header */}
          <div className="mb-2 grid grid-cols-[1fr_65px_50px_50px_50px_50px] gap-2 text-[11px] font-medium">
            <span className="text-sky-400">Item</span>
            <span className="text-right text-sky-400">Cal</span>
            <span className="text-right text-red-500">P</span>
            <span className="text-right text-blue-500">C</span>
            <span className="text-right text-orange-500">F</span>
            <span className="text-right text-purple-500">Fb</span>
          </div>

          {/* Items */}
          <div className="space-y-0.5">
            {items.map((item, i) => (
              <div
                key={item.id || i}
                className="group grid grid-cols-[1fr_65px_50px_50px_50px_50px] gap-2 rounded-lg py-2 px-2 hover:bg-sky-50 items-center text-sm"
              >
                <div>
                  <span className="text-sky-900">{item.name}</span>
                  <span className="ml-1.5 text-xs text-sky-300">
                    ({item.quantity})
                  </span>
                </div>
                <span className="text-right font-medium text-sky-700">
                  {Math.round(item.calories)}
                </span>
                <span className="text-right text-red-600">
                  {Math.round(item.protein)}
                </span>
                <span className="text-right text-blue-600">
                  {Math.round(item.carbs)}
                </span>
                <span className="text-right text-orange-600">
                  {Math.round(item.fat)}
                </span>
                <span className="text-right text-purple-500">
                  {Math.round(item.fiber ?? 0)}
                </span>
                {onDeleteItem && item.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Remove this item?")) onDeleteItem(item.id!);
                    }}
                    className="absolute right-2 hidden rounded p-1 text-sky-300 hover:bg-red-50 hover:text-red-400 group-hover:block"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Totals row */}
          <div className="mt-1 grid grid-cols-[1fr_65px_50px_50px_50px_50px] gap-2 border-t border-sky-100 pt-2 text-sm font-bold">
            <span className="text-sky-900">Total</span>
            <span className="text-right text-sky-900">
              {Math.round(totals.calories)}
            </span>
            <span className="text-right text-red-600">
              {Math.round(totals.protein)}
            </span>
            <span className="text-right text-blue-600">
              {Math.round(totals.carbs)}
            </span>
            <span className="text-right text-orange-600">
              {Math.round(totals.fat)}
            </span>
            <span className="text-right text-purple-500">
              {Math.round(
                items.reduce((sum, item) => sum + (item.fiber ?? 0), 0)
              )}
            </span>
          </div>

          {/* Description / notes */}
          {notes && (
            <div className="mt-3 border-t border-sky-50 pt-3">
              <p className="text-xs font-medium text-sky-400">Description</p>
              <p className="mt-1 rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-700">
                {notes}
              </p>
            </div>
          )}

          {/* Delete button */}
          {onDelete && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete meal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

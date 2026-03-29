"use client";

import { useState, useMemo } from "react";
import { UtensilsCrossed } from "lucide-react";
import DatePicker from "@/components/food/DatePicker";
import DailySummaryCard from "@/components/food/DailySummaryCard";
import MealCard from "@/components/food/MealCard";
import CalendarHeatmap from "@/components/food/CalendarHeatmap";
import NutritionTrends from "@/components/food/NutritionTrends";
import { useGetMealsQuery, useMeQuery, useDeleteMealMutation, useEditMealMutation, useDeleteMealItemMutation } from "@/generated/graphql";
import { formatDateToYMD } from "@/utils/dateUtils";

function computeGoals(profile: { weightKg?: number | null } | null | undefined) {
  const weight = profile?.weightKg || 70;
  const calorieTarget = Math.round(weight * 30);
  return {
    calorieTarget,
    proteinMax: Math.round(weight * 2.0),
    carbsMax: Math.round((calorieTarget * 0.6) / 4),
    fatMax: Math.round((calorieTarget * 0.35) / 9),
    fiberMax: 35,
  };
}

function isEditableDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 1;
}

export default function FoodPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const day = formatDateToYMD(selectedDate);
  const canEdit = isEditableDate(selectedDate);

  const { data: meData } = useMeQuery();
  const goals = useMemo(() => computeGoals(meData?.me), [meData?.me]);

  const { data: mealsData, loading, refetch } = useGetMealsQuery({
    variables: { day, limit: 50 },
    fetchPolicy: "cache-and-network",
  });

  const [deleteMeal] = useDeleteMealMutation();
  const [editMeal] = useEditMealMutation();
  const [deleteMealItem] = useDeleteMealItemMutation();
  const meals = mealsData?.meals?.nodes ?? [];

  const summary = useMemo(() => {
    let totalCal = 0, protein = 0, carbs = 0, fat = 0, fiber = 0;
    for (const meal of meals) {
      totalCal += meal.totals?.caloriesKcal ?? 0;
      protein += meal.totals?.proteinG ?? 0;
      carbs += meal.totals?.carbsG ?? 0;
      fat += meal.totals?.fatG ?? 0;
      for (const item of meal.items ?? []) {
        fiber += item.fiberG ?? 0;
      }
    }
    return { totalCal, protein, carbs, fat, fiber };
  }, [meals]);

  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async (mealId: string) => {
    if (!confirm("Delete this meal?")) return;
    setDeleteError("");
    try {
      await deleteMeal({ variables: { id: mealId } });
      refetch();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete meal");
    }
  };

  const handleEditMeal = async (mealId: string, name: string) => {
    try {
      await editMeal({ variables: { input: { id: mealId, name } } });
      refetch();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to edit meal");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteMealItem({ variables: { id: itemId } });
      refetch();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  const handleDateFromCalendar = (date: Date) => {
    setSelectedDate(date);
    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="h-full overflow-y-auto bg-sky-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {deleteError && (
          <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-600">{deleteError}</div>
        )}

        {/* Header */}
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h1 className="text-lg font-bold text-sky-900 md:text-xl">Food Log</h1>
          <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>

        {/* Desktop: 2-column layout | Mobile: stacked */}
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          {/* Left column — Today's meals */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Daily Summary */}
            <DailySummaryCard summary={summary} goals={goals} />

            {/* Meals */}
            {loading && meals.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              </div>
            ) : meals.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-white py-12 text-center shadow-sm">
                <UtensilsCrossed className="mb-3 h-10 w-10 text-sky-200" />
                <p className="text-sm text-sky-600">No meals logged</p>
                <p className="mt-1 text-xs text-sky-400">Chat with NutriChat to log your meals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meals.map((meal) => (
                  <MealCard
                    key={meal.id}
                    name={meal.name || "Meal"}
                    time={new Date(meal.consumedAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    items={
                      (meal.items ?? []).map((item) => ({
                        id: item.id,
                        name: item.foodName,
                        quantity: `${item.quantity} ${item.unit || ""}`.trim(),
                        calories: item.caloriesKcal ?? 0,
                        protein: item.proteinG ?? 0,
                        carbs: item.carbsG ?? 0,
                        fat: item.fatG ?? 0,
                        fiber: item.fiberG ?? 0,
                      }))
                    }
                    notes={meal.notes || undefined}
                    totals={{
                      calories: meal.totals?.caloriesKcal ?? 0,
                      protein: meal.totals?.proteinG ?? 0,
                      carbs: meal.totals?.carbsG ?? 0,
                      fat: meal.totals?.fatG ?? 0,
                    }}
                    onDelete={canEdit ? () => handleDelete(meal.id) : undefined}
                    onEditMeal={canEdit ? (name) => handleEditMeal(meal.id, name) : undefined}
                    onDeleteItem={canEdit ? handleDeleteItem : undefined}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right column — History + Trends */}
          <div className="w-full space-y-4 lg:w-[380px] lg:shrink-0">
            <CalendarHeatmap onDateSelect={handleDateFromCalendar} />
            <NutritionTrends />
          </div>
        </div>
      </div>
    </div>
  );
}

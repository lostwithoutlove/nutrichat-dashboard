export interface DailySummary {
  totalCal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MacroGoals {
  calorieTarget: number;
  proteinMin: number;
  proteinMax: number;
  carbsMin: number;
  carbsMax: number;
  fatMin: number;
  fatMax: number;
  fiberMin: number;
  fiberMax: number;
}


export type MealType = "breakfast" | "lunch" | "dinner";

export interface DailyMealSelection {
  day: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export type WeeklyMealSelection = DailyMealSelection[];

export const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export function createInitialMealSelection(): WeeklyMealSelection {
  return WEEK_DAYS.map((day) => ({
    day,
    breakfast: false,
    lunch: false,
    dinner: false,
  }));
}

export function calculateMealCount(
  meals: WeeklyMealSelection
): number {
  return meals.reduce((total, day) => {
    return (
      total +
      Number(day.breakfast) +
      Number(day.lunch) +
      Number(day.dinner)
    );
  }, 0);
}

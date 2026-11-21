
"use client";

import type {
  WeeklyMealSelection,
  MealType,
} from "../../types/meals";

import { calculateMealCount } from "../../types/meals";

interface WeeklyMealSelectionProps {
  value: WeeklyMealSelection;
  onChange: (meals: WeeklyMealSelection) => void;
}

const MEALS: {
  key: MealType;
  label: string;
  time: string;
  emoji: string;
}[] = [
  {
    key: "breakfast",
    label: "Breakfast",
    time: "Morning",
    emoji: "🌅",
  },
  {
    key: "lunch",
    label: "Lunch",
    time: "Afternoon",
    emoji: "☀️",
  },
  {
    key: "dinner",
    label: "Dinner",
    time: "Evening",
    emoji: "🌙",
  },
];

export default function WeeklyMealSelection({
  value,
  onChange,
}: WeeklyMealSelectionProps) {
  const mealCount = calculateMealCount(value);
  const mealPrice = 1;
  const totalAmount = mealCount * mealPrice;

  const toggleMeal = (
    dayIndex: number,
    meal: MealType
  ) => {
    const updated = value.map((day, index) =>
      index === dayIndex
        ? { ...day, [meal]: !day[meal] }
        : day
    );

    onChange(updated);
  };

  const toggleAllMeals = (dayIndex: number) => {
    const day = value[dayIndex];

    const allSelected =
      day.breakfast && day.lunch && day.dinner;

    const updated = value.map((item, index) =>
      index === dayIndex
        ? {
            ...item,
            breakfast: !allSelected,
            lunch: !allSelected,
            dinner: !allSelected,
          }
        : item
    );

    onChange(updated);
  };

  return (
    <section className="space-y-6">

      {/* Heading */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Weekly Meal Selection
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select the meals you would like to have
          throughout the week.
        </p>
      </div>

      {/* Meal instructions */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          Select your preferred meals from Monday
          to Sunday. You can choose multiple meals
          each day.
        </p>
      </div>

      {/* Days */}
      <div className="space-y-4">
        {value.map((day, index) => {
          const selectedCount = [
            day.breakfast,
            day.lunch,
            day.dinner,
          ].filter(Boolean).length;

          const allSelected = selectedCount === 3;

          return (
            <div
              key={day.day}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >

              {/* Day heading */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {day.day}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {selectedCount} of 3 meals selected
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleAllMeals(index)}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              </div>

              {/* Meal options */}
              <div className="grid grid-cols-3 gap-2 p-3">
                {MEALS.map((meal) => {
                  const selected = day[meal.key];

                  return (
                    <button
                      key={meal.key}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        toggleMeal(index, meal.key)
                      }
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition ${
                        selected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">
                        {meal.emoji}
                      </span>

                      <span className="text-xs font-semibold">
                        {meal.label}
                      </span>

                      <span className="text-[10px] opacity-70">
                        {meal.time}
                      </span>

                      <span className="text-xs">
                        {selected ? "✓ Selected" : "Select"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="rounded-2xl bg-gray-900 p-5 text-white">
        <h3 className="text-sm font-medium text-gray-300">
          Weekly Meal Summary
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400">
              Total Meals
            </p>
            <p className="mt-1 text-2xl font-bold">
              {mealCount}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Total Amount
            </p>
            <p className="mt-1 text-2xl font-bold">
              RM {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-700 pt-3">
          <p className="text-xs text-gray-400">
            RM {mealPrice.toFixed(2)} per meal
          </p>
        </div>
      </div>

      {mealCount === 0 && (
        <p className="text-sm text-red-500">
          Please select at least one meal.
        </p>
      )}

    </section>
  );
}

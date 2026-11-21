

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
}[] = [
  {
    key: "breakfast",
    label: "Breakfast",
    time: "Morning",
  },
  {
    key: "lunch",
    label: "Lunch",
    time: "Afternoon",
  },
  {
    key: "dinner",
    label: "Dinner",
    time: "Evening",
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

  const selectedDays = value.filter(
    (day) =>
      day.breakfast || day.lunch || day.dinner
  ).length;

  return (
    <section className="space-y-6">

      {/* Heading */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
          Weekly Meal Selection
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose your preferred meals for each day of the week.
        </p>
      </div>

      {/* Instructions */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 110-20 10 10 0 010 20z"
            />
          </svg>
        </div>

        <div>
          <p className="text-sm font-semibold text-blue-900">
            Meal Selection Instructions
          </p>
          <p className="mt-1 text-xs leading-relaxed text-blue-700">
            Tick the checkbox beside each meal you wish
            to select. You may choose multiple meals per day.
          </p>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Weekly Overview
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {selectedDays} of {value.length} days have meals selected
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-3 py-2">
          <span className="text-sm font-bold text-blue-700">
            {mealCount} meals selected
          </span>
        </div>
      </div>

      {/* Days */}
      <div className="space-y-3">
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
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-gray-300"
            >
              {/* Day Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/70 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${
                      selectedCount > 0
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {day.day}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {selectedCount}/3 meals selected
                    </p>
                  </div>
                </div>

                {/* Select All Checkbox */}
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-blue-50 hover:text-blue-700">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate =
                          selectedCount > 0 &&
                          selectedCount < 3;
                      }
                    }}
                    onChange={() => toggleAllMeals(index)}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-600"
                  />
                  Select all
                </label>
              </div>

              {/* Checkbox Meal Options */}
              <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-3">
                {MEALS.map((meal) => {
                  const selected = day[meal.key];

                  return (
                    <label
                      key={meal.key}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                        selected
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleMeal(index, meal.key)
                        }
                        className="h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 accent-blue-600"
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold ${
                            selected
                              ? "text-blue-800"
                              : "text-gray-800"
                          }`}
                        >
                          {meal.label}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {meal.time}
                        </p>
                      </div>

                      {selected && (
                        <span className="text-xs font-semibold text-blue-600">
                          Selected
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="rounded-2xl bg-gray-900 p-5 text-white shadow-sm">
        <h3 className="text-sm font-semibold text-gray-300">
          Weekly Meal Summary
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400">
              Total Meals
            </p>

            <p className="mt-1 text-3xl font-bold">
              {mealCount}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Total Amount
            </p>

            <p className="mt-1 text-3xl font-bold">
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

      {/* Validation */}
      {mealCount === 0 && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Please select at least one meal before proceeding.
        </p>
      )}

    </section>
  );
}

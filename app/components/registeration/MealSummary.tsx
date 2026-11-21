
import {
  WeeklyMealSelection,
  calculateMealCount,
} from "../../types/meals";

interface MealSummaryProps {
  meals: WeeklyMealSelection;
  mealPrice?: number;
}

const MEAL_LABELS = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
] as const;

export default function MealSummary({
  meals,
  mealPrice = 1,
}: MealSummaryProps) {
  const mealCount = calculateMealCount(meals);
  const totalAmount = mealCount * mealPrice;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Meal Summary
        </h2>
        <p className="text-sm text-gray-500">
          Review your selected meals before payment.
        </p>
      </div>

      <div className="space-y-3">
        {meals.map((day) => {
          const selected = MEAL_LABELS.filter(
            (meal) => day[meal.key]
          );

          return (
            <div
              key={day.day}
              className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3"
            >
              <span className="font-medium text-gray-800">
                {day.day}
              </span>

              <div className="text-right">
                {selected.length > 0 ? (
                  <div className="flex flex-wrap justify-end gap-1">
                    {selected.map((meal) => (
                      <span
                        key={meal.key}
                        className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700"
                      >
                        {meal.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">
                    No meals selected
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Price per meal</span>
          <span>RM {mealPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Total meals</span>
          <span>{mealCount}</span>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-3">
          <span className="font-semibold text-gray-900">
            Total Amount
          </span>
          <span className="text-xl font-bold text-blue-700">
            RM {totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
}

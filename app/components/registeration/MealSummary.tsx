
import {
  WeeklyMealSelection,
  calculateMealCount,
} from "../../types/meals";
import { ReceiptText } from "lucide-react";

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

  const activeMeals = meals
    .map((day) => {
      const selected = MEAL_LABELS.filter((meal) => day[meal.key]);
      return {
        day: day.day,
        selected,
        dayAmount: selected.length * mealPrice,
      };
    })
    .filter((item) => item.selected.length > 0);

  return (
    <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
      {/* Header Resit */}
      <div className="border-b border-dashed border-slate-300 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-slate-700 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900">
              Total Order
            </h2>
          </div>
          <span className="font-mono text-[11px] font-semibold uppercase text-slate-500">
            Dapur Minda
          </span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Sila review pembayaran anda sebelum payments.
        </p>
      </div>

      {/* Senarai Item Resit (Hanya hari dengan jumlah > 0) */}
      {activeMeals.length > 0 ? (
        <div className="divide-y divide-dashed divide-slate-200 py-1">
          {activeMeals.map(({ day, selected, dayAmount }) => (
            <div
              key={day}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 py-2.5 sm:py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between sm:justify-start gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {day}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    ({selected.length})
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap gap-1">
                  {selected.map((meal) => (
                    <span
                      key={meal.key}
                      className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-700"
                    >
                      {meal.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end border-t border-slate-100 pt-1.5 sm:border-0 sm:pt-0 shrink-0">
                <span className="text-[11px] text-slate-400 sm:hidden">
                  Subtotal
                </span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-slate-800 tabular-nums">
                  RM {dayAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="font-mono text-xs text-slate-400">
            Tiada hidangan dipilih buat masa ini.
          </p>
        </div>
      )}

      {/* Bahagian Kiraan & Jumlah Resit */}
      <div className="mt-2 border-t-2 border-dashed border-slate-300 pt-4 space-y-2 font-mono">
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
          <span>Harga per meal</span>
          <span className="tabular-nums">RM {mealPrice.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
          <span>Total meals</span>
          <span className="tabular-nums">{mealCount}</span>
        </div>

        <div className="mt-3 flex items-baseline justify-between border-t-2 border-slate-900 pt-3">
          <span className="font-sans text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900">
            Total Amount
          </span>
          <span className="text-lg sm:text-2xl font-extrabold text-blue-700 tabular-nums">
            RM {totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Footer Resit */}
      <div className="mt-4 border-t border-dashed border-slate-200 pt-3 text-center">
        <p className="font-mono text-[11px] text-slate-400">
          *** SILA SEMAK JUMLAH SEBELUM PEMBAYARAN ***
        </p>
      </div>
    </section>
  );
}
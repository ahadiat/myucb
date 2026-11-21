"use client"

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { MEAL_REGISTRATION_CONFIG as CONFIG } from "../../lib/mealRegistrationConfig";

type MealName = "breakfast" | "lunch" | "dinner";
type MealDay = {
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
};
type Registration = {
  student: { name: string; matric: string; phone: string; email: string };
  mealDays: MealDay[];
  invoiceNumber: string;
  createdAt: string;
};
type ApiResult = {
  success: boolean;
  verified?: boolean;
  message?: string;
  uuid?: string;
  invoiceNumber?: string;
  receiptSent?: boolean;
  [key: string]: unknown;
};

const MEALS: { key: MealName; label: string; time: string; emoji: string }[] = [
  { key: "breakfast", label: "Breakfast", time: "7:00 AM – 9:00 AM", emoji: "☀️" },
  { key: "lunch", label: "Lunch", time: "12:00 PM – 2:00 PM", emoji: "🍽️" },
  { key: "dinner", label: "Dinner", time: "6:00 PM – 8:00 PM", emoji: "🌙" },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" }).format(amount);

const todayISO = () => {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const newMealDay = (date: string): MealDay => ({
  date, breakfast: false, lunch: false, dinner: false,
});

function makeInvoiceNumber() {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  return `UCB-${ymd}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function loadSaved(): Registration {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Registration;
      if (parsed?.student && Array.isArray(parsed.mealDays)) return parsed;
    }
  } catch {
    // Ignore malformed local data and start a fresh registration.
  }
  return {
    student: { name: "", matric: "", phone: "", email: "" },
    mealDays: [],
    invoiceNumber: makeInvoiceNumber(),
    createdAt: new Date().toISOString(),
  };
}

function classNames(...values: (string | false | undefined)[]) {
  return values.filter(Boolean).join(" ");
}

export default function MealRegistration() {
 const [registration, setRegistration] = useState<Registration>({
  student: { name: "", matric: "", phone: "", email: "" },
  mealDays: [],
  invoiceNumber: "",
  createdAt: "",
});

const [isInitialized, setIsInitialized] = useState(false);
  const [page, setPage] = useState(0);
  const [proof, setProof] = useState<File | null>(null);
  const [proofError, setProofError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  useEffect(() => {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(registration));
  }, [registration]);

  useEffect(() => {
  const saved = loadSaved();

  setRegistration(saved);
  setIsInitialized(true);
}, []);

useEffect(() => {
  if (!isInitialized) return;

  localStorage.setItem(
    CONFIG.STORAGE_KEY,
    JSON.stringify(registration)
  );
}, [registration, isInitialized]);
  const mealCount = useMemo(
    () => registration.mealDays.reduce(
      (sum, day) => sum + Number(day.breakfast) + Number(day.lunch) + Number(day.dinner), 0
    ),
    [registration.mealDays]
  );
  const total = mealCount * CONFIG.PRICE_PER_MEAL;

  const updateStudent = (field: keyof Registration["student"], value: string) => {
    setRegistration((current) => ({
      ...current,
      student: { ...current.student, [field]: value },
    }));
  };

  const addMealDate = (date: string) => {
    if (!date) return;
    setRegistration((current) => {
      if (current.mealDays.some((day) => day.date === date)) return current;
      return {
        ...current,
        mealDays: [...current.mealDays, newMealDay(date)].sort((a, b) => a.date.localeCompare(b.date)),
      };
    });
  };

  const toggleMeal = (date: string, meal: MealName) => {
    setRegistration((current) => ({
      ...current,
      mealDays: current.mealDays.map((day) =>
        day.date === date ? { ...day, [meal]: !day[meal] } : day
      ),
    }));
  };

  const removeMealDate = (date: string) => {
    setRegistration((current) => ({
      ...current,
      mealDays: current.mealDays.filter((day) => day.date !== date),
    }));
  };

  const selectedMealRows = useMemo(() => {
    return registration.mealDays.flatMap((day) =>
      MEALS.filter((meal) => day[meal.key]).map((meal) => ({
        date: day.date,
        meal: meal.label,
        key: meal.key,
      }))
    );
  }, [registration.mealDays]);

  const goNext = () => {
    setError("");
    if (page === 0) {
      const { name, matric, phone } = registration.student;
      if (!name.trim() || !matric.trim() || !phone.trim()) {
        setError("Please complete your name, matric number and phone number.");
        return;
      }
      if (!/^[A-Za-z0-9/-]{3,30}$/.test(matric.trim())) {
        setError("Please enter a valid matric number.");
        return;
      }
    }
    if (page === 1 && mealCount === 0) {
      setError("Please select at least one meal.");
      return;
    }
    if (page === 2 && total <= 0) {
      setError("Your invoice has no selected meals.");
      return;
    }
    setPage((current) => Math.min(current + 1, 4));
  };

  const goBack = () => {
    setError("");
    setPage((current) => Math.max(current - 1, 0));
  };

  const handleProof = (event: ChangeEvent<HTMLInputElement>) => {
    setProofError("");
    const file = event.target.files?.[0] || null;
    if (!file) {
      setProof(null);
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setProofError("Please upload a JPG, PNG or WEBP image.");
      event.target.value = "";
      setProof(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProofError("The payment proof must not exceed 5 MB.");
      event.target.value = "";
      setProof(null);
      return;
    }
    setProof(file);
  };

  const completePayment = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!registration.student.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.student.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!proof) {
      setError("Please upload your payment proof.");
      return;
    }
    if (!CONFIG.APPS_SCRIPT_URL.startsWith("https://")) {
      setError("Please configure your Google Apps Script Web App URL in mealRegistrationConfig.ts.");
      return;
    }

    setLoading(true);
    try {
      const proofBase64 = await fileToBase64(proof);
      const payload = {
        action: "verifyAndFinalize",
        invoiceNumber: registration.invoiceNumber,
        student: {
          name: registration.student.name.trim(),
          matric: registration.student.matric.trim().toUpperCase(),
          phone: registration.student.phone.trim(),
          email: registration.student.email.trim(),
        },
        mealDays: registration.mealDays,
        proofBase64,
        proofMimeType: proof.type,
        proofFileName: proof.name,
      };

      // This is the ONLY request that sends student/meal data to the backend.
      // Apps Script must run OCR server-side, verify the amount, and only then save.
      const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ApiResult;
      if (!response.ok || !data.success || data.verified !== true) {
        throw new Error(data.message || "Payment could not be verified. Please check the proof or contact the administrator.");
      }

      setResult(data);
      setCompleted(true);
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      setPage(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startAgain = () => {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    setRegistration({
      student: { name: "", matric: "", phone: "", email: "" },
      mealDays: [],
      invoiceNumber: makeInvoiceNumber(),
      createdAt: new Date().toISOString(),
    });
    setProof(null);
    setResult(null);
    setCompleted(false);
    setPage(0);
  };

  const adminLink = `https://wa.me/${CONFIG.ADMIN_WHATSAPP}?text=${encodeURIComponent(
    `Hello admin, I need help with my meal registration. Invoice: ${registration.invoiceNumber}, Matric: ${registration.student.matric || "-"}`
  )}`;

  const steps = ["Student", "Meals", "Invoice", "Payment", "Email"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">UCB · Student Services</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Weekly Meal Registration</h1>
            <p className="mt-1 text-sm text-slate-500">Register your details, select meals and complete payment.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="font-mono text-sm font-bold">
  {registration.invoiceNumber || "Loading invoice..."}
</p>
          </div>
        </header>

        {page < 5 && (
          <nav aria-label="Registration progress" className="mb-8">
            <div className="grid grid-cols-5 gap-2">
              {steps.map((step, index) => (
                <div key={step}>
                  <div className={classNames(
                    "mb-2 h-1.5 rounded-full",
                    index <= page ? "bg-blue-700" : "bg-slate-200"
                  )} />
                  <p className={classNames(
                    "text-center text-[10px] font-semibold sm:text-xs",
                    index === page ? "text-blue-800" : "text-slate-400"
                  )}>{step}</p>
                </div>
              ))}
            </div>
          </nav>
        )}

        <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            {page === 0 && (
              <>
                <SectionHeading eyebrow="Step 01" title="Student information" description="Enter your details as shown in your student record." />
                <div className="mt-7 grid gap-5">
                  <Field label="Full name">
                    <input className="field" autoComplete="name" value={registration.student.name} onChange={(e) => updateStudent("name", e.target.value)} placeholder="Enter your full name" />
                  </Field>
                  <Field label="Matric number">
                    <input className="field uppercase" value={registration.student.matric} onChange={(e) => updateStudent("matric", e.target.value.toUpperCase())} placeholder="e.g. BIF2026001" />
                  </Field>
                  <Field label="Phone number">
                    <input className="field" type="tel" autoComplete="tel" value={registration.student.phone} onChange={(e) => updateStudent("phone", e.target.value)} placeholder="e.g. 0123456789" />
                  </Field>
                </div>
                <InfoNote>These details are saved in this browser only. They will not be sent to Google Sheets at this stage.</InfoNote>
              </>
            )}

            {page === 1 && (
              <>
                <SectionHeading eyebrow="Step 02" title="Choose your meals" description="Add the dates you need, then select breakfast, lunch or dinner for each date." />
                <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-blue-50 p-4 sm:flex-row sm:items-end">
                  <Field label="Select meal date" className="flex-1">
                    <input id="meal-date" type="date" min={todayISO()} className="field bg-white" />
                  </Field>
                  <button type="button" className="btn-primary" onClick={() => {
                    const input = document.getElementById("meal-date") as HTMLInputElement | null;
                    if (input?.value) addMealDate(input.value);
                  }}>+ Add date</button>
                </div>

                {registration.mealDays.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                    <div className="text-3xl">📅</div>
                    <p className="mt-2 font-semibold">No dates added yet</p>
                    <p className="mt-1 text-sm text-slate-500">Choose a date above to start selecting meals.</p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {registration.mealDays.map((day) => (
                      <div key={day.date} className="rounded-2xl border border-slate-200 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold">{new Date(`${day.date}T00:00:00`).toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                            <p className="text-xs text-slate-500">{day.date}</p>
                          </div>
                          <button type="button" onClick={() => removeMealDate(day.date)} className="text-xs font-semibold text-rose-600 hover:text-rose-800">Remove date</button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {MEALS.map((meal) => (
                            <button
                              key={meal.key}
                              type="button"
                              aria-pressed={day[meal.key]}
                              onClick={() => toggleMeal(day.date, meal.key)}
                              className={classNames(
                                "rounded-xl border p-3 text-left transition",
                                day[meal.key] ? "border-blue-700 bg-blue-50 ring-1 ring-blue-700" : "border-slate-200 hover:border-slate-400"
                              )}
                            >
                              <span className="text-xl">{meal.emoji}</span>
                              <span className="mt-2 block text-sm font-bold">{meal.label}</span>
                              <span className="mt-1 block text-[11px] text-slate-500">{meal.time}</span>
                              <span className="mt-2 block text-xs font-semibold text-blue-800">{day[meal.key] ? "Selected ✓" : "Select meal"}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <InfoNote>Each selected meal costs {money(CONFIG.PRICE_PER_MEAL)}. You can add multiple dates.</InfoNote>
              </>
            )}

            {page === 2 && (
              <>
                <SectionHeading eyebrow="Step 03" title="Your invoice" description="Review your selected meals and the amount payable." />
                <div className="mt-6 rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-200 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Invoice</p>
                      <p className="mt-1 font-mono text-sm font-bold"> {registration.invoiceNumber || "Loading invoice..."}</p>
              
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">Unpaid</span>
                  </div>
                  <div className="py-4">
                    <p className="font-bold">{registration.student.name || "Student name"}</p>
                    <p className="text-sm text-slate-500">{registration.student.matric || "Matric number"} · {registration.student.phone || "Phone"}</p>
                  </div>
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    {selectedMealRows.map((row, index) => (
                      <div key={`${row.date}-${row.key}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                        <div>
                          <p className="font-medium">{row.meal}</p>
                          <p className="text-xs text-slate-500">{new Date(`${row.date}T00:00:00`).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <span className="font-semibold">{money(CONFIG.PRICE_PER_MEAL)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                    <div>
                      <p className="font-bold">Total payable</p>
                      <p className="text-xs text-slate-500">{mealCount} meal session(s)</p>
                    </div>
                    <p className="text-2xl font-black text-blue-800">{money(total)}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500">This is a generated invoice, not a payment receipt. Your receipt will only be issued after successful verification.</p>
              </>
            )}

            {page === 3 && (
              <>
                <SectionHeading eyebrow="Step 04" title="Make your payment" description="Transfer the exact invoice amount, then upload a clear screenshot or image of the transaction." />
                <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Amount to pay</p>
                  <p className="mt-1 text-3xl font-black">{money(total)}</p>
                  <p className="mt-2 text-xs text-slate-300">Invoice:  {registration.invoiceNumber || "Loading invoice..."}</p>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_150px]">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Bank transfer details</p>
                    <Detail label="Bank" value={CONFIG.BANK_NAME} />
                    <Detail label="Account name" value={CONFIG.ACCOUNT_NAME} />
                    <Detail label="Account number" value={CONFIG.ACCOUNT_NUMBER} copy />
                    <p className="mt-3 text-xs text-slate-500">{CONFIG.PAYMENT_INSTRUCTIONS}</p>
                  </div>
                  {CONFIG.PAYMENT_QR_IMAGE_URL ? (
                    <div className="rounded-2xl border border-slate-200 p-3">
                      <img src={CONFIG.PAYMENT_QR_IMAGE_URL} alt="Payment QR code" className="mx-auto aspect-square w-full rounded-lg object-contain" />
                      <p className="mt-2 text-center text-xs text-slate-500">Scan to pay</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">Add your QR image URL in config</div>
                  )}
                </div>
                {CONFIG.SHOW_PAYMENT_WINDOW_NOTICE && (
                  <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
                    Payment submission may be restricted to the configured payment window. Please follow the event's payment instructions.
                  </div>
                )}
                <div className="mt-6">
                  <Field label="Upload payment proof (JPG, PNG or WEBP · maximum 5 MB)">
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleProof} className="block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-blue-800" />
                  </Field>
                  {proof && <p className="mt-2 text-xs font-semibold text-emerald-700">✓ {proof.name} selected</p>}
                  {proofError && <p className="mt-2 text-xs text-rose-600">{proofError}</p>}
                </div>
                <InfoNote>Your details and meal selections remain in LocalStorage until the payment is verified. The proof image is held temporarily in memory and is not stored in LocalStorage.</InfoNote>
              </>
            )}

            {page === 4 && (
              <form onSubmit={completePayment}>
                <SectionHeading eyebrow="Step 05" title="Where should we send your receipt?" description="Enter an active email address. Your registration will only be submitted after the server verifies your payment proof." />
                <div className="mt-7">
                  <Field label="Student email address">
                    <input className="field" type="email" autoComplete="email" required value={registration.student.email} onChange={(e) => updateStudent("email", e.target.value)} placeholder="name@example.com" />
                  </Field>
                </div>
                <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm text-blue-950">
                  <p className="font-bold">Final submission</p>
                  <p className="mt-1 text-xs leading-5">We will submit your student details, selected meals and payment proof to the verification service. Google Sheets will only be updated if the server confirms that the payment matches this invoice.</p>
                  <div className="mt-3 flex justify-between border-t border-blue-100 pt-3 font-bold">
                    <span>Total</span><span>{money(total)}</span>
                  </div>
                </div>
                <button
  type="submit"
  disabled={!isInitialized || loading || !proof}
  className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
>
  {!isInitialized
    ? "Loading registration..."
    : loading
      ? "Verifying payment…"
      : "Verify payment & complete registration"}
</button>
                <p className="mt-3 text-center text-xs text-slate-500">Do not close this page while verification is in progress.</p>
              </form>
            )}

            {page === 5 && completed && (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Payment verified</p>
                <h2 className="mt-2 text-2xl font-black">Registration successful!</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Your payment has been verified and your registration has been saved. {result?.receiptSent === false ? "However, the receipt email could not be sent. Please contact the administrator." : "A receipt has been sent to your email address."}
                </p>
                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-slate-200 p-4 text-left">
                  <Detail label="Invoice" value={registration.invoiceNumber} />
                  <Detail label="Matric number" value={registration.student.matric} />
                  <Detail label="Email" value={registration.student.email} />
                  <Detail label="Total paid" value={money(total)} />
                  <Detail label="Verification" value="Successful" />
                </div>
                <a href={adminLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Contact admin on WhatsApp</a>
                <div><button type="button" onClick={startAgain} className="mt-4 text-sm font-semibold text-blue-700 hover:underline">Start a new registration</button></div>
              </div>
            )}

            {error && (
              <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                {error}
                {page >= 3 && <div className="mt-2"><a href={adminLink} target="_blank" rel="noreferrer" className="font-bold underline">Contact admin on WhatsApp</a></div>}
              </div>
            )}

            {page < 5 && page !== 4 && (
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <button type="button" onClick={goBack} disabled={page === 0} className="btn-secondary disabled:invisible">Back</button>
                <button type="button" onClick={goNext} className="btn-primary">{page === 3 ? "Continue to email" : page === 2 ? "Continue to payment" : "Continue"}</button>
              </div>
            )}
            {page === 4 && (
              <div className="mt-4 text-center">
                <button type="button" onClick={goBack} disabled={loading} className="text-sm font-semibold text-slate-500 hover:text-slate-900">← Back to payment details</button>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold">Registration summary</h3>
              <div className="mt-4 space-y-3 text-sm">
                <SummaryRow label="Student" value={registration.student.name || "Not entered"} />
                <SummaryRow label="Matric" value={registration.student.matric || "Not entered"} />
                <SummaryRow label="Dates selected" value={String(registration.mealDays.length)} />
                <SummaryRow label="Meal sessions" value={String(mealCount)} />
                <div className="border-t border-slate-100 pt-3">
                  <SummaryRow label="Total" value={money(total)} strong />
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-blue-950 p-5 text-white">
              <p className="font-bold">Need assistance?</p>
              <p className="mt-2 text-sm leading-6 text-blue-100">If your payment cannot be verified or you need help with registration, contact the administrator.</p>
              <a href={adminLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-950 hover:bg-blue-50">WhatsApp administrator</a>
            </div>
            <p className="px-2 text-xs leading-5 text-slate-400">Your unfinished registration is saved locally in this browser. Do not use private browsing or clear browser data before completing payment.</p>
          </aside>
        </main>
        <footer className="mt-8 text-center text-xs text-slate-400">© {new Date().getFullYear()} UCB Student Services · Secure meal registration</footer>
      </div>
      <style>{`
        .field{width:100%;border:1px solid #cbd5e1;border-radius:12px;padding:12px 14px;font-size:14px;outline:none;background:white}
        .field:focus{border-color:#1d4ed8;box-shadow:0 0 0 3px rgb(29 78 216 / .12)}
        .btn-primary{display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:#1d4ed8;padding:12px 18px;color:white;font-size:14px;font-weight:700;transition:background .15s}
        .btn-primary:hover{background:#1e40af}
        .btn-secondary{display:inline-flex;align-items:center;justify-content:center;border:1px solid #cbd5e1;border-radius:12px;padding:11px 18px;color:#334155;font-size:14px;font-weight:700}
      `}</style>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read the payment proof."));
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      if (comma < 0) reject(new Error("Invalid payment proof file."));
      else resolve(result.slice(comma + 1));
    };
    reader.readAsDataURL(file);
  });
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-black tracking-tight">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></div>;
}
function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <label className={classNames("block", className)}><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>{children}</label>;
}
function InfoNote({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">{children}</div>;
}
function Detail({ label, value, copy = false }: { label: string; value: string; copy?: boolean }) {
  const doCopy = () => { if (navigator.clipboard) void navigator.clipboard.writeText(value); };
  return <div className="mt-3 flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs text-slate-500">{label}</p><p className="break-all text-sm font-semibold">{value || "Not configured"}</p></div>{copy && <button type="button" onClick={doCopy} className="shrink-0 text-xs font-bold text-blue-700">Copy</button>}</div>;
}
function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="flex items-start justify-between gap-3"><span className="text-slate-500">{label}</span><span className={classNames("max-w-[60%] break-words text-right", strong ? "font-black text-blue-800" : "font-semibold text-slate-800")}>{value}</span></div>;
}

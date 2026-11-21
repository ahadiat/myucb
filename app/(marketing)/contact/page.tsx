

"use client";

import { useEffect, useState } from "react";

import {
  StudentInformation,
  WeeklyMealSelection,
  MealSummary,
  PaymentProofUpload,
} from "../../components/registeration";

import {
  initialStudentInformation,
  type StudentInformationData,
} from "../../types/registration";

import {
  createInitialMealSelection,
  type WeeklyMealSelection as MealData,
} from "../../types/meals";

import {
  submitRegistration,
  type SubmissionResult,
} from "../../lib/SubmitRegistration";

import WhatsAppButton from "../../components/whatsapp";

import { MessageCircle } from "lucide-react";

export default function Home() {
  const [student, setStudent] =
    useState<StudentInformationData>(
      initialStudentInformation
    );

  const [meals, setMeals] = useState<MealData>(
    createInitialMealSelection()
  );

  const [proof, setProof] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [isCompleted, setIsCompleted] = useState(false);

  const [submissionFailed, setSubmissionFailed] = useState(false);

  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  const [hydrated, setHydrated] = useState(false);

  // Load saved registration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "dapominda_registration"
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed.student) {
          setStudent(parsed.student);
        }

        if (Array.isArray(parsed.meals)) {
          setMeals(parsed.meals);
        }
      }
    } catch (error) {
      console.error(
        "Unable to load registration draft.",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  // Automatically save registration draft
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        "dapominda_registration",
        JSON.stringify({
          student,
          meals,
        })
      );
    } catch (error) {
      console.error(
        "Unable to save registration draft.",
        error
      );
    }
  }, [student, meals, hydrated]);

  // Submit registration
 async function handleSubmit() {
  if (!proof) {
    alert("Please upload your payment proof.");
    return;
  }

  setSubmitting(true);
  setSubmissionResult(null);
  setSubmissionFailed(false);

  try {
    const result = await submitRegistration({
      student,
      meals,
      proof,
    });

    setSubmissionResult(result);

    if (result.success && result.verified) {
      setIsCompleted(true);
    } else {
      setSubmissionFailed(true);
    }

  } catch (error) {
    console.error("Submission error:", error);

    setSubmissionFailed(true);

  } finally {
    setSubmitting(false);
  }
}

  if (!hydrated) return null;

  if (isCompleted) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-10">

      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">

        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Registration Successful!
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Your payment has been successfully verified
          and your Dapo Minda registration has been saved.
        </p>

        {/* Submission ID */}
        {submissionResult?.uuid && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Submission ID
            </p>

            <p className="mt-2 break-all font-mono text-sm font-semibold text-gray-800">
              {submissionResult.uuid}
            </p>
          </div>
        )}

        <p className="mt-5 text-sm text-gray-500">
          Thank you sebab dah daftar Dapo Minda!
        </p>


      </div>
    </main>
  );
}

if (submissionFailed) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-10">

      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">

        {/* Ikon Kegagalan */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-10 w-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Pendaftaran Tidak Berjaya
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Maaf, sesuatu telah berlaku dan kami tidak dapat
          menyelesaikan pendaftaran anda.

          Sila cuba sekali lagi. Jika masalah masih
          berterusan, sila hubungi pihak pentadbir
          untuk mendapatkan bantuan.
        </p>

        {/* Maklumat Status */}
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-left">

          <p className="text-sm font-semibold text-red-800">
            Status Pendaftaran
          </p>

          <p className="mt-1 text-sm text-red-700">
            {submissionResult?.message ||
              "Pendaftaran tidak dapat diproses. Sila cuba sekali lagi."}
          </p>

        </div>

        {/* Cuba Semula */}
        <button
          type="button"
          onClick={() => {
            setSubmissionFailed(false);
            setSubmissionResult(null);
          }}
          className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Cuba Sekali Lagi
        </button>

        {/* Hubungi Admin */}
        <a
          href="https://wa.me/601121982971?text=Assalamualaikum%2C%20saya%20menghadapi%20masalah%20semasa%20pendaftaran%20Dapo%20Minda.%20Mohon%20bantuan%20pihak%20admin."
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600"
        >
          <MessageCircle size={20} />
          Hubungi Admin melalui WhatsApp
        </a>

        <p className="mt-5 text-xs text-gray-400">
          Dapo Minda · Khidmat dan kebajikan pelajar
        </p>

      </div>
    </main>
  );
}

  return (
    <main className="mx-auto max-w-3xl space-y-10 px-5 py-10">

      {/* Student Information */}
      <StudentInformation
        value={student}
        onChange={setStudent}
      />

      {/* Weekly Meal Selection */}
      <div className="border-t border-gray-200 pt-8">
        <WeeklyMealSelection
          value={meals}
          onChange={setMeals}
        />
      </div>

      {/* Meal Summary */}
      <MealSummary
        meals={meals}
        mealPrice={1}
      />

      {/* Payment Recipient */}
      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-semibold text-gray-900">
          Payment Recipient
        </h3>

        <p className="mt-1 text-sm text-gray-700">
          Noha Sama
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Please make sure the recipient name and payment
          amount match before submitting.
        </p>
      </section>

      {/* Payment Proof */}
      <PaymentProofUpload
        value={proof}
        onChange={setProof}
        disabled={submitting}
        maxSizeMB={10}
      />

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !proof}
        className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting
          ? "Submitting and verifying..."
          : "Submit Payment"}
      </button>

      {/* Submission Result */}
      {submissionResult && (
        <div className="mt-4 rounded-xl border border-gray-200 p-4">

          <p className="font-semibold">
            {submissionResult.verified
              ? "Payment verified"
              : "Payment not verified"}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {submissionResult.message}
          </p>

          {submissionResult.uuid && (
            <p className="mt-2 text-xs text-gray-500">
              Submission ID: {submissionResult.uuid}
            </p>
          )}

          {submissionResult.ocrText && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium">
                View OCR text
              </summary>

              <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-xs">
                {submissionResult.ocrText}
              </pre>
            </details>
          )}

        </div>
      )}

  <WhatsAppButton />

    </main>
  );
}

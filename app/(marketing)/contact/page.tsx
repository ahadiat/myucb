

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

    try {
      const result = await submitRegistration({
        student,
        meals,
        proof,
      });

      setSubmissionResult(result);

      if (result.success && result.verified) {
        alert(
          "Payment verified and registration saved."
        );
      } else if (result.success) {
        alert(
          "Your submission was saved, but payment verification failed."
        );
      } else {
        alert(
          result.message ||
          "Submission could not be saved."
        );
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "An unexpected submission error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return null;

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

    </main>
  );
}

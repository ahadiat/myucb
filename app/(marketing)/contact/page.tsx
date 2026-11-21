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

import { AlertCircle, MessageCircle, QrCode, X } from "lucide-react";

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

  // State UI amaran menggantikan alert()
  const [formNotice, setFormNotice] = useState<string | null>(null);

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

  // Kosongkan notis apabila bukti pembayaran dimuat naik
  useEffect(() => {
    if (proof && formNotice) {
      setFormNotice(null);
    }
  }, [proof, formNotice]);

  // Submit registration
  async function handleSubmit() {
    if (!proof) {
      setFormNotice(
        "Sila muat naik bukti pembayaran anda sebelum menghantar pendaftaran."
      );
      return;
    }

    setFormNotice(null);
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
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 text-center shadow-sm">
          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 sm:h-10 sm:w-10 text-green-600"
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

          <h1 className="mt-5 sm:mt-6 text-xl sm:text-2xl font-bold text-gray-900">
            Registration Successful!
          </h1>

          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-600">
            Your payment has been successfully verified
            and your Dapo Minda registration has been saved.
          </p>

          {/* Submission ID */}
          {submissionResult?.uuid && (
            <div className="mt-5 sm:mt-6 rounded-xl bg-gray-50 p-3.5 sm:p-4">
              <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide text-gray-500">
                Submission ID
              </p>

              <p className="mt-1.5 sm:mt-2 break-all font-mono text-xs sm:text-sm font-semibold text-gray-800">
                {submissionResult.uuid}
              </p>
            </div>
          )}

          <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-gray-500">
            Thank you sebab dah daftar Dapo Minda!
          </p>
        </div>
      </main>
    );
  }

  if (submissionFailed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 text-center shadow-sm">
          {/* Ikon Kegagalan */}
          <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 sm:h-10 sm:w-10 text-red-600"
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

          <h1 className="mt-5 sm:mt-6 text-xl sm:text-2xl font-bold text-gray-900">
            Pendaftaran Tidak Berjaya
          </h1>

          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-600">
            Maaf, sesuatu telah berlaku dan kami tidak dapat
            menyelesaikan pendaftaran anda. Sila cuba sekali
            lagi. Jika masalah masih berterusan, sila hubungi
            pihak pentadbir untuk mendapatkan bantuan.
          </p>

          {/* Maklumat Status */}
          <div className="mt-5 sm:mt-6 rounded-xl bg-red-50 p-3.5 sm:p-4 text-left">
            <p className="text-xs sm:text-sm font-semibold text-red-800">
              Status Pendaftaran
            </p>

            <p className="mt-1 text-xs sm:text-sm text-red-700 wrap-break-word">
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
            className="mt-5 sm:mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
          >
            Cuba Sekali Lagi
          </button>

          {/* Hubungi Admin */}
          <a
            href="https://wa.me/601121982971?text=Assalamualaikum%2C%20saya%20menghadapi%20masalah%20semasa%20pendaftaran%20Dapo%20Minda.%20Mohon%20bantuan%20pihak%20admin."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-xs sm:text-sm md:text-base font-semibold text-white transition hover:bg-green-600"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <span>Hubungi Admin melalui WhatsApp</span>
          </a>

          <p className="mt-5 text-[11px] sm:text-xs text-gray-400">
            Dapo Minda · Khidmat dan kebajikan pelajar
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/60 overflow-x-hidden">
      <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-6 sm:px-6 sm:py-10 lg:py-12">
        {/* Title & Logo Universiti: Pendaftaran Dapur Minda */}
        <header className="mb-6 sm:mb-8 border-b border-gray-200 pb-5 sm:pb-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left gap-4">
            <div className="order-2 sm:order-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
                Pendaftaran Dapur Minda
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
                Lengkapkan maklumat pelajar, pilihan juadah mingguan, dan muat naik bukti pembayaran.
              </p>
            </div>

            <div className="order-1 sm:order-2 shrink-0 flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-2xs">
              <img
                src="https://www.ucbestari.edu.my/wp-content/uploads/2021/02/ucb.png"
                alt="Logo University College Bestari"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              />
            </div>
          </div>
        </header>

        {/* Single Section Flow */}
        <div className="space-y-6 sm:space-y-8">
          {/* Student Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
            <StudentInformation
              value={student}
              onChange={setStudent}
            />
          </div>

          {/* Weekly Meal Selection */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
            <WeeklyMealSelection
              value={meals}
              onChange={setMeals}
            />
          </div>

          {/* Meal Summary + Payment Information */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            <div className="lg:col-span-5 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
              <MealSummary
                meals={meals}
                mealPrice={1}
              />
            </div>

            {/* Maklumat Pembayaran & Ruang QR */}
            <div className="lg:col-span-7 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 sm:p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                {/* Ruang QR Code */}
                <div className="w-36 h-36 sm:w-40 sm:h-40 shrink-0 rounded-2xl border-2 border-dashed border-blue-300 bg-white p-2.5 flex flex-col items-center justify-center text-center shadow-2xs">
                  {/* Gantikan blok di bawah dengan   <QrCode className="h-9 w-9 text-blue-500 mb-1.5" /> */}
                  <img src="/qr.png" alt="QR Touch 'n Go" className="w-full h-full object-contain rounded-xl" />
            
                </div>

                {/* Butiran Penerima Pembayaran */}
                <div className="flex-1 w-full text-center sm:text-left space-y-2.5">
                  <div>
                    <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800">
                      Maklumat Pembayaran
                    </span>
                    <h3 className="mt-1.5 text-base sm:text-lg font-bold text-gray-900">
                      Nama : Noha Sama
                    </h3>
                  </div>

                  <div className="rounded-xl border border-blue-200/80 bg-white px-3.5 py-2.5">
                    <p className="text-[11px] font-medium text-gray-500">
                      No. Akaun / E-Wallet
                    </p>
                    <p className="mt-0.5 font-mono text-sm sm:text-base font-bold text-blue-950 break-all">
                      170570453419{" "}
                      <span className="font-sans text-xs sm:text-sm font-semibold text-blue-700">
                        (Touch n Go E-wallet)
                      </span>
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
                    Sila pastikan nama penerima, butiran akaun, dan jumlah pembayaran sepadan sebelum menghantar pendaftaran.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Proof */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
            <PaymentProofUpload
              value={proof}
              onChange={setProof}
              disabled={submitting}
              maxSizeMB={10}
            />

            {/* Banner UI Amaran (pengganti alert) */}
            {formNotice && (
              <div
                role="alert"
                className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 sm:p-4 text-amber-900"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {formNotice}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFormNotice(null)}
                  aria-label="Tutup notis"
                  className="rounded-lg p-1 text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {submitting
                ? "Submitting and verifying..."
                : "Submit Payment"}
            </button>
          </div>

          {/* Submission Result */}
          {submissionResult && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs">
              <p className="text-sm sm:text-base font-semibold text-gray-900">
                {submissionResult.verified
                  ? "Payment verified"
                  : "Payment not verified"}
              </p>

              <p className="mt-1 text-xs sm:text-sm text-gray-600 wrap-break-word">
                {submissionResult.message}
              </p>

              {submissionResult.uuid && (
                <p className="mt-2 break-all font-mono text-xs text-gray-500">
                  Submission ID: {submissionResult.uuid}
                </p>
              )}

              {submissionResult.ocrText && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs sm:text-sm font-medium text-gray-700">
                    View OCR text
                  </summary>

                  <pre className="mt-2 whitespace-pre-wrap wrap-break-word rounded-lg bg-gray-50 p-3 text-xs text-gray-800">
                    {submissionResult.ocrText}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </section>

      <WhatsAppButton />
    </main>
  );
}
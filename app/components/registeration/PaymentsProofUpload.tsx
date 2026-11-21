
"use client";

import { useEffect, useState, useRef } from "react";
import { AlertCircle, FileCheck2, Trash2, UploadCloud, X } from "lucide-react";

interface PaymentProofUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  maxSizeMB?: number;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function PaymentProofUpload({
  value,
  onChange,
  disabled = false,
  maxSizeMB = 10,
}: PaymentProofUploadProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value || !value.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [value]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg(
        "Sila muat naik fail PDF, JPG, JPEG, PNG, atau WEBP sahaja."
      );
      event.target.value = "";
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`Saiz fail tidak boleh melebihi ${maxSizeMB}MB.`);
      event.target.value = "";
      return;
    }

    setErrorMsg(null);
    onChange(file);
  }

  function handleRemove() {
    setErrorMsg(null);
    onChange(null);
  }

  return (
    <section className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Bukti Pembayaran
        </h2>
        <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
          Muat naik resit transaction bank atau pengesahan pembayaran anda.
        </p>
      </div>

     <div className="space-y-3">

  {/* Hidden Image Input */}
  <input
    ref={imageInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    disabled={disabled}
    onChange={handleFileChange}
  />

  {/* Hidden PDF Input */}
  <input
    ref={pdfInputRef}
    type="file"
    accept=".pdf,application/pdf"
    className="hidden"
    disabled={disabled}
    onChange={handleFileChange}
  />

  {!value && (
    <div className="grid grid-cols-2 gap-3">

      {/* Gallery Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => imageInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-5 text-center transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <UploadCloud className="h-8 w-8 text-blue-600" />

        <span className="text-sm font-semibold text-gray-800">
          Pilih Gambar
        </span>

        <span className="text-xs text-gray-500">
          Gallery / Photos
        </span>
      </button>

      {/* PDF Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => pdfInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-center transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileCheck2 className="h-8 w-8 text-gray-600" />

        <span className="text-sm font-semibold text-gray-800">
          Pilih PDF
        </span>

        <span className="text-xs text-gray-500">
          Files / Documents
        </span>
      </button>

    </div>
  )}

  {value && (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (value.type === "application/pdf") {
          pdfInputRef.current?.click();
        } else {
          imageInputRef.current?.click();
        }
      }}
      className="w-full rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
    >
      Pilih fail lain
    </button>
  )}

</div>

      {errorMsg && (
        <div
          role="alert"
          className="mt-3 sm:mt-4 flex items-start justify-between gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-red-900"
        >
          <div className="flex min-w-0 items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <p className="wrap-break-word text-xs sm:text-sm font-medium leading-snug">
              {errorMsg}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            aria-label="Tutup mesej ralat"
            className="shrink-0 rounded-lg p-1 text-red-700 hover:bg-red-100 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {value && (
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-3.5 min-w-0">
          <div className="flex min-w-0 items-center gap-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={value.name}
                className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-lg border border-gray-200 bg-white object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-600">
                <FileCheck2 className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs sm:text-sm font-semibold text-gray-800">
                {value.name}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={handleRemove}
            className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Buang</span>
          </button>
        </div>
      )}
    </section>
  );
}
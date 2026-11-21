
"use client";

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
  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Please upload a PDF, JPG, JPEG, PNG, or WEBP file.");
      event.target.value = "";
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must not exceed ${maxSizeMB}MB.`);
      event.target.value = "";
      return;
    }

    onChange(file);
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Payment Proof
        </h2>
        <p className="text-sm text-gray-500">
          Upload your bank transfer receipt or payment confirmation.
        </p>
      </div>

      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
          disabled
            ? "cursor-not-allowed bg-gray-100 opacity-60"
            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
        }`}
      >
        <span className="mb-2 text-3xl">📄</span>

        <span className="font-medium text-gray-800">
          {value ? "Choose another file" : "Click to upload payment proof"}
        </span>

        <span className="mt-1 text-xs text-gray-500">
          PDF, JPG, JPEG, PNG or WEBP · Maximum {maxSizeMB}MB
        </span>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={handleFileChange}
        />
      </label>

      {value && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">
              {value.name}
            </p>
            <p className="text-xs text-gray-500">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(null)}
            className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}
    </section>
  );
}

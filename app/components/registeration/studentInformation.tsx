
"use client";

import type { StudentInformationData } from "../../types/registration";

interface StudentInformationProps {
  value: StudentInformationData;
  onChange: (data: StudentInformationData) => void;
}

export default function StudentInformation({
  value,
  onChange,
}: StudentInformationProps) {
  const updateField = (
    field: keyof StudentInformationData,
    newValue: string
  ) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  return (
    <section className="space-y-6">
      {/* Section heading */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Student Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Please provide your information for meal registration.
        </p>
      </div>

      {/* Student form */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Name */}
        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="student-name">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="student-name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            value={value.name}
            onChange={(e) =>
              updateField("name", e.target.value)
            }
            className={inputClass}
            required
          />
        </div>

        {/* Matric Number */}
        <div>
          <label className={labelClass} htmlFor="matric-number">
            Matrik Number <span className="text-red-500">*</span>
          </label>
          <input
            id="matric-number"
            type="text"
            placeholder="e.g. BIF00238"
            value={value.matric}
            onChange={(e) =>
              updateField("matric", e.target.value)
            }
            className={inputClass}
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass} htmlFor="student-phone">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="student-phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 0123456789"
            value={value.phone}
            onChange={(e) =>
              updateField("phone", e.target.value)
            }
            className={inputClass}
            required
          />
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="student-email">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="student-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={value.email}
            onChange={(e) =>
              updateField("email", e.target.value)
            }
            className={inputClass}
            required
          />
        </div>

       

      </div>
    </section>
  );
}


import type { StudentInformationData } from "../types/registration";
import type { WeeklyMealSelection } from "../types/meals";

interface SubmitRegistrationParams {
  student: StudentInformationData;
  meals: WeeklyMealSelection;
  proof: File;
}

export interface SubmissionResult {
  success: boolean;
  verified: boolean;
  message: string;
  uuid?: string;
  invoiceNumber?: string;
  ocrText?: string;
  expectedAmount?: number;
  verifiedAmount?: number | null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result);
      const base64 = result.split(",")[1];

      if (!base64) {
        reject(new Error("Could not read the uploaded file."));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => reject(new Error("File reading failed."));
    reader.readAsDataURL(file);
  });
}

export async function submitRegistration({
  student,
  meals,
  proof,
}: SubmitRegistrationParams): Promise<SubmissionResult> {
  const proofBase64 = await fileToBase64(proof);

  const invoiceNumber = `DM-${crypto.randomUUID()}`;

  const response = await fetch("/api/registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "verifyAndFinalize",
      student,
      mealDays: meals,
      invoiceNumber,
      proofBase64,
      proofMimeType: proof.type,
      proofFileName: proof.name,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Submission failed.");
  }

  return result as SubmissionResult;
}


import type { StudentInformationData } from "../types/registration";

const STORAGE_KEY = "dapominda_registration";

export interface RegistrationDraft {
  student: StudentInformationData;
}

export function saveDraft(data: RegistrationDraft) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadDraft(): RegistrationDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) as RegistrationDraft : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}

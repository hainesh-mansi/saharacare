import { TodayDose, Medication, AdherenceSummary, CaregiverAlert, PatientProfile, TimeOfDay } from "@/types";

export interface DosesResponse {
  success: boolean;
  doses: TodayDose[];
  adherence: AdherenceSummary;
  error?: string;
}

export interface MarkDoseResponse {
  success: boolean;
  dose: TodayDose;
  adherence: AdherenceSummary;
  error?: string;
}

export interface MedicationsResponse {
  success: boolean;
  medications: Medication[];
  error?: string;
}

export interface CreateMedicationResponse {
  success: boolean;
  medication: Medication;
  error?: string;
}

export interface CaregiverOverviewResponse {
  success: boolean;
  patient: PatientProfile;
  adherence: AdherenceSummary;
  alerts: CaregiverAlert[];
  error?: string;
}

export const api = {
  async getDoses(): Promise<DosesResponse> {
    const res = await fetch("/api/doses", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch doses: ${res.statusText}`);
    }
    return res.json();
  },

  async markDoseTaken(doseId: string): Promise<MarkDoseResponse> {
    const res = await fetch("/api/doses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doseId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to mark dose taken: ${res.statusText}`);
    }
    return res.json();
  },

  async getMedications(): Promise<MedicationsResponse> {
    const res = await fetch("/api/medications", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch medications: ${res.statusText}`);
    }
    return res.json();
  },

  async createMedication(data: {
    name: string;
    dosage: string;
    instructions: string;
    timeOfDay: TimeOfDay;
  }): Promise<CreateMedicationResponse> {
    const res = await fetch("/api/medications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create medication: ${res.statusText}`);
    }
    return res.json();
  },

  async getCaregiverOverview(): Promise<CaregiverOverviewResponse> {
    const res = await fetch("/api/caregiver", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch caregiver overview: ${res.statusText}`);
    }
    return res.json();
  },

  async acknowledgeAlert(alertId: string): Promise<{ success: boolean; alertId: string; acknowledged: boolean }> {
    const res = await fetch("/api/caregiver", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertId, acknowledged: true }),
    });
    if (!res.ok) {
      throw new Error(`Failed to acknowledge alert: ${res.statusText}`);
    }
    return res.json();
  },

  async recordWellness(status: "good" | "normal" | "unwell", notes: string = ""): Promise<{ success: boolean; wellness: any }> {
    const res = await fetch("/api/caregiver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) {
      throw new Error(`Failed to record wellness check-in: ${res.statusText}`);
    }
    return res.json();
  },
};

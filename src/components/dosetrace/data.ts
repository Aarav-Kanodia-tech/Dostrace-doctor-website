export type InferenceKind = "high" | "inefficacy" | "unknown" | "low";

export type Patient = {
  id: string;
  age: number;
  condition: string;
  regimen: string;
  chemist: string;
  chemistTone: "warn" | "ok" | "muted";
  appointment: string;
  telemetry: string;
  missedMedicines: number;
  inference: string;
  kind: InferenceKind;
};

export const BASE_PATIENTS: Patient[] = [
  {
    id: "PX-8802",
    age: 58,
    condition: "Type 2 Diabetes",
    regimen: "Metformin 500mg, twice a day (30 days)",
    chemist: "12 days late, not confirmed",
    chemistTone: "warn",
    appointment: "Next visit moved back by 14 days",
    telemetry: "Resting heart rate up by 14; sleep worsened",
    missedMedicines: 24,
    inference: "High risk: May not be taking medicine (86% sure)",
    kind: "high",
  },
  {
    id: "PX-4190",
    age: 63,
    condition: "High blood pressure",
    regimen: "Amlodipine 5mg, once a day",
    chemist: "Refill picked up on time",
    chemistTone: "ok",
    appointment: "Visit happened on time",
    telemetry: "Blood pressure rose to 148/92",
    missedMedicines: 0,
    inference: "Medicine may not be working (89% sure)",
    kind: "inefficacy",
  },
  {
    id: "PX-1044",
    age: 47,
    condition: "High cholesterol",
    regimen: "Atorvastatin 20mg",
    chemist: "No refill record (may have paid cash)",
    chemistTone: "muted",
    appointment: "Visit happened on time",
    telemetry: "Health readings stayed normal",
    missedMedicines: 0,
    inference: "Not enough information (48% unsure)",
    kind: "unknown",
  },
];

export const SYNCED_8802: Partial<Patient> = {
  chemist: "Refill confirmed from photo",
  chemistTone: "ok",
  missedMedicines: 0,
  inference: "Low risk: Refill confirmed",
  kind: "low",
};

export const badgeVariantFor: Record<InferenceKind, "riskHigh" | "riskInefficacy" | "riskUnknown" | "riskLow"> = {
  high: "riskHigh",
  inefficacy: "riskInefficacy",
  unknown: "riskUnknown",
  low: "riskLow",
};

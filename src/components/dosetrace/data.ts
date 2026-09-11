export type InferenceKind = "high" | "inefficacy" | "unknown" | "low";

export type Patient = {
  id: string;
  age: number;
  condition: string;
  regimen: string;
  chemist: string;
  chemistTone: "warn" | "ok" | "muted";
  cadence: string;
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
    regimen: "Metformin 500mg BID (30-day supply)",
    chemist: "Delayed (+12 days unverified)",
    chemistTone: "warn",
    cadence: "Follow-up postponed by 14 days",
    telemetry: "RHR Spike (+14 bpm) & Sleep Disruption",
    missedMedicines: 24,
    inference: "High Risk: Suspected Omission (86% Confidence)",
    kind: "high",
  },
  {
    id: "PX-4190",
    age: 63,
    condition: "Stage 2 Hypertension",
    regimen: "Amlodipine 5mg Daily",
    chemist: "Rx Served On-Time",
    chemistTone: "ok",
    cadence: "Punctual check-in",
    telemetry: "Systolic BP Drift (148/92 mmHg)",
    missedMedicines: 0,
    inference: "Potential Molecule Resistance (89% Confidence)",
    kind: "inefficacy",
  },
  {
    id: "PX-1044",
    age: 47,
    condition: "Hyperlipidemia",
    regimen: "Atorvastatin 20mg",
    chemist: "Unrecorded (Cash / Off-network)",
    chemistTone: "muted",
    cadence: "Punctual check-in",
    telemetry: "Vitals Stable at Baseline",
    missedMedicines: 0,
    inference: "Data Incomplete — Presumed Compliant (48% Uncertainty)",
    kind: "unknown",
  },
];

export const SYNCED_8802: Partial<Patient> = {
  chemist: "Verified via Refill OCR",
  chemistTone: "ok",
  missedMedicines: 0,
  inference: "Low Risk / Adherent (Verified Supply)",
  kind: "low",
};

export const badgeVariantFor: Record<InferenceKind, "riskHigh" | "riskInefficacy" | "riskUnknown" | "riskLow"> = {
  high: "riskHigh",
  inefficacy: "riskInefficacy",
  unknown: "riskUnknown",
  low: "riskLow",
};

export type InferenceKind = "high" | "inefficacy" | "unknown" | "low";

export type Patient = {
  id: string;
  age: number;
  condition: string;
  regimen: string;
  chemist: string;
  chemistTone: "warn" | "ok" | "muted";
  appointment: string;
  lastVisit: string | null; // e.g. "Sep 2, 2026"
  nextVisit: string | null; // e.g. "Sep 20, 2026"
  telemetry: string;
  missedMedicines: number;
  heightCm: number;
  weightKg: number;
  history: string[];
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
    lastVisit: "Aug 16, 2026",
    nextVisit: "Sep 27, 2026",
    telemetry: "Resting heart rate up by 14; sleep worsened",
    missedMedicines: 24,
    heightCm: 168,
    weightKg: 82,
    history: [
      "Type 2 Diabetes diagnosed in 2019",
      "Mild nerve pain in feet since 2023",
      "Appendix surgery in 2008",
      "Father had heart disease",
    ],
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
    lastVisit: "Sep 10, 2026",
    nextVisit: null,
    telemetry: "Blood pressure rose to 148/92",
    missedMedicines: 0,
    heightCm: 172,
    weightKg: 78,
    history: [
      "High blood pressure diagnosed in 2016",
      "Knee replacement in 2021",
      "Smoker for 20 years, quit in 2018",
    ],
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
    lastVisit: "Sep 5, 2026",
    nextVisit: null,
    telemetry: "Health readings stayed normal",
    missedMedicines: 0,
    heightCm: 175,
    weightKg: 74,
    history: [
      "High cholesterol found in 2022 check-up",
      "No surgeries",
      "Allergic to penicillin",
    ],
    inference: "Not enough information (48% unsure)",
    kind: "unknown",
  },
  {
    id: "PX-5521",
    age: 52,
    condition: "Asthma",
    regimen: "Budesonide inhaler, twice a day",
    chemist: "Refill picked up 3 days late",
    chemistTone: "warn",
    appointment: "Next visit booked",
    lastVisit: "Aug 28, 2026",
    nextVisit: "Sep 18, 2026",
    telemetry: "Night cough reported twice this week",
    missedMedicines: 3,
    heightCm: 160,
    weightKg: 65,
    history: [
      "Asthma since childhood",
      "Hospital stay for breathing trouble in 2020",
      "Dust allergy",
    ],
    inference: "High risk: May not be taking medicine (71% sure)",
    kind: "high",
  },
  {
    id: "PX-3377",
    age: 70,
    condition: "Heart failure",
    regimen: "Furosemide 40mg, once a day",
    chemist: "Refill picked up on time",
    chemistTone: "ok",
    appointment: "Visit happened on time",
    lastVisit: "Sep 13, 2026",
    nextVisit: "Oct 11, 2026",
    telemetry: "Weight up 2 kg in one week",
    missedMedicines: 1,
    heightCm: 166,
    weightKg: 71,
    history: [
      "Heart failure diagnosed in 2021",
      "Heart attack in 2019, stent placed",
      "High blood pressure since 2010",
      "Lives with family, needs help walking",
    ],
    inference: "Medicine may not be working (64% sure)",
    kind: "inefficacy",
  },
  {
    id: "PX-6608",
    age: 41,
    condition: "Thyroid (underactive)",
    regimen: "Thyroxine 50mcg, once a day",
    chemist: "Refill picked up on time",
    chemistTone: "ok",
    appointment: "Next visit booked",
    lastVisit: "Aug 20, 2026",
    nextVisit: "Sep 15, 2026",
    telemetry: "Health readings stayed normal",
    missedMedicines: 0,
    heightCm: 158,
    weightKg: 59,
    history: [
      "Underactive thyroid diagnosed in 2023",
      "No surgeries",
      "No known allergies",
    ],
    inference: "Low risk: Refill confirmed",
    kind: "low",
  },
  {
    id: "PX-7743",
    age: 66,
    condition: "Type 2 Diabetes",
    regimen: "Glimepiride 2mg, once a day",
    chemist: "Refill 8 days late",
    chemistTone: "warn",
    appointment: "Next visit moved back by 7 days",
    lastVisit: "Aug 30, 2026",
    nextVisit: "Sep 22, 2026",
    telemetry: "Blood sugar readings above target",
    missedMedicines: 8,
    heightCm: 170,
    weightKg: 86,
    history: [
      "Type 2 Diabetes diagnosed in 2015",
      "Eye check showed early damage in 2024",
      "Overweight since 2018",
    ],
    inference: "High risk: May not be taking medicine (78% sure)",
    kind: "high",
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

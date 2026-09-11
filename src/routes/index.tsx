import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  FlaskConical,
  HeartPulse,
  RefreshCw,
  RotateCcw,
  Search,
  Signal,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignalModal } from "@/components/dosetrace/SignalModal";
import { BASE_PATIENTS, SYNCED_8802, badgeVariantFor, type Patient } from "@/components/dosetrace/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DoseTrace Clinician Intelligence — Adherence vs. Inefficacy" },
      {
        name: "description",
        content:
          "Clinical decision dashboard that separates silent medication non-adherence from drug inefficacy using refill, wearable and appointment signals.",
      },
      { property: "og:title", content: "DoseTrace Clinician Intelligence" },
      { property: "og:type", content: "website" },
      {
        property: "og:description",
        content:
          "Detect silent medication non-adherence and distinguish it from pharmacological inefficacy — no patient check-ins required.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const SYNC_KEY = "dosetrace_patient_sync";

const TABS = [
  { label: "All Patients", kind: "all" as const },
  { label: "Suspected Non-Adherence", kind: "high" as const },
  { label: "Inefficacy Alerts", kind: "inefficacy" as const },
  { label: "High Uncertainty", kind: "unknown" as const },
];

function Dashboard() {
  const [synced, setSynced] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "high" | "inefficacy" | "unknown">("all");
  const [active, setActive] = useState<Patient | null>(null);

  const patients = useMemo(
    () => BASE_PATIENTS.map((p) => (p.id === "PX-8802" && synced ? { ...p, ...SYNCED_8802 } : p)),
    [synced],
  );

  const counts = {
    all: 29,
    high: synced ? 13 : 14,
    inefficacy: 6,
    unknown: 9,
  };

  const visible = patients.filter(
    (p) =>
      p.id.toLowerCase().includes(query.trim().toLowerCase()) && (tab === "all" || p.kind === tab),
  );

  const runSync = useCallback(() => {
    setSynced(true);
    setActive((patient) =>
      patient?.id === "PX-8802" ? { ...patient, ...SYNCED_8802 } : patient,
    );
    toast.success(
      "Sync Received from Patient App: Patient #PX-8802 refill OCR verified (Batch #MF-2026)",
    );
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SYNC_KEY) runSync();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [runSync]);

  const kpis = [
    {
      icon: AlertTriangle,
      count: counts.high,
      title: "Suspected Non-Adherence",
      sub: "Supply gap matches biomarker flare & postponed follow-up",
      variant: "riskHigh" as const,
      accent: "bg-risk-high",
    },
    {
      icon: FlaskConical,
      count: counts.inefficacy,
      title: "Potential Drug Inefficacy",
      sub: "Biomarkers deteriorating despite on-time verified supply",
      variant: "riskInefficacy" as const,
      accent: "bg-risk-inefficacy",
    },
    {
      icon: Signal,
      count: counts.unknown,
      title: "High Data Uncertainty",
      sub: "Vitals stable; untracked offline chemist purchase assumed",
      variant: "riskUnknown" as const,
      accent: "bg-risk-unknown",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-4 lg:flex lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <HeartPulse className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold tracking-tight text-foreground">
                DoseTrace Clinician Intelligence
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                Outpatient Chronic Care &amp; Cardiology Unit
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="riskUnknown" className="hidden font-mono sm:inline-flex">
              Clinical Timeline: Day 42 / 60
            </Badge>
            <div className="flex min-w-0 items-center gap-2 border-l border-border pl-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <UserRound className="h-4 w-4" />
              </span>
              <span className="truncate text-sm font-medium text-foreground">Staff Physician</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-6 px-6 py-6">
        <section className="grid gap-3 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patient ID (e.g. PX-8802)"
              className="bg-surface pl-9 font-mono text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.kind}
                onClick={() => setTab(t.kind)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.kind
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground hover:bg-secondary"
                }`}
              >
                {t.label} ({counts[t.kind]})
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {kpis.map((k) => (
            <article
              key={k.title}
              className="relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-lg"
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${k.accent}`} />
              <div className="flex items-start justify-between gap-3">
                <p className="text-3xl font-bold tracking-tight text-foreground">{k.count}</p>
                <Badge variant={k.variant}>
                  <k.icon className="mr-1 h-3 w-3" />
                  Signal
                </Badge>
              </div>
              <h2 className="mt-1 text-sm font-semibold text-foreground">
                Patients • {k.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{k.sub}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-card md:flex md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <RefreshCw className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="min-w-0 text-sm font-semibold text-foreground">Cross-App Sync Engine</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={runSync}>Simulate Incoming Patient Companion Event</Button>
            <Button variant="outline" onClick={() => setSynced(false)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Demo State
            </Button>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              Priority Cohort Triage
            </h2>
            <p className="text-xs text-muted-foreground">
              Reasoned across smart-pen baselines, chemist fulfillment, wearable drift and
              appointment cadence.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  {[
                    "Patient ID",
                    "Regimen (WONDRx Pen Baseline)",
                    "Chemist Refill Status",
                    "Appointment Cadence",
                    "Passive Biomarker Drift",
                    "Medicines Missed",
                    "Inference Status",
                    "Action",
                  ].map((h) => (
                    <th key={h} className="whitespace-nowrap px-5 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id} className="border-t border-border transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-semibold text-foreground">#{p.id}</td>
                    <td className="px-5 py-4 text-foreground">{p.regimen}</td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          p.chemistTone === "warn"
                            ? "font-medium text-risk-high-foreground"
                            : p.chemistTone === "ok"
                              ? "font-medium text-risk-low-foreground"
                              : "text-muted-foreground"
                        }
                      >
                        {p.chemist}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{p.cadence}</td>
                    <td className="px-5 py-4 text-foreground">{p.telemetry}</td>
                    <td className="px-5 py-4">
                      <Badge variant={p.missedMedicines > 0 ? "riskHigh" : "riskLow"}>
                        {p.missedMedicines}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={badgeVariantFor[p.kind]} className="whitespace-nowrap">
                        {p.inference}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Button variant="outline" size="sm" onClick={() => setActive(p)}>
                        Analyze Signals
                      </Button>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                      No patients match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <SignalModal patient={active} open={!!active} onOpenChange={(v) => !v && setActive(null)} />
    </div>
  );
}

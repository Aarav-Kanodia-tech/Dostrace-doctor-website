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
import { SignalAnalysis } from "@/components/dosetrace/SignalAnalysis";
import { BASE_PATIENTS, SYNCED_8802, type Patient } from "@/components/dosetrace/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DoseTrace — Medicine Tracking for Doctors" },
      {
        name: "description",
        content:
          "A simple doctor view showing missed medicine, refill records, health changes, and patient visits.",
      },
      { property: "og:title", content: "DoseTrace — Medicine Tracking for Doctors" },
      { property: "og:type", content: "website" },
      {
        property: "og:description",
        content:
          "See who may have missed medicine and whose medicine may not be working.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const SYNC_KEY = "dosetrace_patient_sync";

const TABS = [
  { label: "All Patients", kind: "all" as const },
  { label: "Recent Visits", kind: "recent" as const },
  { label: "Upcoming Visits", kind: "upcoming" as const },
];

function Dashboard() {
  const [synced, setSynced] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "recent" | "upcoming">("all");
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

  const visitCounts = {
    all: counts.all,
    recent: patients.filter((patient) => patient.appointment.toLowerCase().includes("happened")).length,
    upcoming: patients.filter((patient) => !patient.appointment.toLowerCase().includes("happened")).length,
  };

  const visible = patients.filter(
    (p) =>
      p.id.toLowerCase().includes(query.trim().toLowerCase()) &&
      (tab === "all" ||
        (tab === "recent" && p.appointment.toLowerCase().includes("happened")) ||
        (tab === "upcoming" && !p.appointment.toLowerCase().includes("happened"))),
  );

  const runSync = useCallback(() => {
    setSynced(true);
    setActive((patient) =>
      patient?.id === "PX-8802" ? { ...patient, ...SYNCED_8802 } : patient,
    );
    toast.success(
      "Update received: Patient #PX-8802 refill confirmed from a photo.",
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
      title: "May Not Be Taking Medicine",
      sub: "Late refill, changed health readings, and delayed visit",
      variant: "riskHigh" as const,
      tone: "risk-high" as const,
    },
    {
      icon: FlaskConical,
      count: counts.inefficacy,
      title: "Medicine May Not Be Working",
      sub: "Health readings worsened even though refills were on time",
      variant: "riskInefficacy" as const,
      tone: "risk-inefficacy" as const,
    },
    {
      icon: Signal,
      count: counts.unknown,
      title: "Not Enough Information",
      sub: "Health readings are steady, but a refill record is missing",
      variant: "riskUnknown" as const,
      tone: "risk-unknown" as const,
    },
  ];

  const toneIconBg: Record<string, string> = {
    "risk-high": "bg-risk-high-soft text-risk-high-foreground",
    "risk-inefficacy": "bg-risk-inefficacy-soft text-risk-inefficacy-foreground",
    "risk-unknown": "bg-risk-unknown-soft text-risk-unknown-foreground",
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <HeartPulse className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold tracking-tight text-foreground">
                DoseTrace Doctor View
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                Long-term Care and Heart Health
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-4 py-2 text-primary-foreground shadow-md">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/20">
                <UserRound className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold opacity-90">Doctor</p>
                <p className="truncate text-[10px] opacity-80">ID: DT-CLIN-7729</p>
              </div>
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
              className="rounded-full bg-surface pl-9 font-mono text-sm shadow-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <Button
                key={t.kind}
                type="button"
                variant={tab === t.kind ? "default" : "outline"}
                onClick={() => setTab(t.kind)}
                className="rounded-full"
              >
                {t.label} ({visitCounts[t.kind]})
              </Button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {kpis.map((k) => (
            <article
              key={k.title}
              className="rounded-2xl border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${toneIconBg[k.tone]}`}>
                  <k.icon className="h-5 w-5" />
                </span>
                <Badge variant={k.variant}>
                  Alert
                </Badge>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">{k.count}</p>
              <h2 className="mt-1 text-sm font-semibold text-foreground">
                Patients • {k.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{k.sub}</p>
            </article>
          ))}
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <RefreshCw className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Patient Updates</p>
              <p className="text-xs text-muted-foreground">Simulate a refill update from the patient app.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={runSync} className="rounded-full">Show New Refill Update</Button>
            <Button variant="outline" onClick={() => setSynced(false)} className="rounded-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Example
            </Button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              Patients to Check
            </h2>
            <p className="text-xs text-muted-foreground">
              Based on medicine use, refill records, health readings, and visits.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  {[
                    "Patient ID",
                    "Medicine Plan",
                    "Refill Status",
                    "Next Visit",
                    "Health Changes",
                    "Medicines Missed",
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
                    <td className="px-5 py-4 text-muted-foreground">{p.appointment}</td>
                    <td className="px-5 py-4 text-foreground">{p.telemetry}</td>
                    <td className="px-5 py-4">
                      <Badge variant={p.missedMedicines > 0 ? "riskHigh" : "riskLow"}>
                        {p.missedMedicines}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Button variant="outline" size="sm" onClick={() => setActive(p)} className="rounded-full">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                      No patients match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <SignalAnalysis patient={active} open={!!active} onOpenChange={(v) => !v && setActive(null)} />
    </div>
  );
}

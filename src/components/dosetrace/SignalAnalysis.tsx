import { CalendarClock, HeartPulse, PackageSearch, ScanLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Patient } from "./data";

const DAYS = 60;
const pct = (day: number) => (day / DAYS) * 100;

function DayScale() {
  return (
    <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
      {[0, 15, 30, 45, 60].map((d) => (
        <span key={d} className="absolute -translate-x-1/2" style={{ left: `${pct(d)}%` }}>
          D{d}
        </span>
      ))}
    </div>
  );
}

function BandRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 border-b border-border py-4 last:border-0 md:grid-cols-[minmax(0,200px)_minmax(0,1fr)] md:gap-6">
      <div className="flex min-w-0 items-start gap-2">
        <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function TelemetryCurve() {
  // baseline days 0-32, spike from day 33
  const points: string[] = [];
  for (let d = 0; d <= DAYS; d++) {
    const base = 62 + Math.sin(d / 3) * 1.6;
    const spike = d >= 33 ? Math.min(16, (d - 32) * 1.5) : 0;
    const y = 100 - ((base + spike - 55) / 35) * 100;
    points.push(`${(d / DAYS) * 100},${y}`);
  }
  return (
    <div className="relative h-24 w-full overflow-hidden rounded-xl border border-border bg-secondary/40">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="var(--risk-high)"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        className="absolute inset-y-0 border-l border-dashed border-risk-high/70"
        style={{ left: `${pct(33)}%` }}
      />
      <span
        className="absolute top-1 -translate-x-1/2 rounded-lg bg-risk-high-soft px-1.5 py-0.5 text-[10px] font-semibold text-risk-high-foreground"
        style={{ left: `${pct(41)}%` }}
      >
        Day 33 · resting heart rate starts rising
      </span>
    </div>
  );
}

export function SignalAnalysis({
  patient,
  open,
  onOpenChange,
}: {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-4xl">
        <header className="min-w-0 pr-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <HeartPulse className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Patient #{patient.id} — Medicine Review
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Age {patient.age} · {patient.condition} · Prescription started on Day 0
              </p>
            </div>
          </div>
          <Badge
            variant={patient.missedMedicines > 0 ? "riskHigh" : "riskLow"}
            className="mt-4"
          >
            Medicines missed: {patient.missedMedicines}
          </Badge>
        </header>

        <section className="mt-2 rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            60-Day Health History
          </h3>

          <BandRow icon={<PackageSearch className="h-4 w-4" />} title="Medicine Supply">
            <div className="relative h-8 w-full overflow-hidden rounded-xl bg-secondary">
              <div
                className="absolute inset-y-0 flex items-center justify-center bg-risk-low/25 text-[10px] font-semibold text-risk-low-foreground"
                style={{ left: 0, width: `${pct(30)}%` }}
              >
                Days 0–30 · medicine available
              </div>
              <div
                className="absolute inset-y-0 flex items-center justify-center bg-risk-high/25 text-[10px] font-semibold text-risk-high-foreground"
                style={{ left: `${pct(30)}%`, width: `${pct(12)}%` }}
              >
                Days 31–42 · no medicine
              </div>
            </div>
            <DayScale />
          </BandRow>

          <BandRow icon={<ScanLine className="h-4 w-4" />} title="Refill Record">
            <div className="relative h-8 w-full overflow-hidden rounded-xl border border-border bg-secondary/40">
              <div
                className="absolute inset-y-0 border-x border-dashed border-risk-high/60 bg-risk-high-soft"
                style={{ left: `${pct(30)}%`, width: `${pct(12)}%` }}
              />
              <span
                className="absolute inset-y-0 flex items-center text-[10px] font-semibold text-risk-high-foreground"
                style={{ left: `${pct(31)}%` }}
              >
                No refill record from Day 30 to Day 42
              </span>
            </div>
            <DayScale />
          </BandRow>

          <BandRow icon={<HeartPulse className="h-4 w-4" />} title="Health Readings">
            <TelemetryCurve />
            <DayScale />
          </BandRow>

          <BandRow icon={<CalendarClock className="h-4 w-4" />} title="Doctor Visits">
            <div className="relative h-8 w-full rounded-xl bg-secondary/40">
              <span
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-risk-unknown"
                style={{ left: `${pct(30)}%` }}
              />
              <span
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-risk-high"
                style={{ left: `${pct(44)}%` }}
              />
              <span
                className="absolute inset-y-0 border-t-2 border-dashed border-risk-high/50"
                style={{ left: `${pct(30)}%`, width: `${pct(14)}%`, top: "50%" }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The visit moved from Day 30 to Day 44. There was no plan to slowly reduce the
              medicine.
            </p>
          </BandRow>
        </section>

        <footer className="flex flex-wrap gap-2">
          <Button className="rounded-full">Change Medicine Plan</Button>
          <Button variant="outline" className="rounded-full">Book a Follow-up Visit</Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full">
            Close Analysis
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

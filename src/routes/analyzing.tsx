import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ANALYZING_STEPS } from "@/data/demo";
import { useSellsweep } from "@/lib/store";

export const Route = createFileRoute("/analyzing")({
  head: () => ({
    meta: [
      { title: "Analyzing your photos, sellsweep" },
      { name: "description", content: "sellsweep is reading your photos and drafting listings." },
      { property: "og:title", content: "Analyzing your photos, sellsweep" },
      { property: "og:description", content: "sellsweep is reading your photos and drafting listings." },
    ],
  }),
  component: Analyzing,
});

function Analyzing() {
  const navigate = useNavigate();
  const { listings } = useSellsweep();
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (listings.length === 0) {
      navigate({ to: "/" });
      return;
    }
    const timers = ANALYZING_STEPS.map((_, i) =>
      setTimeout(() => setDone(i + 1), (i + 1) * 800),
    );
    const finish = setTimeout(() => navigate({ to: "/review" }), 4200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [listings.length, navigate]);

  const progress = (done / ANALYZING_STEPS.length) * 100;

  return (
    <AppShell step="Upload">
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-semibold">Analyzing</h1>
        <ul className="mt-10 space-y-3 text-left">
          {ANALYZING_STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              <span
                className={`flex size-5 items-center justify-center rounded-full border text-[0.65rem] ${
                  i < done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {i < done ? "\u2713" : ""}
              </span>
              <span className={i < done ? "text-sm" : "text-sm text-muted-foreground"}>{label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </AppShell>
  );
}

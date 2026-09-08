import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { BANNER_TEXT } from "@/data/demo";

const STEPS = ["Upload", "Review", "Summary", "Post", "Done"] as const;
export type Step = (typeof STEPS)[number];

function DesktopOnlyNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <div className="max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <p className="font-display text-lg font-medium">sellsweep</p>
        <p className="mt-3 text-sm text-muted-foreground">
          sellsweep is optimized for desktop, mobile is coming soon.
        </p>
      </div>
    </div>
  );
}

function useIsNarrow() {
  const [narrow, setNarrow] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return narrow;
}

function StepIndicator({ current }: { current: Step }) {
  const activeIndex = STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-3">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <span
            className={
              i === activeIndex
                ? "text-sm font-medium text-primary"
                : i < activeIndex
                  ? "text-sm text-foreground"
                  : "text-sm text-muted-foreground"
            }
          >
            {step}
          </span>
          {i < STEPS.length - 1 && <span className="h-px w-8 bg-border" />}
        </div>
      ))}
    </div>
  );
}

export function AppShell({
  step,
  children,
  wide,
  actions,
}: {
  step: Step;
  children: ReactNode;
  wide?: boolean;
  /** The screen's Back / Next controls. Rendered right-aligned at the top of the page and again at the bottom. */
  actions?: ReactNode;
}) {
  const narrow = useIsNarrow();
  if (narrow === null) return null;
  if (narrow) return <DesktopOnlyNotice />;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-muted/60">
        <p className="mx-auto max-w-6xl px-10 py-2.5 text-xs text-muted-foreground">
          {BANNER_TEXT}{" "}
          <Link to="/about" className="text-primary underline underline-offset-2">
            About this prototype
          </Link>
        </p>
      </div>
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-10 py-4">
          <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
            sellsweep
          </Link>
          <StepIndicator current={step} />
        </div>
      </div>
      <main className={wide ? "mx-auto max-w-[1400px] px-10 py-14" : "mx-auto max-w-6xl px-10 py-14"}>
        {actions && <div className="mb-8 flex items-center justify-end gap-3">{actions}</div>}
        {children}
        {actions && <div className="mt-12 flex items-center justify-end gap-3">{actions}</div>}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-10 py-5 text-xs text-muted-foreground">
          <span>sellsweep prototype. Nothing here is real.</span>
          <Link to="/about" className="text-primary underline underline-offset-2">
            About sellsweep
          </Link>
        </div>
      </footer>
    </div>
  );
}

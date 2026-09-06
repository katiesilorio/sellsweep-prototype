import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { MARKETPLACES, type Marketplace } from "@/data/demo";
import { useSellsweep } from "@/lib/store";

export const Route = createFileRoute("/posting")({
  head: () => ({
    meta: [
      { title: "Posting your listings, sellsweep" },
      { name: "description", content: "sellsweep is posting every listing to every marketplace you chose." },
      { property: "og:title", content: "Posting your listings, sellsweep" },
      {
        property: "og:description",
        content: "sellsweep is posting every listing to every marketplace you chose.",
      },
    ],
  }),
  component: Posting,
});

type Status = "Queued" | "Posting" | "Posted";

function Posting() {
  const navigate = useNavigate();
  const { listings } = useSellsweep();

  const cells = useMemo(
    () =>
      listings.flatMap((l) =>
        MARKETPLACES.filter((m) => l.marketplaces[m].selected).map((m) => `${l.id}|${m}`),
      ),
    [listings],
  );

  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  useEffect(() => {
    if (listings.length === 0) {
      navigate({ to: "/" });
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    cells.forEach((key, i) => {
      const start = 400 + i * 260;
      timers.push(setTimeout(() => setStatuses((s) => ({ ...s, [key]: "Posting" })), start));
      timers.push(
        setTimeout(() => setStatuses((s) => ({ ...s, [key]: "Posted" })), start + 1200),
      );
    });
    const finish = setTimeout(() => navigate({ to: "/done" }), 400 + cells.length * 260 + 1600);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [cells, listings.length, navigate]);

  if (listings.length === 0) return null;

  const postedCount = cells.filter((c) => statuses[c] === "Posted").length;
  const progress = cells.length ? (postedCount / cells.length) * 100 : 0;

  const selectedMarketplaces = MARKETPLACES.filter((m) =>
    listings.some((l) => l.marketplaces[m].selected),
  );

  return (
    <AppShell step="Post" wide>
      <h1 className="text-3xl font-semibold">Posting</h1>
      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-left">
              <th className="px-5 py-3 font-medium">Listing</th>
              {selectedMarketplaces.map((m) => (
                <th key={m} className="px-5 py-3 font-medium">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="max-w-xs px-5 py-4">{l.title}</td>
                {selectedMarketplaces.map((m: Marketplace) => {
                  const key = `${l.id}|${m}`;
                  if (!l.marketplaces[m].selected)
                    return (
                      <td key={m} className="px-5 py-4 text-muted-foreground">
                        -
                      </td>
                    );
                  const status = statuses[key] ?? "Queued";
                  return (
                    <td key={m} className="px-5 py-4">
                      <span
                        className={
                          status === "Posted"
                            ? "text-[var(--color-success)]"
                            : status === "Posting"
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }
                      >
                        {status === "Posted" ? "\u2713 " : ""}
                        {status === "Posting" ? "\u25CC " : ""}
                        {status}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

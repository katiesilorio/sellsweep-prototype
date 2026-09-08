import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { PhotoTile } from "@/components/PhotoTile";
import { MARKETPLACES, money } from "@/data/demo";
import { buyerPrice, shippingFor, shippingIncluded, useSellsweep } from "@/lib/store";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Summary before posting, sellsweep" },
      {
        name: "description",
        content: "Everything you are about to post, and the copyright risk you are asked to accept.",
      },
      { property: "og:title", content: "Summary before posting, sellsweep" },
      {
        property: "og:description",
        content: "Everything you are about to post, and the copyright risk you are asked to accept.",
      },
    ],
  }),
  component: Summary,
});

function Summary() {
  const navigate = useNavigate();
  const { listings, updateListing } = useSellsweep();

  useEffect(() => {
    if (listings.length === 0) navigate({ to: "/" });
  }, [listings.length, navigate]);

  if (listings.length === 0) return null;

  const marketplaceCount = new Set(
    listings.flatMap((l) => MARKETPLACES.filter((m) => l.marketplaces[m].selected)),
  ).size;
  const flagged = listings.filter((l) => l.flagged);
  const canPost = flagged.every((l) => l.accepted);

  return (
    <AppShell step="Summary">
      <h1 className="text-3xl font-semibold">
        You are about to post {listings.length} {listings.length === 1 ? "listing" : "listings"} to{" "}
        {marketplaceCount} {marketplaceCount === 1 ? "marketplace" : "marketplaces"}.
      </h1>

      <div className="mt-10 space-y-6">
        {listings.map((l) => {
          const ship = shippingFor(l);
          return (
            <div key={l.id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex gap-6">
                {l.photos[0] && <PhotoTile photo={l.photos[0]} size="sm" />}
                <div className="flex-1">
                  <h2 className="text-base font-medium">{l.title}</h2>
                  <ul className="mt-3 space-y-1.5">
                    {MARKETPLACES.filter((m) => l.marketplaces[m].selected).map((m) => {
                      const cfg = l.marketplaces[m];
                      return (
                        <li key={m} className="text-sm text-muted-foreground">
                          <span className="text-foreground">{m}</span> {money(buyerPrice(l, m))}
                          {shippingIncluded(l, m)
                            ? ", free shipping"
                            : ship !== null
                              ? ` + shipping ${money(ship)}`
                              : " + shipping"}
                          {cfg.pricing === "Custom price" ? " (custom price)" : ""}
                        </li>
                      );
                    })}
                  </ul>

                  {l.flagged && (
                    <div className="mt-4 rounded-xl border border-warning/30 bg-warning-surface p-4">
                      <p className="text-sm text-warning-foreground">{l.flagText}</p>
                      <label className="mt-3 flex cursor-pointer items-center gap-2.5">
                        <input
                          type="checkbox"
                          className="size-4 accent-[var(--color-primary)]"
                          checked={l.accepted}
                          onChange={(e) => updateListing(l.id, { accepted: e.target.checked })}
                        />
                        <span className="text-sm">
                          I understand the risk and want to post this listing anyway
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex items-center gap-3">
        <Link to="/review" className="btn-ghost">
          Back
        </Link>
        <button
          className="btn-primary"
          disabled={!canPost}
          onClick={() => navigate({ to: "/posting" })}
        >
          Post to marketplaces
        </button>
        <span className="text-xs text-muted-foreground">
          {flagged.length === 0
            ? "No copyright risk on these listings."
            : !canPost
              ? "Accept the copyright risk on flagged listings to continue."
              : ""}
        </span>
      </div>
    </AppShell>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { PhotoTile } from "@/components/PhotoTile";
import { MARKETPLACES, MARKETPLACE_SLUGS } from "@/data/demo";
import { useSellsweep } from "@/lib/store";

export const Route = createFileRoute("/done")({
  head: () => ({
    meta: [
      { title: "Listings posted, sellsweep" },
      { name: "description", content: "Every listing is posted to the marketplaces you chose." },
      { property: "og:title", content: "Listings posted, sellsweep" },
      { property: "og:description", content: "Every listing is posted to the marketplaces you chose." },
    ],
  }),
  component: Done;
});

function Done() {
  const navigate = useNavigate();
  const { listings, reset } = useSellsweep();

  useEffect(() => {
    if (listings.length === 0) navigate({ to: "/" });
  }, [listings.length, navigate]);

  if (listings.length === 0) return null;

  const marketplaceCount = new Set(
    listings.flatMap((l) => MARKETPLACES.filter((m) => l.marketplaces[m].selected)),
  ).size;

  return (
    <AppShell step="Done">
      <h1 className="text-3xl font-semibold">
        {listings.length} {listings.length === 1 ? "listing" : "listings"} posted to{" "}
        {marketplaceCount} {marketplaceCount === 1 ? "marketplace" : "marketplaces"}.
      </h1>

      <div className="mt-10 space-y-6">
        {listings.map((l) => (
          <div key={l.id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex gap-6">
              {l.photos[0] && <PhotoTile photo={l.photos[0]} size="sm" />}
              <div>
                <h2 className="text-base font-medium">{l.title}</h2>
                <div className="mt-3 flex flex-wrap gap-4">
                  {MARKETPLACES.filter((m) => l.marketplaces[m].selected).map((m) => (
                    <Link
                      key={m}
                      to="/listing/$listingId/$marketplace"
                      params={{ listingId: l.id, marketplace: MARKETPLACE_SLUGS[m] }}
                      className="text-sm text-primary underline underline-offset-2"
                    >
                      View on {m}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <button
          className="btn-ghost"
          onClick={() => {
            reset();
            navigate({ to: "/" });
          }}
        >
          Start another batch
        </button>
      </div>
    </AppShell>
  );
}

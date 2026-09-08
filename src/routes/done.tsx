import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ListingPreview } from "@/components/ListingPreview";
import { PhotoTile } from "@/components/PhotoTile";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { MARKETPLACES, type Marketplace } from "@/data/demo";
import { useSellsweep, type Listing } from "@/lib/store";

export const Route = createFileRoute("/done")({
  head: () => ({
    meta: [
      { title: "Listings posted, sellsweep" },
      { name: "description", content: "Every listing is posted to the marketplaces you chose." },
      { property: "og:title", content: "Listings posted, sellsweep" },
      { property: "og:description", content: "Every listing is posted to the marketplaces you chose." },
    ],
  }),
  component: Done,
});

function Done() {
  const navigate = useNavigate();
  const { listings, reset } = useSellsweep();
  const [open, setOpen] = useState<{ listing: Listing; marketplace: Marketplace } | null>(null);

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
                    <button
                      key={m}
                      type="button"
                      onClick={() => setOpen({ listing: l, marketplace: m })}
                      className="text-sm text-primary underline underline-offset-2"
                    >
                      View on {m}
                    </button>
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

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[92vh] w-[min(1200px,94vw)] max-w-none overflow-y-auto p-0">
          {open && (
            <>
              <div className="border-b border-border bg-muted/60 px-8 py-3 pr-14">
                <DialogTitle className="text-xs font-normal text-muted-foreground">
                  Simulated <span className="text-foreground">{open.marketplace}</span> listing page inside
                  the sellsweep prototype, not the real marketplace. Nothing here is clickable for real.
                </DialogTitle>
                <DialogDescription className="sr-only">
                  A simulated marketplace listing page for {open.listing.title}.
                </DialogDescription>
              </div>
              <ListingPreview listing={open.listing} marketplace={open.marketplace} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

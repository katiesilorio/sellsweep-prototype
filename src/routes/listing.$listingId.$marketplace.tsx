import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ListingPreview } from "@/components/ListingPreview";
import { MARKETPLACES, MARKETPLACE_SLUGS } from "@/data/demo";
import { useSellsweep } from "@/lib/store";

export const Route = createFileRoute("/listing/$listingId/$marketplace")({
  head: () => ({
    meta: [
      { title: "Simulated listing page, sellsweep" },
      {
        name: "description",
        content: "A simulated marketplace listing page inside the sellsweep prototype.",
      },
      { property: "og:title", content: "Simulated listing page, sellsweep" },
      {
        property: "og:description",
        content: "A simulated marketplace listing page inside the sellsweep prototype.",
      },
    ],
  }),
  component: FakeListing,
});

function FakeListing() {
  const navigate = useNavigate();
  const { listingId, marketplace } = Route.useParams();
  const { listings } = useSellsweep();

  const listing = listings.find((l) => l.id === listingId);
  const name = MARKETPLACES.find((m) => MARKETPLACE_SLUGS[m] === marketplace);

  useEffect(() => {
    if (!listing || !name) navigate({ to: "/" });
  }, [listing, name, navigate]);

  if (!listing || !name) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-muted/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-10 py-2.5 text-xs text-muted-foreground">
          <span>
            Simulated <span className="text-foreground">{name}</span> listing page inside the sellsweep
            prototype, not the real marketplace. Nothing here is clickable for real.
          </span>
          <Link to="/done" className="underline underline-offset-2">
            Back to sellsweep
          </Link>
        </div>
      </div>
      <ListingPreview listing={listing} marketplace={name} />
    </div>
  );
}

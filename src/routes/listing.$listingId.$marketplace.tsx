import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MARKETPLACES, MARKETPLACE_SLUGS, money } from "@/data/demo";
import { buyerPrice, shippingFor, shippingIncluded, useSellsweep } from "@/lib/store";

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

  const ship = shippingFor(listing);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-muted/60">
        <p className="mx-auto max-w-3xl px-10 py-2.5 text-xs text-muted-foreground">
          This is a simulated listing page inside the sellsweep prototype, not the real marketplace.
        </p>
      </div>

      <main className="mx-auto max-w-3xl px-10 py-14">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{name}</p>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {listing.photos.map((p) => (
            <img
              key={p.id}
              src={p.src}
              alt={p.label}
              loading="lazy"
              width={1024}
              height={1024}
              className="aspect-square w-full rounded-xl border border-border object-cover"
            />
          ))}
        </div>

        <h1 className="mt-8 text-2xl font-semibold">{listing.title}</h1>
        <p className="mt-3 text-xl">{money(buyerPrice(listing, name))}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {shippingIncluded(listing, name)
            ? "Free shipping"
            : ship !== null
              ? `+ shipping ${money(ship)}`
              : "+ shipping"}
        </p>

        <div className="mt-8 space-y-4 whitespace-pre-line text-[0.95rem] leading-relaxed text-muted-foreground">
          {listing.description}
        </div>

        <div className="mt-12">
          <Link to="/done" className="btn-ghost">
            Back to sellsweep
          </Link>
        </div>
      </main>
    </div>
  );
}

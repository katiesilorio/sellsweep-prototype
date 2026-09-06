import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { MarketplaceRows } from "@/components/MarketplaceControls";
import { PhotoTile } from "@/components/PhotoTile";
import { shippingFor, useSellsweep, type Listing } from "@/lib/store";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Review your listings, sellsweep" },
      {
        name: "description",
        content: "Edit the AI-drafted titles, prices, shipping, and marketplace choices before posting.",
      },
      { property: "og:title", content: "Review your listings, sellsweep" },
      {
        property: "og:description",
        content: "Edit the AI-drafted titles, prices, shipping, and marketplace choices before posting.",
      },
    ],
  }),
  component: Review,
});

function ShippingField({ listing }: { listing: Listing }) {
  const { updateListing } = useSellsweep();
  const derived = shippingFor(listing);
  return (
    <input
      className="field"
      value={derived === null ? "" : derived.toFixed(2)}
      placeholder="Enter dimensions and weight"
      onChange={(e) => {
        const v = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
        updateListing(listing.id, { shippingOverride: Number.isNaN(v) ? null : v });
      }}
    />
  );
}

function DimsFields({ listing, compact }: { listing: Listing; compact?: boolean }) {
  const { updateListing } = useSellsweep();
  const fields: Array<{ key: "length" | "width" | "height" | "weight"; label: string }> = [
    { key: "length", label: "Length (in)" },
    { key: "width", label: "Width (in)" },
    { key: "height", label: "Height (in)" },
    { key: "weight", label: "Weight (lb)" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {fields.map((f) => (
        <label key={f.key} className="block">
          <span className="text-[0.7rem] text-muted-foreground">{f.label}</span>
          <input
            className="field mt-1"
            value={listing[f.key]}
            onChange={(e) => updateListing(listing.id, { [f.key]: e.target.value })}
            placeholder={compact ? f.label.slice(0, 1) : ""}
          />
        </label>
      ))}
    </div>
  );
}

function CopyrightBanner({ flagged }: { flagged: Listing[] }) {
  if (flagged.length === 0) {
    return (
      <p className="mb-8 text-xs text-muted-foreground">No copyright risk found</p>
    );
  }
  return (
    <div className="mb-8 rounded-2xl border border-warning/30 bg-warning-surface p-5">
      <p className="text-sm font-medium text-warning-foreground">
        {flagged.length} {flagged.length === 1 ? "listing carries" : "listings carry"} copyright risk
      </p>
      <ul className="mt-2 list-disc pl-5 text-sm text-warning-foreground">
        {flagged.map((l) => (
          <li key={l.id}>{l.title}</li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-warning-foreground">
        You will be asked to accept the risk before posting.
      </p>
    </div>
  );
}

function SingleForm({ listing }: { listing: Listing }) {
  const { updateListing } = useSellsweep();
  return (
    <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-12">
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            {listing.photos[0] && <PhotoTile photo={listing.photos[0]} size="lg" />}
          </div>
          <div className="col-span-2 grid grid-cols-2 content-start gap-4">
            {listing.photos.slice(1).map((p) => (
              <PhotoTile key={p.id} photo={p} size="lg" />
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-xs text-muted-foreground">Title</span>
          <input
            className="field mt-1"
            value={listing.title}
            onChange={(e) => updateListing(listing.id, { title: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="text-xs text-muted-foreground">Description</span>
          <textarea
            className="field mt-1 min-h-40"
            value={listing.description}
            onChange={(e) => updateListing(listing.id, { description: e.target.value })}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs text-muted-foreground">Suggested price</span>
            <input
              className="field mt-1"
              value={listing.price}
              onChange={(e) =>
                updateListing(listing.id, { price: parseFloat(e.target.value) || 0 })
              }
            />
            <span className="mt-1 block text-[0.7rem] text-muted-foreground">
              Priced against comparable listings.
            </span>
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Shipping cost</span>
            <div className="mt-1">
              <ShippingField listing={listing} />
            </div>
          </label>
        </div>

        <DimsFields listing={listing} />
      </div>

      <div>
        <h2 className="text-sm font-medium">Marketplaces</h2>
        <div className="mt-4">
          <MarketplaceRows listing={listing} />
        </div>
      </div>
    </div>
  );
}

function MultipleTable() {
  const { listings, applyToAll, updateListing } = useSellsweep();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm shadow-card">
          {toast}
        </div>
      )}
      {listings.map((l) => (
        <div key={l.id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="grid grid-cols-[180px_minmax(0,1fr)_260px] gap-8">
            <div className="flex flex-wrap gap-2">
              {l.photos.map((p, i) => (
                <PhotoTile key={p.id} photo={p} size={i === 0 ? "md" : "sm"} />
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {l.flagged && (
                  <span
                    title="Copyright risk"
                    className="rounded-full border border-warning/40 px-2 py-0.5 text-[0.65rem] text-warning-foreground"
                  >
                    Copyright risk
                  </span>
                )}
              </div>
              <input
                className="field"
                value={l.title}
                onChange={(e) => updateListing(l.id, { title: e.target.value })}
              />
              <div>
                <textarea
                  className={`field ${expanded === l.id ? "min-h-40" : "min-h-16"}`}
                  value={l.description}
                  onChange={(e) => updateListing(l.id, { description: e.target.value })}
                />
                <button
                  className="mt-1 text-[0.7rem] text-primary underline underline-offset-2"
                  onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                >
                  {expanded === l.id ? "Collapse" : "Expand"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[0.7rem] text-muted-foreground">Suggested price</span>
                  <input
                    className="field mt-1"
                    value={l.price}
                    onChange={(e) => updateListing(l.id, { price: parseFloat(e.target.value) || 0 })}
                  />
                </label>
                <label className="block">
                  <span className="text-[0.7rem] text-muted-foreground">Shipping cost</span>
                  <div className="mt-1">
                    <ShippingField listing={l} />
                  </div>
                </label>
              </div>
              <DimsFields listing={l} compact />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium">Marketplaces</h3>
                {listings.length > 1 && (
                  <button
                    className="text-[0.7rem] text-primary underline underline-offset-2"
                    onClick={() => {
                      applyToAll(l.id);
                      setToast("Marketplace choices applied to every listing.");
                    }}
                  >
                    Apply to all
                  </button>
                )}
              </div>
              <div className="mt-3">
                <MarketplaceRows listing={l} compact />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Review() {
  const navigate = useNavigate();
  const { listings, mode } = useSellsweep();

  useEffect(() => {
    if (listings.length === 0) navigate({ to: "/" });
  }, [listings.length, navigate]);

  if (listings.length === 0) return null;

  const flagged = listings.filter((l) => l.flagged);
  const canContinue = listings.every((l) =>
    Object.values(l.marketplaces).some((c) => c.selected),
  );

  return (
    <AppShell step="Review" wide={mode === "multiple"}>
      <h1 className="text-3xl font-semibold">Review</h1>
      <p className="mt-2 text-muted-foreground">
        sellsweep drafted everything. Change anything you like.
      </p>

      <div className="mt-10">
        <CopyrightBanner flagged={flagged} />
        {mode === "one" && listings[0] ? <SingleForm listing={listings[0]} /> : <MultipleTable />}
      </div>

      <div className="mt-12 flex items-center gap-3">
        <Link to="/" className="btn-ghost">
          Back
        </Link>
        <button
          className="btn-primary"
          disabled={!canContinue}
          onClick={() => navigate({ to: "/summary" })}
        >
          Continue
        </button>
        {!canContinue && (
          <span className="text-xs text-muted-foreground">
            Select at least one marketplace for every listing.
          </span>
        )}
      </div>
    </AppShell>
  );
}

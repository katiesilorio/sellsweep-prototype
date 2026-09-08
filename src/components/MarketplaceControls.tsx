import {
  MARKETPLACES,
  PRICING_STRATEGIES,
  SHIPPING_METHODS,
  money,
  type Marketplace,
  type PricingStrategy,
  type ShippingMethod,
} from "@/data/demo";
import {
  buyerPrice,
  itemPrice,
  shippingFor,
  shippingIncluded,
  useSellsweep,
  type Listing,
} from "@/lib/store";

export function BuyerPriceLine({ listing, m }: { listing: Listing; m: Marketplace }) {
  const ship = shippingFor(listing);
  if (shippingIncluded(listing, m)) {
    return (
      <p className="text-xs text-muted-foreground">
        Buyer sees <span className="text-foreground">{money(buyerPrice(listing, m))}</span>, free
        shipping
        {ship === null ? " (enter dimensions and weight to include the shipping cost)" : ""}
      </p>
    );
  }
  return (
    <p className="text-xs text-muted-foreground">
      Buyer sees <span className="text-foreground">{money(itemPrice(listing, m))}</span> + shipping
      {ship !== null ? ` ${money(ship)}` : ""}
    </p>
  );
}

export function MarketplaceRows({
  listing,
  compact,
  onApplied,
}: {
  listing: Listing;
  compact?: boolean;
  /** Called with a short message after "Apply to all marketplaces" runs, for a toast. */
  onApplied?: (message: string) => void;
}) {
  const { setMarketplace, applyToAllMarketplaces } = useSellsweep();
  const labelClass = "block text-[0.65rem] uppercase tracking-wide text-muted-foreground";

  return (
    <div className={compact ? "space-y-2.5" : "space-y-3"}>
      {MARKETPLACES.map((m) => {
        const cfg = listing.marketplaces[m];
        return (
          <div
            key={m}
            className={`rounded-xl border p-3 ${
              cfg.selected ? "border-primary/40 bg-primary/[0.03]" : "border-border"
            }`}
          >
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                className="size-4 accent-[var(--color-primary)]"
                checked={cfg.selected}
                onChange={(e) => setMarketplace(listing.id, m, { selected: e.target.checked })}
              />
              <span className={compact ? "text-xs font-medium" : "text-sm font-medium"}>{m}</span>
            </label>

            {cfg.selected && (
              <div className="mt-3 space-y-2.5">
                <label className="block">
                  <span className={labelClass}>Price strategy</span>
                  <select
                    className="field mt-1 text-xs"
                    value={cfg.pricing}
                    onChange={(e) =>
                      setMarketplace(listing.id, m, { pricing: e.target.value as PricingStrategy })
                    }
                  >
                    {PRICING_STRATEGIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>

                {cfg.pricing === "Custom price" && (
                  <label className="block">
                    <span className={labelClass}>Custom price</span>
                    <input
                      className="field mt-1 text-xs"
                      inputMode="decimal"
                      placeholder={money(listing.price)}
                      value={cfg.customPrice === null ? "" : cfg.customPrice}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
                        setMarketplace(listing.id, m, { customPrice: Number.isNaN(v) ? null : v });
                      }}
                    />
                  </label>
                )}

                <label className="block">
                  <span className={labelClass}>Shipping strategy</span>
                  <select
                    className="field mt-1 text-xs"
                    value={cfg.shipping}
                    onChange={(e) =>
                      setMarketplace(listing.id, m, { shipping: e.target.value as ShippingMethod })
                    }
                  >
                    {SHIPPING_METHODS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <BuyerPriceLine listing={listing} m={m} />

                <button
                  type="button"
                  className="text-[0.7rem] text-primary underline underline-offset-2"
                  onClick={() => {
                    applyToAllMarketplaces(listing.id, m);
                    onApplied?.(`${m} price and shipping settings applied to all marketplaces for this listing.`);
                  }}
                >
                  Apply to all marketplaces
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

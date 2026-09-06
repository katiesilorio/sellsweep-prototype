import {
  MARKETPLACES,
  PRICING_STRATEGIES,
  SHIPPING_METHODS,
  money,
  type Marketplace,
  type PricingStrategy,
  type ShippingMethod,
} from "@/data/demo";
import { buyerPrice, shippingFor, useSellsweep, type Listing } from "@/lib/store";

export function BuyerPriceLine({ listing, m }: { listing: Listing; m: Marketplace }) {
  const cfg = listing.marketplaces[m];
  const ship = shippingFor(listing);
  if (cfg.pricing === "Price includes shipping") {
    return (
      <p className="text-xs text-muted-foreground">
        Buyer sees {money(buyerPrice(listing, m))} <span>free shipping</span>
      </p>
    );
  }
  return (
    <p className="text-xs text-muted-foreground">
      Buyer sees {money(listing.price)}{" "}
      <span>+ shipping{ship !== null ? ` ${money(ship)}` : ""}</span>
    </p>
  );
}

export function MarketplaceRows({
  listing,
  compact,
}: {
  listing: Listing;
  compact?: boolean;
}) {
  const { setMarketplace } = useSellsweep();

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
              <div className="mt-2.5 space-y-2">
                <select
                  className="field text-xs"
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
                <select
                  className="field text-xs"
                  value={cfg.shipping}
                  disabled={cfg.pricing === "Price includes shipping"}
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
                <BuyerPriceLine listing={listing} m={m} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

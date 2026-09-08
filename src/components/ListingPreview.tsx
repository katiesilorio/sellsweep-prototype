import { useState } from "react";
import { money, type Marketplace } from "@/data/demo";
import { buyerPrice, shippingFor, shippingIncluded, type Listing } from "@/lib/store";

/*
 * Each marketplace page follows that marketplace's page conventions (where the gallery sits,
 * what the purchase panel contains, what the seller block looks like) so it reads as familiar.
 * No logos, wordmarks, brand colors, or copied typography: the marketplace is named in plain text.
 * Every control on these pages is inert. Nothing is real.
 */

function shippingLine(listing: Listing, m: Marketplace): string {
  const ship = shippingFor(listing);
  if (shippingIncluded(listing, m)) return "Free shipping";
  return ship !== null ? `+ ${money(ship)} shipping` : "+ shipping";
}

function Gallery({
  listing,
  index,
  onPick,
  stripSide,
}: {
  listing: Listing;
  index: number;
  onPick: (i: number) => void;
  stripSide: "left" | "bottom";
}) {
  const main = listing.photos[index] ?? listing.photos[0];
  const strip = (
    <div className={stripSide === "left" ? "flex flex-col gap-2" : "mt-3 flex gap-2"}>
      {listing.photos.map((p, i) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onPick(i)}
          className={`size-14 overflow-hidden rounded-md border ${
            i === index ? "border-foreground" : "border-border"
          }`}
        >
          <img src={p.src} alt={p.label} className="size-full object-cover" />
        </button>
      ))}
    </div>
  );
  const big = main ? (
    <img
      src={main.src}
      alt={main.label}
      className="aspect-square w-full rounded-lg border border-border object-cover"
    />
  ) : null;
  if (stripSide === "left") {
    return (
      <div className="flex gap-3">
        {strip}
        <div className="flex-1">{big}</div>
      </div>
    );
  }
  return (
    <div>
      {big}
      {strip}
    </div>
  );
}

function Inert({ children, primary }: { children: string; primary?: boolean }) {
  return (
    <button
      type="button"
      className={`w-full rounded-full px-5 py-2.5 text-sm font-medium ${
        primary
          ? "bg-foreground text-background"
          : "border border-foreground text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Stars() {
  return <span aria-label="5 star rating">{"\u2605\u2605\u2605\u2605\u2605"}</span>;
}

function EbayPage({ listing }: { listing: Listing }) {
  const [i, setI] = useState(0);
  return (
    <main className="mx-auto max-w-6xl px-10 py-10">
      <p className="text-xs text-muted-foreground">Home &gt; Home &amp; Garden &gt; Handmade</p>
      <div className="mt-6 grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-10">
        <Gallery listing={listing} index={i} onPick={setI} stripSide="left" />
        <div>
          <h1 className="text-xl font-semibold leading-snug">{listing.title}</h1>
          <div className="mt-4 rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">Condition: New, handmade</p>
            <p className="mt-3 text-2xl font-semibold">US {money(buyerPrice(listing, "eBay"))}</p>
            <p className="mt-1 text-sm text-muted-foreground">{shippingLine(listing, "eBay")}</p>
            <div className="mt-5 space-y-2.5">
              <Inert primary>Buy It Now</Inert>
              <Inert>Add to cart</Inert>
              <Inert>Make offer</Inert>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Est. delivery in 4 to 7 days. 30 day returns. Ships from the United States.
            </p>
          </div>
          <div className="mt-4 rounded-lg border border-border p-4 text-sm">
            <p className="font-medium">sellsweep-demo-seller</p>
            <p className="text-xs text-muted-foreground">100% positive feedback, 312 items sold</p>
          </div>
        </div>
      </div>
      <section className="mt-12 max-w-3xl">
        <h2 className="text-lg font-semibold">Item specifics</h2>
        <dl className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Condition</dt>
          <dd>New</dd>
          <dt className="text-muted-foreground">Handmade</dt>
          <dd>Yes</dd>
          <dt className="text-muted-foreground">Dimensions</dt>
          <dd>
            {listing.length || "?"} x {listing.width || "?"} x {listing.height || "?"} in
          </dd>
          <dt className="text-muted-foreground">Weight</dt>
          <dd>{listing.weight || "?"} lb</dd>
        </dl>
        <h2 className="mt-10 text-lg font-semibold">Item description from the seller</h2>
        <div className="mt-3 whitespace-pre-line text-[0.95rem] leading-relaxed text-muted-foreground">
          {listing.description}
        </div>
      </section>
    </main>
  );
}

function EtsyPage({ listing }: { listing: Listing }) {
  const [i, setI] = useState(0);
  return (
    <main className="mx-auto max-w-6xl px-10 py-10">
      <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-12">
        <Gallery listing={listing} index={i} onPick={setI} stripSide="left" />
        <div>
          <p className="text-xs text-muted-foreground">
            <Stars /> 4.9 (128 reviews) &middot; sellsweep demo shop
          </p>
          <p className="mt-3 text-2xl font-semibold">{money(buyerPrice(listing, "Etsy"))}</p>
          <p className="text-xs text-muted-foreground">{shippingLine(listing, "Etsy")}</p>
          <h1 className="mt-3 text-lg leading-snug">{listing.title}</h1>
          <p className="mt-3 text-sm">In stock, ready to ship</p>
          <div className="mt-5 space-y-2.5">
            <Inert primary>Add to cart</Inert>
            <Inert>Buy it now</Inert>
          </div>
          <div className="mt-6 rounded-lg border border-border p-4 text-sm">
            <p className="font-medium">Item details</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>Handmade item</li>
              <li>Ships from the United States</li>
              <li>
                {listing.length || "?"} x {listing.width || "?"} x {listing.height || "?"} inches,{" "}
                {listing.weight || "?"} lb
              </li>
            </ul>
          </div>
          <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {listing.description}
          </div>
        </div>
      </div>
    </main>
  );
}

function SquarePage({ listing }: { listing: Listing }) {
  const [i, setI] = useState(0);
  return (
    <main className="mx-auto max-w-5xl px-10 py-12">
      <p className="text-center text-sm font-medium tracking-wide">sellsweep demo store</p>
      <div className="mt-10 grid grid-cols-2 gap-14">
        <Gallery listing={listing} index={i} onPick={setI} stripSide="bottom" />
        <div>
          <h1 className="text-2xl font-semibold leading-snug">{listing.title}</h1>
          <p className="mt-3 text-xl">{money(buyerPrice(listing, "Square"))}</p>
          <p className="text-xs text-muted-foreground">{shippingLine(listing, "Square")}</p>
          <label className="mt-6 block text-xs text-muted-foreground">
            Quantity
            <input className="field mt-1 w-24" value="1" readOnly />
          </label>
          <div className="mt-5">
            <Inert primary>Add to cart</Inert>
          </div>
          <div className="mt-8 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {listing.description}
          </div>
        </div>
      </div>
    </main>
  );
}

function FacebookPage({ listing }: { listing: Listing }) {
  const [i, setI] = useState(0);
  return (
    <main className="mx-auto max-w-6xl px-10 py-8">
      <div className="grid grid-cols-[minmax(0,1.5fr)_360px] gap-6">
        <div className="rounded-lg bg-muted p-6">
          <Gallery listing={listing} index={i} onPick={setI} stripSide="bottom" />
        </div>
        <aside className="rounded-lg border border-border p-5">
          <h1 className="text-lg font-semibold leading-snug">{listing.title}</h1>
          <p className="mt-2 text-xl font-semibold">{money(buyerPrice(listing, "Facebook Marketplace"))}</p>
          <p className="text-xs text-muted-foreground">
            Listed 2 hours ago &middot; {shippingLine(listing, "Facebook Marketplace")}
          </p>
          <div className="mt-4 space-y-2.5">
            <Inert primary>Message seller</Inert>
            <Inert>Save</Inert>
          </div>
          <div className="mt-6 border-t border-border pt-4 text-sm">
            <p className="font-medium">Details</p>
            <p className="mt-1 text-muted-foreground">Condition: New</p>
            <div className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">
              {listing.description}
            </div>
          </div>
          <div className="mt-6 border-t border-border pt-4 text-sm">
            <p className="font-medium">Seller information</p>
            <p className="mt-1 text-muted-foreground">sellsweep demo seller &middot; Joined 2019</p>
            <p className="text-muted-foreground">Very responsive to messages</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

/** The simulated listing page for one marketplace, without any surrounding chrome. */
export function ListingPreview({ listing, marketplace }: { listing: Listing; marketplace: Marketplace }) {
  if (marketplace === "eBay") return <EbayPage listing={listing} />;
  if (marketplace === "Etsy") return <EtsyPage listing={listing} />;
  if (marketplace === "Square") return <SquarePage listing={listing} />;
  return <FacebookPage listing={listing} />;
}

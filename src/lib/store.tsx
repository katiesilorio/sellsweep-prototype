import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  DEMO_ITEMS,
  MARKETPLACES,
  shippingCostForWeight,
  type Comparable,
  type DemoPhoto,
  type Marketplace,
  type PricingStrategy,
  type ShippingMethod,
} from "@/data/demo";

export type MarketplaceConfig = {
  selected: boolean;
  pricing: PricingStrategy;
  /** Used only when pricing is "Custom price". Null until the user types one. */
  customPrice: number | null;
  shipping: ShippingMethod;
};

export type Listing = {
  id: string;
  photos: DemoPhoto[];
  title: string;
  description: string;
  price: number;
  length: string;
  width: string;
  height: string;
  weight: string;
  shippingOverride: number | null;
  flagged: boolean;
  flagText?: string | undefined;
  accepted: boolean;
  marketplaces: Record<Marketplace, MarketplaceConfig>;
  comparables: Record<Marketplace, Comparable[]>;
};

export type Mode = "one" | "multiple" | null;

export type Group = { id: string; name: string; photoIds: string[] };

function defaultMarketplaces(): Record<Marketplace, MarketplaceConfig> {
  const out = {} as Record<Marketplace, MarketplaceConfig>;
  for (const m of MARKETPLACES) {
    out[m] = {
      selected: false,
      pricing: "Suggested price",
      customPrice: null,
      shipping: "Customer pays shipping",
    };
  }
  return out;
}

export function shippingFor(listing: Listing): number | null {
  if (listing.shippingOverride !== null) return listing.shippingOverride;
  const hasDims = listing.length && listing.width && listing.height;
  const w = parseFloat(listing.weight);
  if (!hasDims || !listing.weight || Number.isNaN(w)) return null;
  return shippingCostForWeight(w);
}

/** The item price on one marketplace before shipping: the AI suggestion, or the custom price if one is set. */
export function itemPrice(listing: Listing, m: Marketplace): number {
  const cfg = listing.marketplaces[m];
  if (cfg.pricing === "Custom price" && cfg.customPrice !== null) return cfg.customPrice;
  return listing.price;
}

export function shippingIncluded(listing: Listing, m: Marketplace): boolean {
  return listing.marketplaces[m].shipping === "Include in total price, free shipping";
}

/** What the buyer sees as the price on one marketplace. */
export function buyerPrice(listing: Listing, m: Marketplace): number {
  const base = itemPrice(listing, m);
  if (shippingIncluded(listing, m)) return base + (shippingFor(listing) ?? 0);
  return base;
}

type Ctx = {
  mode: Mode;
  setMode: (m: Mode) => void;
  photosLoaded: boolean;
  loadPhotos: (mode: Exclude<Mode, null>) => void;
  availablePhotos: DemoPhoto[];
  groups: Group[];
  addGroup: () => void;
  selectedGroupId: string | null;
  selectGroup: (id: string) => void;
  assignPhoto: (photoId: string) => void;
  unassignPhoto: (photoId: string) => void;
  /** Delete a photo from the batch entirely (single and multiple modes). */
  removePhoto: (photoId: string) => void;
  /** Delete a listing group; its photos return to the ungrouped section automatically. */
  removeGroup: (groupId: string) => void;
  ungroupedPhotos: DemoPhoto[];
  listings: Listing[];
  buildListings: () => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  setMarketplace: (id: string, m: Marketplace, patch: Partial<MarketplaceConfig>) => void;
  /** Copy one listing's whole marketplace setup (which are checked, and their settings) to every other listing. */
  applyToAll: (sourceId: string) => void;
  /** Within one listing, copy one marketplace's price and shipping settings to the other three. Does not change which are checked. */
  applyToAllMarketplaces: (id: string, sourceM: Marketplace) => void;
  reset: () => void;
};

const SellsweepContext = createContext<Ctx | null>(null);

export function SellsweepProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(null);
  const [photosLoaded, setPhotosLoaded] = useState(false);
  const [availablePhotos, setAvailablePhotos] = useState<DemoPhoto[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  // Counts every group ever created in this batch, so a deleted listing's number is never reused.
  const [groupCounter, setGroupCounter] = useState(0);

  const value = useMemo<Ctx>(() => {
    const assignedIds = new Set(groups.flatMap((g) => g.photoIds));
    const ungroupedPhotos = availablePhotos.filter((p) => !assignedIds.has(p.id));

    function itemForPhoto(photoId: string) {
      return DEMO_ITEMS.find((i) => i.photos.some((p) => p.id === photoId))!;
    }

    function listingFromPhotos(id: string, photos: DemoPhoto[]): Listing {
      const item = itemForPhoto(photos[0]!.id);
      return {
        id,
        photos,
        title: item.title,
        description: item.description,
        price: item.price,
        length: "",
        width: "",
        height: "",
        weight: "",
        shippingOverride: null,
        flagged: item.flagged,
        flagText: item.flagText,
        accepted: false,
        marketplaces: defaultMarketplaces(),
        comparables: item.comparables,
      };
    }

    return {
      mode,
      setMode: (m) => {
        setMode(m);
        setPhotosLoaded(false);
        setAvailablePhotos([]);
        setGroups([]);
        setSelectedGroupId(null);
        setListings([]);
        setGroupCounter(0);
      },
      photosLoaded,
      loadPhotos: (m) => {
        const items = m === "one" ? [DEMO_ITEMS[0]!] : DEMO_ITEMS;
        setAvailablePhotos(items.flatMap((i) => i.photos));
        setPhotosLoaded(true);
      },
      availablePhotos,
      groups,
      addGroup: () => {
        const n = groupCounter + 1;
        const id = `group-${n}`;
        setGroupCounter(n);
        // Newest listing goes to the top so the user never scrolls to find the one they just added.
        setGroups((g) => [{ id, name: `Listing ${n}`, photoIds: [] }, ...g]);
        setSelectedGroupId(id);
      },
      selectedGroupId,
      selectGroup: setSelectedGroupId,
      assignPhoto: (photoId) => {
        if (!selectedGroupId) return;
        setGroups((gs) =>
          gs.map((g) =>
            g.id === selectedGroupId ? { ...g, photoIds: [...g.photoIds, photoId] } : g,
          ),
        );
      },
      unassignPhoto: (photoId) => {
        setGroups((gs) =>
          gs.map((g) => ({ ...g, photoIds: g.photoIds.filter((p) => p !== photoId) })),
        );
      },
      removePhoto: (photoId) => {
        setGroups((gs) =>
          gs.map((g) => ({ ...g, photoIds: g.photoIds.filter((p) => p !== photoId) })),
        );
        setAvailablePhotos((ps) => ps.filter((p) => p.id !== photoId));
      },
      removeGroup: (groupId) => {
        // Photos are not deleted; ungroupedPhotos is derived, so they reappear in the ungrouped section.
        setGroups((gs) => gs.filter((g) => g.id !== groupId));
        setSelectedGroupId((cur) => {
          if (cur !== groupId) return cur;
          const remaining = groups.filter((g) => g.id !== groupId);
          return remaining[0]?.id ?? null;
        });
      },
      ungroupedPhotos,
      listings,
      buildListings: () => {
        if (mode === "one") {
          setListings([listingFromPhotos("listing-1", availablePhotos)]);
        } else {
          // groups are stored newest first; listings read in creation order.
          setListings(
            [...groups].reverse().map((g, index) =>
              listingFromPhotos(
                `listing-${index + 1}`,
                g.photoIds.map((pid) => availablePhotos.find((p) => p.id === pid)!),
              ),
            ),
          );
        }
      },
      updateListing: (id, patch) =>
        setListings((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l))),
      setMarketplace: (id, m, patch) =>
        setListings((ls) =>
          ls.map((l) => {
            if (l.id !== id) return l;
            const next = { ...l.marketplaces[m], ...patch };
            return { ...l, marketplaces: { ...l.marketplaces, [m]: next } };
          }),
        ),
      applyToAllMarketplaces: (id, sourceM) =>
        setListings((ls) =>
          ls.map((l) => {
            if (l.id !== id) return l;
            const src = l.marketplaces[sourceM];
            const out = { ...l.marketplaces };
            for (const m of MARKETPLACES) {
              out[m] = {
                ...out[m],
                pricing: src.pricing,
                customPrice: src.customPrice,
                shipping: src.shipping,
              };
            }
            return { ...l, marketplaces: out };
          }),
        ),
      applyToAll: (sourceId) =>
        setListings((ls) => {
          const source = ls.find((l) => l.id === sourceId);
          if (!source) return ls;
          return ls.map((l) =>
            l.id === sourceId
              ? l
              : { ...l, marketplaces: JSON.parse(JSON.stringify(source.marketplaces)) },
          );
        }),
      reset: () => {
        setMode(null);
        setPhotosLoaded(false);
        setAvailablePhotos([]);
        setGroups([]);
        setSelectedGroupId(null);
        setListings([]);
        setGroupCounter(0);
      },
    };
  }, [mode, photosLoaded, availablePhotos, groups, selectedGroupId, listings, groupCounter]);

  return <SellsweepContext.Provider value={value}>{children}</SellsweepContext.Provider>;
}

export function useSellsweep() {
  const ctx = useContext(SellsweepContext);
  if (!ctx) throw new Error("useSellsweep must be used inside SellsweepProvider");
  return ctx;
}

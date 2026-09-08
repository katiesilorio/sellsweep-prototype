import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  DEMO_ITEMS,
  MARKETPLACES,
  shippingCostForWeight,
  type DemoPhoto,
  type Marketplace,
  type PricingStrategy,
  type ShippingMethod,
} from "@/data/demo";

export type MarketplaceConfig = {
  selected: boolean;
  pricing: PricingStrategy;
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
};

export type Mode = "one" | "multiple" | null;

export type Group = { id: string; name: string; photoIds: string[] };

function defaultMarketplaces(): Record<Marketplace, MarketplaceConfig> {
  const out = {} as Record<Marketplace, MarketplaceConfig>;
  for (const m of MARKETPLACES) {
    out[m] = {
      selected: true,
      pricing: "Price listed, shipping added",
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

export function buyerPrice(listing: Listing, m: Marketplace): number {
  const cfg = listing.marketplaces[m];
  if (cfg.pricing === "Price includes shipping") {
    return listing.price + (shippingFor(listing) ?? 0);
  }
  return listing.price;
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
  ungroupedPhotos: DemoPhoto[];
  listings: Listing[];
  buildListings: () => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  setMarketplace: (id: string, m: Marketplace, patch: Partial<MarketplaceConfig>) => void;
  applyToAll: (sourceId: string) => void;
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
        const id = `group-${groups.length + 1}`;
        // Newest listing goes to the top so the user never scrolls to find the one they just added.
        setGroups((g) => [{ id, name: `Listing ${g.length + 1}`, photoIds: [] }, ...g]);
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
            if (next.pricing === "Price includes shipping") next.shipping = "Free shipping";
            return { ...l, marketplaces: { ...l.marketplaces, [m]: next } };
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
      },
    };
  }, [mode, photosLoaded, availablePhotos, groups, selectedGroupId, listings]);

  return <SellsweepContext.Provider value={value}>{children}</SellsweepContext.Provider>;
}

export function useSellsweep() {
  const ctx = useContext(SellsweepContext);
  if (!ctx) throw new Error("useSellsweep must be used inside SellsweepProvider");
  return ctx;
}

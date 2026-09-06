import mugSet from "@/assets/mug-set.jpg";
import brassLamp from "@/assets/brass-lamp.jpg";
import coasters from "@/assets/coasters.jpg";

/**
 * All dummy data for the sellsweep prototype lives here.
 * Nothing in this file is real.
 */

export const MARKETPLACES = ["eBay", "Etsy", "Square", "Facebook Marketplace"] as const;
export type Marketplace = (typeof MARKETPLACES)[number];

export const MARKETPLACE_SLUGS: Record<Marketplace, string> = {
  eBay: "ebay",
  Etsy: "etsy",
  Square: "square",
  "Facebook Marketplace": "facebook-marketplace",
};

export const PRICING_STRATEGIES = [
  "Price listed, shipping added",
  "Price includes shipping",
] as const;
export type PricingStrategy = (typeof PRICING_STRATEGIES)[number];

export const SHIPPING_METHODS = ["Customer pays shipping", "Free shipping"] as const;
export type ShippingMethod = (typeof SHIPPING_METHODS)[number];

export const ANALYZING_STEPS = [
  "Reading your photos",
  "Identifying each item",
  "Writing titles and descriptions",
  "Researching comparable prices",
  "Checking for copyright risk",
];

export const BANNER_TEXT =
  "Prototype. This assumes you are already onboarded and your marketplace accounts are connected. It covers posting only. Optimized for desktop, mobile coming soon.";

export type DemoPhoto = { id: string; label: string; src: string };

export type DemoItem = {
  id: string;
  name: string;
  photos: DemoPhoto[];
  title: string;
  price: number;
  description: string;
  flagged: boolean;
  flagText?: string;
  sample: { length: string; width: string; height: string; weight: string };
};

export const DEMO_ITEMS: DemoItem[] = [
  {
    id: "item-1",
    name: "Hand-thrown ceramic mug set",
    photos: [
      { id: "p1-1", label: "Pair together", src: mugSet },
      { id: "p1-2", label: "One mug alone", src: mugSet },
      { id: "p1-3", label: "Handle detail", src: mugSet },
      { id: "p1-4", label: "Base with maker's stamp", src: mugSet },
    ],
    title: "Handmade Stoneware Mug Set of 2, Speckled Cream Glaze",
    price: 42.0,
    description:
      "Two stoneware mugs thrown by hand and finished in a speckled cream glaze. The glaze pools a little differently on every piece, so the pair reads as a set without looking machine made. Each mug holds about 12 ounces and stands roughly 4 inches tall.\n\nDishwasher and microwave safe. Because each mug is hand thrown, small differences in height, weight, and the curve of the handle are part of the work rather than a fault.",
    flagged: false,
    sample: { length: "5", width: "4", height: "4", weight: "2.1" },
  },
  {
    id: "item-2",
    name: "Vintage brass table lamp",
    photos: [
      { id: "p2-1", label: "Lamp lit", src: brassLamp },
      { id: "p2-2", label: "Lamp unlit", src: brassLamp },
      { id: "p2-3", label: "Switch and cord", src: brassLamp },
    ],
    title: "Vintage Mid-Century Brass Table Lamp with Linen Shade, Works",
    price: 78.0,
    description:
      "A small mid-century brass table lamp with a turned stem and a weighted round base, found at an estate sale. The brass carries a warm patina consistent with its age, with light surface wear rather than dents or bends.\n\nThe cord and plug have been replaced, so it is safe to use today, and it switches on and off cleanly. The linen shade is clean, with no tears or watermarks, and sits straight on the harp.",
    flagged: false,
    sample: { length: "8", width: "8", height: "16", weight: "4.6" },
  },
  {
    id: "item-3",
    name: "Hand-painted wooden coaster set",
    photos: [
      { id: "p3-1", label: "Set fanned out", src: coasters },
      { id: "p3-2", label: "One coaster close up", src: coasters },
      { id: "p3-3", label: "Backs with cork", src: coasters },
    ],
    title: "Hand-Painted Wooden Coasters, Set of 4, University Team Colors",
    price: 28.0,
    description:
      "Four wooden coasters painted by hand in the colors of a university team, each carrying a university team logo. The paint is applied in layers by brush, so the edges of the design have a slight hand-made softness to them.\n\nThe backs are lined with cork so they sit quietly on a table and will not scratch it. A clear sealant over the paint makes the surface water resistant and easy to wipe down.",
    flagged: true,
    flagText:
      "Copyright risk. This item is handmade and carries a logo owned by someone else. Marketplaces can remove listings like this and the rights holder can pursue a claim. sellsweep will post it if you accept that risk.",
    sample: { length: "4", width: "4", height: "1", weight: "0.8" },
  },
];

export function shippingCostForWeight(weightLb: number): number {
  if (weightLb < 1) return 5.5;
  if (weightLb <= 3) return 9.2;
  if (weightLb <= 10) return 14.8;
  return 24.0;
}

export function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

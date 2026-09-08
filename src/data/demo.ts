import mugSet from "@/assets/mug-set.jpg";
import mugSingle from "@/assets/mug-single.jpg";
import mugHandle from "@/assets/mug-handle.jpg";
import mugBase from "@/assets/mug-base.jpg";
import brassLamp from "@/assets/brass-lamp.jpg";
import lampUnlit from "@/assets/lamp-unlit.jpg";
import lampBase from "@/assets/lamp-base.jpg";
import coasters from "@/assets/coasters.jpg";
import coasterSingle from "@/assets/coaster-single.jpg";
import coasterEdge from "@/assets/coaster-edge.jpg";

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

export const PRICING_STRATEGIES = ["Suggested price", "Custom price"] as const;
export type PricingStrategy = (typeof PRICING_STRATEGIES)[number];

export const SHIPPING_METHODS = [
  "Customer pays shipping",
  "Include in total price, free shipping",
] as const;
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

/** One comparable listing the AI used when suggesting a price. All invented. */
export type Comparable = { title: string; price: number; note: string };

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
  comparables: Record<Marketplace, Comparable[]>;
};

export const DEMO_ITEMS: DemoItem[] = [
  {
    id: "item-1",
    name: "Hand-thrown ceramic mug set",
    photos: [
      { id: "p1-1", label: "Pair together", src: mugSet },
      { id: "p1-2", label: "One mug alone", src: mugSingle },
      { id: "p1-3", label: "Handle detail", src: mugHandle },
      { id: "p1-4", label: "Base with maker's stamp", src: mugBase },
    ],
    title: "Handmade Stoneware Mug Set of 2, Speckled Cream Glaze",
    price: 42.0,
    description:
      "Two stoneware mugs thrown by hand and finished in a speckled cream glaze. The glaze pools a little differently on every piece, so the pair reads as a set without looking machine made. Each mug holds about 12 ounces and stands roughly 4 inches tall.\n\nDishwasher and microwave safe. Because each mug is hand thrown, small differences in height, weight, and the curve of the handle are part of the work rather than a fault.",
    flagged: false,
    sample: { length: "5", width: "4", height: "4", weight: "2.1" },
    comparables: {
      eBay: [
        { title: "Handmade speckled stoneware mugs, set of 2", price: 44.0, note: "Sold 3 weeks ago" },
        { title: "Pair of cream glaze pottery mugs, 12 oz", price: 38.5, note: "Sold 5 weeks ago" },
      ],
      Etsy: [
        { title: "Speckled cream stoneware mug set", price: 46.0, note: "Active, 4.9 stars" },
        { title: "Hand thrown mugs, set of two, oatmeal glaze", price: 42.0, note: "Sold last month" },
        { title: "Farmhouse speckle mug pair", price: 40.0, note: "Active" },
      ],
      Square: [
        { title: "Studio stoneware mug set (2)", price: 45.0, note: "Local pottery shop, in stock" },
      ],
      "Facebook Marketplace": [
        { title: "Handmade ceramic mugs, 2", price: 35.0, note: "Listed 2 weeks ago, pickup" },
        { title: "Pottery mug set, cream", price: 40.0, note: "Sold" },
      ],
    },
  },
  {
    id: "item-2",
    name: "Vintage brass table lamp",
    photos: [
      { id: "p2-1", label: "Lamp lit", src: brassLamp },
      { id: "p2-2", label: "Lamp unlit", src: lampUnlit },
      { id: "p2-3", label: "Switch and cord", src: lampBase },
    ],
    title: "Vintage Mid-Century Brass Table Lamp with Linen Shade, Works",
    price: 78.0,
    description:
      "A small mid-century brass table lamp with a turned stem and a weighted round base, found at an estate sale. The brass carries a warm patina consistent with its age, with light surface wear rather than dents or bends.\n\nThe cord and plug have been replaced, so it is safe to use today, and it switches on and off cleanly. The linen shade is clean, with no tears or watermarks, and sits straight on the harp.",
    flagged: false,
    sample: { length: "8", width: "8", height: "16", weight: "4.6" },
    comparables: {
      eBay: [
        { title: "Vintage brass candlestick table lamp, linen shade", price: 82.0, note: "Sold 2 weeks ago" },
        { title: "Mid-century brass lamp, rewired", price: 75.0, note: "Sold 6 weeks ago" },
        { title: "Small brass accent lamp, works", price: 68.0, note: "Active" },
      ],
      Etsy: [
        { title: "Mid century brass table lamp with new linen shade", price: 95.0, note: "Active" },
        { title: "Vintage brass lamp, patina, rewired", price: 79.0, note: "Sold last month" },
      ],
      Square: [
        { title: "Brass table lamp, vintage, rewired", price: 85.0, note: "Antique mall, in stock" },
      ],
      "Facebook Marketplace": [
        { title: "Vintage brass lamp", price: 60.0, note: "Listed, pickup only" },
        { title: "Brass table lamp with shade, works", price: 72.0, note: "Sold" },
      ],
    },
  },
  {
    id: "item-3",
    name: "Hand-painted wooden coaster set",
    photos: [
      { id: "p3-1", label: "Set fanned out", src: coasters },
      { id: "p3-2", label: "One coaster close up", src: coasterSingle },
      { id: "p3-3", label: "Edge detail", src: coasterEdge },
    ],
    title: "Hand-Painted Wooden Coasters, Set of 4, University Team Colors",
    price: 28.0,
    description:
      "Four wooden coasters painted by hand in the colors of a university team, each carrying a university team logo. The paint is applied in layers by brush, so the edges of the design have a slight hand-made softness to them.\n\nThe backs are lined with cork so they sit quietly on a table and will not scratch it. A clear sealant over the paint makes the surface water resistant and easy to wipe down.",
    flagged: true,
    flagText:
      "Copyright risk. This item is handmade and carries a logo owned by someone else. Marketplaces can remove listings like this and the rights holder can pursue a claim. sellsweep will post it if you accept that risk.",
    sample: { length: "4", width: "4", height: "1", weight: "0.8" },
    comparables: {
      eBay: [
        { title: "Hand painted team coasters, set of 4", price: 30.0, note: "Sold 4 weeks ago" },
        { title: "Wood coasters, college colors, cork back", price: 26.0, note: "Active" },
      ],
      Etsy: [
        { title: "Custom team color wooden coasters (4)", price: 32.0, note: "Active, 4.8 stars" },
        { title: "Hand painted game day coasters", price: 28.0, note: "Sold last month" },
        { title: "Navy and gold coaster set", price: 24.0, note: "Active" },
      ],
      Square: [
        { title: "Painted wood coaster set", price: 29.0, note: "Craft fair booth, in stock" },
      ],
      "Facebook Marketplace": [
        { title: "Team coasters, set of 4, handmade", price: 22.0, note: "Listed 1 week ago" },
      ],
    },
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

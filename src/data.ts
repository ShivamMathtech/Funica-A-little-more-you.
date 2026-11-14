export type Category =
  | "Chairs"
  | "Sofas"
  | "Tables"
  | "Lighting"
  | "Decor"
  | "Beds";
export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  original?: number;
  image: string;
  rating: number;
  reviews: number;
  tag?: string;
  colors: { name: string; hex: string }[];
  material: string;
  dimensions: string;
  description: string;
  new?: boolean;
};
const shades = {
  oak: { name: "Natural oak", hex: "#b59670" },
  charcoal: { name: "Charcoal", hex: "#424340" },
  ivory: { name: "Ivory", hex: "#e9e3d6" },
  sage: { name: "Sage", hex: "#99a08b" },
  sand: { name: "Sand", hex: "#c3ae99" },
  grey: { name: "Pebble grey", hex: "#999997" },
};
export const categories = [
  "All",
  "Chairs",
  "Sofas",
  "Tables",
  "Lighting",
  "Decor",
  "Beds",
] as const;
export const products: Product[] = [
  {
    id: "forma-chair",
    name: "Forma Dining Chair",
    category: "Chairs",
    price: 8499,
    original: 9999,
    image: "chair-oak",
    rating: 4.9,
    reviews: 128,
    tag: "Bestseller",
    colors: [shades.charcoal, shades.ivory, shades.sage],
    material: "Moulded polypropylene, solid beech legs",
    dimensions: "W 46 × D 52 × H 82 cm",
    description:
      "A familiar silhouette, thoughtfully refined. The sculpted seat supports long conversations, while solid timber legs bring a little warmth to the everyday.",
  },
  {
    id: "haven-sofa",
    name: "Haven Velvet Sofa",
    category: "Sofas",
    price: 42999,
    original: 49999,
    image: "sofa-green",
    rating: 4.9,
    reviews: 86,
    tag: "The living edit",
    colors: [
      { name: "Forest green", hex: "#365d50" },
      shades.sand,
      shades.charcoal,
    ],
    material: "Velvet upholstery, kiln-dried hardwood frame",
    dimensions: "W 192 × D 86 × H 82 cm",
    description:
      "Your favourite place to do absolutely nothing. Deep, generous cushions meet beautifully tailored velvet in a sofa made for quiet mornings and full houses.",
  },
  {
    id: "elva-chair",
    name: "Elva Accent Chair",
    category: "Chairs",
    price: 12499,
    image: "chair-soft",
    rating: 4.8,
    reviews: 64,
    tag: "New",
    new: true,
    colors: [shades.grey, shades.sand, shades.ivory],
    material: "Textured woven fabric, solid oak legs",
    dimensions: "W 58 × D 62 × H 88 cm",
    description:
      "Soft curves and a little Scandinavian simplicity. An inviting upholstered chair that feels just as at home by your desk as it does at the dinner table.",
  },
  {
    id: "arc-floor-lamp",
    name: "Arc Reading Lamp",
    category: "Lighting",
    price: 5499,
    original: 6999,
    image: "lamp",
    rating: 4.7,
    reviews: 92,
    colors: [shades.charcoal, shades.ivory],
    material: "Powder-coated steel, adjustable shade",
    dimensions: "W 28 × D 35 × H 145 cm",
    description:
      "A pool of warm light, exactly where you need it. The adjustable shade and quiet profile make this a natural companion for your favourite reading corner.",
  },
  {
    id: "lumi-stool",
    name: "Lumi Oak Stool",
    category: "Chairs",
    price: 3999,
    image: "chair-white",
    rating: 4.8,
    reviews: 53,
    tag: "New",
    new: true,
    colors: [shades.oak, shades.ivory],
    material: "Solid ash timber with a water-based finish",
    dimensions: "W 34 × D 34 × H 65 cm",
    description:
      "Small in footprint, generous in possibility. A light, honest timber stool for the breakfast counter, a studio corner, or wherever life needs an extra seat.",
  },
  {
    id: "clay-dinner-set",
    name: "Dune Dinner Set",
    category: "Decor",
    price: 2999,
    image: "decor",
    rating: 4.9,
    reviews: 117,
    colors: [{ name: "Ocean blue", hex: "#8ba9ba" }, shades.ivory],
    material: "Glazed stoneware; set of four pieces",
    dimensions: "Dinner plate Ø 27 cm · Bowl Ø 16 cm",
    description:
      "Make the everyday table a little more special. Organic shapes and subtle, hand-finished glazes make each piece quietly individual.",
  },
  {
    id: "aria-chair",
    name: "Aria Tufted Chair",
    category: "Chairs",
    price: 15999,
    original: 18999,
    image: "chair-lounge",
    rating: 4.8,
    reviews: 42,
    colors: [shades.ivory, shades.sand],
    material: "Linen-blend upholstery, painted timber frame",
    dimensions: "W 62 × D 60 × H 87 cm",
    description:
      "A softer take on a classic. Buttoned upholstery, gentle curves, and a beautifully balanced frame create a welcoming spot for one more chapter.",
  },
  {
    id: "terra-sofa",
    name: "Terra Lounge Sofa",
    category: "Sofas",
    price: 54999,
    image: "vase",
    rating: 4.9,
    reviews: 38,
    tag: "New",
    new: true,
    colors: [shades.sand, shades.grey],
    material: "Textured performance fabric, solid timber frame",
    dimensions: "W 214 × D 94 × H 80 cm",
    description:
      "Room to stretch out, space to settle in. With relaxed proportions and an earthy palette, Terra makes even a busy day feel a little slower.",
  },
  {
    id: "nord-desk",
    name: "Nord Writing Desk",
    category: "Tables",
    price: 11999,
    image: "table",
    rating: 4.6,
    reviews: 47,
    colors: [shades.ivory, shades.oak],
    material: "Engineered wood with durable satin finish",
    dimensions: "W 120 × D 60 × H 75 cm",
    description:
      "A clean surface for a clear mind. This quietly practical desk brings space, light, and just enough structure to your home workspace.",
  },
  {
    id: "line-lamp",
    name: "Line Studio Lamp",
    category: "Lighting",
    price: 6499,
    image: "shelf",
    rating: 4.8,
    reviews: 29,
    tag: "New",
    new: true,
    colors: [shades.charcoal, shades.sage],
    material: "Steel with matte finish and pivoting head",
    dimensions: "W 25 × D 32 × H 150 cm",
    description:
      "An understated essential with a purposeful bend. Direct warm light over a good book, a work-in-progress, or your favourite corner.",
  },
  {
    id: "arch-mirror",
    name: "Sol Arch Mirror",
    category: "Decor",
    price: 8999,
    image: "sofa-caramel",
    rating: 4.7,
    reviews: 33,
    colors: [shades.ivory, shades.sand],
    material: "Polished glass with rounded resin frame",
    dimensions: "W 70 × H 110 × D 3 cm",
    description:
      "Invite a little more light in. The soft architectural curve adds depth and a considered finishing touch to a hallway, bedroom, or quiet nook.",
  },
  {
    id: "noor-bed",
    name: "Noor Upholstered Bed",
    category: "Beds",
    price: 48999,
    original: 55999,
    image: "bedroom",
    rating: 4.8,
    reviews: 51,
    colors: [shades.sand, shades.grey],
    material: "Linen-blend upholstery, timber frame; mattress excluded",
    dimensions: "W 165 × D 214 × H 125 cm",
    description:
      "End the day somewhere lovely. A deeply upholstered headboard and timeless proportions make Noor the calm centre of a restful room.",
  },
];
export const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
export const findProduct = (id: string) => products.find((p) => p.id === id);

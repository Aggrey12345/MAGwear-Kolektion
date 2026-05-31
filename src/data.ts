import { Product, Testimonial } from './types';
import { PROFILE_IMAGE_BASE64 } from './components/profileImageBase64';

// Generated luxury assets paths from file generation
export const ownerProfile = {
  name: "Mathias Aggrey",
  brandName: "MAGwear Kolektionz",
  title: "Founder & CEO",
  profileImage: PROFILE_IMAGE_BASE64,
  bio: "My name is Mathias Aggrey, the founder and owner of MAGwear Kolektionz, a modern fashion brand dedicated to providing stylish sneakers, premium perfumes, and trendy clothing for individuals who value quality, confidence, and elegance.\n\nAs a passionate entrepreneur, I created MAGwear Kolektionz with the vision of bringing fashion, comfort, and luxury together in one place. My goal is to help customers express their unique personalities through carefully selected footwear, fragrances, and clothing collections that match modern lifestyles.\n\nAt MAGwear Kolektionz, we believe that fashion is more than just what you wear—it's a statement of confidence and individuality. We are committed to offering high-quality products, exceptional customer service, and a seamless shopping experience.\n\nWhether you're looking for the latest sneakers, signature perfumes, or fashionable outfits, MAGwear Kolektionz is your trusted destination for style and excellence.",
  socials: {
    facebook: "https://facebook.com/Mathias.Garo.Aggrey", // Mathias Garo Aggrey
    email: "aggreymathias96@gmail.com",
    phone: "0542728375",
    instagram: "#",
    twitter: "#",
  }
};

export const heroContent = {
  title: "MAGwear Kolektions",
  slogan: "Luxury Sneakers, Fashion & Signature Fragrances",
  description: "Experience high-end artistry combined with premium street culture. Hand-picked collections curated for the modern individual.",
  bgImage: "/src/assets/images/hero_background_1779218667496.png"
};

export const productsData: Product[] = [
  // SNEAKERS
  {
    id: "snk-01",
    name: "AeroGold Stealth High-Tops",
    category: "sneakers",
    price: 320,
    description: "Our signature luxury high-top sneaker. Featuring premium matte black full-grain leather, hand-brushed gold accents, and a reactive amber-glowing soles structure.",
    image: "/src/assets/images/premium_sneakers_1779218688579.png",
    tag: "Exclusive",
    rating: 4.9,
    reviewsCount: 142,
    colorway: "Vortex Black / Aurum Gold",
    specs: ["Full-grain Italian calf leather", "Responsive gold carbon fiber chassis", "Shock-absorbent gold air chamber", "Handcrafted in limited batches"]
  },
  {
    id: "snk-02",
    name: "Viper Tech-Street Runner",
    category: "sneakers",
    price: 245,
    description: "Ultra-responsive athletic runners with woven reflective nylon mesh, dynamic flight lacing, and textured tactical overlays.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    tag: "Hot Release",
    rating: 4.8,
    reviewsCount: 98,
    colorway: "Cyber Crimson / Matte Obsidian",
    specs: ["Reflective weave-knit ventilation", "Zero-gravity foam midsole", "High-grip rugged vulcanized treads"]
  },
  {
    id: "snk-03",
    name: "Classic Alabaster Luxe Premium",
    category: "sneakers",
    price: 210,
    description: "Minimalist low-profile leather sneakers with raw unpainted stitching, golden heel stamp, and reinforced memory foam insole.",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
    tag: "Best Seller",
    rating: 4.7,
    reviewsCount: 204,
    colorway: "Cream White / Platinum Gold",
    specs: ["Buttery-soft nappa leather lining", "Double-stitched durable cupsole", "Subtle embossed brand lettering"]
  },
  {
    id: "snk-04",
    name: "Vintage Aurora Retro Dunk",
    category: "sneakers",
    price: 185,
    description: "Distressed premium nubuck suede trainers that pay tribute to timeless basketball aesthetics with a luxury streetwear upgrade.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
    tag: "Retro Classic",
    rating: 4.8,
    reviewsCount: 81,
    colorway: "Lavender Dusk / Pale Amethyst",
    specs: ["Premium nubuck and velvet leather", "Padded high comfort collar", "Dual-tone vintage wax laces"]
  },

  // PERFUMES
  {
    id: "prf-01",
    name: "Oud Royale Noire Extrait",
    category: "perfumes",
    price: 175,
    description: "The crown jewel fragrance of MAGwear. Sensual rich agarwood (oud) blended with smoky black amber, gold saffron, and crushed Damascus rose notes.",
    image: "/src/assets/images/luxury_perfume_1779218705488.png",
    tag: "Signature Parfum",
    rating: 4.9,
    reviewsCount: 188,
    colorway: "Deep Amber / Saffron Infusion",
    specs: ["Highly concentrated Extrait de Parfum", "Over 12 hours of projection and sillage", "Hand-blown black glass bottle, gold plated cap", "Unisex signature scent"]
  },
  {
    id: "prf-02",
    name: "Ignis Gold Warm Elixir",
    category: "perfumes",
    price: 140,
    description: "A passionate, intoxicating scent that ignites the senses. Sweet burning vetiver, toasted bergamot, and rich Madagascar vanilla, dry wood cedar base.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
    tag: "Limited Offer",
    rating: 4.8,
    reviewsCount: 76,
    colorway: "Smoky Vanilla & Bergamot",
    specs: ["Earthy cardamom opening", "Warm woody heart", "Exceptional cold weather performance"]
  },
  {
    id: "prf-03",
    name: "Alabaster Bloom Eau de Parfum",
    category: "perfumes",
    price: 125,
    description: "Crisp white linen, oceanic minerals, fresh mint, and clean white musk base. Clean, invigorating, perfect as an everyday luxury signature.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop",
    tag: "Fresh Signature",
    rating: 4.6,
    reviewsCount: 112,
    colorway: "Clean Sea Spray & White Musk",
    specs: ["Ultra-clean daytime oceanic breeze", "Zesty lime and sage leaf high notes", "Refreshing and crisp projects beautifully"]
  },
  {
    id: "prf-04",
    name: "Amber Elixir Intense",
    category: "perfumes",
    price: 155,
    description: "An enigmatic fusion of balsamic resin, patchouli leaves, dark cacao, and a hint of warm honey-soaked leather. Mysterious and provocative.",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop",
    tag: "Rare Edit",
    rating: 4.9,
    reviewsCount: 63,
    colorway: "Honey Leather & Dark Cocoa",
    specs: ["Rich spicy elements", "Intimate projection with long-lasting trace", "Includes bespoke luxury container box"]
  },

  // CLOTHING
  {
    id: "clo-01",
    name: "MAGwear Aureum Embossed Hoodie",
    category: "clothing",
    price: 190,
    description: "Exquisite heavy-knit 500GSM designer hoodie in premium matte black. Highlights textured, hand-stitch embossed gold and amber brand script.",
    image: "/src/assets/images/designer_apparel_1779218721384.png",
    tag: "Limited Edition",
    rating: 4.9,
    reviewsCount: 119,
    colorway: "Mantle Black / Sovereign Gold",
    specs: ["100% Organic French Terry Cotton", "Oversized street silhouette", "Gold tip braided drawstrings", "Double lined heavy-gauge hood"]
  },
  {
    id: "clo-02",
    name: "Urban Renegade Cargo Parka",
    category: "clothing",
    price: 260,
    description: "Waterproof functional techwear jacket features modular cargo chest pockets, orange utility straps, and multi-directional high-ventilation zippers.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&auto=format&fit=crop",
    tag: "Popular",
    rating: 4.8,
    reviewsCount: 84,
    colorway: "Tactical Charcoal / Hazard Orange",
    specs: ["Ripstop water-repellent nylon", "Adjustable elastic toggles", "Internal device harness and key ring"]
  },
  {
    id: "clo-03",
    name: "Acid-Wash Drop Shoulder Sweatshirt",
    category: "clothing",
    price: 135,
    description: "Sun-faded retro profile crewneck with unique distressed raw edges, wide ribbed hems, and minimalist brand backplate embroidery.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    tag: "Classic Essential",
    rating: 4.7,
    reviewsCount: 156,
    colorway: "Mineral Graphite / Light Acid Fade",
    specs: ["Heavy loopback breathable blend", "Drop shoulder boxy silhouette", "Resistant to shrinkage can be heat dryed"]
  },
  {
    id: "clo-04",
    name: "Sovereign Street Silk Tee",
    category: "clothing",
    price: 85,
    description: "Lustrous heavy cotton blended with luxurious Mulberry silk for a buttery skin feel, featuring subtle tonal orange/gold contrast embroidery.",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop",
    tag: "New Arrival",
    rating: 4.8,
    reviewsCount: 42,
    colorway: "Pitch Obsidian / Flame Gold Accent",
    specs: ["80% Luxury Cotton, 20% Mulberry Silk", "Extremely breathable and cooling knit", "Preshrunk luxury finish stitches"]
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: "t-01",
    name: "Michael K. Lawson",
    role: "Collector & Sneaker Enthusiast",
    comment: "The AeroGold Stealth Sneakers are an absolute masterpiece. The craftsmanship rival and exceed luxury fashion houses costing triple. Aggrey really understands the street culture!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5
  },
  {
    id: "t-02",
    name: "Elizabeth Amponsah",
    role: "Creative Director",
    comment: "Oud Royale is hands down my favorite fragrance. Everywhere I go, people ask what I'm wearing. The amber sillage is rich, premium, and lasts from morning to late at night.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5
  },
  {
    id: "t-03",
    name: "Kofi Owusu-Bempah",
    role: "Fashion Stylist",
    comment: "MAGwear clothing items are unmatched. The Aureum Hoodie's weight, structural fit, and deep organic cotton feel premium. It integrates easily into high-fashion and street looks alike.",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop",
    rating: 5
  }
];

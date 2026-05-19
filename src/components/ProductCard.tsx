import React, { useState } from 'react';
import { ShoppingCart, Star, Eye, X, Check, Award, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  key?: string | number;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [successAdded, setSuccessAdded] = useState(false);

  // Choose a default size options list based on category
  const sizeOptions = product.category === 'sneakers' 
    ? ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'] 
    : product.category === 'clothing' 
    ? ['S', 'M', 'L', 'XL', 'XXL'] 
    : ['50ml', '100ml', '150ml']; // Perfumes

  const handleAddToCart = () => {
    onAddToCart(product);
    setSuccessAdded(true);
    setTimeout(() => setSuccessAdded(false), 2000);
  };

  return (
    <>
      {/* Product Item Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="group relative flex flex-col h-full bento-card cursor-pointer"
      >
        {/* Card Header Media area */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-950">
          {product.tag && (
            <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[9px] font-display font-black tracking-widest uppercase rounded-md gold-gradient text-white shadow-md shadow-brand-orange/15">
              {product.tag}
            </span>
          )}
          
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            referrerPolicy="no-referrer"
          />

          {/* Absolute Bottom Black/Gold Linear Overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action Hover Controls */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <button
              onClick={() => setShowQuickView(true)}
              className="p-3.5 rounded-xl bg-white text-black hover:bg-brand-orange hover:text-white transform hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg shadow-black/40"
              title="Quick Look"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-3.5 rounded-xl gold-gradient text-white hover:brightness-110 transform hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg shadow-black/40"
              title="Add to Collection"
            >
              {successAdded ? <Check className="w-4 h-4 animate-bounce" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card Specs and Description */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            {/* Category / Star Ratings Row */}
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] tracking-widest uppercase text-brand-orange font-bold font-display">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-neutral-400">
                <Star className="w-3 h-3 text-brand-gold fill-brand-gold" />
                <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300">{product.rating}</span>
                <span className="text-[9px] text-neutral-500">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Product Title styled with premium serif title look */}
            <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white tracking-tight group-hover:text-brand-orange transition-colors duration-300 mb-1.5 leading-snug">
              {product.name}
            </h3>

            {/* Price section */}
            <p className="font-display font-extrabold text-sm text-brand-orange font-mono mb-2">
              ${product.price}.00
            </p>

            {/* Specs Description */}
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
              {product.description}
            </p>
          </div>

          {/* Footer Action Card Button Panel */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-900/60 flex items-center justify-between gap-2">
            <button
              onClick={() => setShowQuickView(true)}
              className="text-[10px] font-display font-bold uppercase tracking-wider text-neutral-500 hover:text-brand-orange dark:text-neutral-400 dark:hover:text-white transition-colors duration-200 cursor-pointer"
            >
              More Details
            </button>
            <button
              onClick={handleAddToCart}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-[10px] font-display font-semibold uppercase tracking-widest text-neutral-800 hover:border-brand-orange hover:bg-brand-orange/5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:border-brand-orange dark:hover:bg-brand-orange/10 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              {successAdded ? (
                <>
                  <Check className="w-3 h-3 text-brand-orange" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3" />
                  Add To Bag
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* QUICK VIEW MODAL COMPONENT */}
      <AnimatePresence>
        {showQuickView && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            
            {/* Backdrop Glow Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickView(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Main Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 z-10 flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowQuickView(false)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-neutral-800 text-neutral-400 hover:text-white hover:border-brand-orange/40 transition-all duration-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Media Left Column */}
              <div className="md:w-1/2 relative bg-neutral-900 aspect-square md:aspect-auto flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {product.tag && (
                  <span className="absolute top-6 left-6 px-3 py-1.5 text-[9px] font-display font-black tracking-widest uppercase rounded-md bg-gradient-to-r from-brand-orange to-brand-gold text-white">
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Data Right Column */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[600px] bg-white dark:bg-neutral-950">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5 text-brand-orange text-xs font-bold uppercase tracking-widest">
                    <Award className="w-3.5 h-3.5" />
                    {product.category}
                  </div>

                  <h2 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white tracking-tight mb-2 leading-snug">
                    {product.name}
                  </h2>

                  {/* Rating Stars and Price */}
                  <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="text-xl font-display font-extrabold text-brand-orange">
                      ${product.price}.00
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-sm">
                      <div className="flex items-center gap-0.5 text-brand-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-brand-gold text-brand-gold' : 'text-neutral-300 dark:text-neutral-700'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">{product.rating}</span>
                      <span className="text-[10px] text-neutral-500">({product.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  {/* Highlights / Bio description */}
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed mb-5">
                    {product.description}
                  </p>

                  {/* Colorway details if available */}
                  {product.colorway && (
                    <div className="mb-5">
                      <span className="text-[10px] font-display font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                        Color / Theme
                      </span>
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        {product.colorway}
                      </span>
                    </div>
                  )}

                  {/* Specs Bullets */}
                  {product.specs && (
                    <div className="mb-6">
                      <span className="text-[10px] font-display font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-2">
                        Premium Highlights
                      </span>
                      <ul className="space-y-1.5">
                        {product.specs.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                            <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-gold" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Premium Guarantee Badges */}
                  <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-150 dark:border-neutral-800/60">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                      <span>100% Authentic Curation</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
                      <Truck className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Secured Global Shipping</span>
                    </div>
                  </div>

                  {/* Selection Size Label */}
                  <div className="mb-6">
                    <span className="text-[10px] font-display font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-2.5">
                      Select {product.category === 'perfumes' ? 'Volume' : 'Size'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-2 rounded-lg text-xs font-mono font-medium tracking-wide uppercase border transition-all duration-300 cursor-pointer ${
                            selectedSize === sz
                              ? 'bg-brand-orange border-brand-orange text-white'
                              : 'border-neutral-200 dark:border-neutral-800 bg-neutral-55 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 hover:text-neutral-800 dark:hover:border-neutral-600 dark:hover:text-white'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Confirm additions panel bottom line */}
                <div className="flex gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4.5 rounded-xl gold-gradient text-white text-xs font-display font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-orange/15 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {successAdded ? (
                      <>
                        <Check className="w-4 h-4 animate-bounce" />
                        Added to Kolektion!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add To Kolektion Bag
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

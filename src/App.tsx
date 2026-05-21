import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart';
import { useFirebase } from './components/FirebaseProvider';
import { Product, CartItem } from './types';
import { Search, Gift, Sparkles, Filter, Star, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { products, testimonials } = useFirebase();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Sync with local storage or choose dark by default for luxury street look
    const val = localStorage.getItem('magwear-theme');
    return val ? val === 'dark' : true; 
  });
  
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const items = localStorage.getItem('magwear-cart');
    return items ? JSON.parse(items) : [];
  });
  
  // Filtering and Searching parameters
  const [sneakerSearch, setSneakerSearch] = useState('');
  const [perfumeSearch, setPerfumeSearch] = useState('');
  const [clothingSearch, setClothingSearch] = useState('');
  
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'EXCLUSIVE' | 'NEW' | 'BEST'>('ALL');
  const [vipPromoAlert, setVipPromoAlert] = useState<boolean>(true);

  // Sync theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('magwear-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('magwear-theme', 'light');
    }
  }, [darkMode]);

  // Sync cart counter to local storage
  useEffect(() => {
    localStorage.setItem('magwear-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const idx = prevItems.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const copy = [...prevItems];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) => 
      prev.map((item) => item.product.id === productId ? { ...item, quantity } : item)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Scroll Actions
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Filter strategy
  const filterProducts = (products: Product[], query: string, category: 'sneakers' | 'perfumes' | 'clothing') => {
    return products.filter((prod) => {
      if (prod.category !== category) return false;
      
      // Match query
      const matchQuery = prod.name.toLowerCase().includes(query.toLowerCase()) || 
                          prod.description.toLowerCase().includes(query.toLowerCase());
      
      // Match special VIP tags
      if (activeFilter === 'EXCLUSIVE') {
        return matchQuery && (prod.tag?.toLowerCase().includes('exclusive') || prod.tag?.toLowerCase().includes('limited'));
      }
      if (activeFilter === 'NEW') {
        return matchQuery && prod.tag?.toLowerCase().includes('new');
      }
      if (activeFilter === 'BEST') {
        return matchQuery && (prod.tag?.toLowerCase().includes('best') || prod.rating >= 4.8);
      }
      return matchQuery;
    });
  };

  const sneakerList = filterProducts(products, sneakerSearch, 'sneakers');
  const perfumeList = filterProducts(products, perfumeSearch, 'perfumes');
  const clothingList = filterProducts(products, clothingSearch, 'clothing');

  const cartItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      darkMode 
        ? 'bg-neutral-950 text-white' 
        : 'bg-[#fdfcfb] text-neutral-900'
    }`}>
      
      {/* Sticky Top Responsive Header Navbar */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        cartItemsCount={cartItemsCount}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Hero Welcome banner */}
      <Hero 
        onShopClick={() => scrollToId('sneakers')} 
        onExploreClick={() => scrollToId('profile')}
      />

      {/* Floating Spark Promo Panel (Can be dismissed) */}
      <AnimatePresence>
        {vipPromoAlert && (
          <div className="bg-gradient-to-r from-brand-orange to-brand-gold py-3 px-4 text-center text-white text-xs font-semibold relative flex items-center justify-center gap-3">
            <span className="flex items-center gap-1.5 justify-center">
              <Gift className="w-4 h-4 text-white animate-bounce" />
              <span>Use discount code <strong className="font-bold underline tracking-wider">MAGWEAR15</strong> at checkout for 15% VIP off on all Collections!</span>
            </span>
            <button
              onClick={() => setVipPromoAlert(false)}
              className="absolute right-4 p-1 hover:bg-white/10 rounded-sm cursor-pointer transition-colors"
              title="Dismiss Promo"
            >
              &times;
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* Main Collections Hub Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Universal Filter and Brand Tag Category Controls */}
        <div className="flex flex-col items-center justify-between border-b border-neutral-200 dark:border-neutral-900 pb-8 mb-12 gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="font-display font-medium text-xs tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
              Curation Standard
            </h3>
            <p className="font-display font-bold text-lg text-neutral-900 dark:text-white mt-1">
              Select Signature Filter
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'ALL', label: 'All Curation' },
              { id: 'EXCLUSIVE', label: 'Limited Release' },
              { id: 'NEW', label: 'New Arrivals' },
              { id: 'BEST', label: 'Top Rated 4.8+' }
            ].map((filt) => (
              <button
                key={filt.id}
                onClick={() => setActiveFilter(filt.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                  activeFilter === filt.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900 dark:border-white shadow-md'
                    : 'border-neutral-200 text-neutral-500 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {filt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= SNEAKERS COLLECTION SECTION ================= */}
        <section id="sneakers" className="py-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-display font-black tracking-widest uppercase text-brand-orange">
                Premium Feet Curation
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight uppercase mt-1">
                Sneaker <span className="gold-gradient-text font-serif italic font-light leading-none">Kolektions</span>
              </h2>
              <div className="w-12 h-1 bg-brand-orange mt-2.5 rounded-full" />
            </div>

            {/* Sneaker Sector Search Filter */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search sneakers..."
                value={sneakerSearch}
                onChange={(e) => setSneakerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-xs focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {sneakerList.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {sneakerList.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center rounded-2xl bg-neutral-900/10 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850"
              >
                <HelpCircle className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-light">No premium sneakers matched your filter parameters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ================= PERFUME COLLECTION SECTION ================= */}
        <section id="perfumes" className="py-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-display font-black tracking-widest uppercase text-brand-gold">
                Niche Olfactory Curation
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight uppercase mt-1">
                Luxury <span className="gold-gradient-text font-serif italic font-light leading-none">Fragrances</span>
              </h2>
              <div className="w-12 h-1 bg-brand-gold mt-2.5 rounded-full" />
            </div>

            {/* Perfume Sector Search Filter */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search perfumes..."
                value={perfumeSearch}
                onChange={(e) => setPerfumeSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-xs focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {perfumeList.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {perfumeList.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center rounded-2xl bg-neutral-900/10 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850"
              >
                <HelpCircle className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-light">No premium perfumes matched your filter parameters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ================= CLOTHING BOUTIQUE SECTION ================= */}
        <section id="clothing" className="py-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-display font-black tracking-widest uppercase text-brand-orange">
                Heavy Knit Streetwear Cut-And-Sew
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight uppercase mt-1">
                Clothing <span className="gold-gradient-text font-serif italic font-light leading-none">Boutique</span>
              </h2>
              <div className="w-12 h-1 bg-brand-orange mt-2.5 rounded-full" />
            </div>

            {/* Clothing Sector Search Filter */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search clothing..."
                value={clothingSearch}
                onChange={(e) => setClothingSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-xs focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {clothingList.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {clothingList.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center rounded-2xl bg-neutral-900/10 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850"
              >
                <HelpCircle className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-light">No premium clothing items matched your filter parameters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="py-24 bg-black/60 dark:bg-black/90 text-white relative border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs font-display font-black tracking-[0.3em] uppercase text-brand-orange">
              Verified Style Statements
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-display font-bold uppercase tracking-tight">
              Kolektion <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">Endorsements</span>
            </h2>
            <div className="mt-3 w-16 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div 
                key={test.id}
                className="p-8 rounded-2xl bg-neutral-900 border border-neutral-850 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-brand-gold mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  {/* Comment */}
                  <p className="text-xs text-neutral-400 leading-relaxed font-light italic">
                    "{test.comment}"
                  </p>
                </div>

                {/* Persona line */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-800">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200">{test.name}</h4>
                    <span className="text-[10px] text-brand-orange uppercase tracking-wider font-semibold font-display">{test.role}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= INTERACTIVE INQUIRY SECTION ================= */}
      <ContactForm />

      {/* Footer Block */}
      <Footer />

      {/* Sliding Luxury Shopping Bag Cart Drawer */}
      <ShoppingCart 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

    </div>
  );
}

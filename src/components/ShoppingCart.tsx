import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Sparkles, CheckCircle2, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Product } from '../types';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function ShoppingCart({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearCart
}: ShoppingCartProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'purchasing' | 'success'>('cart');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discount = promoApplied ? subtotal * 0.15 : 0; // 15% discount
  const estShipping = subtotal > 300 || subtotal === 0 ? 0 : 25; // Free shipping over $300
  const finalTotal = subtotal - discount + estShipping;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'MAGWEAR15') {
      setPromoApplied(true);
    } else {
      setPromoError('Invalid coupon code. Try using: MAGWEAR15');
    }
  };

  const handleTriggerCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep('purchasing');
    
    // Simulate luxury blockchain or merchant payment clearing
    setTimeout(() => {
      setCheckoutStep('success');
    }, 2000);
  };

  const handleDone = () => {
    onClearCart();
    setCheckoutStep('cart');
    setPromoApplied(false);
    setPromoCode('');
    setPromoError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Slider content container drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative w-full max-w-md h-full bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-900 shadow-2xl z-10 flex flex-col justify-between"
          >
            {/* Header section */}
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-orange" />
                <h2 className="font-serif font-bold text-lg text-neutral-900 dark:text-white tracking-wide uppercase">
                  Your Curation Bag
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:text-white dark:hover:bg-neutral-900 transition-all duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DYNAMIC MIDDLE CONTENT CHANGER */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                
                {/* SUCCESS CHECKOUT WINDOW */}
                {checkoutStep === 'success' ? (
                  <motion.div
                    key="success-checkout"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center px-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-orange to-brand-gold text-white flex items-center justify-center mb-6 shadow-lg shadow-brand-orange/20 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <h3 className="font-serif font-bold text-xl text-neutral-900 dark:text-white tracking-wide mb-2.5 uppercase">
                      Order Sealed Elegantly!
                    </h3>

                    <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed mb-6 font-light">
                      Your custom selections have been secured! Owner <strong className="text-neutral-900 dark:text-white">Aggrey Mathias</strong> is pre-packaging your order and will contact you at your email or mobile line to finalize cash on delivery or transfer payment instructions.
                    </p>

                    <div className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-left space-y-2 mb-8">
                      <div className="text-[10px] font-display font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-800 pb-1.5 flex justify-between">
                        <span>Invoice Summary</span>
                        <span className="text-brand-gold font-mono">Invoice #MW-{Math.floor(1000 + Math.random() * 9000)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-neutral-700 dark:text-neutral-300">
                        <span>Grand Total Settled:</span>
                        <span className="font-mono text-neutral-900 dark:text-white font-bold">${finalTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-green-600 font-light">
                        <span>Shipping Class:</span>
                        <span>Secured Courier delivery</span>
                      </div>
                    </div>

                    <button
                      onClick={handleDone}
                      className="w-full py-4.5 rounded-xl gold-gradient text-white font-display font-bold text-xs uppercase tracking-widest hover:brightness-105 transition-all duration-300 cursor-pointer"
                    >
                      Continue Curating Styles
                    </button>
                  </motion.div>
                ) : checkoutStep === 'purchasing' ? (
                  
                  // PROCESSING LOADER WINDOW
                  <motion.div
                    key="purchasing-checkout"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <div className="relative w-14 h-14 mb-6">
                      <div className="absolute inset-0 border-4 border-brand-orange/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
                    </div>
                    <h3 className="font-display font-bold text-sm uppercase text-neutral-700 dark:text-white tracking-widest">
                      Clearing Curation...
                    </h3>
                    <p className="text-xs text-neutral-500 mt-2 font-light">
                      Securing high-top stocks and fragrance oils...
                    </p>
                  </motion.div>

                ) : cartItems.length === 0 ? (
                  
                  // EMPTY CART WINDOW
                  <motion.div
                    key="empty-cart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 flex items-center justify-center text-neutral-400 dark:text-neutral-600 mb-4">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Your bag is empty
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-600 mt-1.5 max-w-xs font-light">
                      Add products from our Sneakers, Perfumes, or Clothing sections to build your luxurious attire.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-850 bg-neutral-100 dark:bg-neutral-900 text-[10px] font-display font-semibold uppercase tracking-widest text-neutral-800 dark:text-white hover:border-brand-orange hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors duration-300 cursor-pointer"
                    >
                      Browse Boutique
                    </button>
                  </motion.div>

                ) : (
                  
                  // ITEMS LIST WINDOW
                  <motion.div
                    key="items-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    {cartItems.map((item) => (
                      <motion.div
                        layout
                        key={item.product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-150 dark:border-neutral-850 hover:border-brand-orange/20 transition-colors duration-300"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-lg bg-neutral-200 dark:bg-neutral-950 overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Calculations description */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between gap-2">
                            <h4 className="font-serif font-bold text-xs text-neutral-800 dark:text-white tracking-wide line-clamp-1">
                              {item.product.name}
                            </h4>
                            <span className="font-mono text-xs text-brand-orange font-bold flex-shrink-0">
                              ${item.product.price * item.quantity}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2.5">
                            {/* Quantity buttons adjusted */}
                            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                className={`p-1 rounded text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer ${item.quantity <= 1 ? 'opacity-35 cursor-not-allowed' : ''}`}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs text-neutral-800 dark:text-neutral-200 w-4 text-center font-bold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 rounded text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Delete block */}
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="p-1.5 rounded-lg border border-transparent text-neutral-400 dark:text-neutral-600 hover:text-red-500 hover:border-red-500/10 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </motion.div>

                )}
              </AnimatePresence>
            </div>

            {/* BILLING AND FOOTER STAGE (Only if step is 'cart' AND there are items) */}
            {checkoutStep === 'cart' && cartItems.length > 0 && (
              <div className="p-6 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 space-y-5">
                
                {/* Promo Code Applied */}
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                      <input
                        disabled={promoApplied}
                        type="text"
                        placeholder={promoApplied ? "VIP Discount Applied!" : "Promo Code (MAGWEAR15)"}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-brand-orange disabled:opacity-60 disabled:text-green-500 font-mono text-neutral-800 dark:text-neutral-100"
                      />
                    </div>
                    <button
                      disabled={promoApplied || !promoCode}
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-brand-orange hover:text-brand-orange dark:hover:text-white text-[10px] font-display font-medium uppercase tracking-wider transition-all duration-250 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[10px] text-red-500 font-medium pl-1 leading-none">{promoError}</p>
                  )}
                </form>

                {/* Bill details list */}
                <div className="space-y-2 border-b border-neutral-100 dark:border-neutral-900 pb-4 text-xs font-light">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal:</span>
                    <span className="font-mono text-neutral-750 dark:text-neutral-300">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between text-green-500 font-medium">
                      <span>VIP promo code discount (15%):</span>
                      <span className="font-mono">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-500">
                    <span>Secured Shipping:</span>
                    {estShipping === 0 ? (
                      <span className="text-green-500 font-display font-semibold uppercase text-[10px]">Free shipping</span>
                    ) : (
                      <span className="font-mono text-neutral-750 dark:text-neutral-300">${estShipping.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-display font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">Grand Total:</span>
                  <span className="font-display font-black text-lg text-brand-orange font-mono">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Trigger Checkout Solid button */}
                <button
                  onClick={handleTriggerCheckout}
                  className="w-full py-4.5 rounded-xl gold-gradient text-white text-xs font-display font-bold uppercase tracking-widest hover:brightness-105 active:scale-99 transition-all duration-250 shadow-md shadow-brand-orange/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  Conclude Selection Purchase
                </button>
                
                <p className="text-[10px] text-center text-neutral-500 dark:text-neutral-600 font-light">
                  Direct cash on receipt or secure bank link coordinates. Free shipping for luxury orders over $300.
                </p>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, ShoppingBag, Flame, Sparkles, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from './FirebaseProvider';
import { signInWithGoogle, signOutUser } from '../firebase';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  cartItemsCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ darkMode, setDarkMode, cartItemsCount, onOpenCart }: NavbarProps) {
  const { user, isAdmin } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Basic active item highlighting based on scroll position
      const sections = ['home', 'sneakers', 'perfumes', 'clothing', 'profile', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveItem(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', id: 'home' },
    { label: 'Sneakers', id: 'sneakers' },
    { label: 'Perfumes', id: 'perfumes' },
    { label: 'Clothing', id: 'clothing' },
    { label: 'Profile', id: 'profile' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    setActiveItem(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      isScrolled 
        ? 'py-3 bg-black/80 dark:bg-black/90 backdrop-blur-md border-b border-brand-orange/10 shadow-lg shadow-black/20' 
        : 'py-5 bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer select-none" onClick={() => handleNavClick('home')}>
            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-black text-black text-xs tracking-tighter shadow-md shadow-brand-orange/15">
              MK
            </div>
            <div className="flex items-center">
              <span className="font-extrabold tracking-tighter text-sm sm:text-base text-white">
                MAGWEAR <span className="text-brand-orange font-serif font-light italic font-serif">KOLEKTIONS</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative font-display font-medium text-xs tracking-widest uppercase transition-all duration-300 py-1 hover:text-brand-orange ${
                  activeItem === item.id 
                    ? 'text-brand-orange' 
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {item.label}
                {activeItem === item.id && (
                  <motion.span 
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-brand-orange to-brand-gold rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Utility Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:text-white hover:border-brand-orange/40 transition-all duration-300 group cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-brand-gold group-hover:rotate-45 transition-transform duration-500" />
              ) : (
                <Moon className="w-4 h-4 text-brand-orange group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:text-white hover:border-brand-orange/40 transition-all duration-300 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-white ring-1 ring-black animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Google Authentication Profile Chip */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
                <img 
                  src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} 
                  alt={user.displayName || 'Curator'} 
                  className="w-7 h-7 rounded-lg object-cover border border-neutral-800 animate-fade-in"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-neutral-200 uppercase tracking-tight truncate max-w-[80px]">
                    {user.displayName?.split(' ')[0]}
                  </span>
                  <span className="text-[8px] text-brand-orange leading-[1] font-medium tracking-wide">
                    {isAdmin ? 'OWNER' : 'CLIENT'}
                  </span>
                </div>
                <button 
                  onClick={signOutUser}
                  className="p-1.5 rounded-lg border border-neutral-800 hover:border-red-500/40 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white hover:border-brand-orange/40 transition-all duration-300 text-xs font-semibold cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Join</span>
              </button>
            )}
          </div>

          {/* Mobile Buttons Left of Burger */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-neutral-800/80 bg-neutral-900/40 text-neutral-300"
            >
              {darkMode ? <Sun className="w-4 h-4 text-brand-gold" /> : <Moon className="w-4 h-4 text-brand-orange" />}
            </button>

            {/* Mobile Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl border border-neutral-800/80 bg-neutral-900/40 text-neutral-300"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-white ring-1 ring-black">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-neutral-800/80 bg-neutral-900/40 text-neutral-300"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden w-full bg-black/95 border-b border-brand-orange/10 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {menuItems.map((item, index) => (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left font-display font-medium text-xs tracking-widest uppercase py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-between ${
                    activeItem === item.id 
                      ? 'text-brand-orange bg-brand-orange/10 border-l-2 border-brand-orange' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${activeItem === item.id ? 'bg-brand-orange' : 'bg-transparent'}`}></span>
                </motion.button>
              ))}

              {/* Mobile Auth options */}
              <div className="pt-3 border-t border-neutral-900 flex items-center justify-between px-4 mt-4">
                {user ? (
                  <div className="flex items-center gap-2">
                    <img 
                      src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} 
                      alt="User" 
                      className="w-7 h-7 rounded-lg object-cover border border-neutral-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-[10px] font-bold text-white uppercase tracking-tight">{user.displayName?.split(' ')[0]}</div>
                      <div className="text-[8px] text-brand-orange tracking-widest uppercase font-semibold">{isAdmin ? 'Owner' : 'Client'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">Guest Client</div>
                )}
                
                {user ? (
                  <button
                    onClick={signOutUser}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <LogOut className="w-3" h-3="" />
                    <span>Out</span>
                  </button>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    <LogIn className="w-3" h-3="" />
                    <span>Join</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

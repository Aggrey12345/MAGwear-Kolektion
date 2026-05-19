import React from 'react';
import { Mail, Phone, Facebook, Instagram, Twitter, Flame, ArrowUp, Sparkles } from 'lucide-react';
import { ownerProfile } from '../data';

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 py-16 relative overflow-hidden">
      
      {/* Decorative lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          
          {/* Logo Brand columns */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleScrollTop}>
              <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-black text-black text-xs tracking-tighter shadow-md shadow-brand-orange/15">
                MK
              </div>
              <div className="flex items-center">
                <span className="font-extrabold tracking-tighter text-sm text-white">
                  MAGWEAR <span className="text-brand-orange font-serif font-light italic">KOLEKTIONS</span>
                </span>
              </div>
            </div>
            
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed font-light">
              Premium curated boutique delivering high-fashion designer sneakers, long-lasting unisex spray extraits, and heavy organic cotton streetwear silhouettes. Built for those who demand elite personal expressions.
            </p>
          </div>

          {/* Sitemap quicklinks columns */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-bold text-xs uppercase text-white tracking-widest">
              Explore Departments
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="#sneakers" className="hover:text-brand-orange transition-colors duration-200 font-light">Sneakers Collection</a>
              <a href="#perfumes" className="hover:text-brand-orange transition-colors duration-200 font-light">Luxury Perfumes</a>
              <a href="#clothing" className="hover:text-brand-orange transition-colors duration-200 font-light">Clothing Boutique</a>
              <a href="#profile" className="hover:text-brand-orange transition-colors duration-200 font-light">About curator</a>
              <a href="#contact" className="hover:text-brand-orange transition-colors duration-200 font-light">Direct Inbound</a>
              <span className="text-neutral-700 select-none">Terms / Privacy</span>
            </div>
          </div>

          {/* Newsletter signup columns */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-bold text-xs uppercase text-white tracking-widest">
              Unshakable Circle
            </h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Subscribe to unlock private invitations, drop notifications, and hidden sneaker releases.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                required
                type="email"
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs placeholder-neutral-600 focus:outline-none focus:border-brand-orange transition-colors duration-300"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-orange/85 text-white font-display font-bold text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Deep Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-neutral-600">
          <div>
            &copy; {new Date().getFullYear()} <span className="text-neutral-400 font-medium">MAGwear Kolektions</span>. Luxury curation by <strong className="text-neutral-400 hover:text-brand-gold transition-colors duration-300">{ownerProfile.name}</strong>. All rights reserved.
          </div>
          
          {/* Scroll to top button */}
          <button
            onClick={handleScrollTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-900 bg-neutral-900/50 text-neutral-500 hover:text-brand-orange hover:border-brand-orange/20 transition-all duration-300 cursor-pointer"
            title="Scroll To Peak"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3 text-neutral-500 hover:text-brand-orange" />
          </button>
        </div>

      </div>
    </footer>
  );
}

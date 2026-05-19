import React from 'react';
import { Compass, ShoppingBag, ArrowDown, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { heroContent } from '../data';

interface HeroProps {
  onShopClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onShopClick, onExploreClick }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white pt-20">
      
      {/* Background Image with Premium Dark Multi-Stage Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroContent.bgImage}
          alt="Boutique Luxury Showcase Background"
          className="w-full h-full object-cover scale-105 filter brightness-40 contrast-115 select-none animate-pulse-slow"
          style={{ animationDuration: '8s' }}
          referrerPolicy="no-referrer"
        />
        {/* Multistage overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-0" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent z-0" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-0" />
        
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full filter blur-[100px] animate-blob" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-brand-gold/10 rounded-full filter blur-[120px] animate-blob [animation-delay:2s]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
        
        {/* Sparkles / Luxury badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full border border-brand-orange/30 bg-black/55 backdrop-blur-md mb-6 shadow-md shadow-brand-orange/5"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin-slow" />
          <span className="font-display text-[10px] tracking-[0.25em] uppercase text-brand-gold font-bold">
            Curated Elite Streetwear & Fragrance
          </span>
        </motion.div>

        {/* Decorative Spinning Dashed Circle from Bento Design Spec */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-20 hidden md:block">
          <div className="w-[450px] h-[450px] rounded-full border border-neutral-600 border-dashed animate-spin-slow"></div>
        </div>

        {/* Boutique Name styled with Bento Theme fonts */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-6 text-white"
        >
          Signature <span className="gold-gradient-text italic font-light font-serif">Style</span><br/>Redefined.
        </motion.h1>

        {/* Short luxury slogan & description text */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 font-serif italic text-lg md:text-2xl text-neutral-200 max-w-3xl mx-auto tracking-wide"
        >
          “{heroContent.slogan}”
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-xs md:text-sm text-neutral-400 max-w-xl mx-auto tracking-wider leading-relaxed"
        >
          {heroContent.description}
        </motion.p>

        {/* Call to action buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Shop collection CTA (primary solid) */}
          <button
            onClick={onShopClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-gold text-white font-display font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-brand-orange/30 transform hover:-translate-y-1 hover:brightness-110 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop Collection
          </button>

          {/* Explore styles CTA (secondary stroke) */}
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-neutral-700/80 bg-black/60 backdrop-blur-sm text-neutral-200 font-display font-bold text-xs uppercase tracking-widest hover:text-white hover:border-brand-orange/50 hover:bg-black/80 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-brand-gold animate-pulse" />
            Explore Styles
          </button>
        </motion.div>
      </div>

      {/* Bounce-flowing scroll indicator info button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <motion.button
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          onClick={onShopClick}
          className="flex flex-col items-center gap-1.5 text-neutral-500 hover:text-brand-orange transition-colors duration-300 group cursor-pointer"
        >
          <span className="font-display text-[9px] uppercase tracking-[0.2em] font-medium group-hover:tracking-[0.25em] transition-all duration-300">Explore Collection</span>
          <ArrowDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-brand-orange transition-colors duration-300" />
        </motion.button>
      </div>
    </section>
  );
}

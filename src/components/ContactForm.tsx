import React, { useState } from 'react';
import { Mail, Phone, Facebook, Send, CheckCircle2, MessageSquare, Clock, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ownerProfile } from '../data';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'Sneakers Curation',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    
    // Simulate premium backend post
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form fields
      setFormData({
        name: '',
        email: '',
        interest: 'Sneakers Curation',
        message: ''
      });
    }, 1800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24 bg-black text-white relative overflow-hidden border-t border-neutral-900">
      
      {/* Visual background glows */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-brand-orange/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-brand-gold/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-display font-black tracking-[0.3em] uppercase text-brand-orange">
            Get In Touch
          </span>
          <h2 className="mt-2 text-3xl md:text-5xl font-display font-bold uppercase tracking-tight">
            Magwear <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">Inquiry Desk</span>
          </h2>
          <div className="mt-3 w-16 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Details Panel (Left: 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Header Description */}
            <div className="mb-4">
              <h3 className="font-serif font-bold text-xl text-neutral-900 dark:text-white tracking-wide mb-2">
                Let's Craft Lifestyle
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed font-light">
                Have specific sizing demands, bespoke fragrance desires, or custom apparel orders? Drop us a prompt or connect with Aggrey Mathias directly.
              </p>
            </div>

            {/* Structured Detail Cards */}
            <div className="space-y-4">
              
              {/* Direct Phone */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/60 hover:border-brand-orange/30 transition-colors duration-400 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange flex-shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-display font-bold text-neutral-400 dark:text-neutral-500 tracking-wider block">Phone Line</span>
                  <a href={`tel:${ownerProfile.socials.phone}`} className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-brand-orange transition-colors duration-250">
                    {ownerProfile.socials.phone}
                  </a>
                </div>
              </div>

              {/* Direct Email */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/60 hover:border-brand-orange/30 transition-colors duration-400 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-display font-bold text-neutral-400 dark:text-neutral-500 tracking-wider block">Email Address</span>
                  <a href={`mailto:${ownerProfile.socials.email}`} className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-brand-orange transition-colors duration-250 break-all">
                    {ownerProfile.socials.email}
                  </a>
                </div>
              </div>

              {/* Facebook Profile */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/60 hover:border-brand-orange/30 transition-colors duration-400 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <Facebook className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-display font-bold text-neutral-400 dark:text-neutral-500 tracking-wider block">Facebook Desk</span>
                  <a href={ownerProfile.socials.facebook} target="_blank" rel="noreferrer" className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-brand-orange transition-colors duration-250">
                    Mathias Garo Aggrey
                  </a>
                </div>
              </div>

            </div>

            {/* Quick response stats */}
            <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 flex items-center gap-3 mt-4 shadow-sm">
              <Clock className="w-4 h-4 text-brand-gold animate-pulse" />
              <div className="text-[11px] text-neutral-600 dark:text-neutral-400 font-light">
                Average reply time is <span className="text-brand-orange font-semibold">under 2 hours</span> for orders.
              </div>
            </div>

          </div>

          {/* Luxury Form Area (Right: 8 cols) */}
          <div className="lg:col-span-8">
            <div className="bento-card p-6 sm:p-8 md:p-10 shadow-lg">
              
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  // INPUT STAGE
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    
                    {/* Double name & email line */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-[10px] uppercase font-display font-bold tracking-widest text-neutral-500 dark:text-neutral-400">
                          Your Name
                        </label>
                        <input
                          required
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Mathias Aggrey"
                          className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-55 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs focus:text-neutral-900 dark:focus:text-white focus:outline-none focus:border-brand-orange transition-colors duration-300 placeholder-neutral-400 dark:placeholder-neutral-700 rounded-xl"
                        />
                      </div>

                      {/* Email input */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-[10px] uppercase font-display font-bold tracking-widest text-neutral-500 dark:text-neutral-400">
                          Email Address
                        </label>
                        <input
                          required
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. user@domain.com"
                          className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-55 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs focus:text-neutral-900 dark:focus:text-white focus:outline-none focus:border-brand-orange transition-colors duration-300 placeholder-neutral-400 dark:placeholder-neutral-700 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Selector interest dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="interest" className="text-[10px] uppercase font-display font-bold tracking-widest text-neutral-500 dark:text-neutral-400">
                        Inquiry Topic
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-55 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 text-xs focus:text-neutral-900 dark:focus:text-white focus:outline-none focus:border-brand-orange transition-colors duration-300 appearance-none font-sans cursor-pointer rounded-xl"
                      >
                        <option value="Sneakers Curation">Sneakers Curation (Yeezy, Jordans, AeroGold, etc)</option>
                        <option value="Bespoke Perfumes">Signature Fragrances & Oils (Oud Royale, Saffron)</option>
                        <option value="Streetwear Apparel">High-End Streetwear & Hoodies</option>
                        <option value="Private Booking">Sizing Consult / Private fitting with Aggrey</option>
                        <option value="Feedback / Support">General Partnership or Support</option>
                      </select>
                    </div>

                    {/* Detailed message textarea */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-[10px] uppercase font-display font-bold tracking-widest text-neutral-500 dark:text-neutral-400">
                        Detailed Message
                      </label>
                      <textarea
                        required
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Write down details of custom sneaker sizes, desired perfume notes, or shipping request..."
                        className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-55 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs focus:text-neutral-900 dark:focus:text-white focus:outline-none focus:border-brand-orange transition-colors duration-300 placeholder-neutral-400 dark:placeholder-neutral-700 resize-none leading-relaxed rounded-xl"
                      />
                    </div>

                    {/* Dynamic Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl gold-gradient text-white text-xs font-display font-bold uppercase tracking-widest hover:brightness-105 active:scale-99 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Transmit Sealed Inquiry
                          </>
                        )}
                      </button>
                    </div>

                  </motion.form>
                ) : (
                  // SUCCESS CONFIRMATION STAGE
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-10 text-center flex flex-col items-center justify-center max-w-md mx-auto"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-6 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <h4 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white tracking-wide mb-2.5">
                      Inquiry Sealed Successfully!
                    </h4>

                    <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                      Thank you for contacting MAGwear Kolektions. Your private inquiry has been transmitted securely. Owner <strong className="text-brand-orange font-semibold">{ownerProfile.name}</strong> will personally review and contact you shortly.
                    </p>

                    {/* Structured Summary display */}
                    <div className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850/80 mb-8 text-left space-y-2.5">
                      <span className="text-[10px] font-display font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1 border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
                        Inquiry Receipt
                      </span>
                      <div className="text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="text-neutral-400 dark:text-neutral-500 font-medium">Topic:</span> Sneakers Curation
                      </div>
                      <div className="text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="text-neutral-400 dark:text-neutral-500 font-medium">Status:</span> Pending Curator Approval
                      </div>
                    </div>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 text-[10px] font-display font-semibold uppercase tracking-widest text-neutral-800 dark:text-white hover:border-brand-orange dark:hover:border-brand-orange hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors duration-300 cursor-pointer"
                    >
                      Submit Another Concern
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

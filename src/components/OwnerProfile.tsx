import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Facebook, Instagram, Twitter, Award, Compass, Sparkles, CheckCircle2, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { ownerProfile } from '../data';
import { PROFILE_IMAGE_BASE64 } from './profileImageBase64';

export default function OwnerProfile() {
  const [profilePic, setProfilePic] = useState<string>(PROFILE_IMAGE_BASE64);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedPic = localStorage.getItem('magwear_profile_picture_custom');
    if (savedPic) {
      setProfilePic(savedPic);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, JPEG, GIF etc.).');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        try {
          localStorage.setItem('magwear_profile_picture_custom', base64);
          setProfilePic(base64);
        } catch (error) {
          // If image too large for localStorage, compress on the fly using a canvas
          const img = new Image();
          img.src = base64;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 512;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            try {
              localStorage.setItem('magwear_profile_picture_custom', compressedBase64);
              setProfilePic(compressedBase64);
            } catch (err) {
              console.error('Storage quota exceeded even after compression:', err);
            }
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const credentials = [
    "Over a decade of streetwear and vintage luxury curation",
    "Specialist in bespoke fragrance notes and oil extracts",
    "Established pioneer in contemporary cut-and-sew silhouettes",
    "Committed to authentic global sourcing and fine artisan stitching"
  ];

  return (
    <section id="profile" className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-brand-gold/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-brand-orange/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-display font-black tracking-[0.3em] uppercase text-brand-orange">
            The Visionary
          </span>
          <h2 className="mt-2 text-3xl md:text-5xl font-display font-bold uppercase tracking-tight">
            Founder & <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">Curator</span>
          </h2>
          <div className="mt-3 w-16 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full" />
        </div>

        {/* Outer Grid Panel */}
        <div className="bento-card p-6 sm:p-10 lg:p-12 shadow-xl max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Owner Picture Area (Left) */}
          <div className="w-full lg:w-2/5 flex-shrink-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-square max-w-[340px] mx-auto group"
            >
              {/* Luxury Frame Accents */}
              <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-brand-orange via-brand-gold to-brand-orange opacity-40 blur-sm group-hover:opacity-75 transition-opacity duration-500 scale-95 group-hover:scale-100" />
              
              {/* Under-shadow layer */}
              <div className="absolute inset-0 rounded-2xl bg-black z-0 shadow-2xl" />

              {/* Main Image */}
              <div 
                onClick={triggerFileSelect}
                className="relative z-10 w-full h-full rounded-2xl border-2 border-brand-gold/40 overflow-hidden transform group-hover:rotate-1 group-hover:scale-102 transition-transform duration-500 cursor-pointer"
              >
                <img
                  src={profilePic}
                  alt={ownerProfile.name}
                  className="w-full h-full object-cover rounded-2xl filter brightness-95 transition-all duration-350 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Custom Photo Overlay with Camera icon */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                  <Camera className="w-8 h-8 text-brand-gold animate-bounce" />
                  <span className="font-display text-xs font-bold text-white uppercase tracking-wider">Change Profile Pic</span>
                  <span className="text-[10px] text-neutral-300">JPG, PNG or GIF</span>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />

              {/* Float Badge overlay */}
              <div className="absolute -bottom-4 -right-4 z-25 p-3 rounded-2xl bg-black border border-neutral-800 text-brand-gold shadow-lg shadow-black/80 flex items-center gap-1.5 transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300">
                <Award className="w-4 h-4 text-brand-orange animate-pulse" />
                <span className="font-display text-[9px] font-bold uppercase tracking-widest text-neutral-200">Certified Luxury</span>
              </div>
            </motion.div>
          </div>

          {/* Biography Details (Right) */}
          <div className="w-full lg:w-3/5 flex flex-col justify-between">
            <div>
              
              {/* Title Header */}
              <div className="mb-6">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-gold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                    Boutique Owner
                  </span>
                </div>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-wide">
                  {ownerProfile.name}
                </h3>
                <p className="text-xs text-brand-orange font-mono uppercase tracking-widest mt-1">
                  {ownerProfile.title}
                </p>
              </div>

              {/* Bio text */}
              <div className="text-neutral-650 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6 font-light whitespace-pre-line space-y-4">
                {ownerProfile.bio}
              </div>

              {/* Curation highlights bullets */}
              <div className="mb-8">
                <span className="text-[10px] uppercase font-display font-black tracking-[0.16em] text-neutral-400 block mb-3">
                  Curation Ethos
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {credentials.map((cred, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-neutral-700 dark:text-neutral-300 font-light leading-snug">
                        {cred}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Social Links Panel and Direct Triggers */}
            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-display font-bold text-neutral-400 dark:text-neutral-500 tracking-wider">
                  Direct Inquiries
                </span>
                <span className="text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                  Available for private fittings
                </span>
              </div>

              {/* Social Round Icons */}
              <div className="flex items-center gap-3">
                {/* Facebook Handle (Mathias Garo Aggrey) */}
                <a
                  href={ownerProfile.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400 hover:text-brand-orange hover:border-brand-orange/40 transition-all duration-300 cursor-pointer hover:scale-105"
                  title="Facebook: Mathias Garo Aggrey"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* Email Direct */}
                <a
                  href={`mailto:${ownerProfile.socials.email}`}
                  className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400 hover:text-brand-orange hover:border-brand-orange/40 transition-all duration-300 cursor-pointer hover:scale-105"
                  title={`Email Owner: ${ownerProfile.socials.email}`}
                >
                  <Mail className="w-4 h-4" />
                </a>

                {/* Phone Dial */}
                <a
                  href={`tel:${ownerProfile.socials.phone}`}
                  className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400 hover:text-brand-orange hover:border-brand-orange/40 transition-all duration-300 cursor-pointer hover:scale-105"
                  title={`Call Owners Office: ${ownerProfile.socials.phone}`}
                >
                  <Phone className="w-4 h-4" />
                </a>

                {/* Instagram Handle Mockup */}
                <a
                  href={ownerProfile.socials.instagram}
                  className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400 hover:text-brand-orange hover:border-brand-orange/40 transition-all duration-300 cursor-pointer hover:scale-105"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Twitter Handle Mockup */}
                <a
                  href={ownerProfile.socials.twitter}
                  className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400 hover:text-brand-orange hover:border-brand-orange/40 transition-all duration-300 cursor-pointer hover:scale-105"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

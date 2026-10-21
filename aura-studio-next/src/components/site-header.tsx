'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Phone, Menu, X, ArrowUpRight } from 'lucide-react';
import { productConfig } from '../config/product';

export const SiteHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#hero' },
    { label: 'Reels', href: '#product-slider' },
    { label: 'Craft', href: '#about' },
    { label: 'Brands', href: '#trust' },
    { label: 'Moments', href: '#ugc-showcase' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFCF8]/90 backdrop-blur-md border-b border-[#7545F5]/12 shadow-[0_4px_20px_rgba(117,69,245,0.06)]'
          : 'bg-[#FFFCF8]/75 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="#hero" className="flex items-center gap-2 group">
          <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-widest text-[#1A1918] group-hover:text-[#7545F5] transition-colors">
            {productConfig.brand.logoText}
          </span>
          <span className="font-heading text-[10px] font-black tracking-widest bg-[#E4FF83] text-[#1A1918] px-2 py-0.5 rounded-full border border-[#7545F5]/20 shadow-xs">
            {productConfig.brand.logoSubtext}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/70 border border-[#7545F5]/10 px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(117,69,245,0.04)] backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold text-[#555260] hover:text-[#7545F5] hover:bg-[#E9DFFF]/40 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`https://wa.me/${productConfig.contact.whatsappRaw}?text=${encodeURIComponent(
              productConfig.contact.whatsappPrefill
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#25D366]/40 text-[#127A3A] text-xs font-heading font-semibold hover:bg-[#25D366]/10 transition-all shadow-xs"
            title="Chat with our studio team on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          <a
            href="#lead-form"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7545F5] text-white text-xs font-heading font-semibold hover:bg-[#6333ea] transition-all shadow-[0_4px_14px_rgba(117,69,245,0.25)]"
          >
            <span>Inquire</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-white border border-[#7545F5]/15 text-[#1A1918] hover:bg-[#E9DFFF]/30 transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-[#7545F5]/15 px-6 py-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-2 mb-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-[#1A1918] hover:bg-[#E9DFFF]/40 hover:text-[#7545F5] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5 pt-4 border-t border-[#7545F5]/10">
            <a
              href={`https://wa.me/${productConfig.contact.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#25D366] text-white text-xs font-heading font-semibold"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href={`tel:${productConfig.contact.phoneRaw}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white border border-[#7545F5]/20 text-[#7545F5] text-xs font-heading font-semibold"
            >
              <Phone className="w-4 h-4" />
              <span>Call {productConfig.contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

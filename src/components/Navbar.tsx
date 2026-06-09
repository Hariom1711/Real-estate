"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full px-6 md:px-12 lg:px-16 pt-6 z-50">
      <nav className="liquid-glass rounded-xl px-5 py-3 flex items-center justify-between border border-border">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight text-foreground uppercase select-none">
            PUNE REALTY
          </Link>
        </div>

        {/* Navigation links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: 'Properties', href: '/listings' },
            { name: 'Locations', href: '/#locations' },
            { name: 'Compare', href: '/compare' },
            { name: 'Contact', href: '/contact' }
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 select-none"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button & Theme Switcher - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/listings"
            className="bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all duration-300 text-sm font-semibold px-5 py-2.5 rounded-lg inline-flex items-center justify-center select-none cursor-pointer"
          >
            Browse Properties
          </Link>
        </div>

        {/* Mobile Controls & Hamburger Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground focus:outline-none p-1 rounded hover:bg-white/10 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-xl liquid-glass border border-border p-5 flex flex-col gap-4 animate-fade-in">
          {[
            { name: 'Properties', href: '/listings' },
            { name: 'Locations', href: '/#locations' },
            { name: 'Compare', href: '/compare' },
            { name: 'Contact', href: '/contact' }
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 border-b border-border pb-2"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/listings"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-primary text-primary-foreground text-center w-full py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition duration-300 mt-2 inline-flex items-center justify-center select-none cursor-pointer"
          >
            Browse Properties
          </Link>
        </div>
      )}
    </header>
  );
}

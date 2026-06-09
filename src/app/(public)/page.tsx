"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedHeading from '@/components/AnimatedHeading';
import FadeIn from '@/components/FadeIn';
import { Search, MapPin, Building2, MessageSquare } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = [];
    if (location) query.push(`location=${encodeURIComponent(location)}`);
    if (propertyType) query.push(`type=${encodeURIComponent(propertyType)}`);
    const queryString = query.length > 0 ? `?${query.join('&')}` : '';
    router.push(`/listings${queryString}`);
  };

  return (
    <div className="dark relative min-h-screen w-full overflow-hidden bg-black text-white select-none">
      {/* Cinematic Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
      />

      {/* Main Page Layout Wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end">
        
        {/* Hero Section Content */}
        <main className="flex-1 flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-20 pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-end">
            
            {/* Left Column: Heading, Subheading, Search & CTAs */}
            <div className="flex flex-col items-start max-w-2xl">
              
              {/* Primary Animated Heading */}
              <AnimatedHeading
                text={`Find your place\nin Pune.`}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 leading-tight font-light"
                charDelay={30}
                initialDelay={200}
                transitionDuration={500}
              />

              {/* Subheading Description */}
              <FadeIn delay={800} duration={1000}>
                <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed font-light max-w-xl">
                  Explore premium homes, apartments, and luxury villas in Pune's prime locations.
                </p>
              </FadeIn>

              {/* Glassmorphic Search Bar */}
              <FadeIn delay={1100} duration={1000} className="w-full mb-6">
                <form
                  onSubmit={handleSearch}
                  className="liquid-glass border border-border p-2.5 rounded-xl w-full flex flex-col sm:flex-row gap-2.5 items-center"
                >
                  {/* Location Selector */}
                  <div className="w-full sm:flex-1">
                    <Select value={location} onValueChange={(val) => setLocation(val || '')}>
                      <SelectTrigger className="w-full h-11 bg-white/5 border border-border hover:bg-white/10 focus-visible:border-white/25 text-foreground flex gap-2 items-center justify-between text-left px-3 py-2 rounded-lg [&>svg]:text-foreground cursor-pointer select-none">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <MapPin size={18} className="text-muted-foreground shrink-0" />
                          <SelectValue placeholder="Select Location" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border text-foreground rounded-lg backdrop-blur-lg w-full [&_svg]:text-foreground animate-in fade-in-0 duration-200">
                        <SelectItem value="baner">Baner</SelectItem>
                        <SelectItem value="koregaon-park">Koregaon Park</SelectItem>
                        <SelectItem value="kalyani-nagar">Kalyani Nagar</SelectItem>
                        <SelectItem value="hinjawadi">Hinjawadi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Type Selector */}
                  <div className="w-full sm:flex-1">
                    <Select value={propertyType} onValueChange={(val) => setPropertyType(val || '')}>
                      <SelectTrigger className="w-full h-11 bg-white/5 border border-border hover:bg-white/10 focus-visible:border-white/25 text-foreground flex gap-2 items-center justify-between text-left px-3 py-2 rounded-lg [&>svg]:text-foreground cursor-pointer select-none">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Building2 size={18} className="text-muted-foreground shrink-0" />
                          <SelectValue placeholder="Property Type" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border text-foreground rounded-lg backdrop-blur-lg w-full [&_svg]:text-foreground animate-in fade-in-0 duration-200">
                        <SelectItem value="apartment">Apartments</SelectItem>
                        <SelectItem value="villa">Villas</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search CTA */}
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold text-sm px-6 h-11 rounded-lg hover:opacity-90 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Search size={16} />
                    <span>Search</span>
                  </Button>
                </form>
              </FadeIn>

              {/* Action Buttons */}
              <FadeIn delay={1300} duration={1000}>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="/listings"
                    className="bg-primary text-primary-foreground px-8 h-11 rounded-lg font-medium text-sm hover:opacity-90 active:scale-95 transition-all duration-300 inline-flex items-center justify-center select-none cursor-pointer"
                  >
                    Browse Listings
                  </a>
                  <a
                    href="/contact"
                    className="liquid-glass border border-border text-foreground px-8 h-11 rounded-lg font-medium text-sm hover:bg-foreground hover:text-background active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2 select-none cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    <span>Contact Agent</span>
                  </a>
                </div>
              </FadeIn>

            </div>

            {/* Right Column: Glass Card Tagline Badge */}
            <div className="flex items-end justify-start lg:justify-end shrink-0">
              <FadeIn delay={1500} duration={1000}>
                <div className="liquid-glass border border-white/10 px-8 py-4 rounded-2xl flex items-center justify-center">
                  <span className="text-lg md:text-xl lg:text-2xl font-light tracking-wide text-gray-200">
                    Apartments · Villas · Commercial
                  </span>
                </div>
              </FadeIn>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

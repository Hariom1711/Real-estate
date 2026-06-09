"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Building2, Eye, GitCompare, RefreshCcw } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from '@/lib/utils';

interface Location {
  id: string;
  name: string;
}

interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  bhk: number;
  price: number;
  area: number;
  floor: number | null;
  possessionDate: string | null;
  status: string;
  address: string;
  images: string;
  amenities: string;
  locationId: string;
  location: Location;
}

interface ListingsClientProps {
  initialProperties: any[];
  locations: Location[];
  initialParams: {
    location?: string;
    type?: string;
    bhk?: string;
    search?: string;
  };
}



export default function ListingsClient({
  initialProperties,
  locations,
  initialParams,
}: ListingsClientProps) {
  // Filter States
  const [search, setSearch] = useState(initialParams.search || '');
  const [selectedLocation, setSelectedLocation] = useState(initialParams.location || '');
  const [selectedType, setSelectedType] = useState(initialParams.type || '');
  const [selectedBhk, setSelectedBhk] = useState(initialParams.bhk || '');
  const [maxPrice, setMaxPrice] = useState<number>(50000000); // 5 Cr default max

  // Comparison State (max 2 properties)
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return initialProperties.filter((item: Property) => {
      // Search text
      if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && 
          !item.description.toLowerCase().includes(search.toLowerCase()) &&
          !item.address.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Location
      if (selectedLocation) {
        // Match either location ID (from select) or location name (from hero search fallback)
        const normSelected = selectedLocation.toLowerCase().replace(/-/g, ' ');
        const normItemLoc = item.location.name.toLowerCase().replace(/-/g, ' ');
        if (
          item.locationId !== selectedLocation &&
          normItemLoc !== normSelected &&
          !normItemLoc.includes(normSelected) &&
          !normSelected.includes(normItemLoc)
        ) {
          return false;
        }
      }
      // Type
      if (selectedType && item.type !== selectedType) {
        return false;
      }
      // BHK
      if (selectedBhk) {
        const bhkNum = parseInt(selectedBhk);
        if (bhkNum === 4) {
          if (item.bhk < 4) return false;
        } else if (item.bhk !== bhkNum) {
          return false;
        }
      }
      // Price
      if (item.price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [initialProperties, search, selectedLocation, selectedType, selectedBhk, maxPrice]);

  const handleCompareCheck = (id: string, checked: boolean) => {
    if (checked) {
      if (comparedIds.length >= 2) {
        alert("You can compare a maximum of 2 properties at a time.");
        return;
      }
      setComparedIds(prev => [...prev, id]);
    } else {
      setComparedIds(prev => prev.filter(item => item !== id));
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedLocation('');
    setSelectedType('');
    setSelectedBhk('');
    setMaxPrice(50000000);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter Sidebar */}
        <aside className="lg:col-span-1 liquid-glass border border-white/10 rounded-2xl p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Filters</h2>
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition"
            >
              <RefreshCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Search Input */}
            <div>
              <label className="text-xs text-gray-400 block mb-2 font-medium">Search Keyword</label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Luxury, Baner, Modular"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-xs text-gray-400 block mb-2 font-medium">Area / Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:border-white/20 h-10"
              >
                <option value="" className="bg-black">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-black">
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="text-xs text-gray-400 block mb-2 font-medium">Property Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:border-white/20 h-10"
              >
                <option value="" className="bg-black">All Types</option>
                <option value="apartment" className="bg-black">Apartment</option>
                <option value="villa" className="bg-black">Villa</option>
                <option value="commercial" className="bg-black">Commercial</option>
              </select>
            </div>

            {/* BHK Filter */}
            <div>
              <label className="text-xs text-gray-400 block mb-2 font-medium">BHK / Bedrooms</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "All", value: "" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" },
                  { label: "4+", value: "4" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setSelectedBhk(item.value)}
                    className={`h-9 rounded-lg text-xs font-semibold border transition ${
                      selectedBhk === item.value
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white border-white/10 hover:border-white/25"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-400 font-medium">Max Budget</label>
                <span className="text-xs font-semibold text-white">
                  {maxPrice === 50000000 ? "No Max Limit" : formatPrice(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={5000000} // 50 L
                max={50000000} // 5 Cr
                step={1000000} // 10 L
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>₹50 Lakh</span>
                <span>₹5 Crore</span>
              </div>
            </div>

          </div>
        </aside>

        {/* Right Side: Properties Grid */}
        <section className="lg:col-span-3">
          {filteredProperties.length === 0 ? (
            <div className="liquid-glass border border-white/10 rounded-2xl p-12 text-center">
              <Building2 className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-white mb-2">No Properties Found</h3>
              <p className="text-sm text-gray-400 font-light max-w-md mx-auto">
                We couldn't find any listings matching your selected filters. Try broadening your criteria or reset the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.map((property: Property) => {
                const imageUrl = property.images.split(',')[0] || '';
                const isCompared = comparedIds.includes(property.id);

                return (
                  <div
                    key={property.id}
                    className="liquid-glass border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-white/25 transition duration-300"
                  >
                    {/* Property Image Container */}
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-900 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase text-white">
                        {property.type}
                      </div>
                      
                      {/* Compare Checkbox Indicator */}
                      <label className="absolute top-4 right-4 cursor-pointer select-none bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-lg hover:bg-black/80 transition flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={(e) => handleCompareCheck(property.id, e.target.checked)}
                          className="w-3.5 h-3.5 accent-white rounded border-white/10 bg-transparent cursor-pointer"
                        />
                        <span className="text-[10px] text-white font-medium">Compare</span>
                      </label>
                    </div>

                    {/* Property Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                          <MapPin size={12} />
                          <span className="font-light">{property.location.name}</span>
                        </div>
                        <h3 className="text-base font-semibold text-white leading-tight mb-2 group-hover:text-gray-300 transition duration-300">
                          {property.title}
                        </h3>
                        <p className="text-xs text-gray-400 font-light line-clamp-2 mb-4 leading-relaxed">
                          {property.description}
                        </p>
                      </div>

                      <div>
                        {/* Specs Strip */}
                        <div className="flex items-center gap-4 text-xs text-gray-300 border-t border-white/5 pt-4 mb-4 font-light">
                          {property.bhk > 0 && (
                            <span>{property.bhk} BHK</span>
                          )}
                          <span>{property.area} sqft</span>
                          <span className="text-gray-500 capitalize">{property.status}</span>
                        </div>

                        {/* Price + Detail Button */}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-white">
                            {formatPrice(property.price)}
                          </span>
                          <Link
                            href={`/property/${property.slug}`}
                            className="bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white hover:text-black active:scale-95 transition-all duration-300 flex items-center gap-1"
                          >
                            <Eye size={12} />
                            <span>View Details</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* Floating Comparison Drawer */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl animate-slide-up">
          <div className="liquid-glass border border-white/20 px-6 py-4 rounded-2xl flex items-center justify-between shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg text-white">
                <GitCompare size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Compare Properties</h4>
                <p className="text-[10px] text-gray-400 font-light">
                  {comparedIds.length === 1
                    ? "Select 1 more property to compare side-by-side"
                    : "Ready to compare properties side-by-side"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setComparedIds([])}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                Clear
              </button>
              
              {comparedIds.length < 2 ? (
                <span className="bg-white/50 text-black/50 px-4 h-9 rounded-lg text-xs font-semibold flex items-center justify-center select-none cursor-not-allowed opacity-50">
                  Compare ({comparedIds.length}/2)
                </span>
              ) : (
                <Link
                  href={`/compare?id1=${comparedIds[0]}&id2=${comparedIds[1] || ''}`}
                  className="bg-white text-black hover:bg-gray-200 active:scale-95 text-xs font-semibold px-4 h-9 rounded-lg inline-flex items-center justify-center select-none cursor-pointer"
                >
                  Compare ({comparedIds.length}/2)
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

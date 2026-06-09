import { getPropertyBySlug, getProperties } from "@/actions/property.actions";
import { notFound } from "next/navigation";
import PropertyGallery from "./PropertyGallery";
import EMICalculator from "./EMICalculator";
import EnquiryForm from "./EnquiryForm";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { MapPin, Building, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamic Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found | Pune Realty",
    };
  }

  return {
    title: `${property.title} | Pune Realty`,
    description: property.description.substring(0, 160),
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Fetch similar properties (same type, excluding current property, max 3)
  const allProperties = await getProperties({ type: property.type });
  const similarProperties = allProperties
    .filter(p => p.id !== property.id)
    .slice(0, 3);

  const imagesList = property.images.split(",").map(url => url.trim());
  const amenitiesList = property.amenities.split(",").map(name => name.trim());

  return (
    <main className="flex-1 min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition font-light select-none"
        >
          <ArrowLeft size={16} />
          <span>Back to listings</span>
        </Link>

        {/* Header Title & Location */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-white">
              {property.type}
            </span>
            <span className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-green-400">
              {property.status}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
            {property.title}
          </h1>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-3 font-light">
            <MapPin size={16} />
            <span>{property.address}</span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-10">
          <PropertyGallery images={imagesList} />
        </div>

        {/* 2-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left 2 Columns: Description, Specs, Amenities, Map */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            
            {/* Overview Card */}
            <section className="liquid-glass border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-gray-400" />
                <span>Overview</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                {property.bhk > 0 && (
                  <div className="border-r border-white/5 pr-4">
                    <span className="text-xs text-gray-500 block mb-1">Configuration</span>
                    <span className="text-lg font-bold text-white">{property.bhk} BHK</span>
                  </div>
                )}
                <div className="border-r border-white/5 pr-4">
                  <span className="text-xs text-gray-500 block mb-1">Super Area</span>
                  <span className="text-lg font-bold text-white">{property.area} sqft</span>
                </div>
                {property.floor && (
                  <div className="border-r border-white/5 pr-4">
                    <span className="text-xs text-gray-500 block mb-1">Floor</span>
                    <span className="text-lg font-bold text-white">{property.floor}th of 15</span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Possession</span>
                  <span className="text-lg font-bold text-white">{property.possessionDate || "Ready"}</span>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="liquid-glass border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 text-white">Description</h2>
              <p className="text-sm text-gray-300 font-light leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </section>

            {/* Amenities Checklist */}
            <section className="liquid-glass border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-white">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-gray-300 font-light">
                    <ShieldCheck size={16} className="text-white shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* EMI Calculator */}
            <section className="liquid-glass border border-white/10 rounded-2xl p-6 md:p-8">
              <EMICalculator propertyPrice={property.price} />
            </section>

            {/* Map Embed */}
            {property.mapsUrl && (
              <section className="liquid-glass border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6 text-white">Location Map</h2>
                <div className="w-full h-80 rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
                  <iframe
                    src={property.mapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Property Location Map"
                  />
                </div>
              </section>
            )}

          </div>

          {/* Right 1 Column: Sticky Price & Enquiry Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-32 flex flex-col gap-6">
            
            {/* Price Box */}
            <div className="liquid-glass border border-white/10 rounded-2xl p-6 text-center">
              <span className="text-xs text-gray-400 block mb-1">Asking Price</span>
              <span className="text-3xl font-extrabold text-white">
                {formatPrice(property.price)}
              </span>
              <span className="text-[11px] text-gray-500 block mt-2 font-light">
                Approx. ₹{Math.round(property.price / property.area)} per sqft
              </span>
            </div>

            {/* Lead Enquiry Form */}
            <EnquiryForm
              propertyId={property.id}
              propertyTitle={property.title}
              whatsappText={property.whatsappText}
              whatsappNo="919876543210" // Default admin whatsapp
            />

          </div>

        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-semibold mb-8 text-white">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((item) => {
                const cover = item.images.split(",")[0] || "";
                return (
                  <Link
                    key={item.id}
                    href={`/property/${item.slug}`}
                    className="liquid-glass border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-white/25 transition duration-300"
                  >
                    <div className="relative h-44 bg-zinc-900 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 block mb-1">{item.location.name}</span>
                        <h4 className="text-sm font-semibold text-white group-hover:text-gray-300 transition line-clamp-1">
                          {item.title}
                        </h4>
                      </div>
                      <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-3">
                        <span className="text-xs font-light text-gray-400">{item.area} sqft</span>
                        <span className="text-sm font-bold text-white">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertySchema } from "@/lib/validations";
import { createProperty, updateProperty } from "@/actions/property.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save, AlertTriangle, Eye } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

type PropertyFormValues = z.infer<typeof PropertySchema>;

interface Location {
  id: string;
  name: string;
}

interface PropertyFormProps {
  property?: any; // If provided, we are in Edit Mode
  locations: Location[];
}

export default function PropertyForm({ property, locations }: PropertyFormProps) {
  const router = useRouter();
  const isEditMode = !!property;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: Partial<PropertyFormValues> = property
    ? {
        title: property.title,
        description: property.description,
        type: property.type as any,
        bhk: property.bhk,
        price: property.price,
        area: property.area,
        floor: property.floor || undefined,
        possessionDate: property.possessionDate || undefined,
        status: property.status as any,
        featured: property.featured,
        address: property.address,
        mapsUrl: property.mapsUrl || undefined,
        whatsappText: property.whatsappText || undefined,
        images: property.images,
        amenities: property.amenities,
        locationId: property.locationId,
      }
    : {
        type: "apartment",
        bhk: 2,
        status: "available",
        featured: false,
        floor: undefined,
        possessionDate: "",
        mapsUrl: "",
        whatsappText: "",
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(PropertySchema) as any,
    defaultValues,
  });

  const onSubmit = async (data: PropertyFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      let res;
      if (isEditMode) {
        res = await updateProperty(property.id, data);
      } else {
        res = await createProperty(data);
      }

      if (res.success) {
        router.refresh();
        router.push("/admin/properties");
      } else {
        setError(res.error || "Failed to save property. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Form submit error:", err);
      setError("An unexpected error occurred. Please check database connectivity.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="liquid-glass border-white/10 bg-transparent text-white shadow-xl backdrop-blur-md">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          
          {/* Server Side Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-3 rounded-lg flex items-start gap-2 animate-in fade-in duration-200">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Basic Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-white/5 pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Property Title
                </label>
                <Input
                  {...register("title")}
                  placeholder="e.g. 3 BHK Ultra-Luxury Skyline Apartment"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                />
                {errors.title && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.title.message}</span>
                )}
              </div>

              {/* Location Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Area / Location
                </label>
                <select
                  {...register("locationId")}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:border-white/20 h-10"
                >
                  <option value="" className="bg-black">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id} className="bg-black">
                      {loc.name}
                    </option>
                  ))}
                </select>
                {errors.locationId && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.locationId.message}</span>
                )}
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Detailed Address
                </label>
                <Input
                  {...register("address")}
                  placeholder="e.g. Row House 12, Baner-Balewadi Link Rd, Pune"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                />
                {errors.address && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.address.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section: Specifications */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-white/5 pb-2">
              Specifications
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {/* Property Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Property Type
                </label>
                <select
                  {...register("type")}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:border-white/20 h-10"
                >
                  <option value="apartment" className="bg-black">Apartment</option>
                  <option value="villa" className="bg-black">Villa</option>
                  <option value="commercial" className="bg-black">Commercial</option>
                </select>
                {errors.type && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.type.message}</span>
                )}
              </div>

              {/* BHK Bedrooms */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  BHK / Bedrooms
                </label>
                <Input
                  type="number"
                  {...register("bhk")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                />
                {errors.bhk && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.bhk.message}</span>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Asking Price (INR)
                </label>
                <Input
                  type="number"
                  {...register("price")}
                  placeholder="e.g. 15000000 for 1.5 Cr"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                />
                {errors.price && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.price.message}</span>
                )}
              </div>

              {/* Super Area */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Super Area (sqft)
                </label>
                <Input
                  type="number"
                  {...register("area")}
                  placeholder="e.g. 1850"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                />
                {errors.area && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.area.message}</span>
                )}
              </div>

              {/* Floor Index */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Floor (Optional)
                </label>
                <Input
                  type="number"
                  {...register("floor")}
                  placeholder="e.g. 8"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                />
                {errors.floor && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.floor.message}</span>
                )}
              </div>

              {/* Possession Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Possession Date
                </label>
                <Input
                  {...register("possessionDate")}
                  placeholder="e.g. Dec 2026 or Ready"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                />
                {errors.possessionDate && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.possessionDate.message}</span>
                )}
              </div>

              {/* Listing Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Listing Status
                </label>
                <select
                  {...register("status")}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:border-white/20 h-10"
                >
                  <option value="available" className="bg-black">Available</option>
                  <option value="booked" className="bg-black">Booked</option>
                  <option value="sold" className="bg-black">Sold</option>
                </select>
                {errors.status && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.status.message}</span>
                )}
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-2.5 h-10 mt-6 select-none cursor-pointer pl-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...register("featured")}
                  className="w-4 h-4 accent-white rounded border-white/10 bg-transparent cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs font-semibold text-gray-300 cursor-pointer select-none">
                  Promote on Homepage
                </label>
              </div>
            </div>
          </div>

          {/* Section: Media & Extras */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-white/5 pb-2">
              Media & Integrations
            </h3>

            <div className="flex flex-col gap-5">
              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Property Description
                </label>
                <Textarea
                  {...register("description")}
                  placeholder="Provide an attractive, detailed property overview..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 w-full"
                />
                {errors.description && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.description.message}</span>
                )}
              </div>

              {/* Images (Comma Separated) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Images (Comma-separated URLs)
                </label>
                <Textarea
                  {...register("images")}
                  placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
                  rows={2}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 w-full font-mono text-[11px]"
                />
                {errors.images && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.images.message}</span>
                )}
              </div>

              {/* Amenities */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Amenities (Comma-separated list)
                </label>
                <Input
                  {...register("amenities")}
                  placeholder="Swimming Pool, Club House, 24/7 Security, Modular Kitchen, Balcony"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                />
                {errors.amenities && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.amenities.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Maps Embed */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Google Maps embed URL (Optional)
                  </label>
                  <Input
                    {...register("mapsUrl")}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full text-xs"
                  />
                  {errors.mapsUrl && (
                    <span className="text-[10px] text-red-400 mt-0.5">{errors.mapsUrl.message}</span>
                  )}
                </div>

                {/* WhatsApp Pre-filled text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    WhatsApp Pre-filled message (Optional)
                  </label>
                  <Input
                    {...register("whatsappText")}
                    placeholder="Hi, I am interested in this luxury apartment..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                  />
                  {errors.whatsappText && (
                    <span className="text-[10px] text-red-400 mt-0.5">{errors.whatsappText.message}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center gap-4 justify-end border-t border-white/5 pt-6 mt-2">
            <Link
              href="/admin/properties"
              className="bg-white/5 border border-white/5 text-gray-300 px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-white/10 hover:text-white transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black font-semibold text-xs px-6 h-10 rounded-lg hover:bg-gray-200 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              <span>{isLoading ? "Saving Listing..." : isEditMode ? "Update Listing" : "Save Listing"}</span>
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}

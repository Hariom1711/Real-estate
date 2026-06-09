"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Star, 
  Edit3, 
  Trash2, 
  Eye, 
  FilterX
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  toggleFeatured, 
  updatePropertyStatus, 
  deleteProperty 
} from "@/actions/property.actions";
import { formatPrice } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
}

interface Property {
  id: string;
  title: string;
  slug: string;
  type: string;
  bhk: number;
  price: number;
  area: number;
  status: string;
  featured: boolean;
  images: string;
  locationId: string;
  location: Location;
}

interface PropertiesTableClientProps {
  initialProperties: any[];
  locations: Location[];
}

export default function PropertiesTableClient({ 
  initialProperties, 
  locations 
}: PropertiesTableClientProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // client filter logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Search title or address
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Location
      if (selectedLocation && p.locationId !== selectedLocation) {
        return false;
      }
      // Status
      if (selectedStatus && p.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [properties, search, selectedLocation, selectedStatus]);

  // Featured server action trigger
  const handleFeaturedToggle = async (id: string, currentFeatured: boolean) => {
    // Optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !currentFeatured } : p))
    );

    const res = await toggleFeatured(id, currentFeatured);
    if (!res.success) {
      // Revert if error
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: currentFeatured } : p))
      );
      alert(res.error || "Failed to update featured state");
    }
  };

  // Status server action trigger
  const handleStatusChange = async (id: string, newStatus: string) => {
    const originalStatus = properties.find((p) => p.id === id)?.status || "available";
    // Optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    const res = await updatePropertyStatus(id, newStatus);
    if (!res.success) {
      // Revert if error
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: originalStatus } : p))
      );
      alert(res.error || "Failed to update status");
    }
  };

  // Delete server action trigger
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this property? This will also purge associated leads.")) {
      const res = await deleteProperty(id);
      if (res.success) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(res.error || "Failed to delete property");
      }
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedLocation("");
    setSelectedStatus("");
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Filtering Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
          />
        </div>

        {/* Location Dropdown */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:border-white/20 h-10 w-full"
        >
          <option value="" className="bg-black">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id} className="bg-black">
              {loc.name}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:border-white/20 h-10 w-full"
        >
          <option value="" className="bg-black">All Statuses</option>
          <option value="available" className="bg-black">Available</option>
          <option value="booked" className="bg-black">Booked</option>
          <option value="sold" className="bg-black">Sold</option>
        </select>

        {/* Clear filters trigger */}
        {(search || selectedLocation || selectedStatus) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 justify-center hover:text-white text-gray-400 text-xs font-semibold cursor-pointer select-none py-2 border border-dashed border-white/10 hover:border-white/20 rounded-lg transition h-10 w-full"
          >
            <FilterX size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Datatable */}
      <div className="liquid-glass border border-white/10 rounded-2xl overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="border-b border-white/10 hover:bg-transparent">
              <TableHead className="w-[10%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Image</TableHead>
              <TableHead className="w-[30%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Property Title</TableHead>
              <TableHead className="w-[15%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Location</TableHead>
              <TableHead className="w-[12%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Price</TableHead>
              <TableHead className="w-[10%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4 text-center">Featured</TableHead>
              <TableHead className="w-[13%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Status</TableHead>
              <TableHead className="w-[10%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="text-center p-12 text-gray-500 font-light">
                  No properties found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((p) => {
                const cover = p.images.split(",")[0] || "";
                return (
                  <TableRow key={p.id} className="border-b border-white/5 hover:bg-white/5 transition duration-200">
                    {/* Image */}
                    <TableCell className="p-4">
                      <div className="h-10 w-16 bg-zinc-900 rounded-lg overflow-hidden border border-white/5 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cover}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>

                    {/* Title */}
                    <TableCell className="p-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white leading-tight">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-1 capitalize font-medium">
                          {p.bhk > 0 ? `${p.bhk} BHK · ` : ""}{p.type} · {p.area} sqft
                        </span>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="p-4">
                      <div className="flex items-center gap-1 text-gray-400 text-xs font-light">
                        <MapPin size={12} className="shrink-0 text-gray-500" />
                        <span>{p.location.name}</span>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="p-4">
                      <span className="text-xs font-bold text-gray-200">
                        {formatPrice(p.price)}
                      </span>
                    </TableCell>

                    {/* Featured Star toggle */}
                    <TableCell className="p-4 text-center">
                      <button
                        onClick={() => handleFeaturedToggle(p.id, p.featured)}
                        className={`p-1.5 rounded-lg border transition select-none cursor-pointer ${
                          p.featured
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-white/5 border-white/5 text-gray-500 hover:text-white"
                        }`}
                      >
                        <Star size={14} className={p.featured ? "fill-amber-400" : ""} />
                      </button>
                    </TableCell>

                    {/* Status Dropdown */}
                    <TableCell className="p-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className={`text-[11px] font-bold uppercase rounded-lg border px-2 py-1 outline-none cursor-pointer bg-black ${
                          p.status === "available"
                            ? "border-green-500/30 text-green-400"
                            : p.status === "booked"
                            ? "border-blue-500/30 text-blue-400"
                            : "border-red-500/30 text-red-400"
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="booked">Booked</option>
                        <option value="sold">Sold</option>
                      </select>
                    </TableCell>

                    {/* Action buttons */}
                    <TableCell className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/property/${p.slug}`}
                          target="_blank"
                          className="bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-lg transition active:scale-95 cursor-pointer"
                          title="View on site"
                        >
                          <Eye size={12} />
                        </Link>
                        <Link
                          href={`/admin/properties/${p.id}/edit`}
                          className="bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-lg transition active:scale-95 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={12} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 p-2 rounded-lg transition active:scale-95 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

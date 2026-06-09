import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Check, X, GitCompare } from "lucide-react";

interface ComparePageProps {
  searchParams: Promise<{
    id1?: string;
    id2?: string;
  }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const resolvedParams = await searchParams;
  const { id1, id2 } = resolvedParams;

  // Fetch properties from database if provided
  const prop1 = id1
    ? await prisma.property.findUnique({
        where: { id: id1 },
        include: { location: true },
      })
    : null;

  const prop2 = id2
    ? await prisma.property.findUnique({
        where: { id: id2 },
        include: { location: true },
      })
    : null;

  // Build a master amenities list from both properties
  const amenitiesSet = new Set<string>();
  if (prop1) prop1.amenities.split(",").forEach(a => amenitiesSet.add(a.trim()));
  if (prop2) prop2.amenities.split(",").forEach(a => amenitiesSet.add(a.trim()));
  const allAmenities = Array.from(amenitiesSet);

  const hasData = prop1 || prop2;

  return (
    <main className="flex-1 min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 lg:px-16 text-white select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition font-light"
        >
          <ArrowLeft size={16} />
          <span>Back to listings</span>
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-2 font-sans">
          <GitCompare size={28} className="text-gray-400" />
          <span>Compare Properties</span>
        </h1>
        <p className="text-sm text-gray-400 mb-10 font-light">
          Compare specifications, prices, and amenities side-by-side to make the best choice.
        </p>

        {!hasData ? (
          <div className="liquid-glass border border-white/10 rounded-2xl p-12 text-center">
            <X className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-white mb-2">No Properties Selected</h3>
            <p className="text-sm text-gray-400 font-light max-w-md mx-auto mb-6">
              Go back to our listings page and check the "Compare" checkbox on up to 2 properties.
            </p>
            <Link
              href="/listings"
              className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 active:scale-95 transition-all duration-300"
            >
              Go to Listings
            </Link>
          </div>
        ) : (
          <div className="liquid-glass border border-white/10 rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 w-[30%] text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Specification
                  </th>
                  <th className="p-4 w-[35%] text-base font-bold text-white">
                    {prop1 ? prop1.title : "Select Property 1"}
                  </th>
                  <th className="p-4 w-[35%] text-base font-bold text-white">
                    {prop2 ? prop2.title : "Select Property 2"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Images */}
                <tr className="border-b border-white/5">
                  <td className="p-4 font-medium text-gray-400">Preview</td>
                  <td className="p-4">
                    {prop1 ? (
                      <div className="h-32 w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prop1.images.split(",")[0]}
                          alt={prop1.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-4">
                    {prop2 ? (
                      <div className="h-32 w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prop2.images.split(",")[0]}
                          alt={prop2.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>

                {/* Price */}
                <tr className="border-b border-white/5">
                  <td className="p-4 font-medium text-gray-400">Price</td>
                  <td className={`p-4 font-bold ${prop1 && prop2 && prop1.price < prop2.price ? "text-green-400" : ""}`}>
                    {prop1 ? formatPrice(prop1.price) : "-"}
                  </td>
                  <td className={`p-4 font-bold ${prop1 && prop2 && prop2.price < prop1.price ? "text-green-400" : ""}`}>
                    {prop2 ? formatPrice(prop2.price) : "-"}
                  </td>
                </tr>

                {/* Area */}
                <tr className="border-b border-white/5">
                  <td className="p-4 font-medium text-gray-400">Super Area</td>
                  <td className="p-4">{prop1 ? `${prop1.area} sqft` : "-"}</td>
                  <td className="p-4">{prop2 ? `${prop2.area} sqft` : "-"}</td>
                </tr>

                {/* Price per sqft */}
                <tr className="border-b border-white/5">
                  <td className="p-4 font-medium text-gray-400">Price per sqft</td>
                  <td className="p-4">
                    {prop1 ? `₹${Math.round(prop1.price / prop1.area)}` : "-"}
                  </td>
                  <td className="p-4">
                    {prop2 ? `₹${Math.round(prop2.price / prop2.area)}` : "-"}
                  </td>
                </tr>

                {/* Location */}
                <tr className="border-b border-white/5">
                  <td className="p-4 font-medium text-gray-400">Location</td>
                  <td className="p-4">{prop1 ? prop1.location.name : "-"}</td>
                  <td className="p-4">{prop2 ? prop2.location.name : "-"}</td>
                </tr>

                {/* Configuration */}
                <tr className="border-b border-white/5">
                  <td className="p-4 font-medium text-gray-400">Configuration</td>
                  <td className="p-4">{prop1 ? `${prop1.bhk} BHK` : "-"}</td>
                  <td className="p-4">{prop2 ? `${prop2.bhk} BHK` : "-"}</td>
                </tr>

                {/* Possession Date */}
                <tr className="border-b border-white/5">
                  <td className="p-4 font-medium text-gray-400">Possession</td>
                  <td className="p-4">{prop1 ? (prop1.possessionDate || "Ready") : "-"}</td>
                  <td className="p-4">{prop2 ? (prop2.possessionDate || "Ready") : "-"}</td>
                </tr>

                {/* Status */}
                <tr className="border-b border-white/5">
                  <td className="p-4 font-medium text-gray-400">Status</td>
                  <td className="p-4 capitalize">{prop1 ? prop1.status : "-"}</td>
                  <td className="p-4 capitalize">{prop2 ? prop2.status : "-"}</td>
                </tr>

                {/* Amenities checklist header */}
                <tr className="bg-white/5 font-semibold text-white">
                  <td className="p-4" colSpan={3}>
                    Amenities Comparison
                  </td>
                </tr>

                {/* Render amenities checklists */}
                {allAmenities.map((amenity) => {
                  const hasProp1 = prop1?.amenities.split(",").map(a => a.trim().toLowerCase()).includes(amenity.toLowerCase());
                  const hasProp2 = prop2?.amenities.split(",").map(a => a.trim().toLowerCase()).includes(amenity.toLowerCase());

                  return (
                    <tr key={amenity} className="border-b border-white/5">
                      <td className="p-4 font-medium text-gray-400">{amenity}</td>
                      <td className="p-4">
                        {hasProp1 ? (
                          <Check className="text-green-400" size={18} />
                        ) : (
                          <X className="text-red-400" size={18} />
                        )}
                      </td>
                      <td className="p-4">
                        {hasProp2 ? (
                          <Check className="text-green-400" size={18} />
                        ) : (
                          <X className="text-red-400" size={18} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  );
}

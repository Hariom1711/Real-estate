import { getProperties } from "@/actions/property.actions";
import { getLocations } from "@/actions/location.actions";
import PropertiesTableClient from "./PropertiesTableClient";
import Link from "next/link";
import { Plus } from "lucide-react";

export const revalidate = 0; // Live properties listing updates

export default async function AdminPropertiesPage() {
  const [properties, locations] = await Promise.all([
    getProperties(),
    getLocations(),
  ]);

  return (
    <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Manage Properties
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Create, update, toggle featured state, or archive property listings.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="bg-white text-black font-semibold text-xs px-4 h-10 rounded-lg hover:bg-gray-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <Plus size={16} />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Client-side search and interactive datatable wrapper */}
      <PropertiesTableClient initialProperties={properties} locations={locations} />
    </main>
  );
}

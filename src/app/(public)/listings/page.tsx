import { getProperties } from "@/actions/property.actions";
import { getLocations } from "@/actions/location.actions";
import ListingsClient from "./ListingsClient";

interface PageProps {
  searchParams: Promise<{
    location?: string;
    type?: string;
    bhk?: string;
    search?: string;
  }>;
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  // Fetch all properties and locations from server
  const properties = await getProperties();
  const locations = await getLocations();

  return (
    <main className="flex-1 min-h-screen bg-black pt-32 pb-16 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 font-sans">
          Explore Properties
        </h1>
        <p className="text-sm text-gray-400 mb-8 font-light">
          Find your dream home from our handpicked premium listings in Pune.
        </p>

        {/* Client-side Listings Wrapper with search, filter and compare */}
        <ListingsClient
          initialProperties={properties}
          locations={locations}
          initialParams={{
            location: resolvedParams.location || '',
            type: resolvedParams.type || '',
            bhk: resolvedParams.bhk || '',
            search: resolvedParams.search || '',
          }}
        />
      </div>
    </main>
  );
}

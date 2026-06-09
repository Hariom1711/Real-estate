import { getLocations } from "@/actions/location.actions";
import LocationsClient from "./LocationsClient";

export const revalidate = 0; // Live location listings

export default async function AdminLocationsPage() {
  const locations = await getLocations();

  return (
    <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 flex flex-col gap-8 max-w-5xl mx-auto w-full select-none">
      {/* Header Panel */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
          Manage Locations
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Set up geographic areas in Pune and configure their benchmark average pricing per sqft.
        </p>
      </div>

      {/* Interactive Locations Console client wrapper */}
      <LocationsClient initialLocations={locations} />
    </main>
  );
}

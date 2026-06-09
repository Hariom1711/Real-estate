import { getLocations } from "@/actions/location.actions";
import PropertyForm from "../PropertyForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 0; // Fresh locations always

export default async function NewPropertyPage() {
  const locations = await getLocations();

  return (
    <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 flex flex-col gap-8 max-w-4xl mx-auto w-full select-none">
      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition font-medium mb-3 select-none"
        >
          <ArrowLeft size={14} />
          <span>Back to properties list</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
          Add New Property
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Register a new luxury real estate listing to publish on Pune Realty.
        </p>
      </div>

      {/* Shared Form in Create Mode (no initial property) */}
      <PropertyForm locations={locations} />
    </main>
  );
}

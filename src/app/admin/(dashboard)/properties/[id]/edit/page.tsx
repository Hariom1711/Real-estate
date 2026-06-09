import prisma from "@/lib/prisma";
import { getLocations } from "@/actions/location.actions";
import PropertyForm from "../../PropertyForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 0; // Dynamic route fetching for edits

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;

  const [property, locations] = await Promise.all([
    prisma.property.findUnique({
      where: { id },
    }),
    getLocations(),
  ]);

  if (!property) {
    notFound();
  }

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
          Edit Property Listing
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Modify the specifications, pricing, media, and features for this property.
        </p>
      </div>

      {/* Shared Form in Edit Mode (has property initial data) */}
      <PropertyForm property={property} locations={locations} />
    </main>
  );
}

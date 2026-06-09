import { getLeads } from "@/actions/lead.actions";
import LeadsListClient from "./LeadsListClient";

export const revalidate = 0; // Live lead enquiries updates

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 flex flex-col gap-8 max-w-7xl mx-auto w-full select-none">
      {/* Header Panel */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
          Manage Enquiries
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Track buyer lead requests, read messages, and initiate direct communication.
        </p>
      </div>

      {/* Interactive Leads list client wrapper */}
      <LeadsListClient initialLeads={leads} />
    </main>
  );
}

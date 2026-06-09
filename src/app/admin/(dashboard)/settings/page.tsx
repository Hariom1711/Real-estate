import { getSettings } from "@/actions/settings.actions";
import SettingsFormClient from "./SettingsFormClient";
import { notFound } from "next/navigation";

export const revalidate = 0; // Live settings updates

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  if (!settings) {
    notFound();
  }

  return (
    <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 flex flex-col gap-8 max-w-3xl mx-auto w-full select-none">
      {/* Header Panel */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
          System Settings
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Configure branding, support numbers, landing metrics, and hero header texts.
        </p>
      </div>

      {/* Settings form client wrapper */}
      <SettingsFormClient settings={settings} />
    </main>
  );
}

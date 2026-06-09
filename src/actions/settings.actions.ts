"use server";

import prisma from "@/lib/prisma";
import { SettingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: "global" },
    });

    // Fallback if not seeded yet
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "global",
          companyName: "Pune Realty",
          phone: "+91 98765 43210",
          whatsappNo: "919876543210",
          officeAddress: "101, Luxury Chambers, Baner, Pune - 411045",
          heroHeadlineText: "Find your place\nin Pune.",
          statsProjects: 12,
          statsClients: 450,
          statsCities: 1,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null;
  }
}

export async function updateSettings(rawData: any) {
  try {
    const validated = SettingsSchema.parse(rawData);

    const settings = await prisma.settings.update({
      where: { id: "global" },
      data: validated,
    });

    revalidatePath("/");
    revalidatePath("/contact");
    return { success: true, settings };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}

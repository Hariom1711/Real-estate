"use server";

import prisma from "@/lib/prisma";
import { LocationSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getLocations() {
  try {
    return await prisma.location.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return [];
  }
}

export async function createLocation(rawData: any) {
  try {
    const validated = LocationSchema.parse(rawData);

    const location = await prisma.location.create({
      data: validated,
    });

    revalidatePath("/admin/locations");
    revalidatePath("/");
    revalidatePath("/listings");
    return { success: true, location };
  } catch (error: any) {
    console.error("Failed to create location:", error);
    return { success: false, error: error.message || "Failed to create location" };
  }
}

export async function updateLocation(id: string, rawData: any) {
  try {
    const validated = LocationSchema.parse(rawData);

    const location = await prisma.location.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/admin/locations");
    revalidatePath("/");
    revalidatePath("/listings");
    return { success: true, location };
  } catch (error: any) {
    console.error("Failed to update location:", error);
    return { success: false, error: error.message || "Failed to update location" };
  }
}

export async function deleteLocation(id: string) {
  try {
    const location = await prisma.location.delete({
      where: { id },
    });

    revalidatePath("/admin/locations");
    revalidatePath("/");
    revalidatePath("/listings");
    return { success: true, location };
  } catch (error: any) {
    console.error("Failed to delete location:", error);
    return { success: false, error: error.message };
  }
}

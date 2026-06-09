"use server";

import prisma from "@/lib/prisma";
import { PropertySchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getProperties(filters?: {
  type?: string;
  location?: string;
  bhk?: string;
  featured?: boolean;
  search?: string;
}) {
  try {
    const where: any = {};

    if (filters?.featured !== undefined) {
      where.featured = filters.featured;
    }
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.location) {
      where.locationId = filters.location; // Match by location UUID
    }
    if (filters?.bhk) {
      const bhkVal = parseInt(filters.bhk);
      if (!isNaN(bhkVal)) {
        where.bhk = bhkVal;
      }
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { address: { contains: filters.search } },
      ];
    }

    return await prisma.property.findMany({
      where,
      include: {
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return [];
  }
}

export async function getPropertyBySlug(slug: string) {
  try {
    return await prisma.property.findUnique({
      where: { slug },
      include: {
        location: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch property:", error);
    return null;
  }
}

export async function createProperty(rawData: any) {
  try {
    const validated = PropertySchema.parse(rawData);
    
    // Create simple slug from title
    const slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 6);

    const property = await prisma.property.create({
      data: {
        ...validated,
        slug,
      },
    });

    revalidatePath("/");
    revalidatePath("/listings");
    return { success: true, property };
  } catch (error: any) {
    console.error("Failed to create property:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function updateProperty(id: string, rawData: any) {
  try {
    const validated = PropertySchema.parse(rawData);
    
    const property = await prisma.property.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/");
    revalidatePath("/listings");
    revalidatePath(`/property/${property.slug}`);
    return { success: true, property };
  } catch (error: any) {
    console.error("Failed to update property:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function deleteProperty(id: string) {
  try {
    const property = await prisma.property.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/listings");
    return { success: true, property };
  } catch (error: any) {
    console.error("Failed to delete property:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function toggleFeatured(id: string, currentStatus: boolean) {
  try {
    const property = await prisma.property.update({
      where: { id },
      data: { featured: !currentStatus },
    });

    revalidatePath("/");
    revalidatePath("/listings");
    return { success: true, property };
  } catch (error: any) {
    console.error("Failed to toggle featured status:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePropertyStatus(id: string, status: string) {
  try {
    const property = await prisma.property.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/");
    revalidatePath("/listings");
    revalidatePath(`/property/${property.slug}`);
    return { success: true, property };
  } catch (error: any) {
    console.error("Failed to update status:", error);
    return { success: false, error: error.message };
  }
}

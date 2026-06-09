"use server";

import prisma from "@/lib/prisma";
import { LeadSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createLead(rawData: any) {
  try {
    const validated = LeadSchema.parse(rawData);

    const lead = await prisma.lead.create({
      data: validated,
    });

    revalidatePath("/admin/leads");
    return { success: true, lead };
  } catch (error: any) {
    console.error("Failed to create lead:", error);
    return { success: false, error: error.message || "Failed to submit enquiry" };
  }
}

export async function getLeads() {
  try {
    return await prisma.lead.findMany({
      include: {
        property: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return [];
  }
}

export async function deleteLead(id: string) {
  try {
    const lead = await prisma.lead.delete({
      where: { id },
    });

    revalidatePath("/admin/leads");
    return { success: true, lead };
  } catch (error: any) {
    console.error("Failed to delete lead:", error);
    return { success: false, error: error.message };
  }
}

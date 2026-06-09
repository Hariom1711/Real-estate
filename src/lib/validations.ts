import { z } from "zod";

export const PropertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["apartment", "villa", "commercial"]),
  bhk: z.coerce.number().int().nonnegative("BHK must be a non-negative integer"),
  price: z.coerce.number().positive("Price must be a positive number"),
  area: z.coerce.number().positive("Area must be a positive number in sqft"),
  floor: z.coerce.number().int().optional(),
  possessionDate: z.string().optional(),
  status: z.enum(["available", "booked", "sold"]).default("available"),
  featured: z.boolean().default(false),
  address: z.string().min(5, "Address must be at least 5 characters"),
  mapsUrl: z.string().url("Maps URL must be a valid URL").or(z.string().length(0)).optional(),
  whatsappText: z.string().optional(),
  images: z.string().min(1, "Please provide at least one image URL"),
  amenities: z.string().min(1, "Please provide at least one amenity"),
  locationId: z.string().uuid("Please select a valid location"),
});

export const LeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  propertyId: z.string().uuid("Associated property is required"),
});

export const LocationSchema = z.object({
  name: z.string().min(2, "Location name must be at least 2 characters"),
  avgPriceSqft: z.coerce.number().positive("Average price per sqft must be a positive number"),
});

export const SettingsSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  whatsappNo: z.string().min(10, "WhatsApp number must be at least 10 characters"),
  officeAddress: z.string().min(5, "Office address must be at least 5 characters"),
  heroHeadlineText: z.string().min(3, "Headline text must be at least 3 characters"),
  statsProjects: z.coerce.number().int().nonnegative(),
  statsClients: z.coerce.number().int().nonnegative(),
  statsCities: z.coerce.number().int().nonnegative(),
});

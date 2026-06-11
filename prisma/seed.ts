import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data (in order of relations)
  await prisma.lead.deleteMany();
  await prisma.property.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
  await prisma.settings.deleteMany();

  // 1. Create default admin settings
  await prisma.settings.create({
    data: {
      companyName: "Pune Realty",
      phone: "+91 98765 43210",
      whatsappNo: "919876543210",
      officeAddress: "101, Luxury Chambers, Baner, Pune - 411045",
      heroHeadlineText: "Find your place\nin Pune.",
      statsProjects: 12,
      statsClients: 450,
      statsCities: 1,
    }
  });

  // 2. Create default Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@punerealty.com',
      password: hashedPassword,
      name: 'Admin Manager',
    }
  });
  console.log(`Seeded admin user: ${admin.email}`);

  // 3. Create Locations
  const baner = await prisma.location.create({
    data: { name: 'Baner', avgPriceSqft: 8500 }
  });
  const koregaonPark = await prisma.location.create({
    data: { name: 'Koregaon Park', avgPriceSqft: 14500 }
  });
  const kalyaniNagar = await prisma.location.create({
    data: { name: 'Kalyani Nagar', avgPriceSqft: 12500 }
  });
  const hinjawadi = await prisma.location.create({
    data: { name: 'Hinjawadi', avgPriceSqft: 6800 }
  });
  console.log('Seeded locations.');

  // 4. Create Properties
  await prisma.property.create({
    data: {
      title: '3 BHK Luxury Apartment in Baner',
      slug: '3-bhk-luxury-apartment-in-baner',
      description: 'Sleek, modern 3 BHK apartment featuring glass balconies, state-of-the-art modular kitchen, smart home automation, and stunning views of the Baner hills.',
      type: 'apartment',
      bhk: 3,
      price: 12500000,
      area: 1650,
      floor: 12,
      possessionDate: 'Dec 2026',
      status: 'available',
      featured: true,
      address: 'Elite Heights, Baner Road, Baner, Pune',
      images: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600,https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600',
      amenities: 'Swimming Pool, Gymnasium, 24/7 Security, Club House, Power Backup, Smart Home',
      locationId: baner.id,
    }
  });

  await prisma.property.create({
    data: {
      title: 'Ultra-Premium 4 BHK Villa in Koregaon Park',
      slug: 'ultra-premium-4-bhk-villa-in-koregaon-park',
      description: 'An exquisite luxury villa in Koregaon Park\'s most exclusive gated community. Features a private pool, landscape garden, elevator, and Italian marble flooring.',
      type: 'villa',
      bhk: 4,
      price: 48000000,
      area: 4200,
      floor: 1,
      possessionDate: 'Ready to Move',
      status: 'available',
      featured: true,
      address: 'Lane 5, Koregaon Park, Pune',
      images: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600,https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=600',
      amenities: 'Private Pool, Landscape Garden, Elevator, Home Automation, Home Theater, 24/7 Security',
      locationId: koregaonPark.id,
    }
  });

  await prisma.property.create({
    data: {
      title: 'Commercial Office Space in Kalyani Nagar',
      slug: 'commercial-office-space-in-kalyani-nagar',
      description: 'Fully furnished grade-A corporate office space. Centrally air-conditioned, featuring 25 workstations, 2 conference rooms, and a pantry.',
      type: 'commercial',
      bhk: 0,
      price: 21000000,
      area: 2100,
      floor: 4,
      possessionDate: 'Ready to Move',
      status: 'available',
      featured: true,
      address: 'Cerebrum IT Park, Kalyani Nagar, Pune',
      images: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600,https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600',
      amenities: 'Central A/C, 24/7 Access, Lift, Conference Rooms, Cafeteria, Visitor Parking',
      locationId: kalyaniNagar.id,
    }
  });

  await prisma.property.create({
    data: {
      title: '2 BHK Smart Apartment in Hinjawadi',
      slug: '2-bhk-smart-apartment-in-hinjawadi',
      description: 'Compact 2 BHK apartment designed for IT professionals. Features solar heating, walking distance to major IT parks, and modular fittings.',
      type: 'apartment',
      bhk: 2,
      price: 7500000,
      area: 980,
      floor: 8,
      possessionDate: 'June 2027',
      status: 'available',
      featured: false,
      address: 'Phase 1, Hinjawadi, Pune',
      images: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600',
      amenities: 'Solar Heating, Lift, Security, Jogging Track, Gymnasium',
      locationId: hinjawadi.id,
    }
  });

  console.log('Seeded properties.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

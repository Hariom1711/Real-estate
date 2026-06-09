import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  Building2, 
  MessageSquare, 
  Sparkles, 
  Calendar, 
  Phone,
  MessageCircle,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export const revalidate = 0; // Force dynamic rendering for live metrics

export default async function AdminDashboardOverview() {
  // Execute database queries in parallel
  const [
    totalProperties,
    totalLeads,
    activeCount,
    featuredCount,
    recentLeads
  ] = await Promise.all([
    prisma.property.count(),
    prisma.lead.count(),
    prisma.property.count({ where: { status: "available" } }),
    prisma.property.count({ where: { featured: true } }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: {
            title: true,
            slug: true,
            price: true,
          },
        },
      },
    }),
  ]);

  const cards = [
    {
      title: "Total Listings",
      value: totalProperties,
      desc: `${activeCount} active on website`,
      icon: Building2,
      color: "text-blue-400",
    },
    {
      title: "Total Enquiries",
      value: totalLeads,
      desc: "All buyer leads captured",
      icon: MessageSquare,
      color: "text-green-400",
    },
    {
      title: "Featured Estates",
      value: featuredCount,
      desc: "Promoted on homepage",
      icon: Sparkles,
      color: "text-amber-400",
    },
    {
      title: "Active Builders",
      value: "4 Areas",
      desc: "Baner, KP, Kalyani, Hinjawadi",
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ];

  return (
    <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
          Dashboard Overview
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Real-time metrics and lead submission trackers for Pune Realty.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="liquid-glass border-white/10 bg-transparent text-white shadow-lg backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  {card.title}
                </span>
                <Icon className={card.color} size={18} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold tracking-tight">
                  {card.value}
                </div>
                <p className="text-[10px] text-gray-500 mt-1 font-medium">
                  {card.desc}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leads Table Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Recent Leads List (Takes 2 columns) */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-gray-400" />
              <span>Recent Enquiries</span>
            </h2>
            <Link
              href="/admin/leads"
              className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1.5 font-semibold"
            >
              <span>View all leads</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="liquid-glass border border-white/10 rounded-2xl p-10 text-center">
              <MessageSquare className="mx-auto text-gray-500 mb-4" size={40} />
              <h3 className="text-sm font-semibold text-white mb-1">No Leads Yet</h3>
              <p className="text-xs text-gray-400 font-light max-w-sm mx-auto">
                Incoming buyer enquiries from property detail pages will populate here automatically.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentLeads.map((lead) => {
                const dateStr = new Date(lead.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                
                // Construct whatsapp link
                const whatsappText = encodeURIComponent(
                  `Hello ${lead.name},\nThank you for reaching out regarding "${lead.property.title}". How can I assist you today?`
                );
                const whatsappLink = `https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${whatsappText}`;

                return (
                  <div
                    key={lead.id}
                    className="liquid-glass border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-white/20 transition duration-300"
                  >
                    <div className="flex flex-col gap-1.5 max-w-md">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white group-hover:text-gray-300 transition">
                          {lead.name}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 text-[10px] font-medium">
                          <Calendar size={10} />
                          <span>{dateStr}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 font-light line-clamp-1">
                        Enquired about:{" "}
                        <Link
                          href={`/property/${lead.property.slug}`}
                          target="_blank"
                          className="underline hover:text-white font-medium"
                        >
                          {lead.property.title}
                        </Link>{" "}
                        ({formatPrice(lead.property.price)})
                      </p>
                      <p className="text-xs text-gray-300 bg-white/5 border border-white/5 rounded-lg px-3 py-2 mt-1 italic font-light">
                        "{lead.message}"
                      </p>
                    </div>

                    {/* Quick Contacts Panel */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <a
                        href={`tel:${lead.phone}`}
                        className="bg-white/10 border border-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg transition active:scale-95 cursor-pointer"
                        title="Call Client"
                      >
                        <Phone size={14} />
                      </a>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        className="bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 p-2.5 rounded-lg transition active:scale-95 cursor-pointer"
                        title="WhatsApp Client"
                      >
                        <MessageCircle size={14} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right: Quick Settings & Quick Links */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Quick Controls</span>
          </h2>
          <Card className="liquid-glass border-white/10 bg-transparent text-white shadow-lg backdrop-blur-md p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Database Maintenance
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/admin/properties"
                className="bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-white hover:text-black transition flex items-center justify-between"
              >
                <span>Manage Properties</span>
                <ArrowRight size={12} />
              </Link>
              <Link
                href="/admin/locations"
                className="bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-white hover:text-black transition flex items-center justify-between"
              >
                <span>Manage Locations</span>
                <ArrowRight size={12} />
              </Link>
              <Link
                href="/admin/settings"
                className="bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-white hover:text-black transition flex items-center justify-between"
              >
                <span>Global System Settings</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="border-t border-white/5 pt-4 mt-2">
              <span className="text-[10px] text-gray-500 block">System Connection Status</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-gray-300">SQLite Connected</span>
              </div>
            </div>
          </Card>
        </section>

      </div>
    </main>
  );
}

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Trash2, 
  Phone, 
  MessageCircle, 
  Calendar,
  Building,
  FilterX
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { deleteLead } from "@/actions/lead.actions";

interface Property {
  title: string;
  slug: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  property: Property;
}

interface LeadsListClientProps {
  initialLeads: any[];
}

export default function LeadsListClient({ initialLeads }: LeadsListClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");

  // Filter client-side
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const s = search.toLowerCase();
      return (
        lead.name.toLowerCase().includes(s) ||
        lead.phone.includes(s) ||
        lead.property.title.toLowerCase().includes(s) ||
        lead.message.toLowerCase().includes(s)
      );
    });
  }, [leads, search]);

  // Delete Server Action trigger
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this enquiry? This action is permanent.")) {
      const res = await deleteLead(id);
      if (res.success) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
      } else {
        alert(res.error || "Failed to delete lead");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      
      {/* Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, property, phone, or text..."
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
          />
        </div>

        {search && (
          <button
            onClick={() => setSearch("")}
            className="flex items-center gap-1.5 justify-center hover:text-white text-gray-400 text-xs font-semibold cursor-pointer select-none py-2 px-3 border border-dashed border-white/10 hover:border-white/20 rounded-lg transition h-10"
          >
            <FilterX size={14} />
            <span>Clear Search</span>
          </button>
        )}
      </div>

      {/* Datatable */}
      <div className="liquid-glass border border-white/10 rounded-2xl overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="border-b border-white/10 hover:bg-transparent">
              <TableHead className="w-[18%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Client Name</TableHead>
              <TableHead className="w-[15%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Contact Phone</TableHead>
              <TableHead className="w-[22%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Interested Property</TableHead>
              <TableHead className="w-[25%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Enquiry Message</TableHead>
              <TableHead className="w-[10%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4">Date</TableHead>
              <TableHead className="w-[10%] text-[10px] font-semibold uppercase tracking-wider text-gray-500 p-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center p-12 text-gray-500 font-light">
                  No lead enquiries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => {
                const dateStr = new Date(lead.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                // Create prefilled WhatsApp text
                const whatsappText = encodeURIComponent(
                  `Hello ${lead.name},\nThank you for reaching out regarding "${lead.property.title}". How can I assist you further?`
                );
                const whatsappLink = `https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${whatsappText}`;

                return (
                  <TableRow key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition duration-200">
                    
                    {/* Client Name */}
                    <TableCell className="p-4 font-bold text-white">
                      {lead.name}
                    </TableCell>

                    {/* Contact Phone */}
                    <TableCell className="p-4">
                      <a 
                        href={`tel:${lead.phone}`} 
                        className="text-xs text-gray-300 hover:text-white underline font-light"
                      >
                        {lead.phone}
                      </a>
                    </TableCell>

                    {/* Property */}
                    <TableCell className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-200">
                        <Building size={12} className="text-gray-500 shrink-0" />
                        <Link
                          href={`/property/${lead.property.slug}`}
                          target="_blank"
                          className="hover:underline font-semibold leading-tight line-clamp-1"
                        >
                          {lead.property.title}
                        </Link>
                      </div>
                    </TableCell>

                    {/* Message */}
                    <TableCell className="p-4">
                      <p className="text-xs text-gray-300 bg-white/5 border border-white/5 rounded-lg px-3 py-2 italic font-light line-clamp-2 max-w-sm">
                        "{lead.message}"
                      </p>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="p-4">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                        <Calendar size={10} className="text-gray-500" />
                        <span>{dateStr}</span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${lead.phone}`}
                          className="bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-lg transition active:scale-95 cursor-pointer"
                          title="Call Client"
                        >
                          <Phone size={12} />
                        </a>
                        <a
                          href={whatsappLink}
                          target="_blank"
                          className="bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 hover:text-green-300 p-2 rounded-lg transition active:scale-95 cursor-pointer"
                          title="WhatsApp Client"
                        >
                          <MessageCircle size={12} />
                        </a>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 p-2 rounded-lg transition active:scale-95 cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </TableCell>

                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

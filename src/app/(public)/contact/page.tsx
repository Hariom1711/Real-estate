import { getProperties } from "@/actions/property.actions";
import { getSettings } from "@/actions/settings.actions";
import ContactForm from "./ContactForm";
import { MapPin, Phone, MessageSquare } from "lucide-react";

export default async function ContactPage() {
  const properties = await getProperties();
  const settings = await getSettings();

  const companyName = settings?.companyName || "Pune Realty";
  const phone = settings?.phone || "+91 98765 43210";
  const whatsappNo = settings?.whatsappNo || "919876543210";
  const officeAddress = settings?.officeAddress || "101, Luxury Chambers, Baner, Pune";

  return (
    <main className="flex-1 min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 lg:px-16 text-white select-none">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 font-sans">
          Contact Us
        </h1>
        <p className="text-sm text-gray-400 mb-10 font-light">
          Get in touch with our premium real estate consultants to find your next home.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Office Contact Info */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Address Card */}
            <div className="liquid-glass border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-white shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Our Office</h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    {officeAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="liquid-glass border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-white shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Call Us</h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    {phone}
                  </p>
                  <span className="text-[10px] text-gray-500 block mt-1 font-light">
                    Monday to Saturday, 10 AM - 7 PM
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="liquid-glass border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-white shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">WhatsApp Chat</h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    Chat with us instantly for fast responses.
                  </p>
                  <a
                    href={`https://wa.me/${whatsappNo}?text=${encodeURIComponent("Hi, I want to inquire about properties in Pune.")}`}
                    target="_blank"
                    className="text-[11px] text-white hover:underline block mt-2 font-medium"
                  >
                    Open WhatsApp Chat →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm properties={properties} whatsappNo={whatsappNo} />
          </div>

        </div>

      </div>
    </main>
  );
}

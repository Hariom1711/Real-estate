"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadSchema } from "@/lib/validations";
import { createLead } from "@/actions/lead.actions";
import { useState } from "react";
import { MessageSquare, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyOption {
  id: string;
  title: string;
}

interface ContactFormProps {
  properties: PropertyOption[];
  whatsappNo: string;
}

export default function ContactForm({ properties, whatsappNo }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "Hi, I am looking to invest in real estate in Pune. Please share details of premium properties.",
      propertyId: properties[0]?.id || "",
    },
  });

  const selectedPropertyId = watch("propertyId");

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const res = await createLead(data);
      if (res.success) {
        setSubmitSuccess(true);
        reset();

        // Get property title for WhatsApp
        const propTitle = properties.find(p => p.id === data.propertyId)?.title || "General Inquiry";
        const waText = `${data.message}\n\nInterest: ${propTitle}\nName: ${data.name}\nPhone: ${data.phone}`;
        const waUrl = `https://wa.me/${whatsappNo}?text=${encodeURIComponent(waText)}`;
        
        window.open(waUrl, "_blank");
      } else {
        alert(res.error || "Failed to submit enquiry.");
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="liquid-glass border border-white/10 rounded-2xl p-6 md:p-8 select-none">
      <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
        <MessageSquare size={20} className="text-gray-400" />
        <span>General Enquiry Form</span>
      </h3>
      <p className="text-xs text-gray-400 mb-8 font-light">
        Submit details to chat directly with our consultants on WhatsApp about your preferred property.
      </p>

      {submitSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-lg p-3.5 mb-6 text-center">
          Enquiry saved! Opening WhatsApp chat...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label className="text-[10px] text-gray-400 block mb-1 font-medium">Your Name</label>
            <Input
              {...register("name")}
              placeholder="John Doe"
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-lg text-sm h-10 w-full"
            />
            {errors.name && (
              <span className="text-[10px] text-red-500 mt-1 block font-medium">{errors.name.message}</span>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="text-[10px] text-gray-400 block mb-1 font-medium">Phone Number</label>
            <Input
              {...register("phone")}
              placeholder="e.g. +91 98765 43210"
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-lg text-sm h-10 w-full"
            />
            {errors.phone && (
              <span className="text-[10px] text-red-500 mt-1 block font-medium">{errors.phone.message}</span>
            )}
          </div>
        </div>

        {/* Property Selector */}
        <div>
          <label className="text-[10px] text-gray-400 block mb-1 font-medium">Property of Interest</label>
          {properties.length > 0 ? (
            <Select
              value={selectedPropertyId}
              onValueChange={(val) => setValue("propertyId", val || "")}
            >
              <SelectTrigger className="w-full h-10 bg-white/5 border border-white/10 hover:bg-white/10 focus-visible:border-white/25 text-white flex gap-2 items-center justify-between text-left px-3 py-2 rounded-lg [&>svg]:text-white cursor-pointer select-none">
                <SelectValue placeholder="Select Property" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border border-white/20 text-white rounded-lg backdrop-blur-lg w-full max-h-60 overflow-y-auto [&_svg]:text-white">
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-xs text-gray-500 font-light">No properties available</span>
          )}
          {errors.propertyId && (
            <span className="text-[10px] text-red-500 mt-1 block font-medium">{errors.propertyId.message}</span>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label className="text-[10px] text-gray-400 block mb-1 font-medium">Message</label>
          <textarea
            {...register("message")}
            rows={4}
            placeholder="Write your custom query..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 rounded-lg text-sm p-3 outline-none focus:border-white/20 font-sans"
          />
          {errors.message && (
            <span className="text-[10px] text-red-500 mt-1 block font-medium">{errors.message.message}</span>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-semibold text-sm h-11 rounded-lg hover:bg-gray-200 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <PhoneCall size={16} />
          <span>{isSubmitting ? "Connecting..." : "Connect on WhatsApp"}</span>
        </Button>
      </form>
    </div>
  );
}

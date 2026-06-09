"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadSchema } from "@/lib/validations";
import { createLead } from "@/actions/lead.actions";
import { MessageSquare, PhoneCall } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EnquiryFormProps {
  propertyId: string;
  propertyTitle: string;
  whatsappText?: string | null;
  whatsappNo: string;
}

export default function EnquiryForm({
  propertyId,
  propertyTitle,
  whatsappText,
  whatsappNo,
}: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: whatsappText || `Hi, I am interested in "${propertyTitle}". Please share more details.`,
      propertyId,
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    try {
      const res = await createLead(data);
      if (res.success) {
        setSubmitSuccess(true);
        reset();

        // Redirect to WhatsApp with pre-filled message
        const waText = `${data.message}\n\nContact Info:\nName: ${data.name}\nPhone: ${data.phone}`;
        const waUrl = `https://wa.me/${whatsappNo}?text=${encodeURIComponent(waText)}`;
        
        // Open WhatsApp in new tab
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
    <div className="liquid-glass border border-white/10 rounded-2xl p-6 select-none">
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <MessageSquare size={18} className="text-gray-400" />
        <span>Enquire Now</span>
      </h3>
      <p className="text-xs text-gray-400 mb-6 font-light">
        Submit details to chat directly with our sales agent on WhatsApp.
      </p>

      {submitSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-lg p-3.5 mb-6 text-center">
          Enquiry saved! Opening WhatsApp chat...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Name Field */}
        <div>
          <label className="text-[10px] text-gray-400 block mb-1 font-medium">Your Name</label>
          <Input
            {...register("name")}
            placeholder="John Doe"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-lg text-sm h-10"
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
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-lg text-sm h-10"
          />
          {errors.phone && (
            <span className="text-[10px] text-red-500 mt-1 block font-medium">{errors.phone.message}</span>
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

        {/* hidden property ID */}
        <input type="hidden" {...register("propertyId")} />

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

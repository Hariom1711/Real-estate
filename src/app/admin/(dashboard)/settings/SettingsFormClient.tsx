"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/lib/validations";
import { updateSettings } from "@/actions/settings.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Save, AlertTriangle, CheckCircle } from "lucide-react";
import { z } from "zod";

type SettingsFormValues = z.infer<typeof SettingsSchema>;

interface SettingsFormClientProps {
  settings: any;
}

export default function SettingsFormClient({ settings }: SettingsFormClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsSchema) as any,
    defaultValues: {
      companyName: settings.companyName,
      phone: settings.phone,
      whatsappNo: settings.whatsappNo,
      officeAddress: settings.officeAddress,
      heroHeadlineText: settings.heroHeadlineText,
      statsProjects: settings.statsProjects,
      statsClients: settings.statsClients,
      statsCities: settings.statsCities,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await updateSettings(data);
      if (res.success) {
        setSuccess("Settings updated successfully! Changes are now live on the site.");
        router.refresh();
      } else {
        setError(res.error || "Failed to update settings.");
      }
    } catch (err) {
      console.error("Settings error:", err);
      setError("An unexpected error occurred. Please verify database schema.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="liquid-glass border-white/10 bg-transparent text-white shadow-xl backdrop-blur-md select-none">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          
          {/* Notifications banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-3 rounded-lg flex items-start gap-2 animate-in fade-in duration-200">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3.5 py-3 rounded-lg flex items-start gap-2 animate-in fade-in duration-200">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Section: Company Branding & Contacts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-white/5 pb-2">
              Company & Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Company Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Company Name
                </label>
                <Input
                  {...register("companyName")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                />
                {errors.companyName && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.companyName.message}</span>
                )}
              </div>

              {/* Support Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Support Phone Number
                </label>
                <Input
                  {...register("phone")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                />
                {errors.phone && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.phone.message}</span>
                )}
              </div>

              {/* WhatsApp Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  WhatsApp Number (with country code, no space/+)
                </label>
                <Input
                  {...register("whatsappNo")}
                  placeholder="e.g. 919876543210"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full font-mono"
                />
                {errors.whatsappNo && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.whatsappNo.message}</span>
                )}
              </div>

              {/* Office Address */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Office Address
                </label>
                <Textarea
                  {...register("officeAddress")}
                  rows={2}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 w-full"
                />
                {errors.officeAddress && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.officeAddress.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section: Website Contents */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-white/5 pb-2">
              Website Contents
            </h3>

            <div className="flex flex-col gap-5">
              {/* Hero Headline Text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Hero Headline Text (use \n for line breaks)
                </label>
                <Textarea
                  {...register("heroHeadlineText")}
                  rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 w-full font-sans text-sm"
                />
                {errors.heroHeadlineText && (
                  <span className="text-[10px] text-red-400 mt-0.5">{errors.heroHeadlineText.message}</span>
                )}
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-5">
                {/* Completed projects */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">
                    Projects Completed
                  </label>
                  <Input
                    type="number"
                    {...register("statsProjects")}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full font-mono text-xs"
                  />
                  {errors.statsProjects && (
                    <span className="text-[9px] text-red-400 mt-0.5">{errors.statsProjects.message}</span>
                  )}
                </div>

                {/* Clients count */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">
                    Happy Clients
                  </label>
                  <Input
                    type="number"
                    {...register("statsClients")}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full font-mono text-xs"
                  />
                  {errors.statsClients && (
                    <span className="text-[9px] text-red-400 mt-0.5">{errors.statsClients.message}</span>
                  )}
                </div>

                {/* Cities count */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">
                    Cities Active
                  </label>
                  <Input
                    type="number"
                    {...register("statsCities")}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full font-mono text-xs"
                  />
                  {errors.statsCities && (
                    <span className="text-[9px] text-red-400 mt-0.5">{errors.statsCities.message}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end border-t border-white/5 pt-6 mt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black font-semibold text-xs px-6 h-10 rounded-lg hover:bg-gray-200 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              <span>{isLoading ? "Saving Settings..." : "Save Settings"}</span>
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}

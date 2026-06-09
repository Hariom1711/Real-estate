import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebarClient from "./AdminSidebarClient";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminDashboardLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  // Extra server-side protection fallback
  if (!session) {
    redirect("/admin/login");
  }

  const userEmail = session.user?.email || "admin@punerealty.com";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative overflow-hidden transition-colors duration-300">
      {/* Background Drone Video Overlay for cohesion */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-[0.08] blur-2xl pointer-events-none z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
      />

      {/* Floating Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Client-side Sidebar containing responsive logic */}
      <div className="relative z-10">
        <AdminSidebarClient userEmail={userEmail} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden md:ml-64 relative z-10">
        {children}
      </div>
    </div>
  );
}

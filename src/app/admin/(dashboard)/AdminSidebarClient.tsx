"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  MapPin, 
  Sliders, 
  LogOut, 
  Menu, 
  X,
  User
} from "lucide-react";

interface AdminSidebarProps {
  userEmail: string;
}

export default function AdminSidebarClient({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Properties", href: "/admin/properties", icon: Building2, exact: false },
    { label: "Leads", href: "/admin/leads", icon: MessageSquare, exact: false },
    { label: "Locations", href: "/admin/locations", icon: MapPin, exact: false },
    { label: "Settings", href: "/admin/settings", icon: Sliders, exact: false },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await signOut({ callbackUrl: "/admin/login" });
    }
  };

  return (
    <>
      {/* Mobile Top Navigation bar */}
      <header className="md:hidden flex items-center justify-between bg-black/50 border-b border-white/10 backdrop-blur-lg px-6 py-4 fixed top-0 w-full z-40">
        <span className="text-base font-bold tracking-tight">PUNE REALTY <span className="text-xs text-gray-400 font-light">Admin</span></span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-gray-300 transition cursor-pointer select-none p-1"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Nav Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-zinc-950/45 border-r border-white/10 backdrop-blur-xl z-40 transition-transform duration-300 flex flex-col justify-between pt-20 md:pt-8 pb-8 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 flex flex-col gap-8">
          {/* Logo Header (Desktop only) */}
          <div className="hidden md:block">
            <h1 className="text-lg font-bold tracking-tight text-white font-sans">
              PUNE REALTY
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-light block mt-0.5">
                Admin Panel
              </span>
            </h1>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold select-none transition ${
                    active
                      ? "bg-white/10 border border-white/20 text-white font-bold shadow-sm backdrop-blur-md"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Button */}
        <div className="px-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-lg overflow-hidden">
              <User size={12} className="text-gray-400 shrink-0" />
              <span className="text-[10px] text-gray-400 truncate max-w-[110px]">
                {userEmail}
              </span>
            </div>
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/15 hover:text-red-300 transition cursor-pointer select-none"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

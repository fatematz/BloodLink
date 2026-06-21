"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Droplet, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  User, 
  PlusCircle, 
  GitPullRequest, 
  Users, 
  HeartHandshake 
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const RED = "#E0173C";
const RED_DARK = "#C20E32";
const NAVY = "#0E1E45";

const DashboardSidebar = ({ role = "donor" }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    try { 
      await authClient.signOut(); 
      router.push("/auth/signin");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const links = {
    donor: [
      { name: "Dashboard Home", href: "/dashboard", icon: LayoutDashboard },
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "My Donation Requests", href: "/dashboard/mydonationrequest", icon: GitPullRequest },
      { name: "Create Request", href: "/dashboard/createdonationrequest", icon: PlusCircle },
    ],
    volunteer: [
      { name: "Dashboard Home", href: "/dashboard", icon: LayoutDashboard },
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "All Donation Requests", href: "/dashboard/all-blood-donation-request", icon: GitPullRequest },
    ],
    admin: [
      { name: "Dashboard Home", href: "/dashboard", icon: LayoutDashboard },
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "All Users", href: "/dashboard/all-users", icon: Users },
      { name: "All Donation Requests", href: "/dashboard/all-blood-donation-request", icon: GitPullRequest },
    ],
  };

  const currentLinks = links[role] || links["donor"];

  const Body = (
    <div className="flex flex-col h-full">
      <Link href="/" className="flex items-center gap-2 px-5 py-5">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `linear-gradient(140deg, ${RED}, ${RED_DARK})` }}>
          <Droplet size={20} className="text-white" fill="white" strokeWidth={1.5} />
        </span>
        <span className="text-[18px] font-extrabold text-white">BloodLink</span>
      </Link>

      <div className="px-5 mb-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
          style={{ background: "rgba(255,255,255,0.12)" }}>
          {role} panel
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {currentLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition duration-200 ${
                isActive 
                  ? "text-white bg-white/10 shadow-sm" 
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-white/60"} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-white/90 hover:text-white transition duration-200 hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          <LogOut size={18} className="text-white/60" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-40" style={{ background: NAVY }}>
        <Link href="/" className="flex items-center gap-2">
          <Droplet size={20} className="text-white" fill="white" />
          <span className="text-white font-bold">BloodLink</span>
        </Link>
        <button onClick={() => setOpen(true)} className="text-white" aria-label="Open menu"><Menu size={24} /></button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 min-h-screen sticky top-0 self-start" style={{ background: NAVY }}>
        {Body}
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 min-h-screen shadow-2xl" style={{ background: NAVY }}>
            <div className="flex justify-end p-4">
              <button onClick={() => setOpen(false)} className="text-white" aria-label="Close menu"><X size={24} /></button>
            </div>
            {Body}
          </div>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;
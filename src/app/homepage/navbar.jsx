"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplet, Menu, X, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    document.cookie = "bloodlink_token=; path=/; max-age=0";
    await authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (res.ok) { const data = await res.json(); setUser(data); }
      } catch (error) { console.error("User fetch error:", error); }
    };
    fetchUser();
  }, []);

  const links = [
    { label: "Home", href: "/" },
    { label: "Donation Requests", href: "/alldonationrequest" },
    ...(user ? [{ label: "Funding", href: "/funding" }] : []),
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="bg-[#F4F6F9]">
      <header className="w-full top-0 lg:top-5 left-0 right-0 z-50 fixed py-4 px-4 md:px-4 lg:px-0">
        <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 select-none">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
              <Droplet size={20} className="text-white" fill="white" strokeWidth={1.5} />
            </span>
            <span className="text-[19px] font-extrabold tracking-tight" style={{ color: RED_DARK }}>BloodLink</span>
          </Link>

          <ul className="hidden lg:flex items-center gap-2 ml-6 flex-1">
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[15px] font-medium transition-colors px-3 py-1.5 rounded-lg"
                  style={isActive(l.href) ? { color: RED, backgroundColor: "rgba(224,23,60,0.08)", fontWeight: 600 } : { color: "#4B5563" }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 hover:bg-gray-50 transition">
                  {user.image ? (
                    <img src={user.image} alt="User" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-[#E0173C] font-bold text-[12px]">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-[14px] font-semibold text-gray-700">{user.name}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50">
                    <div className="px-3 py-2 text-[12px] font-bold text-gray-400 uppercase">{user.role || "User"}</div>
                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-[14px] text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setDropdownOpen(false)}>
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <button onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-3 py-2 text-[14px] text-red-600 hover:bg-red-50 rounded-lg">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/signin" className="text-[15px] font-semibold text-gray-700 hover:text-gray-900 px-2 transition-colors">Login</Link>
                <Link href="/auth/signup" className="text-[15px] font-semibold text-white px-5 py-2.5 rounded-full transition active:scale-[0.98]"
                  style={{ background: RED, boxShadow: "0 8px 18px -8px rgba(224,23,60,0.7)" }}>Register</Link>
              </>
            )}
          </div>

          {/* Mobile toggle — lg এর নিচে */}
          <button className="lg:hidden text-gray-700 p-1" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu — সব screen এ lg এর নিচে */}
        {mobileOpen && (
          <div className="lg:hidden max-w-6xl mx-auto mt-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} onClick={() => setMobileOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-[15px] font-medium transition-colors"
                    style={isActive(l.href) ? { color: RED, backgroundColor: "rgba(224,23,60,0.08)", fontWeight: 600 } : { color: "#374151" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {user ? (
              <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
                <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase">{user.name} · {user.role}</div>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-[15px] font-medium text-gray-700 hover:bg-gray-50">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-[15px] font-medium text-red-600 hover:bg-red-50 w-full text-left">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <Link href="/auth/signin" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 text-[14px] font-semibold text-gray-700 border border-gray-200 rounded-xl">Login</Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 text-[14px] font-semibold text-white rounded-xl" style={{ background: RED }}>Register</Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
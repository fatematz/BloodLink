"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Droplet, Search, Menu, X } from "lucide-react";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "Donation Requests", href: "/donation-requests" },
    { label: "Search Donors", href: "/search-donors" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <div className="bg-#F4F6F9">
    <header className="w-full top-0 left-0 right-0 z-50 fixed px-4 py-4" >
      <nav className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 px-4 sm:px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 shrink-0 select-none">
  <span
    className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
    style={{ background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)` }}
  >
    <Droplet size={20} className="text-white" fill="white" strokeWidth={1.5} />
  </span>
  <span className="text-[19px] font-extrabold tracking-tight" style={{ color: RED_DARK }}>
    BloodLink
  </span>
</Link>

        <ul className="hidden lg:flex items-center gap-7 ml-6">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
          <div className="w-full flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
            <Search size={17} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search donors..."
              className="w-full bg-transparent outline-none text-[14px] text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            href="/auth/signin"
            className="text-[15px] font-semibold text-gray-700 hover:text-gray-900 px-2 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="text-[15px] font-semibold text-white px-5 py-2.5 rounded-full transition active:scale-[0.98]"
            style={{ background: RED, boxShadow: "0 8px 18px -8px rgba(224,23,60,0.7)" }}
          >
            Register
          </Link>
        </div>

        <button
          className="md:hidden text-gray-700 p-1"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
            <Search size={17} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search donors..."
              className="w-full bg-transparent outline-none text-[14px] text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-[15px] font-medium text-gray-700 hover:text-gray-900"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 pt-1">
            <Link
              href="/auth/signin"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center text-[15px] font-semibold text-gray-700 border border-gray-200 py-2.5 rounded-full"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center text-[15px] font-semibold text-white py-2.5 rounded-full"
              style={{ background: RED }}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
    </div>
  );
};

export default Navbar;
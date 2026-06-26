import React from "react";
import Link from "next/link";
import {
  Droplet,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

const Footer = () => {
  const columns = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Donation Requests", href: "/alldonationrequest" },
        { label: "Search Donors", href: "/search-donors" },
      ],
    },
    {
      title: "Get Involved",
      links: [
        { label: "Join as a Donor", href: "/auth/signup" },
        { label: "Funding", href: "/funding" },
        { label: "Login", href: "/auth/signin" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/" },

      ],
    },
  ];

  return (
    <footer className="text-white" style={{ background: "#0E1E45" }}>
      {/* top red strip */}
      <div style={{ background: `linear-gradient(90deg, ${RED}, ${RED_DARK})` }} className="h-1.5 w-full" />

      <div className="max-w-7xl mx-auto px-4 md:px-4 lg:px-0 md:pt-10  py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* brand + about */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(140deg, ${RED}, ${RED_DARK})` }}
              >
                <Droplet size={20} className="text-white" fill="white" strokeWidth={1.5} />
              </span>
              <span className="text-[20px] font-extrabold tracking-tight text-[#C20E32]">BloodLink</span>
            </Link>
            <p className="text-[14px] text-gray-400 leading-relaxed max-w-xs">
              Connecting blood donors with people in need. Every drop counts — join our community
              and help save lives today.
            </p>

            <div className="mt-5 space-y-2.5">
              <span href="+8801700000000" className="flex items-center gap-2.5 text-[13.5px] text-gray-300 hover:text-white transition">
                <Phone size={15} style={{ color: RED }} /> +880 1700-000000
              </span>
              <span href="help@bloodlink.com" className="flex items-center gap-2.5 text-[13.5px] text-gray-300 hover:text-white transition">
                <Mail size={15} style={{ color: RED }} /> help@bloodlink.com
              </span>
              <p className="flex items-center gap-2.5 text-[13.5px] text-gray-300">
                <MapPin size={15} style={{ color: RED }} /> Joypurhat, Bangladesh
              </p>
            </div>
          </div>

          {/* link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[14px] font-bold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13.5px] text-gray-400 hover:text-white transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* divider + bottom row */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-gray-400">
            © {new Date().getFullYear()} BloodLink. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                
                className="w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.10)" }}
                aria-label="social link"
              >
                <Icon size={16} className="text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
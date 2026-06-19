import React from "react";
import Link from "next/link";
import { Users, DollarSign, Droplet, ArrowRight } from "lucide-react";

const RED = "#E0173C";
const RED_DARK = "#C20E32";
const NAVY = "#0E1E45"; 

const ImpactOverview = ({ donors = 15, funding = 12886, requests = 19 }) => {
  const stats = [
    {
      id: 1,
      title: "Active Donors",
      value: `${Number(donors).toLocaleString()}+`,
      caption: "Verified donors ready to help near you.",
      cta: "View donors",
      href: "/search-donors",
      icon: <Users size={20} className="text-white" />,
      iconBg: "bg-gradient-to-br from-[#E0173C] to-[#C20E32]",
      filled: true,
    },
    {
      id: 2,
      title: "Total Funding",
      value: `$${Number(funding).toLocaleString()}`,
      caption: "Raised by the community for patients.",
      cta: "Fund a request",
      href: "/funding",
      icon: <DollarSign size={20} className="text-white" />,
      iconBg: "bg-gradient-to-br from-[#E0173C] to-[#C20E32]",
      filled: true,
    },
    {
      id: 3,
      title: "Total Requests",
      value: requests,
      caption: "Open requests waiting for a donor.",
      cta: "See requests",
      href: "/donation-requests",
      icon: <Droplet size={20} className="text-white" fill="white" />,
      iconBg: "bg-gradient-to-br from-[#E0173C] to-[#C20E32]",
      filled: true,
    },
  ];

  return (
    <section className="w-full bg-[#F4F6F9]">
      <div className="max-w-7xl mx-auto py-14 px-4 md:px-0">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tight text-[#0E1E45] sm:text-4xl">
            Our Impact Overview
          </h2>
        
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="rounded-[2rem] bg-[#C20E32] p-4 transition-all duration-300 hover:-translate-y-1"
              style={{
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: stat.filled
                  ? "1px solid rgba(255,255,255,0.4)"
                  : "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 18px 38px -22px rgba(80,80,120,0.4)",
              }}
            >
              <div
                className="rounded-[1.8rem] py-6 flex flex-col items-center justify-center bg-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.65)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <span
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${stat.iconBg}`}
                >
                  {stat.icon}
                </span>
                
                <h3 className="text-3xl font-black tracking-tight text-[#E0173C]">
                  {stat.value}
                </h3>
                
                <p className="mt-1 text-[11px] font-bold tracking-widest uppercase text-gray-500">
                  {stat.title}
                </p>
              </div>

              <p
                className="mt-5 mb-4 px-1 text-[13px] text-gray-100 leading-relaxed border-l-2 pl-3"
                style={{ borderColor: "rgba(255,255,255,0.6)" }}
              >
                {stat.caption}
              </p>

              <Link
                href={stat.href}
                className="w-full inline-flex items-center justify-center gap-2 text-[13px] font-bold py-3 rounded-full bg-white text-[#C20E32] hover:bg-gray-50 transition active:scale-[0.98]"
                style={{
                  boxShadow: "0 6px 16px -8px rgba(0,0,0,0.2)",
                }}
              >
                {stat.cta} <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactOverview;
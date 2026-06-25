"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, DollarSign, Droplet, ArrowRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

const ImpactOverview = ({ centered = true }) => {
  const { data: session } = useSession();
  const role = session?.user?.role || null;

  const [stats, setStats] = useState({ donors: 0, funding: 0, requests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, fundsRes, requestsRes] = await Promise.all([
          fetch(
            "https://blood-link-server-phi.vercel.app/api/users?role=donor&limit=1",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          ),
          fetch("https://blood-link-server-phi.vercel.app/api/funds", {
            cache: "no-store",
          }),
          fetch(
            "https://blood-link-server-phi.vercel.app/api/donation-requests?limit=1",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          ),
        ]);

        const usersData = await usersRes.json();
        const fundsData = await fundsRes.json();
        const requestsData = await requestsRes.json();

        setStats({
          donors: usersData.total || 0,
          funding: fundsData.total || 0,
          requests: requestsData.totalRequests || 0,
        });
      } catch (err) {
        console.error("Overview stats fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      id: 1,
      title: "Active Donors",
      value: loading ? "..." : `${Number(stats.donors).toLocaleString()}+`,
      caption: "Verified donors ready to help near you.",
      cta: "View donors",
      href: "/search-donors",
      icon: <Users size={20} className="text-white" />,
      ctaRoles: ["admin"],
    },
    {
      id: 2,
      title: "Total Funding",
      value: loading ? "..." : `$${Number(stats.funding).toLocaleString()}`,
      caption: "Raised by the community for patients.",
      cta: "Fund a request",
      href: "/funding",
      icon: <DollarSign size={20} className="text-white" />,
      ctaRoles: ["admin", "volunteer"],
    },
    {
      id: 3,
      title: "Total Requests",
      value: loading ? "..." : stats.requests,
      caption: "Open requests waiting for a donor.",
      cta: "See requests",
      href: "/alldonationrequest",
      icon: <Droplet size={20} className="text-white" fill="white" />,
      ctaRoles: ["admin", "volunteer"],
    },
  ];

  return (
    <section className="w-full bg-[#F4F6F9] pb-10 md:pb-10 lg:pb-30 pt-5 md:pt-0 md:pt-10 md:px-4 lg:pt-10">
      <div className="max-w-7xl mx-auto  px-4 md:px-0">
        <div className={`pt-10 md:pt-30 mb-10 md:mb-20  ${centered ? "text-center" : "text-left"}`}>
          <h2
            className={`text-4xl font-black tracking-tight sm:text-4xl ${centered ? "text-[#0E1E45]" : "text-gray-800"}`}
          >
            Our Impact <span style={{ color: "#E0173C" }}>Overview</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const canSeeCta = role && card.ctaRoles.includes(role);

            return (
              <div
                key={card.id}
                className="rounded-[2rem] bg-[#C20E32] p-4 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.4)",
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
                  <span className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3 bg-gradient-to-br from-[#E0173C] to-[#C20E32]">
                    {card.icon}
                  </span>
                  <h3 className="text-3xl font-black tracking-tight text-[#E0173C]">
                    {card.value}
                  </h3>
                  <p className="mt-1 text-[11px] font-bold tracking-widest uppercase text-gray-500">
                    {card.title}
                  </p>
                </div>

                <p
                  className="mt-5 mb-4 px-1 text-[13px] text-gray-100 leading-relaxed border-l-2 pl-3"
                  style={{ borderColor: "rgba(255,255,255,0.6)" }}
                >
                  {card.caption}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactOverview;

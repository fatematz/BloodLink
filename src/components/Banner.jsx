import React from "react";
import Link from "next/link";
import { Droplet, UserPlus, Search } from "lucide-react";
import BannerImg from "@/images/banner2.jpg";
import Image from "next/image";
import { userinfo } from "@/lib/core/userinfo";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

/* Homepage hero banner */
const Banner = async () => {

  const user = await userinfo();

  return (
    <section className="w-full  pt-20 md:pt-44 pb-6 bg-[#F4F6F9]">
      <div
        className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(120deg, #0A1330 0%, #0E1E45 55%, #3A1020 100%)",
        }}
      >
        <div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{
            background: `radial-gradient(circle, ${RED} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute right-1/3 bottom-0 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #FF7A45 0%, transparent 70%)",
          }}
        />

        <div className="relative grid md:grid-cols-2 gap-12 items-center px-6 sm:px-12 py-12 md:py-16">
          
          {/* ── left: text ── */}
          <div className="order-1 md:order-none">
            <span
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-white px-3 py-1.5 rounded-full mb-5"
              style={{
                background: "rgba(224,23,60,0.18)",
                border: "1px solid rgba(224,23,60,0.4)",
              }}
            >
              <Droplet size={14} fill={RED} style={{ color: RED }} /> Be
              Someone's Lifeline
            </span>

            <h1 className="text-white font-extrabold leading-[1.1] text-4xl sm:text-5xl">
              Donate Blood,
              <br />
              <span style={{ color: RED }}>Save Lives</span>
            </h1>

            <p className="mt-4 text-[15px] text-gray-300 max-w-md leading-relaxed">
              Join our community of donors and connect with people who need
              help. One donation can save up to three lives.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
          href={user ? "/dashboard" : "/auth/signup"}
          className="inline-flex items-center gap-2 text-[15px] font-semibold text-white px-6 py-3.5 rounded-full transition active:scale-[0.98]"
          style={{
            background: RED,
            boxShadow: "0 12px 26px -10px rgba(224,23,60,0.8)",
          }}
        >
          <UserPlus size={18} /> 
          {user ? "Go to Dashboard" : "Join as a Donor"}
        </Link>
              <Link
                href="/search-donors"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-white px-6 py-3.5 rounded-full border border-white/30 hover:bg-white/10 transition active:scale-[0.98]"
              >
                <Search size={18} /> Search Donors
              </Link>
            </div>
          </div>

          <div className="relative w-full order-2 md:order-none pb-4 md:pb-0">
            <div
              className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Image
                src={BannerImg}
                alt="Blood donation"
                className="w-full h-full object-cover"
                placeholder="blur"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, rgba(10,19,48,0.55) 100%)",
                }}
              />
            </div>

            <div className="absolute -bottom-4 left-4 sm:-left-4 bg-white rounded-xl sm:rounded-2xl shadow-xl px-3 py-2 sm:px-5 sm:py-3 flex items-center gap-2 sm:gap-3 transition-all duration-300">
              <span
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(140deg, ${RED}, ${RED_DARK})`,
                }}
              >
                <Droplet className="text-white w-4 h-4 sm:w-5 sm:h-5" fill="white" />
              </span>
              <div className="leading-tight">
                <p className="text-[14px] sm:text-[18px] font-extrabold text-gray-900 whitespace-nowrap">
                  Be a Hero
                </p>
                <p className="text-[10px] sm:text-[12px] text-gray-500 whitespace-nowrap">
                  Donate Today
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
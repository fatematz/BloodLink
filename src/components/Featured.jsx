import React from "react";
import Link from "next/link";
import { ArrowUpRight, Play, Heart, Shield, Award } from "lucide-react";
import imgFeatured from "@/images/f.jpg"
import imgFeatured2 from "@/images/f2.jpg"
import imgFeatured4 from "@/images/f4.jpg"
import imgFeatured5 from "@/images/f5.jpg"
import Image from "next/image";


const RED = "#E0173C";
const RED_DARK = "#C20E32";
const NAVY = "#0E1E45";




const  Featured = async () => {



  return (
    <section className="w-full bg-[#F4F6F9]  px-4 md:px-4 lg:px-0   md:px-0">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10 md:mb-20">
          <h2 className="text-4xl font-black  tracking-tight text-[#0E1E45] sm:text-4xl">
            Every Drop <span style={{ color: "#E0173C" }}> Counts </span> <br /> Discover Your  <span style={{ color: "#E0173C" }}> Impact </span>
          </h2>

         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

          <div className="lg:col-span-4 flex flex-col gap-4">
            
            <div 
            
              className="p-6 rounded-[2rem] bg-[#E0173C]/10 flex flex-col justify-between h-32 transition duration-300 hover:-translate-y-1"
              style={{ border: "1px solid rgba(224,23,60,0.15)" }}
            >
              <span className="text-[#E0173C] font-bold text-sm flex items-center gap-2">
                <Heart size={16} fill="#E0173C" /> Why Donate Blood
              </span>
              <div className="flex justify-between items-end">
                <span className="text-[#0E1E45] font-black text-lg">Learn More</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E0173C] shadow-sm">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>

            <div 
              className="p-6 rounded-[2rem] bg-[#C20E32]/5 flex flex-col justify-between h-32 transition duration-300 hover:-translate-y-1"
              style={{ border: "1px solid rgba(194,14,50,0.1)" }}
            >
              <span className="text-[#C20E32] font-bold text-lg leading-snug">
                One Donation <br /> Saves Three Lives.
              </span>
              <div className="flex justify-end">
                <div className="text-[#C20E32]">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>

            <div 
              className="p-6 rounded-[2rem] bg-[#0E1E45]/5 flex flex-col justify-between h-32 transition duration-300 hover:-translate-y-1"
              style={{ border: "1px solid rgba(14,30,69,0.1)" }}
            >
              <span className="text-[#0E1E45] font-bold text-lg leading-snug">
                A Simple Guide for <br /> First-time Donors.
              </span>
              <div className="flex justify-end">
                <div className="text-[#0E1E45]">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 relative group rounded-[2rem] overflow-hidden min-h-[400px] bg-gray-200 block transition duration-300 hover:-translate-y-1">
            <Image src={imgFeatured} alt="img"
              className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
              
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1E45]/90 via-[#C20E32]/20 to-transparent p-6 flex flex-col justify-between">
              <span className="self-start bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Award size={14} /> Donor Stories
              </span>
              <div className="flex justify-between items-end text-white">
                <h3 className="font-black text-xl leading-tight max-w-[200px]">
                  Real People, Real Lives Saved.
                </h3>
                <div className="w-10 h-10 rounded-full bg-white text-[#C20E32] flex items-center justify-center shadow-lg transform transition group-hover:scale-105">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div  className="relative group rounded-[2rem] overflow-hidden flex-1 min-h-[188px] bg-gray-200 block transition duration-300 hover:-translate-y-1">
              <Image src={imgFeatured4} alt="img" 
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1E45]/90 via-transparent to-transparent p-6 flex flex-col justify-between">
                <span className="self-start bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Shield size={14} /> Verified Donors
                </span>
                <div className="flex justify-between items-end text-white">
                  <h3 className="font-bold text-lg leading-tight">Safe, Screened, <br /> and Simple.</h3>
                  <div className="w-8 h-8 rounded-full bg-white text-[#C20E32] flex items-center justify-center shadow-md">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div  className="relative group rounded-[2rem] overflow-hidden flex-1 min-h-[188px] bg-gray-200 block transition duration-300 hover:-translate-y-1">
              <Image src={imgFeatured2} alt="img"
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1E45]/90 via-transparent to-transparent p-6 flex flex-col justify-between">
                <span className="self-start bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  🩸 Urgent Requests
                </span>
                <div className="flex justify-between items-end text-white">
                  <h3 className="font-bold text-lg leading-tight">Someone Needs <br /> Blood Now.</h3>
                  <div className="w-8 h-8 rounded-full bg-white text-[#C20E32] flex items-center justify-center shadow-md">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div 
          className="rounded-[2.5rem] bg-[#C20E32] p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 18px 38px -22px rgba(80,80,120,0.4)",
          }}
        >
          <div className="md:col-span-5 relative rounded-[2rem] overflow-hidden h-64 bg-gray-300 shadow-inner group">
            <Image src={imgFeatured5} alt="img"
              className="absolute inset-0 bg-cover bg-center"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition group-hover:bg-black/40">
              <button className="w-16 h-16 rounded-full bg-white/90 text-[#E0173C] flex items-center justify-center shadow-2xl transform transition duration-300 group-hover:scale-110 active:scale-95">
                <Play size={28} fill={RED} className="ml-1" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {["#SaveLives", "#BloodDonation", "#Community"].map((tag, idx) => (
                <span key={idx} className="bg-black/40 backdrop-blur-sm text-[10px] text-white px-2 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-center">
            <h3 className="text-3xl font-black text-white tracking-tight mb-4 leading-tight">
              Make Donating Simple, Safe, and Meaningful.
            </h3>
            <p className="text-sm text-gray-100 leading-relaxed mb-6 max-w-xl">
              Ready to help someone in need? Register as a donor in minutes, get notified about
              nearby requests, and track your donations. Small steps today that save real lives tomorrow.
            </p>
            <div className="flex">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-3 bg-white text-[#C20E32] font-bold text-sm px-6 py-3 rounded-full hover:bg-gray-50 transition active:scale-[0.98]"
                style={{
                  boxShadow: "0 6px 16px -8px rgba(0,0,0,0.2)",
                }}
              >
                Become a Donor
                <div className="w-5 h-5 rounded-full bg-[#C20E32] text-white flex items-center justify-center">
                  <ArrowUpRight size={12} />
                </div>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Featured;
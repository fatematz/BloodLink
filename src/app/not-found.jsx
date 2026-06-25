import Link from "next/link";
import { Droplet, Home, ArrowLeft } from "lucide-react";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${RED} 0%, transparent 70%)` }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${RED} 0%, transparent 70%)` }} />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
            <Droplet size={22} className="text-white" fill="white" strokeWidth={1.5} />
          </span>
          <span className="text-[22px] font-extrabold tracking-tight" style={{ color: RED_DARK }}>
            BloodLink
          </span>
        </div>

        {/* 404 */}
        <div className="relative inline-block mb-6">
          <div className="text-[140px] sm:text-[180px] font-black leading-none select-none"
            style={{ 
              color: "transparent",
              WebkitTextStroke: `3px ${RED}`,
              opacity: 0.15
            }}>
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
              style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
              <Droplet size={36} className="text-white" fill="white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-[32px] sm:text-[40px] font-black text-gray-800 tracking-tight">
          Page <span style={{ color: RED }}>Not Found</span>
        </h1>
        <p className="text-gray-400 mt-3 text-[15px] leading-relaxed max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved. Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link href="/"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-[15px] transition active:scale-[0.98] w-full sm:w-auto justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
              boxShadow: "0 12px 26px -10px rgba(224,23,60,0.6)"
            }}>
            <Home size={18} /> Go Back Home
          </Link>
          <Link href="/alldonationrequest"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[15px] transition active:scale-[0.98] w-full sm:w-auto justify-center border-2"
            style={{ borderColor: RED, color: RED }}>
            <Droplet size={18} /> View Donations
          </Link>
        </div>

      </div>
    </div>
  );
}
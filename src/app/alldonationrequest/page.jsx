"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { MapPin, Calendar } from "lucide-react";
import Navbar from "../homepage/navbar";
import Footer from "@/components/Footer";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-end items-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-[#E0173C] text-[#E0173C] disabled:opacity-30 hover:bg-[#E0173C] hover:text-white transition"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 text-sm font-bold transition ${
            p === page
              ? "border-[#E0173C] bg-[#E0173C] text-white"
              : "border-[#E0173C] text-[#E0173C] hover:bg-[#E0173C] hover:text-white"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-[#E0173C] text-[#E0173C] disabled:opacity-30 hover:bg-[#E0173C] hover:text-white transition"
      >
        ›
      </button>
    </div>
  );
};

export default function AllDonationRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://blood-link-server-phi.vercel.app/api/donation-requests?status=pending&page=${page}&limit=5`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    )
      .then((r) => r.json())
      .then((data) => {
        setRequests(data.requests || []);
        setTotalPages(data.totalPages || 1);
        setTotalRequests(data.totalRequests || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const handleViewDetails = async (id) => {
    const session = await authClient.getSession();
    if (session?.data?.user) {
      router.push(`/dashboard/alldonationrequest/${id}`);
    } else {
      router.push(`/auth/signin?redirect=/dashboard/alldonationrequest/${id}`);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F4F6F9",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <Navbar />
      <div
        className="pb-16 pt-36 px-4 text-center"
        style={{
          background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)`,
        }}
      >
        <h1 className="text-[32px] sm:text-[42px] font-black text-white tracking-tight">
          Donation <span style={{ color: "#FFD6DE" }}>Requests</span>
        </h1>
       
      </div>

      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="block w-full -mt-1"
        style={{ height: 50 }}
      >
        <path d="M0,0 L1440,0 L1440,20 Q720,80 0,20 Z" fill={RED_DARK} />
      </svg>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#E0173C] rounded-full animate-spin"></div>
          </div>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-400 py-20">
            No pending donation requests found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  style={{ border: "1px solid #F0F0F0" }}
                >
                  <div
                    className="relative flex flex-col items-center pt-6 pb-8"
                    style={{
                      background: `linear-gradient(140deg, ${RED}15 0%, ${RED}08 100%)`,
                    }}
                  >
                    <span
                      className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{ background: `${RED}15`, color: RED }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: RED }}
                      ></span>
                      Pending
                    </span>
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-[26px] mt-4"
                      style={{
                        background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
                        boxShadow: `0 8px 24px -8px ${RED}80`,
                      }}
                    >
                      {req.bloodGroup}
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-4 bg-white"
                      style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
                    />
                  </div>

                  <div className="px-5 pt-2 pb-5 flex flex-col gap-3 flex-1">
                    <div className="text-center mb-1">
                      <p className="font-bold text-gray-800 text-[17px]">
                        {req.recipientName}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mt-0.5">
                        Recipient
                      </p>
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 text-[13px] text-gray-600">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${RED}12` }}
                        >
                          <MapPin size={13} style={{ color: RED }} />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Location
                          </p>
                          <p className="font-medium text-gray-700">
                            {req.recipientUpazila}, {req.recipientDistrict}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 text-[13px] text-gray-600">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${RED}12` }}
                        >
                          <Calendar size={13} style={{ color: RED }} />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Date & Time
                          </p>
                          <p className="font-medium text-gray-700">
                            {req.donationDate} | {req.donationTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(req._id)}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-white font-semibold text-[14px] transition active:scale-[0.98]"
                      style={{
                        background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
                        boxShadow: `0 6px 16px -6px ${RED}80`,
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
      <div className="mt-26">
        <Footer />
      </div>
    </div>
  );
}

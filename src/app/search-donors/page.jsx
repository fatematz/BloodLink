"use client";

import { useState } from "react";
import Navbar from "../homepage/navbar";
import LOCATIONS from "@/lib/locations";
import { MapPin, Mail } from "lucide-react";
import Footer from "@/components/Footer";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-end items-center gap-2 mt-6">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-[#E0173C] text-[#E0173C] disabled:opacity-30 hover:bg-[#E0173C] hover:text-white transition">
        ‹
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 text-sm font-bold transition ${
            p === page ? "border-[#E0173C] bg-[#E0173C] text-white" : "border-[#E0173C] text-[#E0173C] hover:bg-[#E0173C] hover:text-white"
          }`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-[#E0173C] text-[#E0173C] disabled:opacity-30 hover:bg-[#E0173C] hover:text-white transition">
        ›
      </button>
    </div>
  );
};

export default function SearchDonorsPage() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDonors = async (pageNum = 1) => {
    setLoading(true);
    try {
     const res = await fetch(
  `http://localhost:5000/api/users?role=donor&status=active&bloodGroup=${encodeURIComponent(bloodGroup)}&district=${encodeURIComponent(district)}&upazila=${encodeURIComponent(upazila)}&page=${pageNum}&limit=6`,
  { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
);
      const data = await res.json();
      setDonors(data.users || data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!bloodGroup || !district || !upazila) return;
    setSearched(true);
    setPage(1);
    await fetchDonors(1);
  };

  const handlePageChange = async (newPage) => {
    setPage(newPage);
    await fetchDonors(newPage);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <Navbar />

      {/* Hero */}
      <div className="pt-36 pb-16 px-4 text-center"
        style={{ background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
        <h1 className="text-[32px] sm:text-[42px] font-black text-white tracking-tight">
          Find a <span style={{ color: "#FFD6DE" }}>Blood Donor</span>
        </h1>
        <p className="text-white/80 mt-2 text-[15px] max-w-md mx-auto">
          Search for verified donors in your area by blood group and location.
        </p>
      </div>

      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full -mt-1" style={{ height: 50 }}>
        <path d="M0,0 L1440,0 L1440,20 Q720,80 0,20 Z" fill={RED_DARK} />
      </svg>

      {/* Search Form */}
      <div className="max-w-3xl mx-auto px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Blood Group</label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:border-[#E0173C]">
                <option value="">Select</option>
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">District</label>
              <select value={district} onChange={(e) => { setDistrict(e.target.value); setUpazila(""); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:border-[#E0173C]">
                <option value="">Select</option>
                {Object.keys(LOCATIONS).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Upazila</label>
              <select value={upazila} onChange={(e) => setUpazila(e.target.value)} disabled={!district}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:border-[#E0173C] disabled:opacity-50">
                <option value="">Select</option>
                {(LOCATIONS[district] || []).map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleSearch} disabled={!bloodGroup || !district || !upazila}
            className="mt-4 w-full py-3 rounded-xl text-white font-bold text-[15px] transition active:scale-[0.98] disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
            Search Donors
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#E0173C] rounded-full animate-spin"></div>
          </div>
        ) : searched && donors.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            No donors found for the selected criteria.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {donors.map((donor) => (
                <div key={donor._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
                  {/* Card Top */}
                  <div className="relative pt-6 pb-8 flex flex-col items-center"
                    style={{ background: `linear-gradient(140deg, ${RED}15 0%, ${RED}08 100%)` }}>
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                      {donor.image ? (
                        <img src={donor.image} className="w-full h-full object-cover" alt={donor.name} />
                      ) : (
                        <span className="text-gray-500 font-bold text-2xl">{donor.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    {/* Blood Group Badge */}
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-black"
                      style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
                      {donor.bloodGroup}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-white" style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
                  </div>

                  {/* Card Bottom */}
                  <div className="px-4 pb-4 pt-1">
                    <p className="font-bold text-gray-800 text-center text-[16px]">{donor.name}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-[12px] text-gray-500">
                        <MapPin size={13} style={{ color: RED }} className="shrink-0" />
                        <span>{donor.upazila}, {donor.district}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-gray-500">
                        <Mail size={13} style={{ color: RED }} className="shrink-0" />
                        <span className="truncate">{donor.email}</span>
                      </div>
                    </div>
                    <a 
                      className="mt-4 block w-full py-2 rounded-xl text-white text-center text-[13px] font-semibold transition active:scale-[0.98]"
                      style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
                      Contact Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>


 <div className="mt-26">
        <Footer/>
      </div>

    </div>
  );
}
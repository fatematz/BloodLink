"use client";

import { useState, useEffect } from "react";
import Navbar from "../homepage/navbar";
import { authClient } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreditCard } from "lucide-react";
import Footer from "@/components/Footer";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

export default function FundingPage() {
  const [funds, setFunds] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const session = await authClient.getSession();
      setUser(session?.data?.user);
    };
    init();
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/funds");
      const data = await res.json();
      setFunds(data.funds || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGiveFund = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return toast.error("Enter a valid amount.");
    }
    if (!user) {
      return toast.error("Please log in to donate.");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          userName: user?.name,
          userEmail: user?.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create payment session");
      }

      // Stripe Checkout page এ redirect
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero */}
      <div className="pt-36 pb-16 px-4 text-center"
        style={{ background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
        <h1 className="text-[32px] sm:text-[42px] font-black text-white tracking-tight">
          Funding <span style={{ color: "#FFD6DE" }}>History</span>
        </h1>
        <p className="text-white/80 mt-2 text-[15px] max-w-md mx-auto">
          Manage and track your contributions to the community.
        </p>
      </div>

      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full -mt-1" style={{ height: 50 }}>
        <path d="M0,0 L1440,0 L1440,20 Q720,80 0,20 Z" fill={RED_DARK} />
      </svg>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[13px] text-gray-400">
              Total Raised: <span className="font-bold text-gray-700">${total.toFixed(2)}</span>
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-[14px] transition active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}
          >
            <CreditCard size={16} /> Give Fund
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#E0173C] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-[#FDFDFD]">
                  <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">Donor</th>
                  <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">Transaction ID</th>
                  <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">Date</th>
                  <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">Amount</th>
                  <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {funds.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400 text-sm">No funds yet.</td>
                  </tr>
                ) : (
                  funds.map((fund) => (
                    <tr key={fund._id} className="hover:bg-gray-50/50">
                      <td className="p-4 pl-6">
                        <p className="font-semibold text-gray-800 text-[14px]">{fund.name}</p>
                        <p className="text-[12px] text-gray-400">{fund.email}</p>
                      </td>
                      <td className="p-4 text-[13px] text-gray-500 font-mono">{fund.transactionId}</td>
                      <td className="p-4 text-[13px] text-gray-600">
                        {new Date(fund.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="p-4 font-bold text-gray-800">${fund.amount?.toFixed(2)}</td>
                      <td className="p-4">
                        <span className="bg-green-50 text-green-600 border border-green-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                          ● {fund.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-1">Give Fund</h2>
            <p className="text-[13px] text-gray-400 mb-5">Your contribution helps save lives.</p>
            <label className="block text-[12px] font-semibold text-gray-400 uppercase mb-1.5">Amount (USD)</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#E0173C] mb-4"
            />
            <p className="text-[11px] text-gray-400 mb-4 -mt-2">
              You will be redirected to Stripe's secure payment page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setIsModalOpen(false); setAmount(""); }}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold text-[14px]"
              >
                Cancel
              </button>
              <button
                onClick={handleGiveFund}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl text-white font-semibold text-[14px] disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}
              >
                {submitting ? "Redirecting…" : "Pay with Stripe"}
              </button>
            </div>
          </div>
        </div>
      )}


 <div className="mt-26">
        <Footer/>
      </div>

    </div>
  );
}

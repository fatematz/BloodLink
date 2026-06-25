"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  MapPin,
  Calendar,
  Clock,
  Droplet,
  X,
  Loader2,
  Hospital,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

export default function DonationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [donating, setDonating] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(
      `https://blood-link-server-phi.vercel.app/api/donation-requests/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((r) => r.json())
      .then((data) => setRequest(data))
      .catch(console.error)
      .finally(() => setLoading(false));

    authClient.getSession().then((session) => {
      if (session?.data?.user) setUser(session.data.user);
    });
  }, [id]);

  const isBlocked = user?.status === "blocked";

  const handleDonateClick = () => {
    if (!user) {
      router.push(`/auth/signin?redirect=/dashboard/alldonationrequest/${id}`);
      return;
    }
    if (isBlocked) {
      toast.error("Your account is blocked. You cannot donate.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setDonating(true);
    try {
      const res = await fetch(
        `https://blood-link-server-phi.vercel.app/api/donation-requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            donationStatus: "inprogress",
            donorName: user.name,
            donorEmail: user.email,
          }),
        },
      );
      if (res.ok) {
        setShowModal(false);
        toast.success("Donation Confirmed!");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDonating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} style={{ color: RED }} />
      </div>
    );
  if (!request)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Request not found.
      </div>
    );

  const isInProgress = request.donationStatus === "inprogress";

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Top Card — Blood Group + Recipient */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div
            className="h-2 w-full"
            style={{
              background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
            }}
          />
          <div className="p-6 flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-[22px] shrink-0"
              style={{
                background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
              }}
            >
              {request.bloodGroup}
            </div>
            <div>
              <h1 className="text-[20px] font-black text-gray-800">
                {request.recipientName}
              </h1>
              <p className="text-[12px] text-gray-400 uppercase tracking-wider mt-0.5">
                Recipient
              </p>
              <span
                className={`mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                  isInProgress
                    ? "bg-blue-50 text-blue-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {isInProgress ? "In Progress" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-4">
            Request Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow
              icon={<MapPin size={14} style={{ color: RED }} />}
              label="Location"
              value={`${request.recipientUpazila}, ${request.recipientDistrict}`}
            />
            <InfoRow
              icon={<Calendar size={14} style={{ color: RED }} />}
              label="Date"
              value={request.donationDate}
            />
            <InfoRow
              icon={<Clock size={14} style={{ color: RED }} />}
              label="Time"
              value={request.donationTime}
            />
            <InfoRow
              icon={<Droplet size={14} style={{ color: RED }} />}
              label="Blood Group"
              value={request.bloodGroup}
            />
            {request.hospitalName && (
              <InfoRow
                icon={<Droplet size={14} style={{ color: RED }} />}
                label="Hospital"
                value={request.hospitalName}
              />
            )}
            {request.fullAddress && (
              <InfoRow
                icon={<MapPin size={14} style={{ color: RED }} />}
                label="Full Address"
                value={request.fullAddress}
              />
            )}
          </div>

          {request.requestMessage && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Request Message
              </p>
              <p className="text-[14px] text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">
                {request.requestMessage}
              </p>
            </div>
          )}
        </div>

        {/* Donor Info (if inprogress) */}
        {isInProgress && request.donorName && (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2">
              Donor Info
            </p>
            <p className="font-bold text-blue-700">{request.donorName}</p>
            <p className="text-[13px] text-blue-500">{request.donorEmail}</p>
          </div>
        )}

        {/* Donate Button */}
        <button
          onClick={handleDonateClick}
          disabled={isInProgress || isBlocked}
          className="w-full py-3.5 rounded-xl text-white font-bold text-[15px] transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
          }}
        >
          {isBlocked
            ? "Account Blocked"
            : isInProgress
              ? "Already in Progress"
              : "Donate Now"}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-[20px] font-black text-gray-800 mb-1">
              Confirm Donation
            </h2>
            <p className="text-[13px] text-gray-400 mb-6">
              Your info will be shared with the requester.
            </p>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Donor Name
                </label>
                <input
                  type="text"
                  value={user?.name || ""}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-700"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Donor Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-700"
                />
              </div>
            </div>
            <button
              onClick={handleConfirm}
              disabled={donating}
              className="w-full py-3 rounded-xl text-white font-bold text-[14px] transition disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
              }}
            >
              {donating ? "Confirming..." : "Confirm Donation"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
      style={{ background: `${RED}12` }}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="text-[13px] font-medium text-gray-700">{value}</p>
    </div>
  </div>
);

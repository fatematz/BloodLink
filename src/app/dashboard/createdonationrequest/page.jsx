"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  PlusCircle,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import LOCATIONS from "@/lib/locations";
const districts = Object.keys(LOCATIONS);
const upazilas = LOCATIONS;

const RED = "#E0173C";
const RED_DARK = "#C20E32";

export default function CreateDonationRequest() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  useEffect(() => {
    async function checkUser() {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setUser(session.data.user);
      } else {
        router.push("/auth/signin");
      }
      setLoading(false);
    }
    checkUser();
  }, [router]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "recipientDistrict") {
      setSelectedDistrict(value);
      setFormData((prev) => ({
        ...prev,
        recipientDistrict: value,
        recipientUpazila: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.status === "blocked") return;
    setSubmitting(true);
    const requestData = {
      requesterName: user.name,
      requesterEmail: user.email,
      ...formData,
      donationStatus: "pending",
    };
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/donation-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(requestData),
        },
      );
      if (response.ok) {
        toast.success("Donation request created!");
        setTimeout(() => router.push(""), 1000);
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Failed to create request");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} style={{ color: RED }} />
      </div>
    );

  if (user?.status === "block")
    return (
      <div className="max-w-2xl mx-auto mt-14 p-6 bg-red-50 border border-red-200 rounded-3xl flex flex-col items-center text-center shadow-md">
        <AlertTriangle size={48} className="mb-3" style={{ color: RED }} />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Your Account is Blocked
        </h2>
        <p className="text-gray-600 max-w-md">
          Admin has blocked your status. Blocked users are not allowed to create
          new blood donation requests.
        </p>
      </div>
    );

  return (
    <div
      className="min-h-screen w-full bg-[#F4F6F9] px-4 pb-10 pt-6"
      style={{
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} />
      <style>{`.bd-field:focus { outline:none; border-color:${RED} !important; box-shadow:0 0 0 3px rgba(224,23,60,0.12); } .bd-field::placeholder { color:#9CA3AF; } .bd-btn-shadow { box-shadow:0 10px 22px -8px rgba(224,23,60,0.65); }`}</style>
      <div className="w-full max-w-[680px] bg-white rounded-3xl shadow-xl overflow-hidden mx-auto my-6">
        <div
          style={{
            background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)`,
          }}
          className="px-6 pt-6 pb-1"
        >
          <div className="relative flex items-center justify-center h-11">
            <Link
              href="/dashboard"
              className="absolute left-0 text-white active:scale-90 transition"
            >
              {/* <ChevronLeft size={24} strokeWidth={2.5} /> */}
            </Link>
            <h1 className="text-white text-[20px] mb-4 font-bold tracking-wide flex items-center gap-2">
              <PlusCircle size={20} /> Create Donation Request
            </h1>
          </div>
        </div>
        <svg
          viewBox="0 0 392 56"
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height: 46, marginTop: -1 }}
        >
          <path d="M0,0 L392,0 L392,16 Q196,70 0,16 Z" fill={RED_DARK} />
        </svg>
        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 pt-3 pb-8 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100">
            <div>
              <label className="block text-[14px] font-semibold text-gray-500 mb-1.5">
                Requester Name
              </label>
              <input
                type="text"
                value={user?.name || ""}
                readOnly
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-400 cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-500 mb-1.5">
                Requester Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-400 cursor-not-allowed outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Recipient Name *">
              <input
                type="text"
                required
                disabled={submitting}
                value={formData.recipientName}
                onChange={(e) => handleChange("recipientName", e.target.value)}
                placeholder="Enter recipient full name"
                className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700 disabled:opacity-60"
              />
            </Field>
            <Field label="Blood Group Needed *">
              <SelectBox
                disabled={submitting}
                value={formData.bloodGroup}
                placeholder="Select Blood Group"
                onChange={(v) => handleChange("bloodGroup", v)}
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Recipient District *">
              <SelectBox
                disabled={submitting}
                value={formData.recipientDistrict}
                placeholder="Select District"
                onChange={(v) => handleChange("recipientDistrict", v)}
                options={districts}
              />
            </Field>
            <Field label="Recipient Upazila *">
              <SelectBox
                value={formData.recipientUpazila}
                placeholder={
                  selectedDistrict ? "Select Upazila" : "Pick district first"
                }
                onChange={(v) => handleChange("recipientUpazila", v)}
                options={
                  selectedDistrict ? upazilas[selectedDistrict] || [] : []
                }
                disabled={!selectedDistrict || submitting}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Hospital Name *">
              <input
                type="text"
                required
                disabled={submitting}
                value={formData.hospitalName}
                onChange={(e) => handleChange("hospitalName", e.target.value)}
                placeholder="e.g. Dhaka Medical College"
                className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700 disabled:opacity-60"
              />
            </Field>
            <Field label="Full Address Line *">
              <input
                type="text"
                required
                disabled={submitting}
                value={formData.fullAddress}
                onChange={(e) => handleChange("fullAddress", e.target.value)}
                placeholder="e.g. Zahir Raihan Rd, Dhaka"
                className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700 disabled:opacity-60"
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Donation Date *">
              <input
                type="date"
                required
                disabled={submitting}
                value={formData.donationDate}
                onChange={(e) => handleChange("donationDate", e.target.value)}
                className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700 disabled:opacity-60"
              />
            </Field>
            <Field label="Donation Time *">
              <input
                type="time"
                required
                disabled={submitting}
                value={formData.donationTime}
                onChange={(e) => handleChange("donationTime", e.target.value)}
                className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700 disabled:opacity-60"
              />
            </Field>
          </div>
          <Field label="Request Message *">
            <textarea
              required
              disabled={submitting}
              rows={3}
              value={formData.requestMessage}
              onChange={(e) => handleChange("requestMessage", e.target.value)}
              placeholder="Provide context on why blood is needed..."
              className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700 resize-none disabled:opacity-60"
            />
          </Field>
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full text-white font-semibold py-3.5 rounded-xl bd-btn-shadow active:scale-[0.99] transition disabled:opacity-60 text-center flex items-center justify-center h-12"
              style={{ background: RED }}
            >
              {submitting ? "Processing..." : "Create Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);
const SelectBox = ({ value, placeholder, onChange, options, disabled }) => (
  <div className="relative">
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`bd-field w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] pr-9 ${value ? "text-gray-700" : "text-gray-400"} ${disabled ? "opacity-60" : ""}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o} className="text-gray-700">
          {o}
        </option>
      ))}
    </select>
    <ChevronDown
      size={18}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  </div>
);

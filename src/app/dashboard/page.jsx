"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, MapPin, Calendar, Clock, AlertCircle, Loader2 } from "lucide-react";
import EditButton from "./components/EditButton";

const RED = "#E0173C";

const StatusBadge = ({ status }) => {
  let bg = "bg-amber-50 text-amber-600 border-amber-100";
  let label = "Pending";
  if (status === "inprogress") { bg = "bg-blue-50 text-blue-600 border-blue-100"; label = "In Progress"; }
  else if (status === "done") { bg = "bg-green-50 text-green-600 border-green-100"; label = "Done"; }
  else if (status === "canceled") { bg = "bg-red-50 text-red-600 border-red-100"; label = "Cancelled"; }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${bg} uppercase tracking-wider`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {label}
    </span>
  );
};

export default function DashboardHome() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      const session = await authClient.getSession();
      const userData = session?.data?.user;
      if (!userData) { router.push("/auth/signin"); return; }

      if (userData.role === "admin" || userData.role === "volunteer") {
        router.push("/dashboard/admin-home");
        return;
      }

      setUser(userData);

      const res = await fetch(
        `http://localhost:5000/api/donation-requests?requesterEmail=${userData.email}&limit=3`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  loadData();
}, [router]);


  const getToken = () => localStorage.getItem("token");

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donation-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ donationStatus: newStatus }),
      });
      if (res.ok) {
        toast.success(`Status updated to ${newStatus}!`);
        setRequests((prev) =>
          prev.map((req) => req._id === id ? { ...req, donationStatus: newStatus } : req)
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donation-requests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        toast.success("Request deleted.");
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } else {
        toast.error("Failed to delete.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin" size={40} style={{ color: RED }} />
    </div>
  );

  const hasRequests = requests.length > 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 sm:p-10 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-10">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-800 tracking-tight">
          Hello, <span style={{ color: RED }}>{user?.name || "Donor"}</span>!
        </h1>
        <p className="text-gray-400 text-[14px] mt-1">
          Manage your activities and help save lives today.
        </p>
      </div>

      {hasRequests ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FDFDFD]">
                    <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider pl-6">Recipient Info</th>
                    <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                    <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider text-center">Group</th>
                    <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 pl-6">
                        <p className="font-semibold text-gray-800 text-[14px]">{request.recipientName}</p>
                        {request.donationStatus === "inprogress" && request.donorName && (
                          <div className="mt-1 bg-blue-50/50 border border-blue-100 rounded-md p-1.5 text-[11px] text-blue-600 max-w-[180px]">
                            <p className="font-medium">Donor: {request.donorName}</p>
                            <p className="text-gray-400">{request.donorEmail}</p>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-[13px] text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400 shrink-0" />
                          <span>{request.recipientUpazila}, {request.recipientDistrict}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[13px] text-gray-600">
                        <div className="flex items-center gap-1"><Calendar size={14} className="text-gray-400" /><span>{request.donationDate}</span></div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5"><Clock size={12} /><span>{request.donationTime}</span></div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block text-[13px] font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: `${RED}10`, color: RED }}>
                          {request.bloodGroup}
                        </span>
                      </td>
                      <td className="p-4"><StatusBadge status={request.donationStatus} /></td>
                      <td className="p-4 text-right pr-6 space-x-1.5">
                        {request.donationStatus === "inprogress" && (
                          <div className="inline-flex gap-1 mr-2">
                            <button onClick={() => handleStatusUpdate(request._id, "done")}
                              className="text-[11px] font-medium bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition">
                              Done
                            </button>
                            <button onClick={() => handleStatusUpdate(request._id, "canceled")}
                              className="text-[11px] font-medium bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition">
                              Cancel
                            </button>
                          </div>
                        )}
                        <EditButton request={request} />
                        <button onClick={() => handleDelete(request._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition" title="Delete Request">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <Link href="/dashboard/mydonationrequest"
              className="text-white font-semibold text-[14px] px-6 py-2.5 rounded-lg active:scale-[0.98] transition text-center shadow-[0_4px_12px_rgba(224,23,60,0.2)]"
              style={{ backgroundColor: RED }}>
              View My All Request
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-gray-300" size={24} />
          </div>
          <p className="text-gray-400 text-[15px] font-medium">No Recent Requests</p>
          <Link href="/dashboard/create-donation-request"
            className="mt-4 text-[13px] font-semibold transition hover:underline" style={{ color: RED }}>
            Create your first request +
          </Link>
        </div>
      )}
    </div>
  );
}